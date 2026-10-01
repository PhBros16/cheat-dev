"use client";

import { useEffect, useRef, useState } from "react";
import type { PlayKind } from "@/lib/types";

/* ---------- documentos do iframe ---------- */

const BASE = `*{box-sizing:border-box}body{font-family:system-ui,sans-serif;padding:14px;color:#14171a;background:#fff;margin:0;line-height:1.5}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-30px)}}
@keyframes slide{from{transform:translateX(0)}to{transform:translateX(120px)}}
@keyframes fade{0%,100%{opacity:1}50%{opacity:.15}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
.box{background:#dbeafe;border:2px solid #2f6fed;border-radius:8px;padding:12px 18px;font-weight:600;color:#1e3a8a}
.target{background:#fde68a;border-color:#d97706;color:#78350f}
.wrap{padding:10px;border:1px dashed #9ca3af;border-radius:8px}`;

export function htmlDoc(code: string) {
  return `<!doctype html><meta charset="utf-8"><style>${BASE}</style>${code}`;
}

function boxes(n: number) {
  return Array.from({ length: n }, (_, i) =>
    `<div class="box${i === 1 ? " target" : ""}">${String.fromCharCode(65 + i)}</div>`
  ).join("");
}

export function cssDoc(mode: string, css: string) {
  const lorem =
    "Texto de exemplo para testar a propriedade. Ele é longo o bastante para quebrar em mais de uma linha e mostrar o efeito.";
  const scenes: Record<string, string> = {
    i: `.box{display:inline-block;margin:0}.target{${css}}</style><div class="wrap">${boxes(3)}</div>`,
    c: `.wrap{${css}}</style><div class="wrap"><div class="box">A</div><div class="box target">B</div><div class="box">C</div></div>`,
    f: `.wrap{display:flex;gap:8px;min-height:150px;${css}}</style><div class="wrap">${boxes(3)}</div>`,
    fi: `.wrap{display:flex;gap:8px;min-height:150px}.target{${css}}</style><div class="wrap">${boxes(3)}</div>`,
    g: `.wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;${css}}</style><div class="wrap">${boxes(6)}</div>`,
    gi: `.wrap{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.target{${css}}</style><div class="wrap">${boxes(6)}</div>`,
    p: `.target{${css}}</style><p class="target">${lorem}</p>`,
    h: `.target{${css}}.target:hover{transform:translateX(90px);background:#f87171;color:#fff;box-shadow:0 6px 16px rgba(0,0,0,.3);width:150px}</style><p style="font-size:12px;color:#6b7280;margin:0 0 8px">Passe o mouse sobre a caixa</p><div class="box target" style="display:inline-block">Hover</div>`,
    hr: `.target{${css}}.target:hover{transform:rotate(28deg)}</style><p style="font-size:12px;color:#6b7280;margin:0 0 8px">Passe o mouse sobre a caixa</p><div style="padding:30px 0 0 30px"><div class="box target" style="display:inline-block">Gira</div></div>`,
    a: `.target{display:inline-block;${css}}</style><div class="wrap" style="min-height:90px"><div class="box target">Animado</div></div>`,
  };
  return `<!doctype html><meta charset="utf-8"><style>${BASE}${scenes[mode] ?? scenes.i}`;
}

function jsDoc(code: string) {
  const safe = code.replace(/<\/script/gi, "<\\/script");
  return `<!doctype html><meta charset="utf-8"><body style="font-family:system-ui"><script>
(function(){
  function fmt(x){try{if(typeof x==='string')return x;if(x instanceof Error)return x.name+': '+x.message;
    var s=JSON.stringify(x,function(k,v){return typeof v==='function'?'[Function]':typeof v==='undefined'?'undefined':v},2);
    return s===undefined?String(x):s}catch(e){return String(x)}}
  function send(t,a){parent.postMessage({__cd:1,t:t,m:[].slice.call(a).map(fmt).join(' ')},'*')}
  ['log','info','warn','error','table','dir','debug'].forEach(function(k){console[k]=function(){send(k==='table'||k==='dir'||k==='debug'||k==='info'?'log':k,arguments)}});
  window.addEventListener('error',function(e){send('error',[e.message])});
  window.addEventListener('unhandledrejection',function(e){send('error',['Promise rejeitada: '+(e.reason&&e.reason.message||e.reason)])});
  (async function(){try{
${safe}
  }catch(e){send('error',[e.name+': '+e.message])}})();
})();
</script>`;
}

