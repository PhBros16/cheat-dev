// E2E: ligações trilha <-> guia/receita, link direto #trilha-..., mini-aula dos originais e backup (exportar/importar). Requer o servidor em :3111.
import { createRequire } from "module";
import fs from "fs";
import { execSync } from "child_process";
// Números do catálogo vêm do inventário do código (nada fixo aqui): ampliar o catálogo não quebra este teste.
const INV = JSON.parse(execSync("npx tsx scripts/validate/inventory.mts", { encoding: "utf8" }));
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 1000 });
await page.setRequestInterception(true); page.on("request", (r) => (/fonts\.g/.test(r.url()) ? r.abort() : r.continue()));
page.on("dialog", (d) => d.accept());
const errs = []; page.on("pageerror", (e) => errs.push(e.message.slice(0, 140)));
let fails = 0; const ok = (name, cond, extra = "") => { if (!cond) fails++; console.log(cond ? "✓" : "✗", name, cond ? "" : "→ " + extra); };
const text = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
const go = async (p) => { await page.goto("http://localhost:3111" + p, { waitUntil: "networkidle0" }); await sleep(600); };

// guia -> trilha
await go("/guias/flexbox-do-zero");
ok("guia: bloco 'Pratique isso nos Desafios' com a trilha Layout", /Pratique isso nos Desafios/.test(await text()) && new RegExp(`Layout · CSS · ${INV.tamanhoTrilha["css-layout"]} desafios`).test(await text()), (await text()).match(/Pratique[^.]{0,120}/)?.[0]);
await page.evaluate(() => [...document.querySelectorAll("aside a")].find((a) => a.textContent.includes("Layout"))?.click()); await sleep(2500);
ok("o link abre /desafios na trilha (#trilha-css-layout)", page.url().endsWith("/desafios#trilha-css-layout"), page.url());
const top = await page.evaluate(() => document.getElementById("trilha-css-layout")?.getBoundingClientRect().top ?? 9999);
ok("a página rola até a trilha Layout (visível na tela)", top >= 0 && top < 500, String(top));
ok("a lista mostra só CSS (abriu a aba da linguagem)", await page.evaluate(() => document.querySelector('[role=tab][aria-selected=true]')?.textContent.includes("CSS")), "");
// trilha -> guia/receita
const rel = await page.evaluate(() => { const t = document.getElementById("trilha-css-layout"); return { guias: [...t.querySelectorAll('a[href^="/guias/"]')].map((a) => a.getAttribute("href")), receitas: [...t.querySelectorAll('a[href^="/receitas/"]')].map((a) => a.getAttribute("href")) }; });
ok("a trilha Layout lista os 2 guias e 3 receitas relacionados", rel.guias.join() === "/guias/flexbox-do-zero,/guias/layout-com-grid" && rel.receitas.join() === "/receitas/centralizar-div,/receitas/menu-fixo-no-topo,/receitas/galeria-de-cards-responsiva", JSON.stringify(rel));
// receita -> trilha
await go("/receitas/modo-escuro-com-botao");
ok("receita: bloco Pratique com a trilha 'DOM e eventos'", new RegExp(`DOM e eventos · JavaScript · ${INV.tamanhoTrilha["js-dom"]} desafios`).test(await text()), (await text()).match(/Pratique[^.]{0,140}/)?.[0]);
await go("/guias/publicar-site-github-vercel"); ok("guia de publicação leva à trilha 'Primeiros passos' de HTML", /Primeiros passos · HTML/.test(await text()));

