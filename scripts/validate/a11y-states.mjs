// Roteiro de ESTADOS interativos (Essencial, Desafios com erro/sucesso, SQL Lab SQLite+PostgreSQL, Lab, Geradores,
// Snippets, Templates, Favoritos, Busca, Todos, páginas de comando) com a auditoria de contraste em cada estado.
// Pré-requisitos: node scripts/validate/challenges.mts (gera /tmp/val/solutions.json e web-challenges.json).
//   node scripts/validate/a11y-states.mjs <light|dark> <largura> [pasta-de-prints]     (~4-5 min; limite de 300 s por comando)
import { createRequire } from "module";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
import { fileURLToPath } from "url";
import nodePath from "path";
import fs from 'fs';
const [,, theme, width, shotsDir = ''] = process.argv;
const BASE = 'http://localhost:3111';
const src = fs.readFileSync(nodePath.join(nodePath.dirname(fileURLToPath(import.meta.url)), 'a11y-audit.mjs'), 'utf8');
const fnText = src.slice(src.indexOf('const pageFn = () => {') + 'const pageFn = '.length, src.indexOf('const results = {};')).trim().replace(/;\s*$/, '');
const sol = JSON.parse(fs.readFileSync('/tmp/val/solutions.json', 'utf8'));
const web = JSON.parse(fs.readFileSync('/tmp/val/web-challenges.json', 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: +width, height: 900, isMobile: +width < 500, hasTouch: +width < 500 });
await page.evaluateOnNewDocument((t) => { try { localStorage.setItem('theme', t); } catch {} }, theme);
const jsErrs = [];
page.on('pageerror', (e) => jsErrs.push(String(e.message).slice(0, 140)));
page.on('dialog', (d) => d.accept());
const report = { states: {}, stepFails: [], jsErrs };
let cur = '';
const snap = async (label, shot = false) => {
  await sleep(700);
  try {
    const r = await page.evaluate(`(${fnText})()`);
    report.states[label] = r;
    if (shot && shotsDir) await page.screenshot({ path: `${shotsDir}/${label.replace(/[^\w-]+/g, '_')}-${theme}-${width}.png` });
  } catch (e) { report.stepFails.push(`${label}: snap ${e.message.slice(0, 80)}`); }
};
const step = async (name, fn) => { cur = name; try { await fn(); } catch (e) { report.stepFails.push(`${name}: ${String(e.message).slice(0, 110)}`); } };
const go = async (path) => { await page.goto(BASE + path, { waitUntil: 'networkidle0', timeout: 30000 }); await sleep(500); };
const clickText = (text, sel = 'button') => page.evaluate((t, s) => { const el = [...document.querySelectorAll(s)].find((b) => b.textContent.trim().includes(t)); if (!el) throw new Error('sem botão: ' + t); el.click(); return true; }, text, sel);
const setCm = async (txt) => {
  for (const h of await page.$$('.cm-content')) { if (await h.isIntersectingViewport()) { await h.click(); break; } }
  await page.keyboard.down('Control'); await page.keyboard.press('a'); await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
  await page.evaluate((t) => document.execCommand('insertText', false, t), txt);
};

// ---------- Essencial ----------
await step('essencial', async () => {
  await go('/essencial'); await snap('essencial:inicial', true);
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true)));
  await page.evaluate(() => { const bs = [...document.querySelectorAll('[role=checkbox]')]; bs.slice(0, 3).forEach((b) => b.click()); });
  await snap('essencial:aberto+marcado', true);
  const n = await page.evaluate(() => document.querySelectorAll('[role=tab]').length);
  for (let i = 1; i < n; i++) { await page.evaluate((k) => document.querySelectorAll('[role=tab]')[k].click(), i); await page.evaluate(() => document.querySelectorAll('details').forEach((d) => (d.open = true))); await snap(`essencial:trilha${i}`, i === 3); }
});

