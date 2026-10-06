import { createRequire } from "module";
const req = createRequire("/tmp/val/package.json");
const puppeteer = req("puppeteer-core");
const chromium = req("@sparticuz/chromium").default ?? req("@sparticuz/chromium");
const browser = await puppeteer.launch({ args: chromium.args, executablePath: await chromium.executablePath(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 800 });
const errs = [];
page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errs.push("console: " + m.text() + " " + (m.location()?.url||"")); });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = {};
const frame = () => page.frames().find((x) => x !== page.mainFrame() && x.url() === "about:srcdoc");
const editorText = (p = page) => p.evaluate(() => [...document.querySelectorAll(".cm-content")].filter((e) => e.offsetParent).map((e) => e.innerText).join("|"));
const clickTab = (name) => page.evaluate((n) => [...document.querySelectorAll("button")].find((b) => b.textContent.trim().endsWith(n)).click(), name);
const focusEditor = async () => { for (const h of await page.$$(".cm-content")) { if (await h.isIntersectingViewport()) { await h.click(); return; } } };
const selectAll = async () => { await page.keyboard.down("Control"); await page.keyboard.press("a"); await page.keyboard.up("Control"); };

await page.goto("http://localhost:3111/lab", { waitUntil: "networkidle0" });
await sleep(900);
await page.screenshot({ path: "/tmp/val/lab1.png" });
out.initialHasH1 = (await frame()?.evaluate(() => document.body.innerText))?.includes("Olá, mundo");

await focusEditor(); await selectAll();
await page.keyboard.type("ul>li*3"); await sleep(250); await page.keyboard.press("Tab"); await sleep(900);
out.emmet = (await editorText()).replace(/\s+/g, " ").slice(0, 90);
out.emmetLisInPreview = (await frame()?.evaluate(() => document.querySelectorAll("li").length));

await selectAll();
await page.keyboard.type("cd-ca"); await sleep(700);
if (!(await page.evaluate(() => !!document.querySelector(".cm-tooltip-autocomplete")))) { await page.keyboard.down("Control"); await page.keyboard.press(" "); await page.keyboard.up("Control"); await sleep(500); }
out.popup = await page.evaluate(() => document.querySelector(".cm-tooltip-autocomplete")?.innerText.replace(/\s+/g, " ").slice(0, 80) || null);
await page.keyboard.type("rd"); await sleep(300); await page.keyboard.press("Tab"); await sleep(900);
out.cdCard = (await editorText()).replace(/\s+/g, " ").slice(0, 90);

await clickTab("CSS"); await sleep(300); await focusEditor(); await selectAll();
await page.keyboard.type("body{background:rgb(1,2,3)}"); await sleep(900);
out.cssLive = await frame()?.evaluate(() => getComputedStyle(document.body).backgroundColor);

await clickTab("JS"); await sleep(300); await focusEditor(); await selectAll();
await page.keyboard.type("console.log('oi', {a:1}); localStorage.setItem('x','1'); console.log('ls=' + localStorage.getItem('x')); nope()");
await sleep(2000);
out.consoleText = await page.evaluate(() => (document.body.innerText.match(/oi \{[\s\S]*?\}|ls=\d|nope is not defined[^\n]*/g) || []).join(" || "));

await page.select("select[aria-label='Tamanho da tela']", "iphone-15"); await sleep(700);
await page.screenshot({ path: "/tmp/val/lab2.png" });
out.dimLabel = await page.evaluate(() => (document.body.innerText.match(/\d+ × \d+[\s\S]{0,40}breakpoint: [^\n]*/) || [""])[0].replace(/\s+/g, " "));

await page.select("select[aria-label='Tamanho da tela']", "multi"); await sleep(1000);
out.multiFrames = page.frames().filter((x) => x.url() === "about:srcdoc").length;
await page.screenshot({ path: "/tmp/val/lab3.png" });

await page.evaluate(() => { window.__copied = ""; navigator.clipboard.writeText = async (t) => { window.__copied = t; }; });
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Compartilhar")).click());
await sleep(600);
const link = await page.evaluate(() => window.__copied);
out.linkLen = link.length;
const p2 = await browser.newPage(); await p2.setViewport({ width: 1366, height: 800 });
await p2.goto(link.replace(/^https?:\/\/[^/]+/, "http://localhost:3111"), { waitUntil: "networkidle0" });
await sleep(1500);
out.shareRoundtrip = await p2.evaluate(() => { const s = localStorage.getItem("cheatdev:lab:v1") || ""; return s.includes("console.log") && s.includes("rgb(1,2,3)") && s.includes("<article class="); });

const p3 = await browser.newPage(); await p3.setViewport({ width: 1366, height: 800 });
await p3.goto("http://localhost:3111/snippets/botoes", { waitUntil: "networkidle0" });
await p3.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Editar no Lab")).click());
await sleep(3000);
out.inboxUrl = p3.url();
out.inboxHasEditor = await p3.evaluate(() => !!document.querySelector(".cm-content"));
out.inboxCssTabHasBtn = await p3.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim().endsWith("CSS")); b.click(); return new Promise((r) => setTimeout(() => r([...document.querySelectorAll(".cm-content")].filter((e) => e.offsetParent).map((e) => e.innerText).join("").length), 400)); });
await p3.screenshot({ path: "/tmp/val/lab4.png" });
console.log(JSON.stringify(out, null, 1));
console.log("ERROS:", JSON.stringify(errs.slice(0, 6)));
await browser.close();
