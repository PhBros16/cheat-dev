// Overflow horizontal em TODAS as rotas numa largura (rápido: não mede contraste).
//   node scripts/validate/overflow-all.mjs <largura> <arquivo-de-rotas> <saida.json> [concorrencia]
import { createRequire } from "module";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
import fs from 'fs';
const [,, width, file, outp, conc='6'] = process.argv;
const routes = fs.readFileSync(file,'utf8').split('\n').filter(Boolean);
const b = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const bad = []; let i = 0;
async function w() { const pg = await b.newPage(); await pg.setRequestInterception(true); pg.on('request', r => /fonts\.g/.test(r.url()) ? r.abort() : r.continue());
  await pg.setViewport({ width: +width, height: 900, isMobile: +width < 500, hasTouch: +width < 500 });
  while (i < routes.length) { const r = routes[i++]; try { await pg.goto('http://localhost:3111' + r, { waitUntil: 'domcontentloaded', timeout: 20000 }); await new Promise(x=>setTimeout(x,250));
    const o = await pg.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); if (o > 1) bad.push([r, o]); } catch (e) { bad.push([r, 'ERR ' + e.message.slice(0,50)]); } }
  await pg.close(); }
await Promise.all(Array.from({ length: +conc }, w)); await b.close();
fs.writeFileSync(outp, JSON.stringify(bad)); console.log(`[overflow ${width}px] rotas=${routes.length} com overflow/erro=${bad.length}`, JSON.stringify(bad.slice(0,8)));
