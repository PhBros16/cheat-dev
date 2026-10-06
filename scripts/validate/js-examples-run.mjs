import { createRequire } from "module";
import fs from "fs";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
const list = JSON.parse(fs.readFileSync("/tmp/val/js-examples.json", "utf8"));
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
let bad = 0;
for (const it of list) {
  const p = await browser.newPage();
  const logs = [], errs = [];
  p.on("console", (m) => logs.push(m.text()));
  p.on("pageerror", (e) => errs.push(e.message));
  await p.setContent(`<!doctype html><html><body><script>${it.code.replace(/<\/script>/g, "<\\/script>")}</script></body></html>`, { waitUntil: "load" });
  await new Promise((r) => setTimeout(r, 700));
  const ok = errs.length === 0 && logs.length > 0;
  if (!ok) bad++;
  console.log(ok ? "✓" : "✗", it.id.padEnd(34), (errs[0] ? "ERRO: " + errs[0].slice(0, 90) : `${logs.length} saídas · ${logs[0].slice(0, 56).replace(/\n/g, " ")}`));
  await p.close();
}
console.log("falhas:", bad, "de", list.length);
await browser.close();
