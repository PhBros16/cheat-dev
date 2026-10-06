import { createRequire } from "module";
import fs from "fs";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
const list = JSON.parse(fs.readFileSync("/tmp/val/web-challenges.json", "utf8"));
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 560, height: 420 });
const run = async (doc, tests) => { const p = await browser.newPage(); await p.setViewport({ width: 560, height: 420 }); await p.setContent(doc, { waitUntil: "load" }); await new Promise((r) => setTimeout(r, 120)); const r = await p.evaluate((t) => window.__runTests(t), tests); await p.close(); return r; };
let problems = 0;
for (const c of list) {
  const sol = await run(c.solution, c.tests);
  const fail = sol.filter((r) => !r.ok);
  const st = await run(c.starter, c.tests);
  const stPass = st.filter((r) => r.ok).length;
  const note = [];
  if (fail.length) { problems++; note.push("SOLUÇÃO FALHA: " + fail.map((f) => f.name + (f.err ? " [" + f.err + "]" : "")).join(" | ")); }
  if (stPass === st.length) { problems++; note.push("STARTER JÁ PASSA TUDO"); }
  console.log((note.length ? "✗ " : "✓ ") + c.id.padEnd(16), `solução ${sol.length - fail.length}/${sol.length} · inicial ${stPass}/${st.length}`, note.join(" ; "));
}
console.log("desafios com problema:", problems, "de", list.length);
await browser.close();
