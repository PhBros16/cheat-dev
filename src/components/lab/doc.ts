export type Project = { html: string; css: string; js: string };

/** Script injetado no iframe: ponte do console, captura de erros e localStorage em memória. */
const BRIDGE = `<script>(function(){
var P=parent;
function f(v){try{if(typeof v==='string')return v;if(v instanceof Error)return v.name+': '+v.message;return JSON.stringify(v,function(k,x){return typeof x==='function'?'[Function]':(typeof Node!=='undefined'&&x instanceof Node)?'<'+x.nodeName.toLowerCase()+'>':x},2)}catch(e){return String(v)}}
function s(t,a){try{P.postMessage({__lab:1,t:t,m:a.map(f).join(' ')},'*')}catch(e){}}
['log','info','warn','error','debug'].forEach(function(k){var o=console[k];console[k]=function(){s(k,[].slice.call(arguments));try{o&&o.apply(console,arguments)}catch(e){}}});
addEventListener('error',function(e){s('error',[e.message+(e.lineno?' (linha '+e.lineno+')':'')])});
addEventListener('unhandledrejection',function(e){s('error',['Promise rejeitada: '+((e.reason&&e.reason.message)||e.reason)])});
function mem(){var d={};return{getItem:function(k){return k in d?d[k]:null},setItem:function(k,v){d[k]=String(v)},removeItem:function(k){delete d[k]},clear:function(){d={}},key:function(i){return Object.keys(d)[i]||null},get length(){return Object.keys(d).length}}}
try{void localStorage.length}catch(e){try{Object.defineProperty(window,'localStorage',{value:mem(),configurable:true});Object.defineProperty(window,'sessionStorage',{value:mem(),configurable:true})}catch(_){}}
addEventListener('message',function(e){var d=e.data;if(!d)return;if(d.__labcss!==undefined){var st=document.getElementById('lab-css');if(!st){st=document.createElement('style');st.id='lab-css';(document.head||document.documentElement).appendChild(st)}st.textContent=d.__labcss;return}if(d.__labeval!==undefined){try{s('result',[(0,eval)(d.__labeval)])}catch(err){s('error',[err])}return}if(!d.__labcmd)return;var id='__lab_'+d.k,el=document.getElementById(id);if(d.on){if(!el){el=document.createElement('style');el.id=id;el.textContent=d.css;(document.head||document.documentElement).appendChild(el)}}else if(el){el.remove()}});
addEventListener('load',function(){P.postMessage({__lab:1,t:'ready'},'*')});
})();</script>`;

const VIEWPORT = `<meta name="viewport" content="width=device-width, initial-scale=1">`;

const isFull = (s: string) => /<html[\s>]|<!doctype/i.test(s);

function inject(doc: string, re: RegExp, make: (m: string) => string, fallback: (d: string) => string) {
  return re.test(doc) ? doc.replace(re, (m) => make(m)) : fallback(doc);
}

/** Junta HTML + CSS + JS num documento único para o iframe de preview. */
export function buildDoc({ html, css, js }: Project): string {
  const style = css.trim() ? `<style id="lab-css">\n${css}\n</style>` : "";
  const script = js.trim() ? `<script>\n${js}\n</script>` : "";

  if (!isFull(html)) {
    return `<!doctype html><html><head><meta charset="utf-8">${VIEWPORT}${BRIDGE}${style}</head><body>\n${html}\n${script}</body></html>`;
  }
  let d = html;
  const needsViewport = !/<meta[^>]+viewport/i.test(d);
  d = inject(d, /<head[^>]*>/i, (m) => m + BRIDGE + (needsViewport ? VIEWPORT : ""), (x) =>
    inject(x, /<html[^>]*>/i, (m) => `${m}<head>${BRIDGE}${needsViewport ? VIEWPORT : ""}</head>`, (y) => BRIDGE + y)
  );
  if (style) d = inject(d, /<\/head>/i, (m) => style + m, (x) => x + style);
  if (script) d = inject(d, /<\/body>/i, (m) => script + m, (x) => x + script);
  return d;
}