// ---------- Desafios ----------
await step('desafios', async () => {
  await go('/desafios'); await snap('desafios:inicial', true);
  await clickText('Girar a roleta'); for (let i = 0; i < 24; i++) { await sleep(500); if (await page.evaluate(() => document.body.innerText.includes('Sorteado:'))) break; }
  await snap('desafios:roleta', true);
  const open = async (t) => { await page.evaluate((x) => [...document.querySelectorAll('section button')].find((b) => b.textContent.includes(x))?.click(), t); await sleep(1500); };
  await open('Função soma'); await snap('desafios:js', true);
  await clickText('Rodar testes'); await sleep(2500); await snap('desafios:js-falha', true);
  await clickText('Dica'); await snap('desafios:js-dica');
  await clickText('Solução'); await snap('desafios:js-solucao');
  await setCm(sol['js-soma'].js); await clickText('Rodar testes'); await sleep(2500); await snap('desafios:js-sucesso', true);
  const css = web.find((c) => c.lang === 'css'); 
  if (css) { await open(css.title); await clickText('Rodar testes'); await sleep(2500); await snap('desafios:css-falha'); }
  await open('Clientes de Natal'); await sleep(1500); await snap('desafios:sql', true);
  await setCm("SELECT nome FROM clientes;"); await clickText('Verificar resposta'); await sleep(1500); await snap('desafios:sql-errado', true);
  await setCm("SELEC nome FROM;"); await clickText('Verificar resposta'); await sleep(1500); await snap('desafios:sql-erro-sintaxe', true);
  await setCm("SELECT nome, cidade FROM clientes WHERE cidade = 'Natal';"); await clickText('Verificar resposta'); await sleep(1500); await snap('desafios:sql-ok', true);
});

// ---------- SQL Lab ----------
await step('sql-lab', async () => {
  await go('/sql-lab'); await sleep(1500); await snap('sqllab:inicial', true);
  await clickText('▶ Rodar'); await sleep(2000); await snap('sqllab:resultado', true);
  await setCm('SELEC x FROM;'); await clickText('▶ Rodar'); await sleep(1500); await snap('sqllab:erro', true);
  for (const t of ['Aulas', 'Exerc.', 'Histórico', 'Dialetos']) { await clickText(t); await sleep(700); await snap('sqllab:aba-' + t.replace(/\W/g, ''), t === 'Exerc.' || t === 'Dialetos'); }
  await clickText('Exerc.'); await sleep(500);
  await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.className.includes('w-full') && x.textContent.length > 3 && x.closest('aside, div')); });
  await clickText('Verificar resposta').catch(() => {}); await sleep(1000); await snap('sqllab:exerc-veredito', true);
  await clickText('Dica').catch(() => {}); await snap('sqllab:exerc-dica');
  await clickText('Solução').catch(() => {}); await snap('sqllab:exerc-solucao');
  await clickText('Dialetos'); await sleep(500); await page.evaluate(() => { const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('Testar aqui')); b?.click(); }); await sleep(1500); await snap('sqllab:dialetos-testar', true);
  // motor PostgreSQL
  const pg = await page.evaluate(() => { const o = [...document.querySelectorAll('button, option')].find((x) => /PostgreSQL/.test(x.textContent)); if (!o) return false; if (o.tagName === 'OPTION') { const s = o.closest('select'); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); } else o.click(); return true; });
  if (pg) { await sleep(6000); await clickText('▶ Rodar').catch(() => {}); await sleep(3000); await snap('sqllab:postgres', true); } else report.stepFails.push('sql-lab: não achei seletor de motor PostgreSQL');
});

// ---------- Lab ----------
await step('lab', async () => {
  await go('/lab'); await sleep(1200); await snap('lab:inicial', true);
  await clickText('JS'); await sleep(300);
  await setCm("console.log('ok', 1); console.warn('aviso'); console.error('erro'); 42");
  await page.keyboard.down('Control'); await page.keyboard.press('Enter'); await page.keyboard.up('Control'); await sleep(1500); await snap('lab:console', true);
  await page.evaluate(() => { const s = [...document.querySelectorAll('select')].find((x) => [...x.options].some((o) => o.value === 'multi')); if (s) { s.value = 'multi'; s.dispatchEvent(new Event('change', { bubbles: true })); } }); await sleep(1200); await snap('lab:multitela', true);
  await clickText('Contornos').catch(() => {}); await sleep(400); await snap('lab:contornos');
});

// ---------- Geradores ----------
await step('geradores', async () => {
  await go('/geradores'); const n = await page.evaluate(() => document.querySelectorAll('[role=tab]').length);
  for (let i = 0; i < n; i++) { await page.evaluate((k) => document.querySelectorAll('[role=tab]')[k].click(), i); await sleep(300); await snap(`geradores:aba${i}`, i < 2); }
  await clickText('Copiar CSS').catch(() => {}); await snap('geradores:copiado');
});

