// Inventário REAL do produto, gerado do código. Uso: npx tsx scripts/validate/inventory.mts [--check]
// Com --fix, regenera os números dessas linhas a partir do código (rode antes de commitar um lote). Com --check, confere se os números escritos em docs/DOC-MESTRE.md e docs/LINKEDIN-SERIE.md batem (falha se algum contar errado).
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
if (!process.argv.includes("--fix") && !process.argv.includes("--check")) console.log(JSON.stringify(inv, null, 1));
const FIX = process.argv.includes("--fix");
if (FIX) {
  const A: any = await import("@/content/alts"); const webAlts = Object.values(A.ALTS).reduce((n: number, a: any) => n + a.length, 0), sqlAlts = Object.values(A.SQL_ALTS).reduce((n: number, a: any) => n + a.length, 0);
  const xp = C.CHALLENGES.reduce((n: number, c: any) => n + C.LEVEL_XP[c.level], 0);
  const tl = inv.trilhas, pl = `HTML ${inv.trilhasPorLang.html}, CSS ${inv.trilhasPorLang.css}, JS ${inv.trilhasPorLang.js}, SQL ${inv.trilhasPorLang.sql}`;
  // doc mestre
  let m = fs.readFileSync("docs/DOC-MESTRE.md", "utf8");
  m = m.replace(/Totais: \d+ commits · \d+ comandos · \d+ desafios · \d+ snippets · \d+ templates \(\d+ estilos\) · \d+ comparativos · \d+ receitas · \d+ guias · \d+ passos Essenciais\./, `Totais: ${commits + 1} commits · ${inv.comandos} comandos · ${inv.desafios} desafios · ${inv.snippets} snippets · ${inv.templates} templates (${inv.estilos} estilos) · ${inv.comparativos} comparativos · ${inv.receitas} receitas · ${inv.guias} guias · ${inv.essencial} passos Essenciais.`);
  m = m.replace(/\| Desafios do Hub \|[^\n]*\n/, `| Desafios do Hub | ${inv.desafios} em ${tl} trilhas (HTML ${inv.chHtml} · CSS ${inv.chCss} · JS ${inv.chJs} · SQL ${inv.chSql}); ${inv.comMiniAula} com mini-aula |\n`);
  m = m.replace(/\d+ sequências do básico ao avançado \(HTML \d+, CSS \d+, JS \d+, SQL \d+\)/, `${tl} sequências do básico ao avançado (${pl})`);
  m = m.replace(/XP \(total possível \d+\)/, `XP (total possível ${xp})`);
  const base: Record<string, [number, number]> = { HTML: [26, 43], CSS: [28, 55], JS: [45, 70], SQL: [34, 57] }; const now: Record<string, number> = { HTML: inv.chHtml, CSS: inv.chCss, JS: inv.chJs, SQL: inv.chSql };
  const rows = Object.entries(base).map(([l, [b, t]]) => `| ${l} | ${b} | ${now[l]} | ${t} | ${Math.max(0, Math.min(100, Math.round(((now[l] - b) / (t - b)) * 100)))}% |`).join("\n");
  const tab = `<!-- progresso-etapa1:inicio (gerado por inventory.mts --fix) -->\n| Linguagem | Início (16/10) | Agora | Meta | Feito |\n|---|---|---|---|---|\n${rows}\n| **Total** | 133 | **${inv.desafios}** | 225 | ${Math.round(((inv.desafios - 133) / (225 - 133)) * 100)}% |\n<!-- progresso-etapa1:fim -->`;
  if (/<!-- progresso-etapa1:inicio/.test(m)) m = m.replace(/<!-- progresso-etapa1:inicio[\s\S]*?progresso-etapa1:fim -->/, tab);
  fs.writeFileSync("docs/DOC-MESTRE.md", m);
  // plano do LinkedIn
  let l = fs.readFileSync("docs/LINKEDIN-SERIE.md", "utf8");
  l = l.replace(/(\|\s*Desafios pr[^|]*\|\s*)\*{0,2}\d+\*{0,2}( \(em )\d+( trilhas\))/, `$1**${inv.desafios}**$2${tl}$3`);
  l = l.replace(/(Mini-aulas \(uma por desafio\)[^|]*\|\s*)\d+ · \d+/, `$1${inv.comMiniAula} · ${webAlts + sqlAlts}`);
  l = l.replace(/\b\d{3} desafios\b/g, `${inv.desafios} desafios`).replace(/em \d+ trilhas e 4 níveis/g, `em ${tl} trilhas e 4 níveis`);
  fs.writeFileSync("docs/LINKEDIN-SERIE.md", l);
  // readme
  let r = fs.readFileSync("README.md", "utf8"); r = r.replace(/\d+ desafios em \d+ trilhas/, `${inv.desafios} desafios em ${tl} trilhas`); fs.writeFileSync("README.md", r);
  console.log(`\ndocumentos atualizados (${inv.desafios} desafios, ${tl} trilhas).`);
}
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
