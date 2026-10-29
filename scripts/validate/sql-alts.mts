// SQL: o corretor ACEITA consultas alternativas corretas e RECUSA erros plausíveis. Uso: npx tsx scripts/validate/sql-alts.mts
import { createRequire } from "module";
const initSqlJs = createRequire(import.meta.url)("sql.js"); const { DBS } = await import("@/lib/sqlDbs"); const { sameResult } = await import("@/lib/sqlCheck");
const { CHALLENGES } = await import("@/content/challenges"); const { SQL_ALTS, SQL_WRONG } = await import("@/content/alts");
const S = await initSqlJs(); let bad = 0, okA = 0, okW = 0;
const run = (db: string, q: string) => { const d = new S.Database(); d.exec((DBS as any)[db].script); const r = d.exec(q); return r[0]; };
for (const [id, alts] of Object.entries(SQL_ALTS)) {
  const c = (CHALLENGES as any[]).find((x) => x.id === id && x.kind === "sql"); if (!c) { bad++; console.log("✗ alts: desafio SQL inexistente", id); continue; }
  const sol = run(c.db, c.solution); const ordered = /order\s+by/i.test(c.solution);
  for (const q of alts) { try { const v = sameResult(run(c.db, q) as any, sol as any, ordered); if (v.ok) okA++; else { bad++; console.log("✗ ALTERNATIVA correta foi RECUSADA:", id, "|", v.msg.slice(0, 90)); } } catch (e: any) { bad++; console.log("✗ alternativa com erro de SQL:", id, e.message); } }
  const w = (SQL_WRONG as any)[id]; if (!w) { bad++; console.log("✗ sem erro plausível para", id); continue; }
  try { const v = sameResult(run(c.db, w) as any, sol as any, ordered); if (!v.ok) okW++; else { bad++; console.log("✗ ERRO plausível foi ACEITO:", id); } } catch (e: any) { bad++; console.log("✗ erro plausível com erro de SQL:", id, e.message); }
}
const sqlNovos = (CHALLENGES as any[]).filter((c) => c.kind === "sql" && (SQL_ALTS as any)[c.id]).length;
console.log(`${sqlNovos} desafios SQL com teste de alternativas | alternativas aceitas: ${okA} | erros recusados: ${okW} | problemas: ${bad}`); process.exit(bad ? 1 : 0);
