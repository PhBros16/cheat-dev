import { createRequire } from "module";
import fs from "fs";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
const only = process.env.ONLY ? new RegExp(process.env.ONLY) : null; // ex.: ONLY="^js-" roda só os desafios cujo id casa
const list = JSON.parse(fs.readFileSync("/tmp/val/web-challenges.json", "utf8")).filter((c) => !only || only.test(c.id));
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 560, height: 420 });
const run = async (doc, tests) => { const p = await browser.newPage(); await p.setViewport({ width: 560, height: 420 }); await p.setContent(doc, { waitUntil: "load" }); await new Promise((r) => setTimeout(r, 120)); const r = await p.evaluate((t) => window.__runTests(t), tests); await p.close(); return r; };
let problems = 0, totalAlts = 0, okAlts = 0;
for (const c of list) {
  const sol = await run(c.solution, c.tests);
  const fail = sol.filter((r) => !r.ok);
  const st = await run(c.starter, c.tests);
  const stPass = st.filter((r) => r.ok).length;
  const note = [];
  let altOk = 0;
  for (const [i, a] of (c.alts || []).entries()) { const r = await run(a, c.tests); const f = r.filter((x) => !x.ok); if (f.length) { problems++; note.push(`ALTERNATIVA ${i + 1} FALHA: ` + f.map((x) => x.name + (x.err ? " [" + x.err + "]" : "")).join(" | ")); } else altOk++; }
  totalAlts += (c.alts || []).length; okAlts += altOk;
  if (fail.length) { problems++; note.push("SOLUÇÃO FALHA: " + fail.map((f) => f.name + (f.err ? " [" + f.err + "]" : "")).join(" | ")); }
  if (stPass === st.length) { problems++; note.push("STARTER JÁ PASSA TUDO"); }
  console.log((note.length ? "✗ " : "✓ ") + c.id.padEnd(16), `solução ${sol.length - fail.length}/${sol.length} · inicial ${stPass}/${st.length}` + ((c.alts || []).length ? ` · alternativas ${altOk}/${c.alts.length}` : ""), note.join(" ; "));
}
console.log(`soluções alternativas que passam: ${okAlts}/${totalAlts}`);
console.log("desafios com problema:", problems, "de", list.length);
await browser.close();
