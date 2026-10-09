"use client";

import { useMemo, useRef, useState } from "react";
import OpenInLab from "@/components/OpenInLab";

/* ---------- utilitários de UI ---------- */
const field = "rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground";
const card = "rounded-xl border border-border bg-surface p-4";

function Range({ label, v, set, min, max, step = 1, unit = "" }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step?: number; unit?: string }) {
  return (
    <label className="grid gap-1 text-xs text-muted">
      <span className="flex justify-between"><span>{label}</span><span className="font-mono text-foreground">{v}{unit}</span></span>
      <input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} className="w-full accent-[#2f6fed]" />
    </label>
  );
}

function Select<T extends string>({ label, v, set, opts }: { label: string; v: T; set: (v: T) => void; opts: readonly T[] }) {
  return (
    <label className="grid gap-1 text-xs text-muted">
      {label}
      <select value={v} onChange={(e) => set(e.target.value as T)} className={field}>{opts.map((o) => <option key={o} value={o}>{o}</option>)}</select>
    </label>
  );
}

function Output({ css, html = '<div class="caixa"></div>' }: { css: string; html?: string }) {
  const [ok, setOk] = useState(false);
  const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;min-height:100dvh;display:grid;place-items:center;font-family:system-ui;background:#f3f4f6}</style><style>\n${css}\n</style></head><body>${html}</body></html>`;
  return (
    <div className="mt-4">
      <pre className="overflow-x-auto rounded-lg bg-[#0e1013] p-3 font-mono text-[13px] leading-relaxed text-[#e8eaec]">{css}</pre>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground hover:border-muted"
          onClick={async () => { try { await navigator.clipboard.writeText(css); setOk(true); setTimeout(() => setOk(false), 1500); } catch {} }}
        >{ok ? "Copiado ✓" : "Copiar CSS"}</button>
        <OpenInLab payload={{ doc }} label="Testar no Lab" />
      </div>
    </div>
  );
}

const Stage = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <div className={`grid min-h-[260px] place-items-center rounded-xl border border-border p-6 ${dark ? "bg-[#0e1013]" : "bg-[#f3f4f6]"}`}>{children}</div>
);

