"use client";

import { useRef, useState } from "react";
import SqlResults from "@/components/SqlResults";
import OpenInSqlLab from "@/components/OpenInSqlLab";
import { ENGINES, errHint, openConn, type Conn, type Engine, type Table } from "@/lib/sqlEngine";
import { DBS, type DbId } from "@/lib/sqlDbs";
import type { ResultSet } from "@/lib/sqljs";

/** Testa uma consulta na hora, num banco de exemplo (SQLite ou PostgreSQL, rodando no navegador). Cada execução parte de um banco novo. */
export default function SqlPlay({ db, query, pg, only }: { db: string; query: string; pg?: string; only?: "pg" }) {
  const info = DBS[db as DbId] ?? DBS.loja;
  const [engine, setEngine] = useState<Engine>(only ?? "sqlite");
  const initial = (e: Engine) => (e === "pg" ? pg ?? query : query);
  const [texts, setTexts] = useState<Record<Engine, string>>({ sqlite: query, pg: pg ?? query });
  const [sets, setSets] = useState<ResultSet[] | null>(null);
  const [err, setErr] = useState("");
  const [ms, setMs] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [schema, setSchema] = useState<Table[] | null>(null);
  const seq = useRef(0);

  const text = texts[engine];
  const setText = (v: string) => setTexts((t) => ({ ...t, [engine]: v }));

  async function run(sql = text) {
    const my = ++seq.current;
    setBusy(true); setErr(""); setSets(null);
    let c: Conn | null = null;
    try {
      c = await openConn(engine, info.id);
      const t = performance.now();
      const r = await c.run(sql);
      if (my !== seq.current) return;
      setMs(Math.round((performance.now() - t) * 10) / 10);
      setSets(r);
    } catch (e) {
      if (my === seq.current) setErr(e instanceof Error ? e.message : String(e));
    } finally {
      c?.close();
      if (my === seq.current) setBusy(false);
    }
  }

  async function toggleSchema() {
    if (schema) return setSchema(null);
    try {
      const c = await openConn(engine, info.id);
      setSchema(await c.schema());
      c.close();
    } catch (e) { setErr(e instanceof Error ? e.message : String(e)); }
  }

  function pick(e: Engine) {
    if (only || e === engine) return;
    seq.current++;
    setEngine(e); setSets(null); setErr(""); setSchema(null); setMs(null);
  }

  const hint = err ? errHint(engine, err) : "";

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Testar na hora</p>
          <p className="text-xs text-muted">Banco de exemplo: <b className="text-foreground">{info.name}</b>. Edite e rode. Cada execução começa do banco original, então pode experimentar sem medo.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-border" role="tablist" aria-label="Motor SQL">
            {ENGINES.map((e) => (
              <button key={e.id} role="tab" aria-selected={engine === e.id} disabled={!!only && e.id !== only} onClick={() => pick(e.id)}
                title={e.id === "pg" ? "PostgreSQL de verdade (o mesmo banco do Supabase)" : "SQLite: leve, usado em apps e celulares"}
                className={`px-2.5 py-1 text-xs font-semibold ${engine === e.id ? "bg-foreground text-background" : "bg-surface text-muted hover:text-foreground disabled:opacity-40"}`}>{e.short}</button>
            ))}
          </div>
          <button onClick={toggleSchema} className="rounded-md border border-border px-2 py-1 text-xs text-muted hover:text-foreground">{schema ? "Ocultar tabelas" : "Ver tabelas"}</button>
          <OpenInSqlLab db={info.id} query={text} engine={engine} />
          <button onClick={() => { setText(initial(engine)); setSets(null); setErr(""); }} className="rounded-md border border-border px-2 py-1 text-xs text-muted hover:text-foreground">Restaurar</button>
        </div>
      </div>

      {only === "pg" && <p className="border-b border-border bg-sky-500/10 px-4 py-2 text-xs text-foreground">Este recurso é do <b>PostgreSQL</b> (e, portanto, do Supabase). Ele roda aqui num Postgres de verdade dentro do navegador; o SQLite não tem equivalente.</p>}
      {engine === "pg" && !only && <p className="border-b border-border bg-sky-500/10 px-4 py-2 text-xs text-foreground">Rodando no <b>PostgreSQL</b> (o mesmo motor do Supabase). Na primeira vez ele baixa cerca de 4 MB.</p>}

      {schema && (
        <div className="grid grid-cols-1 gap-2 border-b border-border bg-surface-muted/40 p-3 sm:grid-cols-2">
          {schema.map((t) => (
            <div key={t.name} className="rounded-lg border border-border bg-surface p-2.5 font-mono text-xs">
              <p className="font-bold text-foreground">{t.name} <span className="font-normal text-muted">({t.rows})</span></p>
              <p className="mt-1 leading-relaxed text-muted">{t.cols.map((c) => `${c.pk ? "🔑" : ""}${c.name} ${c.type}`).join(" · ")}</p>
            </div>
          ))}
        </div>
      )}

      <div className="p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") void run(); }}
          spellCheck={false}
          rows={Math.min(16, Math.max(4, text.split("\n").length + 1))}
          className="w-full resize-y rounded-lg border border-border bg-[#0e1013] p-3 font-mono text-[13px] leading-relaxed text-[#e8eaec] outline-none focus-visible:border-css"
          aria-label="Consulta SQL"
        />
        <div className="mt-2 flex items-center gap-3">
          <button onClick={() => void run()} disabled={busy} className="rounded-lg bg-[#1f9c7a] px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60">{busy ? (engine === "pg" ? "Carregando Postgres…" : "Rodando…") : "▶ Rodar (Ctrl+Enter)"}</button>
          {ms !== null && !err && <span className="text-xs text-muted">{ms} ms · {ENGINES.find((e) => e.id === engine)?.short}</span>}
        </div>

        <div className="mt-3" aria-live="polite">
          {err && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm">
              <p className="font-mono text-red-400">{err}</p>
              {hint && <p className="mt-2 text-foreground">💡 {hint}</p>}
            </div>
          )}
          {sets && sets.length > 0 && <SqlResults sets={sets} />}
          {sets && sets.length === 0 && !err && <p className="rounded-lg border border-border p-3 text-sm text-muted">Executado com sucesso. Esse comando não devolve linhas (é uma alteração). Rode um SELECT para ver o efeito.</p>}
        </div>
      </div>
    </div>
  );
}
