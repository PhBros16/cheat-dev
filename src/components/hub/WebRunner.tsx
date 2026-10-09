"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@/components/lab/Editor";
import { buildChallengeDoc } from "@/lib/challengeDoc";
import type { Code, WebChallenge } from "@/content/challenges";

type Result = { name: string; ok: boolean; err?: string };

/** Área de trabalho dos desafios de HTML, CSS e JavaScript: editor, resultado ao vivo e testes automáticos. */
export default function WebRunner({ challenge, onAttempt, onSolved }: { challenge: WebChallenge; onAttempt: () => void; onSolved: () => void }) {
  const [code, setCode] = useState<Code>(challenge.starter);
  const tabs = challenge.lang === "html" ? (["html"] as const) : challenge.lang === "css" ? (["css", "html"] as const) : (["js", "html"] as const);
  const [tab, setTab] = useState<"html" | "css" | "js">(tabs[0]);
  const [doc, setDoc] = useState(() => buildChallengeDoc(challenge.starter));
  const [results, setResults] = useState<Result[] | null>(null);
  const [running, setRunning] = useState(false);
  const [hint, setHint] = useState(false);
  const [sol, setSol] = useState(false);
  const iframe = useRef<HTMLIFrameElement>(null);
  const pending = useRef(false);
  const guard = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seq = useRef(0);

  /* resultado ao vivo (com pausa para não recarregar a cada tecla) */
  useEffect(() => {
    const t = setTimeout(() => setDoc(buildChallengeDoc(code)), 500);
    return () => clearTimeout(t);
  }, [code]);

  /* mensagens do iframe: pronto para testar / resultados */
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.source !== iframe.current?.contentWindow) return;
      const d = e.data;
      if (!d) return;
      if (d.__hubReady && pending.current) {
        pending.current = false;
        iframe.current?.contentWindow?.postMessage({ __hubRun: 1, id: seq.current, tests: challenge.tests }, "*");
      }
      if (d.__hubTests && d.id === seq.current) {
        if (guard.current) clearTimeout(guard.current);
        const r = d.results as Result[];
        setResults(r);
        setRunning(false);
        if (r.every((x) => x.ok)) onSolved();
      }
    }
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [challenge.tests, onSolved]);

  function run() {
    seq.current += 1;
    pending.current = true;
    setRunning(true);
    setResults(null);
    onAttempt();
    setDoc(buildChallengeDoc(code) + `\n<!-- ${seq.current} -->`); // força recarregar a página do exercício
    if (guard.current) clearTimeout(guard.current);
    guard.current = setTimeout(() => {
      if (pending.current || running) {
        pending.current = false;
        setRunning(false);
        setResults([{ name: "Os testes não responderam", ok: false, err: "A página pode ter ficado presa (laço infinito?) ou tem um erro de sintaxe. Revise o código e tente de novo." }]);
      }
    }, 9000);
  }

  const passed = results?.filter((r) => r.ok).length ?? 0;
  const allOk = !!results && results.length > 0 && passed === results.length;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="min-w-0">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center border-b border-black/40 bg-[#21252b]">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`border-r border-black/40 px-4 py-2 text-xs font-semibold uppercase ${tab === t ? "bg-[#282c34] text-white" : "text-zinc-400 hover:text-zinc-200"}`}>{t}</button>
            ))}
            <span className="ml-auto px-3 text-[11px] text-zinc-400">Ctrl+Enter roda os testes</span>
          </div>
          <div className="h-72 bg-[#282c34]">
            {(["html", "css", "js"] as const).map((t) => (
              <Editor key={t} lang={t} value={code[t]} onChange={(v) => setCode((c) => ({ ...c, [t]: v }))} onRun={run} visible={tab === t} />
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={run} disabled={running} className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-on-accent hover:brightness-110 disabled:opacity-60">{running ? "Testando…" : "▶ Rodar testes"}</button>
          <button onClick={() => setHint((v) => !v)} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-muted">💡 Dica</button>
          <button onClick={() => { if (sol || confirm("Ver a solução agora? Tente mais um pouco antes: é assim que se aprende.")) setSol((v) => !v); }} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-muted">👁 Solução</button>
          <button onClick={() => { setCode(challenge.starter); setResults(null); }} className="ml-auto rounded-lg px-3 py-2 text-sm text-muted hover:text-foreground">↺ Recomeçar</button>
        </div>
        {hint && <p className="mt-2 rounded-lg bg-warn-bg p-3 text-sm text-foreground">💡 {challenge.hint}</p>}
        {sol && (
          <div className="mt-2 overflow-x-auto rounded-lg bg-[#0e1013] p-3 font-mono text-xs leading-relaxed text-[#e8eaec]">
            {(["html", "css", "js"] as const).filter((t) => challenge.solution[t].trim() && (t !== "html" || challenge.lang !== "js" || true)).map((t) => (
              <div key={t} className="mb-2 last:mb-0"><p className="mb-1 text-[10px] uppercase text-zinc-400">{t}</p><pre className="whitespace-pre-wrap">{challenge.solution[t]}</pre></div>
            ))}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <p className="border-b border-border bg-surface px-3 py-1.5 text-xs text-muted">Resultado ao vivo (largura de 560px, usada nos testes)</p>
          <div className="overflow-auto" style={{ height: 260 }}>
            <iframe ref={iframe} title="Resultado" sandbox="allow-scripts allow-modals allow-forms" srcDoc={doc} style={{ width: 560, height: 260, border: 0, background: "#fff" }} />
          </div>
        </div>

        <div className="mt-3 rounded-xl border border-border bg-surface p-3" aria-live="polite">
          <p className="flex items-center justify-between text-sm font-semibold text-foreground">
            <span>Testes</span>
            {results && <span className={allOk ? "text-ok-fg" : "text-muted"}>{passed}/{results.length}</span>}
          </p>
          <ul className="mt-2 grid gap-1.5 text-sm">
            {(results ?? challenge.tests.map((t) => ({ name: t.name, ok: null as boolean | null, err: undefined }))).map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="w-5 shrink-0 text-center">{r.ok === null ? "○" : r.ok ? "✅" : "❌"}</span>
                <span className={r.ok === null ? "text-muted" : r.ok ? "text-foreground" : "text-err-fg"}>
                  {r.name}{"err" in r && r.err ? <span className="block text-xs text-muted">{r.err}</span> : null}
                </span>
              </li>
            ))}
          </ul>
          {allOk && <p className="mt-3 rounded-lg bg-ok-bg p-2.5 text-sm font-semibold text-ok-fg">🎉 Todos os testes passaram! Desafio concluído.</p>}
          {results && !allOk && <p className="mt-3 text-xs text-muted">Confira os testes com ❌, ajuste o código e rode de novo.</p>}
        </div>
      </div>
    </div>
  );
}