/* ============================== 1. SOMBRA ============================== */
type Sh = { x: number; y: number; blur: number; spread: number; color: string; op: number; inset: boolean };
const SHADOW_PRESETS: { name: string; l: Sh[] }[] = [
  { name: "Suave", l: [{ x: 0, y: 1, blur: 2, spread: 0, color: "#000000", op: 8, inset: false }, { x: 0, y: 8, blur: 24, spread: 0, color: "#000000", op: 12, inset: false }] },
  { name: "Elevada", l: [{ x: 0, y: 4, blur: 8, spread: 0, color: "#000000", op: 10, inset: false }, { x: 0, y: 24, blur: 56, spread: 0, color: "#000000", op: 18, inset: false }] },
  { name: "Brilho azul", l: [{ x: 0, y: 0, blur: 24, spread: 0, color: "#2f6fed", op: 55, inset: false }] },
  { name: "Dura (neo-brutal)", l: [{ x: 6, y: 6, blur: 0, spread: 0, color: "#000000", op: 100, inset: false }] },
  { name: "Interna", l: [{ x: 0, y: 2, blur: 8, spread: 0, color: "#000000", op: 25, inset: true }] },
];
const hexA = (hex: string, op: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${n >> 16} ${(n >> 8) & 255} ${n & 255} / ${op / 100})`;
};
const shCss = (l: Sh[]) => l.map((s) => `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${hexA(s.color, s.op)}`);

function ShadowGen() {
  const [layers, setLayers] = useState<Sh[]>(SHADOW_PRESETS[1].l);
  const [i, setI] = useState(0);
  const cur = layers[Math.min(i, layers.length - 1)];
  const up = (p: Partial<Sh>) => setLayers((ls) => ls.map((s, k) => (k === i ? { ...s, ...p } : s)));
  const css = `.caixa {\n  width: 160px; height: 110px;\n  background: #fff; border-radius: 16px;\n  box-shadow:\n    ${shCss(layers).join(",\n    ")};\n}`;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
      <div className={card}>
        <div className="mb-3 flex flex-wrap gap-1.5">{SHADOW_PRESETS.map((p) => <button key={p.name} onClick={() => { setLayers(p.l); setI(0); }} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted hover:text-foreground">{p.name}</button>)}</div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {layers.map((_, k) => <button key={k} onClick={() => setI(k)} className={`rounded-md px-2.5 py-1 text-xs font-semibold ${k === i ? "bg-foreground text-background" : "border border-border text-muted"}`}>Camada {k + 1}</button>)}
          {layers.length < 4 && <button onClick={() => { setLayers([...layers, { x: 0, y: 8, blur: 16, spread: 0, color: "#000000", op: 15, inset: false }]); setI(layers.length); }} className="rounded-md border border-dashed border-border px-2.5 py-1 text-xs text-muted">+ camada</button>}
          {layers.length > 1 && <button onClick={() => { setLayers(layers.filter((_, k) => k !== i)); setI(0); }} className="rounded-md px-2 py-1 text-xs text-muted hover:text-foreground">remover</button>}
        </div>
        <div className="grid gap-3">
          <Range label="Deslocamento X" v={cur.x} set={(x) => up({ x })} min={-50} max={50} unit="px" />
          <Range label="Deslocamento Y" v={cur.y} set={(y) => up({ y })} min={-50} max={80} unit="px" />
          <Range label="Desfoque (blur)" v={cur.blur} set={(blur) => up({ blur })} min={0} max={100} unit="px" />
          <Range label="Expansão (spread)" v={cur.spread} set={(spread) => up({ spread })} min={-30} max={50} unit="px" />
          <Range label="Opacidade" v={cur.op} set={(op) => up({ op })} min={0} max={100} unit="%" />
          <div className="flex items-center gap-3 text-xs text-muted">
            <label className="flex items-center gap-2">Cor <input type="color" value={cur.color} onChange={(e) => up({ color: e.target.value })} /></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={cur.inset} onChange={(e) => up({ inset: e.target.checked })} /> interna (inset)</label>
          </div>
        </div>
      </div>
      <div>
        <Stage><div style={{ width: 160, height: 110, background: "#fff", borderRadius: 16, boxShadow: shCss(layers).join(",") }} /></Stage>
        <Output css={css} />
      </div>
    </div>
  );
}

/* ============================== 2. GRADIENTE ============================== */
type Stop = { c: string; p: number };
function GradientGen() {
  const [kind, setKind] = useState<"linear" | "radial" | "conic">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([{ c: "#2f6fed", p: 0 }, { c: "#7c3aed", p: 55 }, { c: "#e4572e", p: 100 }]);
  const list = stops.map((s) => `${s.c} ${s.p}%`).join(", ");
  const value = kind === "linear" ? `linear-gradient(${angle}deg, ${list})` : kind === "radial" ? `radial-gradient(circle at 50% 50%, ${list})` : `conic-gradient(from ${angle}deg, ${list})`;
  const upS = (k: number, p: Partial<Stop>) => setStops((s) => s.map((x, j) => (j === k ? { ...x, ...p } : x)));
  const css = `.caixa {\n  width: 220px; height: 150px; border-radius: 16px;\n  background: ${value};\n}`;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
      <div className={card}>
        <div className="grid gap-3">
          <Select label="Tipo" v={kind} set={setKind} opts={["linear", "radial", "conic"] as const} />
          {kind !== "radial" && <Range label={kind === "linear" ? "Ângulo" : "Giro inicial"} v={angle} set={setAngle} min={0} max={360} unit="°" />}
          {stops.map((s, k) => (
            <div key={k} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-xs text-muted">
              <input type="color" value={s.c} onChange={(e) => upS(k, { c: e.target.value })} />
              <input type="range" min={0} max={100} value={s.p} onChange={(e) => upS(k, { p: Number(e.target.value) })} className="accent-[#2f6fed]" />
              <span className="flex items-center gap-2 font-mono text-foreground">{s.p}%{stops.length > 2 && <button onClick={() => setStops(stops.filter((_, j) => j !== k))} className="text-muted hover:text-foreground" aria-label="remover cor">✕</button>}</span>
            </div>
          ))}
          {stops.length < 5 && <button onClick={() => setStops([...stops, { c: "#1f9c7a", p: 80 }].sort((a, b) => a.p - b.p))} className="w-fit rounded-md border border-dashed border-border px-3 py-1 text-xs text-muted">+ adicionar cor</button>}
        </div>
      </div>
      <div>
        <Stage><div style={{ width: 220, height: 150, borderRadius: 16, background: value }} /></Stage>
        <Output css={css} />
      </div>
    </div>
  );
}

