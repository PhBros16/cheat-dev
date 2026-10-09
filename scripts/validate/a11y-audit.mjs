// Auditoria de acessibilidade/layout por página (WCAG AA): contraste de todo texto visível, erros de console,
// requisições com falha e overflow horizontal.  Uso (com o site rodando em :3111):
//   node scripts/validate/a11y-audit.mjs <light|dark> <largura> <arquivo-de-rotas> <saida.json> [concorrencia]
// O arquivo de rotas tem uma rota por linha (ex.: extraída do /sitemap.xml). Bloqueia o Google Fonts (sem rede no sandbox).
import { createRequire } from "module";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
import fs from 'fs';
const [,, theme, width, routesFile, outFile, conc = '4'] = process.argv;
const routes = fs.readFileSync(routesFile, 'utf8').split('\n').filter(Boolean);
const BASE = 'http://localhost:3111';
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });

const pageFn = () => {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const parse = (c) => { cx.clearRect(0,0,1,1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0,0,1,1); const d = cx.getImageData(0,0,1,1).data; return [d[0],d[1],d[2],d[3]/255]; };
  const blend = (f, b) => [0,1,2].map(i => f[i]*f[3] + b[i]*(1-f[3]));
  const lum = (c) => { const a = c.map(v => { v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }); return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2]; };
  const ratio = (a,b) => { const l1=lum(a), l2=lum(b); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); };
  const rootBg = parse(getComputedStyle(document.body).backgroundColor);
  const base = rootBg[3] ? rootBg.slice(0,3) : [255,255,255];
  const effBg = (el) => {
    const chain = []; let e = el;
    while (e && e.nodeType === 1) { chain.push(e); e = e.parentElement; }
    let bg = base.slice(); let unknown = false;
    for (let i = chain.length - 1; i >= 0; i--) {
      const cs = getComputedStyle(chain[i]);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') unknown = true;
      const c = parse(cs.backgroundColor);
      if (c[3] > 0) bg = blend(c, bg);
    }
    return { bg, unknown };
  };
  const out = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.nodeValue.trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el || ['SCRIPT','STYLE','NOSCRIPT','OPTION'].includes(el.tagName)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    // opacity acumulada
    let op = 1, e = el; while (e) { op *= parseFloat(getComputedStyle(e).opacity); e = e.parentElement; }
    if (op < 0.05) continue;
    const { bg, unknown } = effBg(el);
    let fg = parse(cs.color); if (fg[3] === 0) continue; fg = blend([fg[0],fg[1],fg[2],fg[3]*op], bg);
    const cr = ratio(fg, bg);
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (cr < need) {
      const key = t.slice(0,40) + '|' + fg.map(Math.round) + '|' + bg.map(Math.round);
      if (seen.has(key)) continue; seen.add(key);
      out.push({ text: t.slice(0,50), cls: (el.className && el.className.toString().slice(0,70)) || el.tagName, ratio: +cr.toFixed(2), need, fg: fg.map(Math.round).join(','), bg: bg.map(Math.round).join(','), unknownBg: unknown });
    }
  }
  return { low: out, overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth };
};

const results = {};
let idx = 0;
async function worker() {
  while (idx < routes.length) {
    const route = routes[idx++];
    const pg = await browser.newPage();
    const errs = [], bad = [];
    pg.on('pageerror', e => errs.push('pageerror: ' + String(e.message).slice(0,160)));
    pg.on('console', m => { if (m.type() === 'error' && !/ERR_FAILED|net::ERR/.test(m.text())) errs.push('console: ' + m.text().slice(0,160)); });
    pg.on('requestfailed', r => { if (!/fonts\.g/.test(r.url())) bad.push('FAIL ' + r.url().slice(0,90)); });
    pg.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url().replace(BASE,'')); });
    await pg.setRequestInterception(true);
    pg.on('request', rq => { const u = rq.url(); if (/fonts\.(googleapis|gstatic)\.com/.test(u)) rq.abort(); else rq.continue(); });
    await pg.setViewport({ width: +width, height: 900, isMobile: +width < 500, hasTouch: +width < 500 });
    await pg.evaluateOnNewDocument((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
    try {
      await pg.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 25000 });
      await new Promise(r => setTimeout(r, 400));
      const r = await pg.evaluate(pageFn);
      results[route] = { ...r, errs, bad };
    } catch (e) { results[route] = { low: [], overflowX: 0, errs: errs.concat('NAV: ' + e.message.slice(0,100)), bad }; }
    await pg.close();
  }
}
await Promise.all(Array.from({ length: +conc }, worker));
await browser.close();
fs.writeFileSync(outFile, JSON.stringify(results));
const all = Object.entries(results);
const lowPages = all.filter(([, v]) => v.low.length);
const errPages = all.filter(([, v]) => v.errs.length || v.bad.length);
const ovPages = all.filter(([, v]) => v.overflowX > 1);
console.log(`[${theme} ${width}px] páginas=${all.length} | com contraste baixo=${lowPages.length} (itens=${lowPages.reduce((a,[,v])=>a+v.low.length,0)}) | com erros/4xx=${errPages.length} | com overflow-x=${ovPages.length}`);
