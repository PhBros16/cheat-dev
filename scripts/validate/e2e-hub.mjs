import { createRequire } from "module";
import fs from "fs";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
const sol = JSON.parse(fs.readFileSync("/tmp/val/solutions.json", "utf8"));
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1400, height: 900 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errs = []; page.on("pageerror", (e) => errs.push(e.message.slice(0, 140)));
const out = {};
const click = (t) => page.evaluate((x) => [...document.querySelectorAll("button")].find((b) => b.textContent.trim().includes(x))?.click(), t);
const setCm = async (txt) => { for (const h of await page.$$(".cm-content")) { if (await h.isIntersectingViewport()) { await h.click(); break; } } await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control"); await page.keyboard.press("Backspace"); await page.evaluate((t) => navigator.clipboard?.writeText?.(t).catch(() => {}), txt); await page.keyboard.sendCharacter(txt); await sleep(300); };

await page.goto("http://localhost:3111/desafios", { waitUntil: "networkidle0" });
await sleep(800);
out.inicial = await page.evaluate(() => ({ patente: document.body.innerText.match(/Aprendiz/)?.[0], total: document.body.innerText.match(/0\/58/)?.[0], desafioDoDia: document.body.innerText.includes("Desafio do dia") }));

// 1) roleta
const t0 = Date.now();
await click("Girar a roleta");
for (let i = 0; i < 30; i++) { await sleep(500); if (await page.evaluate(() => document.body.innerText.includes("Sorteado:"))) break; }
out.roleta = await page.evaluate(() => ({ sorteado: document.body.innerText.match(/Sorteado:\s*(\S+)/)?.[1], abriuDesafio: !!document.querySelector("#area-do-desafio h2"), titulo: document.querySelector("#area-do-desafio h2")?.textContent, segundos: 0 }));
out.roleta.segundos = Math.round((Date.now() - t0) / 100) / 10;

// 2) JS: resolver js-soma digitando a solução
await page.evaluate(() => [...document.querySelectorAll("section button")].find((b) => b.textContent.includes("Função soma"))?.click()); await sleep(1200);
await setCm(sol["js-soma"].js);
await click("Rodar testes"); await sleep(2500);
out.jsSoma = await page.evaluate(() => ({ testes: document.body.innerText.match(/\d\/\d(?=\s*\n?\s*(✅|❌|○))/)?.[0], concluido: document.body.innerText.includes("Todos os testes passaram"), xp: document.body.innerText.match(/\+\d+ XP/)?.[0] }));

// 3) errado primeiro (HTML esqueleto), depois certo
await page.evaluate(() => [...document.querySelectorAll("section button")].find((b) => b.textContent.includes("Esqueleto de uma página"))?.click()); await sleep(1200);
await click("Rodar testes"); await sleep(2500);
out.htmlErrado = await page.evaluate(() => ({ falhas: (document.body.innerText.match(/❌/g) || []).length, concluido: document.body.innerText.includes("Todos os testes passaram") }));
await setCm(sol["html-esqueleto"].html);
await click("Rodar testes"); await sleep(2500);
out.htmlCerto = await page.evaluate(() => ({ concluido: document.body.innerText.includes("Todos os testes passaram") }));

// 4) SQL
await page.evaluate(() => [...document.querySelectorAll("section button")].find((b) => b.textContent.includes("Clientes de Natal"))?.click()); await sleep(2500);
await setCm("SELECT nome, cidade FROM clientes WHERE cidade = 'Natal';");
await click("Verificar resposta"); await sleep(1500);
out.sql = await page.evaluate(() => ({ correto: document.body.innerText.includes("Correto!") }));

// 5) progresso salvo
await sleep(600);
out.progresso = await page.evaluate(() => ({ ls: JSON.parse(localStorage.getItem("cheatdev:hub:v1")), texto: document.body.innerText.match(/(\d+)\s*\nXP/)?.[1] }));
await page.reload({ waitUntil: "networkidle0" }); await sleep(800);
out.aposRecarregar = await page.evaluate(() => ({ resolvidos: document.body.innerText.match(/(\d+)\/58\s*\n?\s*resolvidos/)?.[0]?.replace(/\s+/g, " "), checks: (document.body.innerText.match(/✅/g) || []).length }));
await page.screenshot({ path: "/tmp/val/hub.png" });
console.log(JSON.stringify(out, null, 1)); console.log("ERROS:", JSON.stringify(errs.slice(0, 5)));
await browser.close();