/* ============================== 3. FLEXBOX ============================== */
function FlexGen() {
  const [dir, setDir] = useState<"row" | "row-reverse" | "column" | "column-reverse">("row");
  const [wrap, setWrap] = useState<"nowrap" | "wrap" | "wrap-reverse">("nowrap");
  const [jc, setJc] = useState<"flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly">("flex-start");
  const [ai, setAi] = useState<"stretch" | "flex-start" | "center" | "flex-end" | "baseline">("stretch");
  const [gap, setGap] = useState(12);
  const [n, setN] = useState(4);
  const css = `.container {\n  display: flex;\n  flex-direction: ${dir};\n  flex-wrap: ${wrap};\n  justify-content: ${jc};\n  align-items: ${ai};\n  gap: ${gap}px;\n}`;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.3fr]">
      <div className={card}>
        <div className="grid grid-cols-2 gap-3">
          <Select label="flex-direction" v={dir} set={setDir} opts={["row", "row-reverse", "column", "column-reverse"] as const} />
          <Select label="flex-wrap" v={wrap} set={setWrap} opts={["nowrap", "wrap", "wrap-reverse"] as const} />
          <Select label="justify-content" v={jc} set={setJc} opts={["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] as const} />
          <Select label="align-items" v={ai} set={setAi} opts={["stretch", "flex-start", "center", "flex-end", "baseline"] as const} />
        </div>
        <div className="mt-3 grid gap-3"><Range label="gap" v={gap} set={setGap} min={0} max={40} unit="px" /><Range label="Quantidade de itens" v={n} set={setN} min={1} max={9} /></div>
      </div>
      <div>
        <div className="min-h-[260px] rounded-xl border-2 border-dashed border-border bg-[#f3f4f6] p-3" style={{ display: "flex", flexDirection: dir, flexWrap: wrap, justifyContent: jc, alignItems: ai, gap }}>
          {Array.from({ length: n }, (_, k) => (
            <div key={k} className="grid place-items-center rounded-lg border-2 border-[#2f6fed] bg-[#dbeafe] font-bold text-[#1e3a8a]" style={{ width: 56 + (k % 3) * 18, height: 48 + (k % 2) * 26 }}>{k + 1}</div>
          ))}
        </div>
        <Output css={css} html={`<div class="container">${Array.from({ length: n }, (_, k) => `<div class="item">${k + 1}</div>`).join("")}</div>`} />
      </div>
    </div>
  );
}

/* ============================== 4. GRID ============================== */
function GridGen() {
  const [mode, setMode] = useState<"colunas fixas" | "auto-fit (responsivo)">("colunas fixas");
  const [cols, setCols] = useState(3);
  const [min, setMin] = useState(110);
  const [gap, setGap] = useState(12);
  const [n, setN] = useState(6);
  const tpl = mode === "colunas fixas" ? `repeat(${cols}, 1fr)` : `repeat(auto-fit, minmax(${min}px, 1fr))`;
  const css = `.grade {\n  display: grid;\n  grid-template-columns: ${tpl};\n  gap: ${gap}px;\n}`;
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.3fr]">
      <div className={card}>
        <div className="grid gap-3">
          <Select label="Modo" v={mode} set={setMode} opts={["colunas fixas", "auto-fit (responsivo)"] as const} />
          {mode === "colunas fixas" ? <Range label="Colunas" v={cols} set={setCols} min={1} max={8} /> : <Range label="Largura mínima da coluna" v={min} set={setMin} min={60} max={260} unit="px" />}
          <Range label="gap" v={gap} set={setGap} min={0} max={40} unit="px" />
          <Range label="Quantidade de itens" v={n} set={setN} min={1} max={16} />
        </div>
        {mode !== "colunas fixas" && <p className="mt-3 text-xs text-muted">Dica: redimensione a janela. As colunas aparecem e somem sozinhas, sem media query.</p>}
      </div>
      <div>
        <div className="min-h-[260px] rounded-xl border-2 border-dashed border-border bg-[#f3f4f6] p-3" style={{ display: "grid", gridTemplateColumns: tpl, gap, alignContent: "start" }}>
          {Array.from({ length: n }, (_, k) => <div key={k} className="grid h-14 place-items-center rounded-lg border-2 border-[#7c3aed] bg-[#ede9fe] font-bold text-[#4c1d95]">{k + 1}</div>)}
        </div>
        <Output css={css} html={`<div class="grade">${Array.from({ length: n }, (_, k) => `<div class="item">${k + 1}</div>`).join("")}</div>`} />
      </div>
    </div>
  );
}