// mini-aula dos originais
await go("/desafios");
const waitLearn = (re) => page.waitForFunction((r) => new RegExp(r).test(document.querySelector("#area-do-desafio details")?.textContent || ""), { timeout: 12000 }, re).then(() => true).catch(() => false);
await page.evaluate(() => [...document.querySelectorAll("section button")].find((b) => b.textContent.includes("Título azul"))?.click());
ok("original 'Título azul' tem mini-aula", await waitLearn("regra CSS tem"));
await page.evaluate(() => [...document.querySelectorAll("section button")].find((b) => b.textContent.includes("Receita por mês"))?.click());
ok("original de SQL 'Receita por mês' tem mini-aula com strftime", await waitLearn("strftime"));
ok("ao trocar de desafio há UMA mini-aula (a do desafio anterior saiu)", await page.evaluate(() => document.querySelectorAll("#area-do-desafio details").length === 1 && /Datas viram texto/.test(document.querySelector("#area-do-desafio details").textContent)));
ok("a mini-aula mostra o código formatado (sem crases soltas)", await page.evaluate(() => { const d = document.querySelector("#area-do-desafio details"); return !!d && !/`/.test(d.querySelector("p").textContent) && !!d.querySelector("strong code"); }));

// backup
await page.evaluate(() => { localStorage.setItem("cheatdev:hub:v1", JSON.stringify({ solved: { "js-ola": "2026-10-16T10:00:00Z" }, tries: { "js-ola": 2 }, days: ["2026-10-16"] })); localStorage.setItem("cheatdev:favs", JSON.stringify(["css/layout/display-flex"])); localStorage.setItem("cheatdev:lab:inbox", "temporario"); localStorage.setItem("outro-site", "x"); });
await go("/desafios");
ok("painel de backup visível com o aviso de que os dados ficam só no navegador", /só neste navegador, neste aparelho/.test(await text()));
await page.evaluate(() => { window.__blob = null; const orig = URL.createObjectURL; URL.createObjectURL = (b) => { window.__blob = b; return orig.call(URL, b); }; });
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Exportar backup"))?.click()); await sleep(500);
const exported = await page.evaluate(async () => (window.__blob ? await window.__blob.text() : ""));
let bk = {}; try { bk = JSON.parse(exported); } catch {}
ok("exportou um JSON do cheat-dev com o progresso e os favoritos", bk.app === "cheat-dev" && bk.version === 1 && !!bk.data?.["cheatdev:hub:v1"] && !!bk.data?.["cheatdev:favs"], exported.slice(0, 120));
ok("o backup NÃO leva chaves temporárias nem de outros sites", !("cheatdev:lab:inbox" in (bk.data || {})) && !("outro-site" in (bk.data || {})));
fs.writeFileSync("/tmp/val/backup-ok.json", exported); fs.writeFileSync("/tmp/val/backup-ruim.json", JSON.stringify({ app: "outro", version: 1, data: { "cheatdev:hub:v1": "x" } }));
await page.evaluate(() => { localStorage.clear(); });
const input = await page.$('input[type=file]');
await input.uploadFile("/tmp/val/backup-ruim.json"); await sleep(600);
ok("arquivo de outro app é recusado com mensagem", /não parece ser um backup do cheat\/dev/.test(await text()) && (await page.evaluate(() => localStorage.getItem("cheatdev:hub:v1"))) === null);
await input.uploadFile("/tmp/val/backup-ok.json"); await sleep(2500);
const back = await page.evaluate(() => ({ hub: JSON.parse(localStorage.getItem("cheatdev:hub:v1") || "{}"), favs: localStorage.getItem("cheatdev:favs") }));
ok("importar restaura o progresso e os favoritos", back.hub?.solved?.["js-ola"] === "2026-10-16T10:00:00Z" && back.favs === JSON.stringify(["css/layout/display-flex"]), JSON.stringify(back).slice(0, 140));
await sleep(500);
ok("depois de importar, o painel do Hub já mostra 1 desafio resolvido (página recarregou)", new RegExp(`1/${INV.desafios}\\s*resolvidos`).test(await text()), (await text()).match(/\d+\/133 resolvidos/)?.[0]);
ok("sem erros de JavaScript", errs.length === 0, errs.join(" | "));
await browser.close();
console.log(fails ? `\n${fails} FALHA(S)` : "\ntodos os testes passaram"); process.exit(fails ? 1 : 0);