/* ---------- componentes ---------- */

function Frame({ srcDoc, height = 210, scripts = false, iframeRef }: {
  srcDoc: string; height?: number; scripts?: boolean; iframeRef?: React.RefObject<HTMLIFrameElement | null>;
}) {
  return (
    <iframe
      ref={iframeRef}
      title="Resultado"
      sandbox={scripts ? "allow-scripts" : ""}
      srcDoc={srcDoc}
      loading="lazy"
      style={{ height }}
      className="w-full rounded-lg border border-border bg-white"
    />
  );
}

function Shell({ label, hint, children, onReset }: { label: string; hint: string; children: React.ReactNode; onReset: () => void }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted">{hint}</p>
        </div>
        <button type="button" onClick={onReset} className="rounded-md border border-border px-2 py-1 text-xs text-muted hover:text-foreground">
          Restaurar
        </button>
      </div>
      {children}
    </section>
  );
}

const areaCls =
  "h-52 w-full resize-y rounded-lg border border-border bg-surface-muted p-3 font-mono text-[13px] leading-relaxed text-foreground outline-none focus:border-css";

function HtmlPlay({ initial }: { initial: string }) {
  const [code, setCode] = useState(initial);
  return (
    <Shell label="Testar ao vivo" hint="Edite o HTML e veja o resultado na hora." onReset={() => setCode(initial)}>
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} aria-label="Código HTML" className={areaCls} />
        <Frame srcDoc={htmlDoc(code)} height={208} />
      </div>
    </Shell>
  );
}

function CssPlay({ mode, initial }: { mode: string; initial: string }) {
  const pretty = initial.split(";").map((s) => s.trim()).filter(Boolean).map((s) => s + ";").join("\n");
  const [css, setCss] = useState(pretty);
  return (
    <Shell label="Testar ao vivo" hint="Edite as declarações CSS e veja o efeito na caixa B." onReset={() => setCss(pretty)}>
      <div className="grid gap-3 lg:grid-cols-2">
        <textarea value={css} onChange={(e) => setCss(e.target.value)} spellCheck={false} aria-label="Código CSS" className={areaCls} />
        <Frame srcDoc={cssDoc(mode, css.replace(/\n/g, " "))} height={208} />
      </div>
    </Shell>
  );
}

type Line = { t: string; m: string };

function JsPlay({ initial }: { initial: string }) {
  const [code, setCode] = useState(initial);
  const [runKey, setRunKey] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.source !== frame.current?.contentWindow || !e.data || !e.data.__cd) return;
      setLines((l) => [...l, { t: e.data.t, m: e.data.m }].slice(-200));
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  function run() {
    setLines([]);
    setRunKey((k) => k + 1);
  }

  return (
    <Shell label="Executar" hint="Edite o código e clique em Rodar. O console aparece abaixo." onReset={() => { setCode(initial); setLines([]); setRunKey(0); }}>
      <textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck={false} aria-label="Código JavaScript" className={areaCls} />
      <div className="mt-2 flex items-center gap-2">
        <button type="button" onClick={run} className="rounded-lg bg-js px-3.5 py-1.5 text-sm font-semibold text-black">
          ▶ Rodar
        </button>
        <span className="text-xs text-muted">Roda isolado no seu navegador (sandbox).</span>
      </div>
      {runKey > 0 && (
        <iframe key={runKey} ref={frame} title="Execução" sandbox="allow-scripts" srcDoc={jsDoc(code)} className="hidden" />
      )}
      <pre className="mt-2 min-h-16 overflow-x-auto rounded-lg border border-border bg-black p-3 font-mono text-[13px] leading-relaxed">
        {runKey === 0 ? (
          <span className="text-zinc-500">{"// a saída do console aparece aqui"}</span>
        ) : lines.length === 0 ? (
          <span className="text-zinc-500">{"// (sem saída)"}</span>
        ) : (
          lines.map((l, i) => (
            <div key={i} className={l.t === "error" ? "text-red-400" : l.t === "warn" ? "text-yellow-300" : "text-zinc-100"}>
              {l.m}
            </div>
          ))
        )}
      </pre>
    </Shell>
  );
}

export default function Playground({ kind, code, mode }: { kind: PlayKind; code: string; mode?: string }) {
  if (kind === "html") return <HtmlPlay initial={code} />;
  if (kind === "css") return <CssPlay mode={mode ?? "i"} initial={code} />;
  return <JsPlay initial={code} />;
}