/* ============================== 5. CURVA (cubic-bezier) ============================== */
const CURVES: { name: string; v: [number, number, number, number] }[] = [
  { name: "ease", v: [0.25, 0.1, 0.25, 1] },
  { name: "ease-in", v: [0.42, 0, 1, 1] },
  { name: "ease-out", v: [0, 0, 0.58, 1] },
  { name: "ease-in-out", v: [0.42, 0, 0.58, 1] },
  { name: "Suave moderna", v: [0.22, 1, 0.36, 1] },
  { name: "Elástico (overshoot)", v: [0.34, 1.56, 0.64, 1] },
  { name: "Antecipação", v: [0.68, -0.55, 0.27, 1.55] },
];

function BezierGen() {
  const [v, setV] = useState<[number, number, number, number]>(CURVES[5].v);
  const [dur, setDur] = useState(900);
  const [run, setRun] = useState(0);
  const svg = useRef<SVGSVGElement>(null);
  const S = 180, PAD = 36, YMAX = 1.6, YMIN = -0.6; // eixo Y vai de -0,6 a 1,6 para caber overshoot e antecipação
  const H = (YMAX - YMIN) * S + PAD * 2;
  const px = (x: number) => PAD + x * S;
  const py = (y: number) => PAD + (YMAX - y) * S;

  function drag(which: 0 | 1) {
    return (e: React.PointerEvent) => {
      e.preventDefault();
      const move = (ev: PointerEvent) => {
        const r = svg.current!.getBoundingClientRect();
        const k = (S + PAD * 2) / r.width;
        const x = Math.min(1, Math.max(0, ((ev.clientX - r.left) * k - PAD) / S));
        const y = Math.min(YMAX, Math.max(YMIN, YMAX - ((ev.clientY - r.top) * k - PAD) / S));
        setV((c) => (which === 0 ? [round(x), round(y), c[2], c[3]] : [c[0], c[1], round(x), round(y)]));
      };
      const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); setRun((n) => n + 1); };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
  }
  const round = (n: number) => Math.round(n * 100) / 100;
  const fn = `cubic-bezier(${v.join(", ")})`;
  const css = `.elemento {\n  transition: transform ${dur}ms ${fn};\n}\n.elemento:hover {\n  transform: translateX(160px);\n}`;
  const anim = useMemo(() => `@keyframes ida { from { left: 0 } to { left: calc(100% - 44px) } }`, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
      <div className={card}>
        <div className="mb-3 flex flex-wrap gap-1.5">{CURVES.map((c) => <button key={c.name} onClick={() => { setV(c.v); setRun((n) => n + 1); }} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted hover:text-foreground">{c.name}</button>)}</div>
        <svg ref={svg} viewBox={`0 0 ${S + PAD * 2} ${H}`} className="w-full max-w-[300px] touch-none rounded-lg bg-surface-muted">
          <rect x={PAD} y={py(1)} width={S} height={S} fill="none" stroke="currentColor" strokeOpacity=".2" strokeDasharray="4 4" />
          <line x1={px(0)} y1={py(0)} x2={px(v[0])} y2={py(v[1])} stroke="#e4572e" strokeWidth="2" />
          <line x1={px(1)} y1={py(1)} x2={px(v[2])} y2={py(v[3])} stroke="#2f6fed" strokeWidth="2" />
          <path d={`M ${px(0)} ${py(0)} C ${px(v[0])} ${py(v[1])}, ${px(v[2])} ${py(v[3])}, ${px(1)} ${py(1)}`} fill="none" stroke="currentColor" strokeWidth="3" className="text-foreground" />
          <circle cx={px(v[0])} cy={py(v[1])} r="9" fill="#e4572e" onPointerDown={drag(0)} style={{ cursor: "grab" }} />
          <circle cx={px(v[2])} cy={py(v[3])} r="9" fill="#2f6fed" onPointerDown={drag(1)} style={{ cursor: "grab" }} />
        </svg>
        <div className="mt-3"><Range label="Duração" v={dur} set={(n) => { setDur(n); setRun((k) => k + 1); }} min={200} max={2000} step={50} unit="ms" /></div>
      </div>
      <div>
        <Stage>
          <style>{anim}</style>
          <div className="relative h-14 w-full max-w-md rounded-full bg-black/10">
            <div key={run} className="absolute left-0 top-1.5 h-11 w-11 rounded-full bg-[#2f6fed]" style={{ animation: `ida ${dur}ms ${fn} both` }} />
          </div>
          <button onClick={() => setRun((n) => n + 1)} className="mt-4 rounded-md border border-border bg-white px-3 py-1.5 text-xs font-semibold text-black">▶ Repetir</button>
        </Stage>
        <Output css={css} html={`<div class="elemento" style="width:60px;height:60px;border-radius:50%;background:#2f6fed"></div>`} />
      </div>
    </div>
  );
}

/* ============================== 6. BORDER-RADIUS ============================== */
function RadiusGen() {
  const [h, setH] = useState([60, 40, 30, 70]); // topo-esq, topo-dir, base-dir, base-esq (horizontal)
  const [vv, setVv] = useState([60, 30, 70, 40]);
  const val = `${h.map((x) => x + "%").join(" ")} / ${vv.map((x) => x + "%").join(" ")}`;
  const css = `.forma {\n  width: 200px; height: 200px;\n  background: linear-gradient(135deg, #2f6fed, #7c3aed);\n  border-radius: ${val};\n}`;
  const names = ["Topo esquerdo", "Topo direito", "Base direita", "Base esquerda"];
  const rnd = () => Array.from({ length: 4 }, () => 30 + Math.round(Math.random() * 40));
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
      <div className={card}>
        <div className="grid gap-3">
          {names.map((nm, k) => (
            <div key={nm} className="grid grid-cols-2 gap-3">
              <Range label={`${nm} (horiz.)`} v={h[k]} set={(n) => setH(h.map((x, j) => (j === k ? n : x)))} min={0} max={100} unit="%" />
              <Range label="vertical" v={vv[k]} set={(n) => setVv(vv.map((x, j) => (j === k ? n : x)))} min={0} max={100} unit="%" />
            </div>
          ))}
          <div className="flex gap-2">
            <button onClick={() => { setH(rnd()); setVv(rnd()); }} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-foreground">🎲 Aleatório</button>
            <button onClick={() => { setH([50, 50, 50, 50]); setVv([50, 50, 50, 50]); }} className="rounded-md border border-border px-3 py-1.5 text-xs text-muted">Círculo</button>
          </div>
        </div>
      </div>
      <div>
        <Stage><div style={{ width: 200, height: 200, background: "linear-gradient(135deg,#2f6fed,#7c3aed)", borderRadius: val }} /></Stage>
        <Output css={css} html={'<div class="forma"></div>'} />
      </div>
    </div>
  );
}

/* ============================== PÁGINA ============================== */
const TABS = [
  { id: "sombra", label: "Sombra", C: ShadowGen },
  { id: "gradiente", label: "Gradiente", C: GradientGen },
  { id: "flexbox", label: "Flexbox", C: FlexGen },
  { id: "grid", label: "Grid", C: GridGen },
  { id: "curva", label: "Curva de animação", C: BezierGen },
  { id: "radius", label: "Border-radius", C: RadiusGen },
] as const;

export default function Generators() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("sombra");
  const Cur = TABS.find((t) => t.id === tab)!.C;
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Geradores">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition-colors ${tab === t.id ? "border-foreground bg-foreground text-background" : "border-border text-muted hover:text-foreground"}`}>{t.label}</button>
        ))}
      </div>
      <div className="mt-4"><Cur /></div>
    </div>
  );
}
