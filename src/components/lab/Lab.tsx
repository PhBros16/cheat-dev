"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor, { type Lang } from "./Editor";
import { zipSync, unzipSync, strToU8, strFromU8 } from "fflate";
import { buildDoc, decodeProject, encodeProject, exportFiles, exportHtml, importFiles, splitDoc, type ProjFile, type Project } from "./doc";
import { BREAKPOINT_CHIPS, DEFAULT_MULTI, DEVICES, RATIOS, breakpointOf } from "./devices";
import { STARTERS } from "./starters";
import { snippets } from "@/content/snippets";
import { templates } from "@/content/templates";

/* ---------- tipos e persistência ---------- */
type Layout = "side" | "stack" | "editor" | "preview";
type Zoom = "fit" | number;
type Ui = {
  mode: string; // fluid | custom | multi | id de dispositivo
  w: number; h: number; zoom: Zoom; layout: Layout; tab: Lang;
  live: boolean; jsAuto: boolean; split: number; console: boolean; multi: string[];
};
type Line = { t: string; m: string };

const KEY = "cheatdev:lab:v1";
const INBOX = "cheatdev:lab:inbox";
const RUNNING = "cheatdev:lab:running";

const DEFAULT_UI: Ui = { mode: "fluid", w: 393, h: 852, zoom: "fit", layout: "side", tab: "html", live: true, jsAuto: true, split: 48, console: true, multi: DEFAULT_MULTI };

function load(): { project: Project; ui: Ui; dirty: boolean } {
  const fallback = { project: STARTERS[0].project, ui: DEFAULT_UI, dirty: false };
  try {
    const inbox = localStorage.getItem(INBOX);
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    const ui = { ...DEFAULT_UI, ...(saved?.ui ?? {}) };
    if (inbox) {
      localStorage.removeItem(INBOX);
      const o = JSON.parse(inbox);
      const project: Project | null = o.project ?? (typeof o.doc === "string" ? splitDoc(o.doc) : null);
      if (project) return { project, ui: { ...ui, tab: "html" }, dirty: false };
    }
    if (saved?.project) return { project: saved.project, ui, dirty: true };
  } catch {}
  return fallback;
}

const OUTLINE = "*{outline:1px solid rgba(244,63,94,.6)!important;outline-offset:-1px}";
const GRID = "html{background-image:linear-gradient(rgba(47,111,237,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(47,111,237,.12) 1px,transparent 1px)!important;background-size:8px 8px!important}";

/* ---------- frame (iframe imperativo, para CSS ao vivo sem recarregar) ---------- */
function Frame({ w, h, scale, getDoc, runId, register, blocked }: {
  w: number; h: number; scale: number; getDoc: () => string; runId: number;
  register: (el: HTMLIFrameElement, on: boolean) => void; blocked: boolean;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    register(el, true);
    return () => register(el, false);
  }, [register]);
  useEffect(() => {
    if (ref.current) ref.current.srcdoc = getDoc();
  }, [runId, getDoc]);
  return (
    <div style={{ width: w * scale, height: h * scale }} className="shrink-0">
      <div style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "0 0" }}>
        <iframe
          ref={ref}
          title="Preview"
          sandbox="allow-scripts allow-modals allow-forms allow-popups allow-downloads"
          style={{ width: w, height: h, pointerEvents: blocked ? "none" : "auto" }}
          className="block rounded-md border border-border bg-white shadow-lg"
        />
      </div>
    </div>
  );
}

const btn = "rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground hover:border-muted disabled:cursor-not-allowed disabled:opacity-60";
const btnOn = "rounded-md border border-foreground bg-foreground px-2.5 py-1.5 text-xs font-semibold text-background";

