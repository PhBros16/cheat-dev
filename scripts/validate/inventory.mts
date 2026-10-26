// Inventário REAL do produto, gerado do código. Uso: npx tsx scripts/validate/inventory.mts [--check]
// Com --check, confere se os números escritos em docs/DOC-MESTRE.md e docs/LINKEDIN-SERIE.md batem (falha se algum contar errado).
import fs from "fs";
import { execSync } from "child_process";
const L: any = await import("@/lib/content"); const C: any = await import("@/content/challenges"); const T: any = await import("@/content/tracks");
const ESS: any = await import("@/content/essencial"); const SN: any = await import("@/content/snippets"); const TP: any = await import("@/content/templates");
const CM: any = await import("@/content/comparisons"); const RC: any = await import("@/content/recipes"); const GD: any = await import("@/content/guides"); const VS: any = await import("@/content/vscode"); const DV: any = await import("@/components/lab/devices");
const byLang = (l: string) => L.languages.find((x: any) => x.slug === l);
const cmd = { html: L.countEntries(byLang("html")), css: L.countEntries(byLang("css")), js: L.countEntries(byLang("js")), sql: L.countEntries(byLang("sql")) };
const ch = (l: string) => C.CHALLENGES.filter((c: any) => c.lang === l).length;
let commits = 0; try { commits = +execSync("git rev-list --count HEAD", { encoding: "utf8" }).trim(); } catch {}
const inv = {
  comandos: L.totalEntries(), cmdHtml: cmd.html, cmdCss: cmd.css, cmdJs: cmd.js, cmdSql: cmd.sql,
  trilhasPorLang: Object.fromEntries(["html", "css", "js", "sql"].map((l) => [l, T.TRACKS.filter((t: any) => t.lang === l).length])), tamanhoTrilha: Object.fromEntries(T.TRACKS.map((t: any) => [t.id, t.ids.length])),
  desafios: C.CHALLENGES.length, chHtml: ch("html"), chCss: ch("css"), chJs: ch("js"), chSql: ch("sql"), trilhas: T.TRACKS.length, comMiniAula: C.CHALLENGES.filter((c: any) => c.learn).length,
  essencial: ESS.ESSENCIAL.reduce((n: number, t: any) => n + t.steps.length, 0), snippets: SN.snippets.length, templates: TP.templates.length, estilos: TP.templates.reduce((n: number, t: any) => n + (t.themes?.length || 1), 0), // cada template conta 1 estilo se não tiver variações
  comparativos: CM.comparisons.length, receitas: RC.recipes.length, guias: GD.guides.length, atalhosVscode: VS.vscodeSnippets.length, dispositivos: DV.DEVICES.length, commits,
};
console.log(JSON.stringify(inv, null, 1));
if (!process.argv.includes("--check")) process.exit(0);

let bad = 0; const fail = (m: string) => { bad++; console.log("✗", m); }; const pass = (m: string) => console.log("✓", m);
const mestre = fs.readFileSync("docs/DOC-MESTRE.md", "utf8"), li = fs.readFileSync("docs/LINKEDIN-SERIE.md", "utf8");
// doc mestre: linha "Totais: ..."
const tot = mestre.match(/Totais:\s*(\d+) commits · (\d+) comandos · (\d+) desafios · (\d+) snippets · (\d+) templates \((\d+) estilos\) · (\d+) comparativos · (\d+) receitas · (\d+) guias · (\d+) passos/);
if (!tot) fail("DOC-MESTRE: linha 'Totais:' não encontrada no formato esperado");
else {
  const [, c, cm, d, s, t, e, cp, r, g, p] = tot.map(Number);
  const pairs: [string, number, number][] = [["comandos", cm, inv.comandos], ["desafios", d, inv.desafios], ["snippets", s, inv.snippets], ["templates", t, inv.templates], ["estilos", e, inv.estilos], ["comparativos", cp, inv.comparativos], ["receitas", r, inv.receitas], ["guias", g, inv.guias], ["passos Essenciais", p, inv.essencial]];
  for (const [n, doc, real] of pairs) doc === real ? pass(`DOC-MESTRE ${n}: ${real}`) : fail(`DOC-MESTRE ${n}: o doc diz ${doc}, o código tem ${real}`);
  Math.abs(c - commits) <= 2 ? pass(`DOC-MESTRE commits: ${c} (real ${commits})`) : fail(`DOC-MESTRE commits: o doc diz ${c}, o repositório tem ${commits}`);
}
// plano do LinkedIn: tabela do inventário
const row = (label: RegExp) => li.match(new RegExp("\\|\\s*" + label.source + "[^|]*\\|\\s*\\*{0,2}(\\d+)", "i"));
const checks: [string, RegExp, number][] = [["comandos", /Comandos/, inv.comandos], ["desafios", /Desafios pr/, inv.desafios], ["passos Essencial", /Passos da trilha/, inv.essencial], ["snippets", /Snippets de/, inv.snippets], ["atalhos VS Code", /Atalhos de VS/, inv.atalhosVscode], ["dispositivos", /Dispositivos no/, inv.dispositivos]];
for (const [n, re, real] of checks) { const m = row(re); !m ? fail(`LINKEDIN: linha '${n}' não encontrada`) : +m[1] === real ? pass(`LINKEDIN ${n}: ${real}`) : fail(`LINKEDIN ${n}: o plano diz ${m[1]}, o código tem ${real}`); }
const cm = li.match(/Commits atômicos no repositório \|\s*(\d+)\+?/); cm ? (+cm[1] <= commits ? pass(`LINKEDIN commits: "${cm[1]}+" (real ${commits})`) : fail(`LINKEDIN commits: diz ${cm[1]}+ mas há ${commits}`)) : fail("LINKEDIN: linha de commits não encontrada");
// números soltos nos textos dos posts: nenhum '58 desafios' / '503' errado
const outros = [...li.matchAll(/\b(\d+) (desafios|comandos)\b/g)].filter((m) => (m[2] === "desafios" ? +m[1] !== inv.desafios : +m[1] !== inv.comandos));
outros.length ? outros.forEach((m) => fail(`LINKEDIN: texto cita "${m[0]}" (real: ${m[2] === "desafios" ? inv.desafios : inv.comandos})`)) : pass("LINKEDIN: nenhum '<N> desafios/comandos' com número errado no texto");
console.log(bad ? `\n${bad} divergência(s)` : "\ndocumentos batem com o código"); process.exit(bad ? 1 : 0);
