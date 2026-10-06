// Detecta demos de CSS sem efeito visível (compara a cena com e sem o CSS) e declarações inúteis. Uso: npx tsx scripts/validate/css-demos.mts
import { createRequire } from "module";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core"); const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
const PG: any = await import("@/components/Playground"); const cssDoc: (m: string, c: string) => string = PG.cssDoc ?? PG.default?.cssDoc;
const { languages } = await import("@/lib/content");
const items: { key: string; mode: string; css: string }[] = [];
for (const c of languages.find((l) => l.slug === "css")!.categories) for (const e of c.entries) if (e.demo) items.push({ key: `${c.slug}/${e.slug}`, mode: e.demo.mode, css: e.demo.css });
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage(); await page.setViewport({ width: 560, height: 230 });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function shot(mode: string, c: string) { await page.setContent(cssDoc(mode, c.replace(/\n/g, " ")), { waitUntil: "load" }); if (mode === "h") { await page.hover(".target"); await sleep(260); } else if (mode === "a") await sleep(350); return (await page.screenshot()) as Buffer; }
for (const it of items) {
  const full = await shot(it.mode, it.css);
  if (Buffer.compare(full, await shot(it.mode, "")) === 0) console.log("SEM EFEITO:", it.key, it.css);
  const decls = it.css.split(";").map((x) => x.trim()).filter(Boolean);
  if (decls.length > 1) for (let k = 0; k < decls.length; k++) if (Buffer.compare(full, await shot(it.mode, decls.filter((_, j) => j !== k).join(";"))) === 0) console.log("declaração sem efeito:", it.key, decls[k]);
}
console.log(items.length, "demos verificados"); await browser.close();