export default function Lab() {
  const [init] = useState(load);
  const [project, setProject] = useState<Project>(init.project);
  const [ui, setUi] = useState<Ui>(init.ui);
  const [dirty, setDirty] = useState(init.dirty);
  const [runId, setRunId] = useState(1);
  const [lines, setLines] = useState<Line[]>([]);
  const [toast, setToast] = useState("");
  const [jsPaused, setJsPaused] = useState(() => {
    try { return localStorage.getItem(RUNNING) === "1"; } catch { return false; }
  });
  const [firstDoc] = useState(() => buildDoc(jsPaused ? { ...init.project, js: "" } : init.project));
  const [outline, setOutline] = useState(false);
  const [grid, setGrid] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [box, setBox] = useState({ w: 800, h: 600 });
  const [narrow, setNarrow] = useState(false);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [repl, setRepl] = useState("");
  const [fs, setFs] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const split = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const frames = useRef<Set<HTMLIFrameElement>>(new Set());
  const ran = useRef<Project>(project);
  const docRef = useRef(firstDoc);
  const flags = useRef({ outline, grid });
  useEffect(() => { flags.current = { outline, grid }; }, [outline, grid]);
  const reg = useCallback((el: HTMLIFrameElement, on: boolean) => { if (on) frames.current.add(el); else frames.current.delete(el); }, []);
  const consoleEnd = useRef<HTMLDivElement>(null);

  const set = useCallback((patch: Partial<Ui>) => setUi((u) => ({ ...u, ...patch })), []);
  const flash = useCallback((m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); }, []);

  /* --- documento atual (JS pausado = sem o JS) --- */
  const effective = useCallback((p: Project) => buildDoc(jsPaused ? { ...p, js: "" } : p), [jsPaused]);
  const getDoc = useCallback(() => docRef.current, []);
  useEffect(() => {
    try { if (!jsPaused && ran.current.js.trim()) localStorage.setItem(RUNNING, "1"); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const post = useCallback((msg: unknown) => frames.current.forEach((f) => f.contentWindow?.postMessage(msg, "*")), []);

  const run = useCallback((p: Project, force = false) => {
    if (force) setJsPaused(false);
    const pr = force ? p : jsPaused ? { ...p, js: "" } : p;
    try { localStorage.setItem(RUNNING, pr.js.trim() ? "1" : "0"); } catch {}
    docRef.current = buildDoc(pr);
    ran.current = p;
    setLines([]);
    setRunId((n) => n + 1);
  }, [jsPaused]);

  /* --- Live: CSS é injetado sem recarregar; HTML recarrega; JS conforme config --- */
  useEffect(() => {
    if (!ui.live) return;
    const prev = ran.current;
    const htmlChanged = prev.html !== project.html;
    const jsChanged = prev.js !== project.js;
    const cssChanged = prev.css !== project.css;
    if (!htmlChanged && !jsChanged && !cssChanged) return;
    const needsReload = htmlChanged || (jsChanged && ui.jsAuto && !jsPaused);
    const t = setTimeout(() => {
      if (needsReload) run(project);
      else if (cssChanged) {
        post({ __labcss: project.css });
        docRef.current = effective(project);
        ran.current = { ...ran.current, css: project.css };
      }
    }, needsReload ? (jsChanged ? 800 : 300) : 60);
    return () => clearTimeout(t);
  }, [project, ui.live, ui.jsAuto, jsPaused, run, post, effective]);

  /* --- persistência --- */
  useEffect(() => {
    const t = setTimeout(() => {
      try { localStorage.setItem(KEY, JSON.stringify({ project, ui })); } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [project, ui]);

  /* --- link compartilhado (#p=...) --- */
  useEffect(() => {
    const m = location.hash.match(/^#p=(.+)$/);
    if (!m) return;
    decodeProject(m[1]).then((p) => {
      if (!p) return flash("Link inválido ou corrompido.");
      setProject(p);
      setDirty(false);
      history.replaceState(null, "", location.pathname);
      run(p);
      flash("Projeto carregado do link.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --- mensagens do iframe --- */
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      const d = e.data;
      if (!d || !d.__lab) return;
      const list = [...frames.current];
      if (!list.some((f) => f.contentWindow === e.source)) return;
      if (d.t === "ready") {
        try { localStorage.setItem(RUNNING, "0"); } catch {}
        const src = e.source as Window;
        if (flags.current.outline) src.postMessage({ __labcmd: 1, k: "outline", on: true, css: OUTLINE }, "*");
        if (flags.current.grid) src.postMessage({ __labcmd: 1, k: "grid", on: true, css: GRID }, "*");
        return;
      }
      if (list[0]?.contentWindow !== e.source) return; // evita linhas duplicadas no multi-tela
      setLines((l) => [...l, { t: d.t, m: d.m }].slice(-300));
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => { consoleEnd.current?.scrollIntoView({ block: "end" }); }, [lines]);

  /* --- medidas --- */
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ui.layout, narrow, mobileView]);

  useEffect(() => {
    const f = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", f);
    return () => document.removeEventListener("fullscreenchange", f);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const f = () => setNarrow(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  /* --- toggles de depuração --- */
  useEffect(() => { post({ __labcmd: 1, k: "outline", on: outline, css: OUTLINE }); }, [outline, post]);
  useEffect(() => { post({ __labcmd: 1, k: "grid", on: grid, css: GRID }); }, [grid, post]);

  /* --- ações --- */
  const edit = (lang: Lang) => (v: string) => { setProject((p) => ({ ...p, [lang]: v })); setDirty(true); };

  function loadProject(p: Project) {
    if (dirty && !confirm("Substituir o código atual? O que você escreveu será perdido.")) return;
    setProject(p);
    setDirty(false);
    run(p, false);
  }

  async function share() {
    const code = await encodeProject(project);
    const url = `${location.origin}/lab#p=${code}`;
    try { await navigator.clipboard.writeText(url); flash(url.length > 8000 ? "Link copiado (longo: pode falhar em alguns apps)." : "Link copiado!"); }
    catch { prompt("Copie o link:", url); }
  }

  function download() {
    const blob = new Blob([exportHtml(project)], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "projeto.html";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function downloadZip() {
    const data: Record<string, Uint8Array> = {};
    for (const f of exportFiles(project)) data[`meu-projeto/${f.name}`] = strToU8(f.content);
    const blob = new Blob([zipSync(data) as BlobPart], { type: "application/zip" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "meu-projeto.zip";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importFromFiles(list: File[]) {
    const out: ProjFile[] = [];
    for (const f of list) {
      if (/\.zip$/i.test(f.name)) {
        const z = unzipSync(new Uint8Array(await f.arrayBuffer()));
        for (const [name, bytes] of Object.entries(z)) if (/\.(html?|css|m?js)$/i.test(name) && !name.includes("node_modules/")) out.push({ name, content: strFromU8(bytes) });
      } else if (/\.(html?|css|m?js)$/i.test(f.name)) out.push({ name: f.name, content: await f.text() });
    }
    if (!out.length) return flash("Nenhum arquivo .html, .css, .js ou .zip encontrado.");
    loadProject(importFiles(out));
    flash(`Importado: ${out.length} arquivo${out.length > 1 ? "s" : ""}.`);
  }

  function toggleMulti(id: string) {
    const has = ui.multi.includes(id);
    if (!has && ui.multi.length >= 4) return flash("Máximo de 4 telas ao mesmo tempo.");
    if (has && ui.multi.length <= 1) return;
    set({ multi: has ? ui.multi.filter((x) => x !== id) : [...ui.multi, id] });
  }

  function sendRepl() {
    if (!repl.trim()) return;
    setLines((l) => [...l, { t: "input", m: repl }]);
    post({ __labeval: repl });
    setRepl("");
  }

  function startDrag(e: React.PointerEvent, axis: "x" | "y" | "xy", scale: number) {
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY, sw = ui.w, sh = ui.h;
    setDragging(true);
    const mv = (ev: PointerEvent) => {
      set({
        mode: "custom",
        ...(axis !== "y" ? { w: Math.max(200, Math.round(sw + (ev.clientX - sx) / scale)) } : {}),
        ...(axis !== "x" ? { h: Math.max(200, Math.round(sh + (ev.clientY - sy) / scale)) } : {}),
      });
    };
    const up = () => { setDragging(false); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
  }

  function startSplit(e: React.PointerEvent) {
    e.preventDefault();
    setDragging(true);
    const mv = (ev: PointerEvent) => {
      const r = split.current!.getBoundingClientRect();
      const pct = ui.layout === "side" ? ((ev.clientX - r.left) / r.width) * 100 : ((ev.clientY - r.top) / r.height) * 100;
      set({ split: Math.min(80, Math.max(20, pct)) });
    };
    const up = () => { setDragging(false); window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
  }

  function pickDevice(id: string) {
    if (id === "fluid" || id === "multi" || id === "custom") return set({ mode: id });
    const d = DEVICES.find((x) => x.id === id)!;
    set({ mode: id, w: d.w, h: d.h });
  }

  function rotate() { set({ w: ui.h, h: ui.w, mode: ui.mode === "fluid" ? "custom" : ui.mode }); }

  /* --- geometria do preview --- */
  const geo = useMemo(() => {
    const pad = 32;
    if (ui.mode === "fluid") return { frames: [{ w: Math.max(100, box.w), h: Math.max(100, box.h), label: "" }], scale: 1 };
    if (ui.mode === "multi") {
      const sel = ui.multi.map((id) => DEVICES.find((d) => d.id === id)).filter((d): d is (typeof DEVICES)[number] => !!d);
      const list = sel.length ? sel : DEVICES.filter((d) => DEFAULT_MULTI.includes(d.id));
      const gap = 24, total = list.reduce((a, d) => a + d.w, 0) + gap * (list.length - 1);
      const maxH = Math.max(...list.map((d) => d.h));
      const auto = Math.min(1, (box.w - pad) / total, (box.h - pad - 28) / maxH);
      const scale = ui.zoom === "fit" ? Math.max(0.15, auto) : ui.zoom;
      return { frames: list.map((d) => ({ w: d.w, h: d.h, label: `${d.name} · ${d.w}px` })), scale };
    }
    const auto = Math.min(1, (box.w - pad) / ui.w, (box.h - pad - 28) / ui.h);
    return { frames: [{ w: ui.w, h: ui.h, label: "" }], scale: ui.zoom === "fit" ? Math.max(0.15, auto) : ui.zoom };
  }, [ui.mode, ui.w, ui.h, ui.zoom, ui.multi, box]);

  const curW = geo.frames[0].w;
  const showEditor = narrow ? mobileView === "editor" : ui.layout !== "preview";
  const showPreview = narrow ? mobileView === "preview" : ui.layout !== "editor";
  const side = !narrow && ui.layout === "side";

  const tabs: { id: Lang; label: string; color: string }[] = [
    { id: "html", label: "HTML", color: "#e4572e" },
    { id: "css", label: "CSS", color: "#2f6fed" },
    { id: "js", label: "JS", color: "#d4a017" },
  ];

  return (
    <div ref={root} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const l = [...e.dataTransfer.files]; if (l.length) void importFromFiles(l); }} className={`fixed inset-x-0 bottom-0 z-20 flex flex-col bg-background lg:z-[45] ${fs ? "top-0" : "top-[57px]"}`}>
      {/* ---------- barra de ferramentas ---------- */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
        <select
          aria-label="Abrir modelo"
          value=""
          onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            const [kind, id] = v.split(":");
            if (kind === "st") loadProject(STARTERS.find((s) => s.id === id)!.project);
            if (kind === "sn") loadProject(splitDoc(snippets.find((s) => s.slug === id)!.code));
            if (kind === "tp") loadProject(splitDoc(templates.find((s) => s.slug === id)!.code));
          }}
          className="max-w-44 rounded-md border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-foreground"
        >
          <option value="">📂 Abrir modelo…</option>
          <optgroup label="Laboratórios">{STARTERS.map((s) => <option key={s.id} value={`st:${s.id}`}>{s.title}</option>)}</optgroup>
          <optgroup label="Templates de site">{templates.map((s) => <option key={s.slug} value={`tp:${s.slug}`}>{s.title}</option>)}</optgroup>
          <optgroup label="Snippets">{snippets.map((s) => <option key={s.slug} value={`sn:${s.slug}`}>{s.title}</option>)}</optgroup>
        </select>

        <span className="mx-1 h-5 w-px bg-border" />

        <select
          aria-label="Tamanho da tela"
          value={ui.mode}
          onChange={(e) => pickDevice(e.target.value)}
          className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-foreground"
        >
          <option value="fluid">↔ Responsivo (preenche)</option>
          <option value="custom">✎ Tamanho livre</option>
          <option value="multi">▦ Multi-tela (3 ao mesmo tempo)</option>
          {(["Celular", "Tablet", "Computador"] as const).map((g) => (
            <optgroup key={g} label={g}>
              {DEVICES.filter((d) => d.group === g).map((d) => <option key={d.id} value={d.id}>{d.name} — {d.w}×{d.h}</option>)}
            </optgroup>
          ))}
        </select>

        {ui.mode !== "fluid" && ui.mode !== "multi" && (
          <>
            <input aria-label="Largura" type="number" min={200} value={ui.w} onChange={(e) => set({ w: Number(e.target.value) || 200, mode: "custom" })} className="w-16 rounded-md border border-border bg-surface px-1.5 py-1.5 text-xs text-foreground" />
            <span className="text-xs text-muted">×</span>
            <input aria-label="Altura" type="number" min={200} value={ui.h} onChange={(e) => set({ h: Number(e.target.value) || 200, mode: "custom" })} className="w-16 rounded-md border border-border bg-surface px-1.5 py-1.5 text-xs text-foreground" />
            <button className={btn} onClick={rotate} title="Girar (inverte largura e altura)">⟳ Girar</button>
            <select aria-label="Proporção" value="" onChange={(e) => { const r = RATIOS.find((x) => x.id === e.target.value); if (r) set({ mode: "custom", h: Math.round(ui.w * r.f) }); }} className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-foreground">
              <option value="">Proporção…</option>
              {RATIOS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </>
        )}

        {ui.mode !== "fluid" && (
          <select aria-label="Zoom" value={String(ui.zoom)} onChange={(e) => set({ zoom: e.target.value === "fit" ? "fit" : Number(e.target.value) })} className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-foreground">
            <option value="fit">Zoom: ajustar</option>
            {[0.25, 0.5, 0.75, 1, 1.25].map((z) => <option key={z} value={z}>{z * 100}%</option>)}
          </select>
        )}

        <span className="mx-1 h-5 w-px bg-border" />

        <button className={ui.live ? btnOn : btn} onClick={() => set({ live: !ui.live })} title="Atualizar o preview enquanto digita">● Live</button>
        <button className={ui.jsAuto ? btnOn : btn} onClick={() => set({ jsAuto: !ui.jsAuto })} title="Rodar o JS automaticamente ao digitar (desligue se estiver testando laços)">JS auto</button>
        <button className={btn} onClick={() => run(project, true)} title="Ctrl+Enter">▶ Executar</button>
        <button className={outline ? btnOn : btn} onClick={() => setOutline((v) => !v)} title="Contorna todos os elementos">▢ Contornos</button>
        <button className={grid ? btnOn : btn} onClick={() => setGrid((v) => !v)} title="Grade de 8px sobre o preview">▦ Grade 8px</button>

        <span className="ml-auto flex flex-wrap items-center gap-1.5">
          {!narrow && (
            <span className="flex overflow-hidden rounded-md border border-border">
              {([["side", "◫"], ["stack", "⬒"], ["editor", "⌨"], ["preview", "▭"]] as const).map(([l, ic]) => (
                <button key={l} onClick={() => set({ layout: l })} title={{ side: "Lado a lado", stack: "Empilhado", editor: "Só editor", preview: "Só preview" }[l]} className={`px-2 py-1.5 text-xs ${ui.layout === l ? "bg-foreground text-background" : "bg-surface text-foreground"}`}>{ic}</button>
              ))}
            </span>
          )}
          <button className={btn} onClick={share}>🔗 Compartilhar</button>
          <button className={btn} onClick={download} title="Um único arquivo .html">⬇ .html</button>
          <button className={btn} onClick={downloadZip} title="Pasta com index.html, style.css e script.js">⬇ .zip</button>
          <button className={btn} onClick={() => fileInput.current?.click()} title="Importar .html, .css, .js ou .zip (também dá para arrastar para cá)">⬆ Importar</button>
          <input ref={fileInput} type="file" multiple accept=".html,.htm,.css,.js,.mjs,.zip" className="hidden" onChange={(e) => { const l = [...(e.target.files ?? [])]; e.target.value = ""; if (l.length) void importFromFiles(l); }} />
          <button className={btn} onClick={() => root.current?.requestFullscreen?.()} title="Tela cheia">⛶</button>
        </span>
      </div>

      {narrow && (
        <div className="flex border-b border-border">
          {(["editor", "preview"] as const).map((v) => (
            <button key={v} onClick={() => setMobileView(v)} className={`flex-1 py-2 text-sm font-semibold ${mobileView === v ? "bg-surface-muted text-foreground" : "text-muted"}`}>{v === "editor" ? "Código" : "Resultado"}</button>
          ))}
        </div>
      )}

      {jsPaused && (
        <div className="flex items-center gap-3 border-b border-yellow-600/40 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
          <span>A última execução não terminou (possível laço infinito). O JS foi pausado: corrija e clique em Executar.</span>
          <button className={btn} onClick={() => run(project, true)}>▶ Executar com JS</button>
        </div>
      )}

      {/* ---------- área principal ---------- */}
      <div ref={split} className={`flex min-h-0 flex-1 ${side ? "flex-row" : "flex-col"}`}>
        {/* editor */}
        <section
          className="flex min-h-0 min-w-0 flex-col bg-[#282c34]"
          style={{ display: showEditor ? "flex" : "none", flex: showPreview && !narrow ? `0 0 ${ui.split}%` : "1 1 auto" }}
        >
          <div className="flex items-center border-b border-black/40 bg-[#21252b]">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => set({ tab: t.id })} className={`flex items-center gap-2 border-r border-black/40 px-4 py-2 text-xs font-semibold ${ui.tab === t.id ? "bg-[#282c34] text-white" : "text-zinc-400 hover:text-zinc-200"}`}>
                <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />{t.label}
              </button>
            ))}
            <span className="ml-auto hidden px-3 text-[11px] text-zinc-400 md:block">Tab: Emmet e <code>cd-</code> · Ctrl+Enter: executar</span>
          </div>
          <div className="min-h-0 flex-1">
            {tabs.map((t) => (
              <Editor key={t.id} lang={t.id} value={project[t.id]} onChange={edit(t.id)} onRun={() => run(project, true)} visible={ui.tab === t.id} />
            ))}
          </div>
        </section>

        {showEditor && showPreview && !narrow && (
          <div onPointerDown={startSplit} role="separator" aria-orientation={side ? "vertical" : "horizontal"} className={`z-10 shrink-0 bg-border hover:bg-css ${side ? "w-1.5 cursor-col-resize" : "h-1.5 cursor-row-resize"}`} />
        )}

        {/* preview */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col" style={{ display: showPreview ? "flex" : "none" }}>
          <div className="flex items-center gap-3 border-b border-border bg-surface px-3 py-1.5 text-xs text-muted">
            <span className="font-mono text-foreground">{ui.mode === "multi" ? "multi-tela" : `${Math.round(curW)} × ${Math.round(geo.frames[0].h)}`}</span>
            {ui.mode !== "multi" && <span>breakpoint: {breakpointOf(curW)}</span>}
            {ui.mode !== "fluid" && <span>zoom {Math.round(geo.scale * 100)}%</span>}
            {ui.mode === "multi" ? (
              <details className="relative">
                <summary className="cursor-pointer rounded border border-border px-2 py-0.5 text-foreground">Telas ({ui.multi.length}/4) ▾</summary>
                <div className="absolute left-0 top-7 z-30 max-h-72 w-60 overflow-auto rounded-lg border border-border bg-surface p-2 shadow-xl">
                  {DEVICES.map((d) => (
                    <label key={d.id} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-xs text-foreground hover:bg-surface-muted">
                      <input type="checkbox" checked={ui.multi.includes(d.id)} onChange={() => toggleMulti(d.id)} />
                      <span className="flex-1">{d.name}</span><span className="text-muted">{d.w}</span>
                    </label>
                  ))}
                </div>
              </details>
            ) : (
              <span className="hidden items-center gap-1 lg:flex">
                {BREAKPOINT_CHIPS.map((w) => (
                  <button key={w} onClick={() => set({ mode: "custom", w, h: ui.mode === "fluid" ? Math.round(box.h) : ui.h })} className={`rounded px-1.5 py-0.5 font-mono ${Math.round(curW) === w ? "bg-foreground text-background" : "border border-border text-muted hover:text-foreground"}`}>{w}</button>
                ))}
              </span>
            )}
            <button className="ml-auto text-muted hover:text-foreground" onClick={() => set({ console: !ui.console })}>{ui.console ? "▾ Console" : "▸ Console"}{lines.length ? ` (${lines.length})` : ""}</button>
          </div>

          <div ref={viewport} className={`relative min-h-0 flex-1 ${ui.mode === "fluid" ? "overflow-hidden" : "overflow-auto bg-surface-muted"}`}>
            {ui.mode === "fluid" ? (
              <Frame w={geo.frames[0].w} h={geo.frames[0].h} scale={1} getDoc={getDoc} runId={runId} register={reg} blocked={dragging} />
            ) : (
              <div className="flex min-h-full min-w-full p-4"><div className="mx-auto flex items-start gap-6">
                {geo.frames.map((f, i) => (
                  <div key={i} className="relative shrink-0">
                    {f.label && <p className="mb-1.5 text-center text-[11px] text-muted">{f.label}</p>}
                    <Frame w={f.w} h={f.h} scale={geo.scale} getDoc={getDoc} runId={runId} register={reg} blocked={dragging} />
                    {ui.mode !== "multi" && (
                      <>
                        <div onPointerDown={(e) => startDrag(e, "x", geo.scale)} className="absolute -right-3 top-0 h-full w-3 cursor-ew-resize" title="Arraste para redimensionar" />
                        <div onPointerDown={(e) => startDrag(e, "y", geo.scale)} className="absolute -bottom-3 left-0 h-3 w-full cursor-ns-resize" />
                        <div onPointerDown={(e) => startDrag(e, "xy", geo.scale)} className="absolute -bottom-3 -right-3 h-4 w-4 cursor-nwse-resize rounded-full border border-border bg-surface" />
                      </>
                    )}
                  </div>
                ))}
              </div></div>
            )}
          </div>

          {ui.console && (
            <div className="flex h-40 shrink-0 flex-col border-t border-border bg-black">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-1 text-[11px] text-zinc-400">
                <span>Console</span>
                <button onClick={() => setLines([])} className="hover:text-white">limpar</button>
              </div>
              <div className="min-h-0 flex-1 overflow-auto px-3 py-1.5 font-mono text-[12.5px] leading-relaxed">
                {lines.length === 0 && <span className="text-zinc-400">{"// console.log() aparece aqui"}</span>}
                {lines.map((l, i) => (
                  <div key={i} className={`whitespace-pre-wrap ${l.t === "error" ? "text-red-400" : l.t === "warn" ? "text-yellow-300" : l.t === "result" ? "text-sky-300" : l.t === "input" ? "text-zinc-400" : "text-zinc-100"}`}>
                    {l.t === "result" ? "← " : l.t === "input" ? "› " : ""}{l.m}
                  </div>
                ))}
                <div ref={consoleEnd} />
              </div>
              <input
                value={repl}
                onChange={(e) => setRepl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendRepl()}
                placeholder="› digite uma expressão JavaScript e aperte Enter (ex.: document.title)"
                className="border-t border-white/10 bg-transparent px-3 py-1.5 font-mono text-[12.5px] text-zinc-100 outline-none placeholder:text-zinc-400"
              />
            </div>
          )}
        </section>
      </div>

      {toast && <div role="status" className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-lg">{toast}</div>}
    </div>
  );
}
