"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@/components/lab/Editor";
import SqlResults from "@/components/SqlResults";
import { errHint, openConn, type Conn, type Table } from "@/lib/sqlEngine";
import { sameResult } from "@/lib/sqlCheck";
import { DBS } from "@/lib/sqlDbs";
import type { SqlChallenge } from "@/content/challenges";
import type { ResultSet } from "@/lib/sqljs";

/** Área de trabalho dos desafios de SQL: consulta livre no banco de exemplo e verificação contra a solução. */
export default function SqlRunner({ challenge, onAttempt, onSolved }: { challenge: SqlChallenge; onAttempt: () => void; onSolved: () => void }) {
  const [query, setQuery] = useState(`-- ${challenge.title}\n\n`);
  const [sets, setSets] = useState<ResultSet[] | null>(null);
  const [err, setErr] = useState("");
  const [verdict, setVerdict] = useState<{ ok: boolean; msg: string } | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [hint, setHint] = useState(false);
  const [sol, setSol] = useState(false);
  const conn = useRef<Conn | null>(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const c = await openConn("sqlite", challenge.db);
        if (dead) { c.close(); return; }
        conn.current = c;
        setTables(await c.schema());
      } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
    })();
    return () => { dead = true; conn.current?.close(); conn.current = null; };
  }, [challenge.db]);

  async function run() {
    if (!conn.current) return;
    setErr(""); setSets(null);
    try { setSets(await conn.current.run(query)); } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
  }

  async function check() {
    onAttempt();
    try {
      const a = await openConn("sqlite", challenge.db);
      const b = await openConn("sqlite", challenge.db);
      const user = (await a.run(query)).at(-1);
      const solution = (await b.run(challenge.solution)).at(-1);
      a.close(); b.close();
      const v = sameResult(user, solution, /order\s+by/i.test(challenge.solution));
      setVerdict(v);
      if (v.ok) onSolved();
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      setVerdict({ ok: false, msg: `Sua consulta deu erro: ${m}. ${errHint("sqlite", m)}` });
    }
  }

  const hintTxt = err ? errHint("sqlite", err) : "";

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="min-w-0">
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="h-56 bg-[#282c34]"><Editor lang="sql" value={query} onChange={setQuery} onRun={() => void run()} visible /></div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={() => void run()} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-muted">▶ Rodar</button>
          <button onClick={() => void check()} className="rounded-lg bg-[#1f9c7a] px-4 py-2 text-sm font-bold text-white hover:brightness-110">✓ Verificar resposta</button>
          <button onClick={() => setHint((v) => !v)} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-muted">💡 Dica</button>
          <button onClick={() => { if (sol || confirm("Ver a solução agora? Tente mais um pouco antes: é assim que se aprende.")) setSol((v) => !v); }} className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-muted">👁 Solução</button>
        </div>
        {hint && <p className="mt-2 rounded-lg bg-amber-500/10 p-3 text-sm text-foreground">💡 {challenge.hint}</p>}
        {sol && <pre className="mt-2 overflow-x-auto rounded-lg bg-[#0e1013] p-3 font-mono text-xs text-[#e8eaec]">{challenge.solution}</pre>}
        {verdict && <p role="status" className={`mt-3 rounded-lg p-3 text-sm font-semibold ${verdict.ok ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/10 text-red-300"}`}>{verdict.ok ? "🎉 " : "❌ "}{verdict.msg}</p>}
        <div className="mt-3" aria-live="polite">
          {err && <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm"><p className="font-mono text-red-400">{err}</p>{hintTxt && <p className="mt-2 text-foreground">💡 {hintTxt}</p>}</div>}
          {sets && sets.length > 0 && <SqlResults sets={sets} />}
        </div>
      </div>
      <aside className="min-w-0 rounded-xl border border-border bg-surface p-3 text-xs">
        <p className="font-semibold text-foreground">Banco: {DBS[challenge.db].name}</p>
        <p className="mb-2 text-muted">{DBS[challenge.db].desc}</p>
        {tables.map((t) => (
          <div key={t.name} className="mb-2 rounded-lg border border-border bg-background p-2 font-mono">
            <p className="font-bold text-foreground">{t.name} <span className="font-normal text-muted">({t.rows})</span></p>
            <p className="mt-0.5 leading-relaxed text-muted">{t.cols.map((c) => `${c.pk ? "🔑" : ""}${c.name}`).join(" · ")}</p>
          </div>
        ))}
      </aside>
    </div>
  );
}