/** Separa um documento/fragmento completo em HTML + CSS + JS (para abrir snippets e templates no Lab). */
export function splitDoc(doc: string): Project {
  const full = isFull(doc);
  const p = new DOMParser().parseFromString(full ? doc : `<body>${doc}</body>`, "text/html");
  const css = [...p.querySelectorAll("style")].map((s) => (s.textContent ?? "").trim()).filter(Boolean).join("\n\n");
  const js = [...p.querySelectorAll("script:not([src])")].map((s) => (s.textContent ?? "").trim()).filter(Boolean).join("\n\n");
  p.querySelectorAll("style, script:not([src])").forEach((n) => n.remove());
  const html = full ? "<!DOCTYPE html>\n" + p.documentElement.outerHTML : p.body.innerHTML.trim();
  return { html: html.replace(/\n{3,}/g, "\n\n").replace(/>\s*<\/(head|body)>/g, "></$1>"), css, js };
}

/** Arquivo único para download. */
export function exportHtml(pr: Project): string {
  const d = buildDoc(pr);
  return d.replace(BRIDGE, "");
}

/* ---------- link compartilhável (hash) ---------- */
const b64u = (u8: Uint8Array) => {
  let s = "";
  u8.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const unb64u = (s: string) => {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
};

export async function encodeProject(pr: Project): Promise<string> {
  const stream = new Blob([new TextEncoder().encode(JSON.stringify(pr))]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  return b64u(new Uint8Array(await new Response(stream).arrayBuffer()));
}

export async function decodeProject(code: string): Promise<Project | null> {
  try {
    const stream = new Blob([unb64u(code) as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    const o = JSON.parse(await new Response(stream).text());
    if (typeof o.html === "string" && typeof o.css === "string" && typeof o.js === "string") return o;
  } catch {}
  return null;
}

/* ---------- projeto em arquivos (ZIP) ---------- */
export type ProjFile = { name: string; content: string };

/** Divide o projeto em index.html + style.css + script.js (como numa pasta de verdade). */
export function exportFiles(p: Project): ProjFile[] {
  const link = p.css.trim() ? `<link rel="stylesheet" href="style.css">` : "";
  const script = p.js.trim() ? `<script src="script.js" defer></script>` : "";
  let html: string;
  if (isFull(p.html)) {
    html = p.html;
    if (link) html = inject(html, /<\/head>/i, (m) => `  ${link}\n${m}`, (x) => x);
    if (script) html = inject(html, /<\/body>/i, (m) => `  ${script}\n${m}`, (x) => x + script);
  } else {
    html = `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  ${VIEWPORT}\n  <title>Projeto</title>\n${link ? `  ${link}\n` : ""}</head>\n<body>\n${p.html}\n${script ? `  ${script}\n` : ""}</body>\n</html>\n`;
  }
  const files: ProjFile[] = [{ name: "index.html", content: html }];
  if (p.css.trim()) files.push({ name: "style.css", content: p.css });
  if (p.js.trim()) files.push({ name: "script.js", content: p.js });
  files.push({ name: "LEIA-ME.txt", content: "Projeto exportado do cheat/dev Lab.\nAbra o index.html no navegador, ou arraste esta pasta para o VS Code.\nPara publicar: veja o guia 'Do zero ao site no ar: GitHub + Vercel'.\n" });
  return files;
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Junta arquivos soltos (.html/.css/.js) ou o conteúdo de um ZIP em um projeto do Lab. */
export function importFiles(files: ProjFile[]): Project {
  const base = (n: string) => n.split("/").pop() ?? n;
  const htmls = files.filter((f) => /\.html?$/i.test(f.name));
  const main = htmls.find((f) => /^index\.html?$/i.test(base(f.name))) ?? htmls[0];
  const csss = files.filter((f) => /\.css$/i.test(f.name));
  const jss = files.filter((f) => /\.m?js$/i.test(f.name));
  let html = main?.content ?? "";
  for (const f of csss) html = html.replace(new RegExp(`<link[^>]+href=["'][^"']*${esc(base(f.name))}["'][^>]*>\\s*`, "gi"), "");
  for (const f of jss) html = html.replace(new RegExp(`<script[^>]+src=["'][^"']*${esc(base(f.name))}["'][^>]*>\\s*</script>\\s*`, "gi"), "");
  return {
    html,
    css: csss.map((f) => f.content.trim()).join("\n\n"),
    js: jss.map((f) => f.content.trim()).join("\n\n"),
  };
}
