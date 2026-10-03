"use client";

import { useState } from "react";
import SqlResults from "@/components/SqlResults";
import { explainError, getSqlJs, type ResultSet } from "@/lib/sqljs";
import { DBS, type DbId } from "@/lib/sqlDbs";
import OpenInSqlLab from "@/components/OpenInSqlLab";

/** Testa uma consulta na hora, num banco de exemplo (SQLite no navegador). Cada execução parte de um banco novo. */
export default function SqlPlay({ db, query }: { db: string; query: string }) {
  const info = DBS[db as DbId] ?? DBS.loja;
  const [text, setText] = useState(query);
  const [sets, setSets] = useState<ResultSet[] | null>(null);
  const [err, setErr] = useState("");
  const [ms, setMs] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [schema, setSchema] = useState<{ name: string; cols: string[] }[] | null>(null);

  async function run(sql = text) {
    setBusy(true); setErr(""); setSets(null);
    try {
      const S = await getSqlJs();
      const d = new S.Database();
      d.exec(info.script);
      const t = performance.now();
      const r = d.exec(sql) as ResultSet[];
      setMs(Math.round((performance.now() - t) * 10) / 10);
      setSets(r);
      d.close();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
    setBusy(false);
  }

  async function toggleSchema() {
    if (schema) return setSchema(null);
    const S = await getSqlJs();
    const d = new S.Database();
    d.exec(info.script);
    const names = d.exec("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")[0].values.map((v: unknown[]) => String(v[0]));
    setSchema(names.map((n: string) => ({ name: n, cols: d.exec(`PRAGMA table_info(${n})`)[0].values.map((v: unknown[]) => `${v[1]} ${v[2]}`) })));
    d.close();
  }

  const hint = err ? explainError(err) : "";

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Testar na hora</p>
          <p className="text-xs text-muted">Banco de exemplo: <b className="text-foreground">{info.name}</b>. Edite a consulta e rode. Cada execução começa do banco original, então pode experimentar sem medo.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleSchema} className="rounded-md border border-border px-2 py-1 text-xs text-muted hover:text-foreground">{schema ? "Ocultar tabelas" : "Ver tabelas"}</button>
          <OpenInSqlLab db={info.id} query={text} />
          <button onClick={() => { setText(query); setSets(null); setErr(""); }} className="rounded-md border border-border px-2 py-1 text-xs text-muted hover:text-foreground">Restaurar</button>
        </div>
      </div>

      {schema && (
        <div className="grid grid-cols-1 gap-2 border-b border-border bg-surface-muted/40 p-3 sm:grid-cols-2">
          {schema.map((t) => (
            <div key={t.name} className="rounded-lg border border-border bg-surface p-2.5 font-mono text-xs">
              <p className="font-bold text-foreground">{t.name}</p>
              <p className="mt-1 leading-relaxed text-muted">{t.cols.join(" · ")}</p>
            </div>
          ))}
        </div>
      )}

      <div className="p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") run(); }}
          spellCheck={false}
          rows={Math.min(14, Math.max(4, text.split("\n").length + 1))}
          className="w-full resize-y rounded-lg border border-border bg-[#0e1013] p-3 font-mono text-[13px] leading-relaxed text-[#e8eaec] outline-none focus-visible:border-css"
          aria-label="Consulta SQL"
        />
        <div className="mt-2 flex items-center gap-3">
          <button onClick={() => run()} disabled={busy} className="rounded-lg bg-[#1f9c7a] px-4 py-2 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60">{busy ? "Rodando…" : "▶ Rodar (Ctrl+Enter)"}</button>
          {ms !== null && !err && <span className="text-xs text-muted">{ms} ms</span>}
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
