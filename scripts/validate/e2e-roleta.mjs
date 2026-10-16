// E2E da roleta configurável, trilhas, seleção individual e mini-aula. Requer o servidor em :3111 e /tmp/val/solutions.json (npx tsx scripts/validate/challenges.mts).
import { createRequire } from "module";
import fs from "fs";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
const sol = JSON.parse(fs.readFileSync("/tmp/val/solutions.json", "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 1000 });
await page.setRequestInterception(true); page.on("request", (r) => (/fonts\.g/.test(r.url()) ? r.abort() : r.continue()));
page.on("dialog", (d) => d.accept());
const errs = []; page.on("pageerror", (e) => errs.push(e.message.slice(0, 140)));
let fails = 0; const ok = (name, cond, extra = "") => { if (!cond) fails++; console.log(cond ? "✓" : "✗", name, cond ? "" : "→ " + extra); };
const go = async () => { await page.goto("http://localhost:3111/desafios", { waitUntil: "networkidle0" }); await sleep(500); };
const text = () => page.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
const click = (t, sel = "button") => page.evaluate((x, s) => { const e = [...document.querySelectorAll(s)].find((b) => b.textContent.trim().includes(x)); if (!e) throw new Error("sem " + x); e.click(); }, t, sel);
const pressed = (t) => page.evaluate((x) => [...document.querySelectorAll("button[aria-pressed]")].find((b) => b.textContent.trim().includes(x))?.getAttribute("aria-pressed") === "true", t);
const wheelLabel = () => page.evaluate(() => document.querySelector("svg[role=img]")?.getAttribute("aria-label") || "");
const count = async () => (await text()).match(/(\d+) desafios? na roleta/)?.[1];
const setCm = async (txt) => { for (const h of await page.$$(".cm-content")) { if (await h.isIntersectingViewport()) { await h.click(); break; } } await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control"); await page.keyboard.press("Backspace"); await page.evaluate((t) => document.execCommand("insertText", false, t), txt); await sleep(700); };
const waitText = (re, ms = 12000) => page.waitForFunction((r) => new RegExp(r).test(document.body.innerText.replace(/\s+/g, " ")), { timeout: ms }, re.source).then(() => true).catch(() => false);

await go();
ok("padrão: 133 desafios na roleta", (await count()) === "133", await count());
ok("padrão: roleta com 4 opções (linguagens)", /4 opções: HTML, CSS, JS, SQL/.test(await wheelLabel()), await wheelLabel());

// filtros
await click("HTML", "button[aria-pressed]"); await sleep(300);
ok("desligar HTML: a roleta cai para 107 desafios e 3 opções", (await count()) === "107" && /3 opções/.test(await wheelLabel()), `${await count()} | ${await wheelLabel()}`);
await click("CSS", "button[aria-pressed]"); await click("JavaScript", "button[aria-pressed]"); await sleep(300);
ok("só SQL: 34 desafios e a roleta vira fatias por trilha (6)", (await count()) === "34" && /6 opções/.test(await wheelLabel()), `${await count()} | ${await wheelLabel()}`);
await click("SQL", "button[aria-pressed]"); await sleep(200);
ok("não deixa desligar a última linguagem", (await pressed("SQL")) === true && (await count()) === "34");
await click("avançado", "button[aria-pressed]"); await click("chefe", "button[aria-pressed]"); await sleep(300);
const n2 = Number(await count()); ok("SQL sem avançado/chefe: menos desafios", n2 > 0 && n2 < 34, String(n2));
await page.reload({ waitUntil: "networkidle0" }); await sleep(500);
ok("os filtros persistem ao recarregar", (await count()) === String(n2) && (await pressed("SQL")) === true && (await pressed("avançado")) === false, await count());
await click("Só os que ainda não resolvi", "label"); await sleep(200);
ok("a opção 'só pendentes' liga/desliga", (await page.evaluate(() => [...document.querySelectorAll("label")].find((l) => l.textContent.includes("Só os que"))?.querySelector("input")?.checked)) === false);

// seleção um a um
await page.evaluate(() => localStorage.removeItem("cheatdev:hub:wheel:v1")); await go();
await click("Escolher um a um"); await sleep(300);
const boxes = await page.evaluate(() => document.querySelectorAll('input[type=checkbox][aria-label^="Incluir"]').length);
ok("modo seleção: aparece uma caixa por desafio da lista (133)", boxes === 133, String(boxes));
for (const t of ["Olá, nome!", "Faixa etária", "Escolher colunas"]) await page.evaluate((x) => document.querySelector(`input[type=checkbox][aria-label="Incluir \\"${x}\\" na roleta"]`)?.click(), t);
await sleep(300);
ok("3 marcados: '3 desafios na roleta (sua seleção)'", /3 desafios na roleta \(sua seleção\)/.test(await text()), (await text()).match(/\d+ desafios na roleta[^.]{0,30}/)?.[0]);
ok("a roleta vira 3 fatias, uma por desafio", /3 opções: Olá, nome!, Faixa etária, Escolher colunas/.test(await wheelLabel()), await wheelLabel());
ok("filtros ficam desativados com seleção manual", await page.evaluate(() => document.querySelector("fieldset")?.disabled === true));
await page.reload({ waitUntil: "networkidle0" }); await sleep(500);
ok("a seleção persiste ao recarregar", /3 desafios na roleta \(sua seleção\)/.test(await text()));
await click("Girar a roleta"); ok("a roleta sorteou (aparece 'Sorteado:')", await waitText(/Sorteado:/), "");
const aberto = await page.evaluate(() => document.querySelector("#area-do-desafio h2, #area-do-desafio h3")?.textContent || "");
ok("o desafio aberto é um dos escolhidos", ["Olá, nome!", "Faixa etária", "Escolher colunas"].includes(aberto), aberto);
ok("a mini-aula aparece antes do exercício", await page.evaluate(() => !!document.querySelector("#area-do-desafio details summary") && document.querySelector("#area-do-desafio details")?.textContent.includes("Aprenda")));
await click("Limpar seleção"); await sleep(300);
ok("limpar seleção volta ao filtro (133)", (await count()) === "133");
await click("Escolher um a um"); // fecha o modo (caso aberto) e reabre
await page.evaluate(() => localStorage.setItem("cheatdev:hub:wheel:v1", JSON.stringify({ langs: ["html", "css", "js", "sql"], levels: ["iniciante", "intermediário", "avançado", "chefe"], onlyPending: true, custom: ["js-ola"] }))); await go();
ok("1 desafio só: em vez da roleta, um botão para abri-lo", /Abrir “Olá, nome!”/.test(await text()) && !(await wheelLabel()));
await page.evaluate(() => localStorage.removeItem("cheatdev:hub:wheel:v1"));

// trilhas e próximo passo
await go();
ok("visão por trilhas: HTML com 7 trilhas", /HTML 0\/26 · 7 trilhas/.test(await text()), (await text()).match(/HTML 0\/\d+ · \d+ trilhas/)?.[0]);
await page.evaluate(() => document.querySelector('button[aria-label="Continuar a trilha Primeiros passos"]')?.click()); await sleep(1500);
const t1 = await page.evaluate(() => document.querySelector("#area-do-desafio h2, #area-do-desafio h3")?.textContent || "");
ok("'Continuar' abre o 1º passo da trilha (Títulos na ordem certa)", t1 === "Títulos na ordem certa", t1);
ok("mostra 'passo 1 de 6'", /Primeiros passos · passo 1 de 6/.test(await text()), (await text()).match(/passo \d+ de \d+/)?.[0]);
await click("HTML", "[role=tab]"); // aba HTML da lista? (garante que a página reage)
await go(); await page.evaluate(() => document.querySelector('button[aria-label="Continuar a trilha Primeiros passos"]')?.click()); await sleep(1500);
await setCm(sol["html-titulos"].html); await click("Rodar testes");
ok("resolve 'Títulos na ordem certa' (3/3)", await waitText(/Todos os testes passaram/), "");
ok("ganha XP e a conquista 'Primeiro passo' sai do cadeado", /\+10 XP/.test(await text()) && !/Primeiro passo 🔒/.test(await text()), "");
await click("Próximo passo");
await sleep(1500);
const t2 = await page.evaluate(() => document.querySelector("#area-do-desafio h2, #area-do-desafio h3")?.textContent || "");
ok("'Próximo passo →' abre o passo 2 (Parágrafos e quebras de linha)", t2 === "Parágrafos e quebras de linha", t2);
await go();
ok("o progresso da trilha mostra 1/6 e o 'próximo' avança", /1\/6/.test(await text()) && await page.evaluate(() => /próximo/.test(document.querySelector("#lista-de-desafios")?.innerText || "")));

// níveis e abas
await click("Por nível"); await sleep(300);
ok("'Por nível' agrupa por nível", /iniciante/.test(await text()) && /chefe/.test(await text()));
await click("SQL (", "[role=tab]"); await sleep(300);
const cards = await page.evaluate(() => document.querySelectorAll("#lista-de-desafios .grid > div.relative").length);
ok("aba SQL no modo por nível mostra os 34 desafios de SQL", cards === 34, String(cards));
ok("sem erros de JavaScript", errs.length === 0, errs.join(" | "));
await browser.close();
console.log(fails ? `\n${fails} FALHA(S)` : "\ntodos os testes passaram"); process.exit(fails ? 1 : 0);
