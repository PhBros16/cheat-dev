"use client";

import type { ResultSet } from "@/lib/sqljs";

const MAX = 200;

export function toCsv(r: ResultSet) {
  const esc = (v: unknown) => (v === null ? "" : /[",\n;]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  return [r.columns.join(","), ...r.values.map((row) => row.map(esc).join(","))].join("\n");
}

/** Tabela(s) de resultado de uma execução. */
export default function SqlResults({ sets }: { sets: ResultSet[] }) {
  return (
    <div className="grid gap-3">
      {sets.map((r, k) => (
        <div key={k} className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-auto" style={{ maxHeight: 320 }}>
            <table className="w-full min-w-max border-collapse text-left font-mono text-[13px]">
              <thead className="sticky top-0 bg-surface-muted text-muted">
                <tr>{r.columns.map((c, i) => <th key={i} className="whitespace-nowrap px-3 py-1.5 font-semibold">{c}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {r.values.slice(0, MAX).map((row, i) => (
                  <tr key={i} className="hover:bg-surface-muted/60">
                    {row.map((v, j) => (
                      <td key={j} className={`whitespace-nowrap px-3 py-1 ${typeof v === "number" ? "text-right text-sky-500" : "text-foreground"}`}>
                        {v === null ? <i className="text-muted">NULL</i> : String(v)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border bg-surface px-3 py-1 text-[11px] text-muted">
            {r.values.length} linha{r.values.length === 1 ? "" : "s"}{r.values.length > MAX ? ` (mostrando ${MAX})` : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
