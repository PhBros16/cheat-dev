// Valida TODAS as consultas SQL do projeto nos dois motores. Uso (na raiz do repo): npx tsx scripts/validate/sql-all.mts
import { createRequire } from "module";
const req = createRequire(process.cwd() + "/package.json");
const init = req("sql.js"); const { PGlite } = await import("@electric-sql/pglite");
const { DBS } = await import("@/lib/sqlDbs"); const { pgScript } = await import("@/lib/pgScripts");
const { SQL_DEMOS } = await import("@/content/sql-demos"); const { PG_OVERRIDES } = await import("@/content/pg-demos");
const { SQL_PG_ONLY } = await import("@/content/extra/sql-4"); const { DIALECTS } = await import("@/content/sql-dialects");
const { CHALLENGES } = await import("@/content/challenges");
const S = await init(); let bad = 0;
const lite = (db: string, q: string, tag: string) => { try { const d = new S.Database(); d.exec((DBS as any)[db].script); d.exec(q); } catch (e: any) { bad++; console.log("SQLITE", tag, e.message); } };
const pg = async (db: string, q: string, tag: string) => { const d = new PGlite(); try { await d.exec(pgScript(db as any)); await d.exec(q); } catch (e: any) { bad++; console.log("PG", tag, String(e.message).slice(0, 100)); } await d.close(); };
for (const [slug, d] of Object.entries(SQL_DEMOS)) { lite(d.db, d.query, slug); await pg(d.db, PG_OVERRIDES[slug] ?? d.query, slug); }
for (const [slug, d] of Object.entries(SQL_PG_ONLY)) await pg(d.db, d.pg, slug);
for (const d of DIALECTS) if (d.try) { lite("loja", d.try.sqlite, "dialeto:" + d.id); await pg("loja", d.try.pg, "dialeto:" + d.id); }
for (const c of CHALLENGES) if (c.kind === "sql") lite(c.db, c.solution, "desafio:" + c.id);
console.log("consultas validadas; falhas:", bad);
