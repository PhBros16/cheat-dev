import { Recipe } from "@/lib/types";

const RESET = `*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; color: #14171a; }\n`;

export const recipes: Recipe[] = [
  {
    slug: "centralizar-div", title: "Como centralizar uma div (horizontal e vertical)", level: "iniciante", tags: ["css", "layout", "grid"],
    summary: "A forma mais curta e confiável de centralizar qualquer coisa no meio da tela.",
    project: { html: `<div class="tela">\n  <div class="caixa">Centralizado!</div>\n</div>`, js: "",
      css: RESET + `.tela {\n  display: grid;\n  place-items: center;   /* centro horizontal e vertical */\n  min-height: 100dvh;\n  background: #f3f4f6;\n}\n.caixa { padding: 32px 48px; background: #2f6fed; color: #fff; border-radius: 14px; font-weight: 700; }` },
    how: ["display: grid no pai e place-items: center centralizam os filhos nos dois eixos com duas linhas.", "min-height: 100dvh dá ao pai a altura da tela; sem altura, não há espaço vertical para centralizar.", "Alternativa com flex: display:flex; justify-content:center; align-items:center. Só horizontal em bloco com largura: margin-inline: auto."],
  },
  {
    slug: "menu-fixo-no-topo", title: "Como fazer um menu fixo no topo com efeito de vidro", level: "iniciante", tags: ["css", "navbar", "sticky"],
    summary: "Cabeçalho que acompanha a rolagem, com fundo translúcido e desfoque.",
    project: { html: `<header class="topo">\n  <strong>MinhaMarca</strong>\n  <nav><a href="#a">Início</a><a href="#b">Serviços</a><a href="#c">Contato</a></nav>\n</header>\n<main>\n  <section id="a"><h1>Role a página</h1><p>O menu fica no topo.</p></section>\n  <section id="b"><h2>Serviços</h2><p>Conteúdo longo...</p></section>\n  <section id="c"><h2>Contato</h2><p>Conteúdo longo...</p></section>\n</main>`, js: "",
      css: RESET + `.topo {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 14px 24px;\n  background: rgb(255 255 255 / .75);\n  backdrop-filter: blur(10px);\n  border-bottom: 1px solid #e5e7eb;\n}\nnav { display: flex; gap: 20px; }\na { text-decoration: none; color: inherit; font-weight: 600; }\nsection { min-height: 80vh; padding: 48px 24px; }\nhtml { scroll-behavior: smooth; }\nsection { scroll-margin-top: 70px; } /* o título não fica atrás do menu */` },
    how: ["position: sticky + top: 0 gruda o cabeçalho sem tirá-lo do fluxo (não precisa de padding extra no corpo, como no fixed).", "O fundo semitransparente com backdrop-filter dá o efeito vidro; sem um fundo atrás, o desfoque não aparece.", "scroll-margin-top evita que o título da seção fique escondido atrás do menu ao clicar nos links."],
  },
  {
    slug: "modal-com-dialog", title: "Como criar um modal (janela) com a tag dialog", level: "iniciante", tags: ["html", "javascript", "modal", "acessibilidade"],
    summary: "Modal nativo: foco, tecla ESC e fundo escurecido já vêm prontos.",
    project: { html: `<button id="abrir">Abrir modal</button>\n\n<dialog id="modal">\n  <h2>Tem certeza?</h2>\n  <p>Essa ação não pode ser desfeita.</p>\n  <form method="dialog">\n    <button value="cancelar">Cancelar</button>\n    <button value="ok" class="primario">Confirmar</button>\n  </form>\n</dialog>`,
      css: RESET + `body { display: grid; place-items: center; min-height: 100dvh; }\nbutton { padding: 10px 18px; border-radius: 8px; border: 1px solid #d1d5db; background: #fff; font: inherit; cursor: pointer; }\n.primario { background: #2f6fed; border-color: #2f6fed; color: #fff; }\ndialog { border: 0; border-radius: 16px; padding: 28px; box-shadow: 0 20px 60px rgb(0 0 0 / .3); }\ndialog::backdrop { background: rgb(0 0 0 / .5); backdrop-filter: blur(3px); }\ndialog form { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; }`,
      js: `const modal = document.getElementById('modal');\ndocument.getElementById('abrir').onclick = () => modal.showModal();\nmodal.addEventListener('close', () => console.log('Resultado:', modal.returnValue));` },
    how: ["showModal() abre o dialog por cima de tudo, prende o foco dentro dele e fecha com ESC, sem nenhuma biblioteca.", "Um <form method=\"dialog\"> fecha o modal ao enviar e devolve o value do botão em modal.returnValue.", "O fundo escurecido é estilizado com ::backdrop."],
  },
  {
    slug: "modo-escuro-com-botao", title: "Como fazer modo escuro com botão (e lembrar a escolha)", level: "intermediário", tags: ["css", "javascript", "tema", "variáveis"],
    summary: "Segue o tema do sistema por padrão e deixa o usuário trocar manualmente.",
    project: { html: `<header><h1>Meu site</h1><button id="tema" aria-label="Alternar tema">🌙</button></header>\n<p>O tema segue o sistema, mas você pode trocar no botão.</p>`,
      css: `:root { --bg: #ffffff; --texto: #14171a; }\n@media (prefers-color-scheme: dark) { :root:not([data-tema="claro"]) { --bg: #0e1013; --texto: #e8eaec; } }\n:root[data-tema="escuro"] { --bg: #0e1013; --texto: #e8eaec; }\nbody { margin: 0; padding: 24px; font-family: system-ui; background: var(--bg); color: var(--texto); transition: background .3s, color .3s; }\nheader { display: flex; justify-content: space-between; align-items: center; }\nbutton { font-size: 22px; background: none; border: 1px solid currentColor; border-radius: 10px; padding: 6px 12px; cursor: pointer; color: inherit; }`,
      js: `const raiz = document.documentElement;\nconst salvo = localStorage.getItem('tema');\nif (salvo) raiz.dataset.tema = salvo;\n\ndocument.getElementById('tema').onclick = () => {\n  const escuroAgora = getComputedStyle(raiz).getPropertyValue('--bg').trim() === '#0e1013';\n  const novo = escuroAgora ? 'claro' : 'escuro';\n  raiz.dataset.tema = novo;\n  localStorage.setItem('tema', novo);\n};` },
    how: ["Cores viram variáveis CSS no :root; trocar o tema é só trocar o valor das variáveis.", "A media query prefers-color-scheme aplica o tema do sistema; o atributo data-tema no <html> tem prioridade quando o usuário escolhe.", "localStorage guarda a escolha. No Lab ele funciona em memória; no seu site, persiste de verdade."],
  },
  {
    slug: "card-com-hover", title: "Como fazer um card que sobe e brilha no hover", level: "iniciante", tags: ["css", "card", "transição"],
    summary: "Card com elevação suave, sombra em camadas e zoom contido na imagem.",
    project: { html: `<article class="card">\n  <div class="img"><div class="foto"></div></div>\n  <div class="corpo"><h3>Título do card</h3><p>Um resumo curto do conteúdo aparece aqui.</p><a href="#">Saiba mais →</a></div>\n</article>`, js: "",
      css: RESET + `body { display: grid; place-items: center; min-height: 100dvh; background: #f3f4f6; }\n.card { width: 300px; background: #fff; border-radius: 16px; overflow: hidden;\n  box-shadow: 0 1px 2px rgb(0 0 0 / .08), 0 4px 12px rgb(0 0 0 / .06);\n  transition: transform .25s cubic-bezier(.22, 1, .36, 1), box-shadow .25s; }\n.card:hover { transform: translateY(-6px); box-shadow: 0 8px 16px rgb(0 0 0 / .1), 0 24px 48px rgb(0 0 0 / .16); }\n.img { overflow: hidden; }\n.foto { height: 160px; background: linear-gradient(135deg, #2f6fed, #7c3aed); transition: transform .5s ease; }\n.card:hover .foto { transform: scale(1.08); }\n.corpo { padding: 18px; }\n.corpo h3 { margin: 0 0 6px; }\n.corpo p { margin: 0 0 12px; color: #6b7280; }\n.corpo a { color: #2f6fed; font-weight: 700; text-decoration: none; }\n@media (prefers-reduced-motion: reduce) { .card, .foto { transition: none; } }` },
    how: ["A transição fica no estado normal (não no :hover), então vale na ida e na volta.", "Só transform e box-shadow mudam: são baratos para o navegador animar.", "O overflow: hidden no contêiner da imagem impede que o zoom vaze para fora das bordas arredondadas."],
  },
  {
    slug: "galeria-de-cards-responsiva", title: "Como fazer uma grade de cards responsiva sem media query", level: "iniciante", tags: ["css", "grid", "responsivo"],
    summary: "As colunas aparecem e somem sozinhas conforme a largura da tela.",
    project: { html: `<div class="grade">\n  <div class="item">1</div><div class="item">2</div><div class="item">3</div>\n  <div class="item">4</div><div class="item">5</div><div class="item">6</div>\n</div>`, js: "",
      css: RESET + `body { padding: 24px; }\n.grade {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));\n  gap: 16px;\n}\n.item { display: grid; place-items: center; min-height: 120px; border-radius: 14px; background: linear-gradient(135deg, #2f6fed, #7c3aed); color: #fff; font: 800 28px system-ui; }` },
    how: ["repeat(auto-fit, minmax(220px, 1fr)) diz: tantas colunas quanto couberem, cada uma com no mínimo 220px.", "min(100%, 220px) evita que a coluna estoure em telas mais estreitas que 220px.", "Teste no Lab trocando o tamanho da tela: as colunas mudam sem nenhuma media query."],
  },
  {
    slug: "botao-com-loading", title: "Como fazer um botão com estado de carregamento", level: "intermediário", tags: ["css", "javascript", "botão"],
    summary: "Botão que mostra um spinner e bloqueia cliques duplicados enquanto processa.",
    project: { html: `<button id="salvar" class="btn"><span class="spin" aria-hidden="true"></span><span class="txt">Salvar</span></button>`,
      css: RESET + `body { display: grid; place-items: center; min-height: 100dvh; }\n.btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 26px; border: 0; border-radius: 10px; background: #2f6fed; color: #fff; font: 700 16px system-ui; cursor: pointer; }\n.spin { display: none; width: 16px; height: 16px; border: 2.5px solid rgb(255 255 255 / .4); border-top-color: #fff; border-radius: 50%; animation: gira .7s linear infinite; }\n.btn[aria-busy="true"] .spin { display: block; }\n.btn[aria-busy="true"] { opacity: .8; cursor: progress; }\n@keyframes gira { to { transform: rotate(360deg); } }`,
      js: `const btn = document.getElementById('salvar');\nconst txt = btn.querySelector('.txt');\n\nbtn.addEventListener('click', async () => {\n  if (btn.getAttribute('aria-busy') === 'true') return; // evita clique duplo\n  btn.setAttribute('aria-busy', 'true');\n  btn.disabled = true;\n  txt.textContent = 'Salvando…';\n  await new Promise((r) => setTimeout(r, 1800)); // simula a requisição\n  btn.removeAttribute('aria-busy');\n  btn.disabled = false;\n  txt.textContent = 'Salvo ✓';\n  console.log('Requisição concluída');\n});` },
    how: ["O estado é guardado no atributo aria-busy: o CSS reage a ele e leitores de tela também.", "disabled + a checagem no início do handler impedem cliques duplos enquanto a requisição roda.", "Troque o setTimeout pelo seu fetch() de verdade; o resto do fluxo continua igual."],
  },
  {
    slug: "tooltip-so-com-css", title: "Como fazer um tooltip só com CSS", level: "iniciante", tags: ["css", "tooltip", "atributos"],
    summary: "Dica que aparece no hover e no foco do teclado, lendo o texto de um atributo.",
    project: { html: `<p>Passe o mouse ou use Tab no <button class="tip" data-tip="Texto da dica aparece aqui" type="button">botão com dica</button>.</p>`, js: "",
      css: RESET + `body { padding: 80px 24px; }\n.tip { position: relative; padding: 8px 14px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff; font: inherit; cursor: help; }\n.tip::after {\n  content: attr(data-tip);\n  position: absolute; left: 50%; bottom: calc(100% + 10px);\n  translate: -50% 4px;\n  padding: 6px 10px; border-radius: 8px;\n  background: #14171a; color: #fff; font-size: 13px; white-space: nowrap;\n  opacity: 0; pointer-events: none;\n  transition: opacity .2s, translate .2s;\n}\n.tip:hover::after, .tip:focus-visible::after { opacity: 1; translate: -50% 0; }` },
    how: ["content: attr(data-tip) no ::after lê o texto do atributo HTML, sem JavaScript.", ":focus-visible faz a dica aparecer também para quem navega por teclado.", "pointer-events: none impede que o tooltip invisível atrapalhe cliques."],
  },
  {
    slug: "faq-acordeao", title: "Como fazer um FAQ (acordeão) com details", level: "iniciante", tags: ["html", "css", "acessibilidade"],
    summary: "Abre e fecha sem JavaScript, acessível por teclado e leitor de tela.",
    project: { html: `<section class="faq">\n  <details open><summary>Como funciona?</summary><p>A tag details abre e fecha sozinha.</p></details>\n  <details><summary>Preciso de JavaScript?</summary><p>Não. Funciona com HTML puro.</p></details>\n  <details><summary>Dá para estilizar?</summary><p>Sim, inclusive a setinha e a animação.</p></details>\n</section>`, js: "",
      css: RESET + `body { padding: 32px 16px; background: #f3f4f6; }\n.faq { max-width: 560px; margin: auto; display: grid; gap: 10px; }\ndetails { background: #fff; border-radius: 12px; padding: 0 18px; box-shadow: 0 1px 3px rgb(0 0 0 / .08); }\nsummary { padding: 16px 0; font-weight: 700; cursor: pointer; list-style: none; display: flex; justify-content: space-between; }\nsummary::-webkit-details-marker { display: none; }\nsummary::after { content: "+"; font-size: 22px; line-height: 1; transition: rotate .2s; }\ndetails[open] summary::after { rotate: 45deg; }\ndetails p { margin: 0 0 16px; color: #4b5563; }` },
    how: ["details/summary é um acordeão nativo: teclado (Enter/Espaço) e leitores de tela já funcionam.", "O marcador padrão é removido e substituído por um + que gira 45° (vira ×) quando aberto.", "Para abrir um por vez, dê o mesmo atributo name aos details (suporte em navegadores atuais)."],
  },
  {
    slug: "abas-tabs", title: "Como fazer abas (tabs) acessíveis", level: "intermediário", tags: ["html", "javascript", "css", "acessibilidade"],
    summary: "Troca de painéis com roles ARIA e navegação pelas setas do teclado.",
    project: { html: `<div class="abas">\n  <div role="tablist" aria-label="Seções">\n    <button role="tab" aria-selected="true" aria-controls="p1" id="t1">Perfil</button>\n    <button role="tab" aria-selected="false" aria-controls="p2" id="t2" tabindex="-1">Conta</button>\n    <button role="tab" aria-selected="false" aria-controls="p3" id="t3" tabindex="-1">Plano</button>\n  </div>\n  <div role="tabpanel" id="p1" aria-labelledby="t1">Conteúdo do perfil.</div>\n  <div role="tabpanel" id="p2" aria-labelledby="t2" hidden>Dados da conta.</div>\n  <div role="tabpanel" id="p3" aria-labelledby="t3" hidden>Seu plano atual.</div>\n</div>`,
      css: RESET + `body { padding: 32px 16px; }\n.abas { max-width: 520px; margin: auto; }\n[role=tablist] { display: flex; gap: 4px; border-bottom: 2px solid #e5e7eb; }\n[role=tab] { padding: 10px 18px; border: 0; background: none; font: 600 15px system-ui; color: #6b7280; cursor: pointer; border-bottom: 3px solid transparent; margin-bottom: -2px; }\n[role=tab][aria-selected=true] { color: #2f6fed; border-color: #2f6fed; }\n[role=tabpanel] { padding: 20px 4px; }`,
      js: `const abas = [...document.querySelectorAll('[role=tab]')];\nfunction ativar(aba) {\n  abas.forEach((t) => {\n    const on = t === aba;\n    t.setAttribute('aria-selected', on);\n    t.tabIndex = on ? 0 : -1;\n    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;\n  });\n  aba.focus();\n}\nabas.forEach((t, i) => {\n  t.onclick = () => ativar(t);\n  t.onkeydown = (e) => {\n    if (e.key === 'ArrowRight') ativar(abas[(i + 1) % abas.length]);\n    if (e.key === 'ArrowLeft') ativar(abas[(i - 1 + abas.length) % abas.length]);\n  };\n});` },
    how: ["Os papéis ARIA (tablist, tab, tabpanel) dizem aos leitores de tela que isso é um conjunto de abas.", "Só a aba ativa fica no ciclo do Tab (tabindex 0); as setas ← → movem entre as outras: é o padrão esperado.", "O atributo hidden esconde os painéis inativos sem precisar de classe."],
  },
  {
    slug: "skeleton-loading", title: "Como fazer um skeleton loading (placeholder animado)", level: "iniciante", tags: ["css", "animação", "loading"],
    summary: "Blocos cinza pulsando enquanto o conteúdo real carrega.",
    project: { html: `<div class="card">\n  <div class="sk avatar"></div>\n  <div class="linhas"><div class="sk l1"></div><div class="sk l2"></div><div class="sk l3"></div></div>\n</div>`, js: "",
      css: RESET + `body { display: grid; place-items: center; min-height: 100dvh; background: #f3f4f6; }\n.card { display: flex; gap: 16px; width: 340px; padding: 20px; background: #fff; border-radius: 16px; }\n.linhas { flex: 1; display: grid; gap: 10px; align-content: center; }\n.sk { background: linear-gradient(90deg, #eceef1 25%, #f7f8fa 50%, #eceef1 75%) 0 0 / 200% 100%; border-radius: 8px; animation: brilho 1.4s linear infinite; }\n.avatar { width: 56px; height: 56px; border-radius: 50%; }\n.l1 { height: 14px; width: 80%; } .l2 { height: 12px; } .l3 { height: 12px; width: 55%; }\n@keyframes brilho { to { background-position: -200% 0; } }\n@media (prefers-reduced-motion: reduce) { .sk { animation: none; } }` },
    how: ["Um gradiente com o dobro da largura (200%) desliza com background-position, criando o brilho que passa.", "Use as mesmas dimensões do conteúdo real: assim a página não 'pula' quando os dados chegam.", "Troque os blocos pelo conteúdo real quando o fetch terminar."],
  },
  {
    slug: "carrossel-com-scroll-snap", title: "Como fazer um carrossel sem JavaScript", level: "intermediário", tags: ["css", "scroll-snap", "carrossel"],
    summary: "Slider que desliza por toque ou arrasto e encaixa em cada slide.",
    project: { html: `<div class="trilho">\n  <div class="slide s1">1</div><div class="slide s2">2</div><div class="slide s3">3</div><div class="slide s4">4</div>\n</div>`, js: "",
      css: RESET + `body { padding: 24px 0; }\n.trilho { display: flex; gap: 14px; padding: 0 24px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 24px; scrollbar-width: none; }\n.slide { flex: 0 0 80%; max-width: 420px; height: 220px; display: grid; place-items: center; border-radius: 18px; color: #fff; font: 800 48px system-ui; scroll-snap-align: start; }\n.s1 { background: #2f6fed; } .s2 { background: #7c3aed; } .s3 { background: #e4572e; } .s4 { background: #1f9c7a; }` },
    how: ["scroll-snap-type no trilho e scroll-snap-align em cada slide fazem a rolagem encaixar.", "flex: 0 0 80% deixa o próximo slide aparecer pela borda, sinal visual de que dá para deslizar.", "Para setas e pontinhos, adicione JS com scrollBy() ou scrollIntoView({behavior:'smooth'})."],
  },
  {
    slug: "revelar-ao-rolar", title: "Como animar elementos ao rolar a página", level: "intermediário", tags: ["javascript", "css", "animação", "scroll"],
    summary: "Seções que aparecem suavemente quando entram na tela, com IntersectionObserver.",
    project: { html: `<section class="bloco"><h2>Role para baixo ↓</h2></section>\n<section class="bloco revela"><h2>Bloco 1</h2><p>Apareceu!</p></section>\n<section class="bloco revela"><h2>Bloco 2</h2><p>Também apareceu.</p></section>\n<section class="bloco revela"><h2>Bloco 3</h2><p>E este também.</p></section>`,
      css: RESET + `.bloco { min-height: 70vh; display: grid; place-content: center; text-align: center; padding: 24px; }\n.revela { opacity: 0; transform: translateY(40px); transition: opacity .7s ease, transform .7s cubic-bezier(.22, 1, .36, 1); }\n.revela.visivel { opacity: 1; transform: none; }\n@media (prefers-reduced-motion: reduce) { .revela { opacity: 1; transform: none; transition: none; } }`,
      js: `const obs = new IntersectionObserver((entradas) => {\n  entradas.forEach((e) => {\n    if (e.isIntersecting) {\n      e.target.classList.add('visivel');\n      obs.unobserve(e.target); // anima só uma vez\n    }\n  });\n}, { threshold: 0.2 });\n\ndocument.querySelectorAll('.revela').forEach((el) => obs.observe(el));` },
    how: ["IntersectionObserver avisa quando um elemento entra na tela, sem ouvir o evento scroll (bem mais leve).", "A classe .visivel dispara a transição CSS; o estado inicial (invisível, deslocado) fica na classe .revela.", "unobserve() faz a animação rodar uma única vez por elemento."],
  },
];

export const getRecipe = (slug: string) => recipes.find((r) => r.slug === slug);

export function recipeDoc(p: Recipe["project"]) {
  return `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<style>\n${p.css}\n</style>\n</head>\n<body>\n${p.html}\n${p.js.trim() ? `<script>\n${p.js}\n</script>\n` : ""}</body>\n</html>`;
}
