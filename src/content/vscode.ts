/**
 * Snippets de VS Code do cheat/dev.
 * Gatilho padrão: "cd-nome" (também funciona sem hífen: "cdnome").
 * Tabstops usam [[1:texto]] / [[0]] aqui e viram ${1:texto} / $0 na exportação.
 */
export type VsSnippet = {
  id: string; // vira o gatilho: cd-<id>
  lang: "html" | "css";
  title: string;
  description: string;
  body: string;
  group: string;
};

export const vscodeSnippets: VsSnippet[] = [
  /* ================= HTML ================= */
  { id: "html", lang: "html", group: "Base da página", title: "Página completa (pt-BR)", description: "Documento HTML5 já com lang, viewport, descrição, CSS e script com defer.",
    body: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[[1:Título da página]]</title>
  <meta name="description" content="[[2:Descrição de até 155 caracteres]]">
  <link rel="stylesheet" href="[[3:style.css]]">
</head>
<body>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <header>
    [[4]]
  </header>
  <main id="conteudo">
    [[0]]
  </main>
  <footer>
    <p>&copy; [[5:2026]] [[6:Seu nome]]</p>
  </footer>
  <script src="[[7:script.js]]" defer></script>
</body>
</html>` },
  { id: "seo", lang: "html", group: "Base da página", title: "Head completo: SEO + Open Graph", description: "Metas de busca, compartilhamento (WhatsApp, Discord, LinkedIn), favicon e cor do navegador.",
    body: `<title>[[1:Título]] | [[2:Nome do site]]</title>
<meta name="description" content="[[3:Descrição]]">
<link rel="canonical" href="[[4:https://seusite.com/]]">
<meta name="theme-color" content="[[5:#0e1013]]">
<link rel="icon" href="[[6:/favicon.svg]]" type="image/svg+xml">

<meta property="og:type" content="website">
<meta property="og:title" content="[[1:Título]]">
<meta property="og:description" content="[[3:Descrição]]">
<meta property="og:image" content="[[7:https://seusite.com/og.png]]">
<meta property="og:url" content="[[4:https://seusite.com/]]">
<meta name="twitter:card" content="summary_large_image">` },
  { id: "font", lang: "html", group: "Base da página", title: "Google Fonts (otimizado)", description: "Preconnect + fonte com display=swap, para não travar a renderização.",
    body: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=[[1:Inter]]:wght@400;600;700&display=swap" rel="stylesheet">` },
  { id: "skip", lang: "html", group: "Base da página", title: "Link 'pular para o conteúdo'", description: "Acessibilidade para teclado. Combine com a classe .skip do snippet cd-focus.",
    body: `<a class="skip" href="#[[1:conteudo]]">Pular para o conteúdo</a>` },

  { id: "nav", lang: "html", group: "Estrutura", title: "Cabeçalho com navegação", description: "header + nav acessível com aria-label e link da página atual.",
    body: `<header class="topo">
  <a class="logo" href="/">[[1:Logo]]</a>
  <nav aria-label="Principal">
    <ul>
      <li><a href="[[2:#sobre]]" aria-current="page">[[3:Sobre]]</a></li>
      <li><a href="[[4:#servicos]]">[[5:Serviços]]</a></li>
      <li><a href="[[6:#contato]]">[[7:Contato]]</a></li>
    </ul>
  </nav>
</header>` },
  { id: "section", lang: "html", group: "Estrutura", title: "Section com título ligado", description: "Seção semântica; leitores de tela anunciam o título.",
    body: `<section aria-labelledby="[[1:id-titulo]]">
  <h2 id="[[1:id-titulo]]">[[2:Título da seção]]</h2>
  [[0]]
</section>` },
  { id: "footer", lang: "html", group: "Estrutura", title: "Rodapé com links", description: "footer com nav secundária e direitos autorais.",
    body: `<footer>
  <nav aria-label="Rodapé">
    <a href="[[1:/privacidade]]">Privacidade</a>
    <a href="[[2:/termos]]">Termos</a>
  </nav>
  <p>&copy; [[3:2026]] [[4:Empresa]]. Todos os direitos reservados.</p>
</footer>` },

  { id: "campo", lang: "html", group: "Formulários", title: "Campo (label + input)", description: "Par label/input corretamente ligado, com autocomplete e required.",
    body: `<div class="campo">
  <label for="[[1:email]]">[[2:E-mail]]</label>
  <input id="[[1:email]]" name="[[1:email]]" type="[[3:email]]" autocomplete="[[4:email]]" required>
</div>` },
  { id: "form", lang: "html", group: "Formulários", title: "Formulário de contato", description: "Form completo com nome, e-mail, mensagem e botão.",
    body: `<form action="[[1:/enviar]]" method="post">
  <div class="campo">
    <label for="nome">Nome</label>
    <input id="nome" name="nome" type="text" autocomplete="name" required>
  </div>
  <div class="campo">
    <label for="email">E-mail</label>
    <input id="email" name="email" type="email" autocomplete="email" required>
  </div>
  <div class="campo">
    <label for="mensagem">Mensagem</label>
    <textarea id="mensagem" name="mensagem" rows="5" required></textarea>
  </div>
  <button type="submit">[[2:Enviar]]</button>
</form>` },
  { id: "btn", lang: "html", group: "Formulários", title: "Botão", description: "Sempre com type explícito, evita enviar formulário sem querer.",
    body: `<button type="[[1:button]]" class="btn">[[2:Clique aqui]]</button>` },

  { id: "img", lang: "html", group: "Mídia", title: "Imagem otimizada", description: "alt, width/height (evita salto de layout), lazy loading e decoding assíncrono.",
    body: `<img src="[[1:foto.jpg]]" alt="[[2:Descrição da imagem]]" width="[[3:800]]" height="[[4:600]]" loading="lazy" decoding="async">` },
  { id: "picture", lang: "html", group: "Mídia", title: "Imagem responsiva (picture)", description: "WebP/AVIF com fallback e tamanhos diferentes por tela.",
    body: `<picture>
  <source type="image/avif" srcset="[[1:foto]].avif">
  <source type="image/webp" srcset="[[1:foto]].webp">
  <img src="[[1:foto]].jpg" alt="[[2:Descrição]]" width="[[3:1200]]" height="[[4:800]]" loading="lazy" decoding="async">
</picture>` },
  { id: "video", lang: "html", group: "Mídia", title: "Vídeo", description: "video com controles, poster e carregamento só dos metadados.",
    body: `<video controls preload="metadata" poster="[[1:capa.jpg]]" width="[[2:800]]">
  <source src="[[3:video.mp4]]" type="video/mp4">
  Seu navegador não suporta vídeo.
</video>` },

  { id: "card", lang: "html", group: "Componentes", title: "Card", description: "article com imagem, título, texto e link.",
    body: `<article class="card">
  <img src="[[1:capa.jpg]]" alt="[[2:]]" width="400" height="250" loading="lazy">
  <div class="card-corpo">
    <h3>[[3:Título]]</h3>
    <p>[[4:Resumo do conteúdo.]]</p>
    <a href="[[5:#]]">[[6:Saiba mais]]</a>
  </div>
</article>` },
  { id: "dialog", lang: "html", group: "Componentes", title: "Modal nativo (dialog)", description: "dialog + showModal() — foco, ESC e fundo já tratados pelo navegador.",
    body: `<button type="button" onclick="document.getElementById('[[1:modal]]').showModal()">Abrir</button>

<dialog id="[[1:modal]]">
  <h2>[[2:Título]]</h2>
  <p>[[3:Conteúdo]]</p>
  <form method="dialog"><button>Fechar</button></form>
</dialog>` },
  { id: "details", lang: "html", group: "Componentes", title: "Acordeão / FAQ (details)", description: "Abre e fecha sem JavaScript.",
    body: `<details>
  <summary>[[1:Pergunta]]</summary>
  <p>[[2:Resposta]]</p>
</details>` },
  { id: "table", lang: "html", group: "Componentes", title: "Tabela acessível", description: "caption, thead/tbody e scope nos cabeçalhos.",
    body: `<table>
  <caption>[[1:Descrição da tabela]]</caption>
  <thead>
    <tr><th scope="col">[[2:Coluna A]]</th><th scope="col">[[3:Coluna B]]</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">[[4:Linha 1]]</th><td>[[5:Valor]]</td></tr>
  </tbody>
</table>` },

  /* ================= CSS ================= */
  { id: "css", lang: "css", group: "Starter", title: "Starter completo (reset + tokens + base)", description: "Tudo que garante uma base estável: cole no topo de qualquer projeto novo.",
    body: `/* ---------- reset ---------- */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
body { min-height: 100dvh; line-height: 1.6; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; height: auto; }
input, button, textarea, select { font: inherit; color: inherit; }
button { cursor: pointer; }
p, h1, h2, h3, h4 { overflow-wrap: break-word; }
h1, h2, h3 { text-wrap: balance; line-height: 1.2; }
p { text-wrap: pretty; }
a { color: inherit; }

/* ---------- tokens ---------- */
:root {
  color-scheme: light dark;
  --cor-marca: [[1:#2f6fed]];
  --bg: light-dark(#ffffff, #0e1013);
  --texto: light-dark(#14171a, #e8eaec);
  --suave: light-dark(#6b7280, #9aa3ad);
  --borda: light-dark(#e5e7eb, #2a2e33);
  --raio: 12px;
  --espaco: clamp(1rem, 2vw + .5rem, 2rem);
  --sombra: 0 1px 2px rgb(0 0 0 / .08), 0 8px 24px rgb(0 0 0 / .12);
  --fonte: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

/* ---------- base ---------- */
body { font-family: var(--fonte); background: var(--bg); color: var(--texto); }
:focus-visible { outline: 3px solid var(--cor-marca); outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
[[0]]` },
  { id: "reset", lang: "css", group: "Starter", title: "Reset moderno", description: "Só o reset: box-sizing, margens, mídia responsiva, fontes de formulário e quebra de texto.",
    body: `*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
body { min-height: 100dvh; line-height: 1.6; }
img, picture, video, canvas, svg { display: block; max-width: 100%; height: auto; }
input, button, textarea, select { font: inherit; color: inherit; }
p, h1, h2, h3, h4 { overflow-wrap: break-word; }
h1, h2, h3 { text-wrap: balance; }` },
  { id: "root", lang: "css", group: "Starter", title: "Tokens de design (:root)", description: "Cores, espaçamentos, raios, sombras e transições em variáveis.",
    body: `:root {
  --cor-marca: [[1:#2f6fed]];
  --cor-texto: #14171a;
  --cor-fundo: #ffffff;
  --cor-borda: #e5e7eb;

  --espaco-1: .5rem;
  --espaco-2: 1rem;
  --espaco-3: 1.5rem;
  --espaco-4: 2.5rem;

  --raio: 12px;
  --sombra-1: 0 1px 2px rgb(0 0 0 / .08), 0 2px 6px rgb(0 0 0 / .06);
  --sombra-2: 0 4px 8px rgb(0 0 0 / .08), 0 12px 28px rgb(0 0 0 / .12);

  --rapido: .15s ease;
  --medio: .3s cubic-bezier(.22, 1, .36, 1);
}` },
  { id: "dark", lang: "css", group: "Starter", title: "Modo escuro (sistema + botão)", description: "Segue o tema do sistema e aceita override com data-tema no html.",
    body: `:root { --bg: #fff; --texto: #14171a; }
@media (prefers-color-scheme: dark) {
  :root:not([data-tema="claro"]) { --bg: #0e1013; --texto: #e8eaec; }
}
:root[data-tema="escuro"] { --bg: #0e1013; --texto: #e8eaec; }
body { background: var(--bg); color: var(--texto); }` },

  { id: "container", lang: "css", group: "Layout", title: "Container centralizado", description: "Largura máxima com respiro lateral, sem media query.",
    body: `.container {
  width: min(100% - 2rem, [[1:1100px]]);
  margin-inline: auto;
}` },
  { id: "center", lang: "css", group: "Layout", title: "Centralizar (grid)", description: "A forma mais curta de centralizar horizontal e verticalmente.",
    body: `.[[1:centro]] {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}` },
  { id: "flex", lang: "css", group: "Layout", title: "Flex em linha com gap", description: "Linha que quebra em telas pequenas.",
    body: `.[[1:linha]] {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: [[2:space-between]];
  gap: [[3:1rem]];
}` },
  { id: "grid", lang: "css", group: "Layout", title: "Grade responsiva (auto-fit)", description: "Colunas que se ajustam sozinhas, sem media query.",
    body: `.[[1:grade]] {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax([[2:240px]], 1fr));
  gap: [[3:1rem]];
}` },
  { id: "stack", lang: "css", group: "Layout", title: "Pilha vertical (stack)", description: "Espaçamento vertical uniforme entre filhos, sem margin em cada um.",
    body: `.stack > * + * { margin-top: var(--stack, [[1:1rem]]); }` },
  { id: "sticky", lang: "css", group: "Layout", title: "Cabeçalho fixo (sticky)", description: "Gruda no topo ao rolar, com fundo para não sobrepor texto.",
    body: `.topo {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--bg, #fff);
  border-bottom: 1px solid var(--borda, #e5e7eb);
}` },
  { id: "mq", lang: "css", group: "Layout", title: "Media query (mobile-first)", description: "Escreva o estilo do celular primeiro e vá acrescentando para telas maiores.",
    body: `@media (min-width: [[1:768px]]) {
  [[0]]
}` },
  { id: "cq", lang: "css", group: "Layout", title: "Container query", description: "Componente que muda conforme o tamanho do PAI.",
    body: `.[[1:cards]] { container-type: inline-size; }

@container (min-width: [[2:480px]]) {
  .[[3:card]] { [[0]] }
}` },

  { id: "btn", lang: "css", group: "Componentes", title: "Botão base + variações", description: "Botão com hover, active, foco e desabilitado.",
    body: `.btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .7em 1.2em;
  border: 0;
  border-radius: var(--raio, 10px);
  background: var(--cor-marca, #2f6fed);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform .15s ease, filter .15s ease;
}
.btn:hover { filter: brightness(1.1); }
.btn:active { transform: scale(.97); }
.btn:disabled { opacity: .5; cursor: not-allowed; filter: none; }` },
  { id: "card", lang: "css", group: "Componentes", title: "Card com hover", description: "Borda, sombra e leve elevação ao passar o mouse.",
    body: `.card {
  background: var(--bg, #fff);
  border: 1px solid var(--borda, #e5e7eb);
  border-radius: var(--raio, 12px);
  overflow: hidden;
  transition: transform .25s ease, box-shadow .25s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgb(0 0 0 / .14);
}` },
  { id: "glass", lang: "css", group: "Componentes", title: "Glassmorphism", description: "Vidro fosco. Precisa de fundo colorido ou imagem atrás.",
    body: `.vidro {
  background: rgb(255 255 255 / .12);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  border: 1px solid rgb(255 255 255 / .25);
  border-radius: 16px;
}` },

  { id: "trans", lang: "css", group: "Movimento", title: "Transição padrão", description: "Transição só do que muda, com curva suave.",
    body: `transition: [[1:transform]] .25s cubic-bezier(.22, 1, .36, 1), [[2:opacity]] .25s ease;` },
  { id: "anim", lang: "css", group: "Movimento", title: "Animação de entrada (fade-up)", description: "@keyframes + classe pronta; use 'both' para respeitar o atraso.",
    body: `@keyframes fade-up {
  from { opacity: 0; transform: translateY([[1:20px]]); }
  to   { opacity: 1; transform: none; }
}
.[[2:entra]] { animation: fade-up .6s ease-out both; }` },
  { id: "reduced", lang: "css", group: "Movimento", title: "prefers-reduced-motion", description: "Respeita quem prefere menos movimento (acessibilidade).",
    body: `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}` },

  { id: "focus", lang: "css", group: "Acessibilidade", title: "Anel de foco + skip link", description: "Foco visível só no teclado e o link 'pular para o conteúdo'.",
    body: `:focus-visible {
  outline: 3px solid var(--cor-marca, #2f6fed);
  outline-offset: 3px;
}
.skip {
  position: absolute;
  left: 1rem;
  top: -4rem;
  padding: .6rem 1rem;
  background: #000;
  color: #fff;
  z-index: 100;
}
.skip:focus { top: 1rem; }` },
  { id: "sr", lang: "css", group: "Acessibilidade", title: "sr-only (só para leitor de tela)", description: "Esconde visualmente mas mantém para tecnologias assistivas.",
    body: `.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}` },

  { id: "clamp", lang: "css", group: "Tipografia", title: "Tipografia fluida (clamp)", description: "Título que cresce com a tela dentro de limites seguros.",
    body: `h1 { font-size: clamp(2rem, 1.2rem + 4vw, 3.5rem); }
h2 { font-size: clamp(1.5rem, 1rem + 2vw, 2.25rem); }` },
  { id: "truncate", lang: "css", group: "Tipografia", title: "Cortar texto (1 linha / N linhas)", description: "Reticências em uma linha ou limite de linhas.",
    body: `.corta-1 { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.corta-3 {
  display: -webkit-box;
  -webkit-line-clamp: [[1:3]];
  -webkit-box-orient: vertical;
  overflow: hidden;
}` },
  { id: "aspect", lang: "css", group: "Tipografia", title: "Proporção de mídia", description: "Reserva o espaço da imagem/vídeo e evita salto de layout.",
    body: `.[[1:midia]] {
  aspect-ratio: [[2:16 / 9]];
  width: 100%;
  object-fit: cover;
}` },
];

/* ---------- exportação para o formato do VS Code ---------- */
const toVs = (s: string) =>
  s.replace(/\[\[(\d+)(?::([^\]]*))?\]\]/g, (_, n, t) => (t !== undefined ? `\${${n}:${t}}` : `$${n}`));

export const plain = (s: string) =>
  s.replace(/\[\[(\d+)(?::([^\]]*))?\]\]/g, (_, __, t) => t ?? "");

export const prefixes = (id: string) => [`cd-${id}`, `cd${id}`];

export function buildVsJson(lang: "html" | "css" | "all") {
  const out: Record<string, unknown> = {};
  for (const s of vscodeSnippets) {
    if (lang !== "all" && s.lang !== lang) continue;
    out[`cheat/dev: ${s.title}`] = {
      ...(lang === "all" ? { scope: s.lang } : {}),
      prefix: prefixes(s.id),
      body: toVs(s.body).split("\n"),
      description: s.description,
    };
  }
  return JSON.stringify(out, null, 2);
}