// ---------- Snippets / Templates ----------
await step('snippets', async () => {
  await go('/snippets'); const n = await page.evaluate(() => document.querySelectorAll('[role=tab]').length);
  for (let i = 0; i < Math.min(n, 12); i++) { await page.evaluate((k) => document.querySelectorAll('[role=tab]')[k].click(), i); await sleep(250); await snap(`snippets:aba${i}`, i === 1); }
  const href = await page.evaluate(() => document.querySelector('a[href^="/snippets/"]')?.getAttribute('href')); if (href) { await go(href); await snap('snippets:detalhe', true); }
});
await step('templates', async () => {
  await go('/templates'); await snap('templates:lista', true);
  const href = await page.evaluate(() => document.querySelector('a[href^="/templates/"]')?.getAttribute('href'));
  if (href) { await go(href); await snap('templates:detalhe', true); const n = await page.evaluate(() => document.querySelectorAll('[role=tab]').length); for (let i = 0; i < Math.min(n, 4); i++) { await page.evaluate((k) => document.querySelectorAll('[role=tab]')[k].click(), i); await sleep(300); await snap(`templates:aba${i}`); } }
});

// ---------- Favoritos / Busca / Todos ----------
await step('favoritos', async () => {
  for (const p of ['/css/layout/display-flex', '/js', '/html', '/sql']) { /* garante favoritos nas 4 linguagens */ }
  const pages = ['/css/layout/display-flex'];
  const r = await (await fetch(BASE + '/sitemap.xml')).text();
  const locs = [...r.matchAll(/<loc>[^<]*cheat-dev\.vercel\.app([^<]*)<\/loc>/g)].map((m) => m[1]);
  for (const l of ['html', 'css', 'js', 'sql']) { const p = locs.find((x) => x.split('/').length === 4 && x.startsWith('/' + l + '/')); if (p) { await go(p); await clickText('Favoritar').catch(() => {}); await sleep(200); } }
  await go('/favoritos'); await snap('favoritos:cheio', true);
});
await step('busca', async () => {
  await go('/busca?q=centralizar'); await snap('busca:resultados', true);
  await page.evaluate(() => document.querySelectorAll('button').forEach((b) => { if (/^(HTML|CSS|JS|JavaScript|SQL)/.test(b.textContent.trim())) b.click(); })); await sleep(300); await snap('busca:filtros');
  await go('/busca?q=zzzxxyy'); await snap('busca:vazio');
});
await step('todos', async () => {
  await go('/todos'); const n = await page.evaluate(() => document.querySelectorAll('button').length);
  for (const l of ['HTML', 'CSS', 'JavaScript', 'SQL']) { await clickText(l).catch(() => {}); await sleep(250); await snap('todos:' + l, l === 'CSS'); }
});

// ---------- Páginas de comando e detalhes ----------
await step('comandos', async () => {
  const r = await (await fetch(BASE + '/sitemap.xml')).text();
  const locs = [...r.matchAll(/<loc>[^<]*cheat-dev\.vercel\.app([^<]*)<\/loc>/g)].map((m) => m[1]);
  const pick = (pre, n = 1) => locs.filter((x) => x.startsWith(pre) && x.split('/').length >= 4).slice(0, n);
  for (const p of [...pick('/html/', 2), ...pick('/css/', 2), ...pick('/js/', 2), ...pick('/sql/', 2)]) {
    await go(p); await snap('cmd:' + p, p.includes('display-flex') || p.startsWith('/sql/') && p === pick('/sql/')[0]);
    await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => /▶|Rodar|Executar|Testar/.test(b.textContent))?.click()); await sleep(1800); await snap('cmd-run:' + p);
  }
  for (const p of [...pick('/receitas/'), ...pick('/comparativos/'), ...pick('/guias/'), '/vscode']) { await go(p); await snap('det:' + p, true); }
  await go('/pagina-que-nao-existe'); await snap('404', true);
});

// ---------- Mobile: gaveta da sidebar ----------
if (+width < 500) await step('gaveta', async () => {
  await go('/'); await page.evaluate(() => document.querySelector('button[aria-label="Abrir menu"]')?.click()); await sleep(500); await snap('mobile:gaveta', true);
});

await browser.close();
fs.writeFileSync(`/tmp/val/states-${theme}-${width}.json`, JSON.stringify(report));
const low = Object.entries(report.states).filter(([, v]) => v.low.length);
const ov = Object.entries(report.states).filter(([, v]) => v.overflowX > 1);
console.log(`[${theme} ${width}] estados=${Object.keys(report.states).length} | com contraste baixo=${low.length} (itens=${low.reduce((a, [, v]) => a + v.low.length, 0)}) | overflow-x=${ov.length} | passos falhos=${report.stepFails.length} | pageerrors=${jsErrs.length}`);
