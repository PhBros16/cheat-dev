"use client";

import { useState } from "react";
import { DIALECTS } from "@/content/sql-dialects";
import type { Engine } from "@/lib/sqlEngine";

const ROWS = [
  { k: "sqlite", name: "SQLite", run: "sqlite" as Engine },
  { k: "pg", name: "PostgreSQL / Supabase", run: "pg" as Engine },
  { k: "mysql", name: "MySQL / MariaDB", run: null },
  { k: "sqlserver", name: "SQL Server", run: null },
] as const;

/** O mesmo objetivo escrito em cada banco. SQLite e PostgreSQL dá para testar; MySQL e SQL Server são referência. */
export default function Dialects({ onTry }: { onTry: (query: string, engine: Engine) => void }) {
  const [id, setId] = useState(DIALECTS[0].id);
  const [copied, setCopied] = useState("");
  const d = DIALECTS.find((x) => x.id === id) ?? DIALECTS[0];

  async function copy(k: string, text: string) {
    try { await navigator.clipboard.writeText(text); setCopied(k); setTimeout(() => setCopied(""), 1200); } catch {}
  }

  return (
    <div>
      <p className="mb-2 text-muted">Mesmo objetivo, quatro bancos. Escolha uma receita:</p>
      <select value={id} onChange={(e) => setId(e.target.value)} className="mb-3 w-full rounded-md border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-foreground" aria-label="Receita">
        {DIALECTS.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
      </select>
      <p className="mb-3 rounded-md bg-warn-bg p-2 text-foreground">{d.why}</p>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-2">
        {ROWS.map((r) => {
          const code = d[r.k];
          const test = r.run && d.try ? d.try[r.run === "pg" ? "pg" : "sqlite"] : null;
          return (
            <div key={r.k} className="rounded-lg border border-border bg-background">
              <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5">
                <b className="text-foreground">{r.name}</b>
                <span className="flex items-center gap-2">
                  {r.run ? (test ? <button onClick={() => onTry(test, r.run!)} className="font-semibold text-sql-fg hover:underline">▶ Testar aqui</button> : <span className="text-muted">sem teste</span>) : <span className="text-muted" title="Não há como rodar MySQL ou SQL Server no navegador">só referência</span>}
                  <button onClick={() => void copy(r.k, code)} className="text-muted hover:text-foreground">{copied === r.k ? "copiado ✓" : "copiar"}</button>
                </span>
              </div>
              <pre className="overflow-x-auto p-2.5 font-mono text-[11.5px] leading-relaxed text-foreground">{code}</pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
