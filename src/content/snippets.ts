import { Snippet } from "@/lib/types";
import { snippetsExtra } from "@/content/snippets-extra";

const style = `<style>
*{box-sizing:border-box}
body{font-family:system-ui,sans-serif;margin:0;padding:20px;background:#0e1013;color:#e8eaec}
</style>`;

const base: Snippet[] = [
  {
    slug: "botoes",
    title: "Botões (primário, secundário, perigo)",
    description: "Três variações de botão prontas, com hover e estado desabilitado.",
    category: "UI básica",
    code: `${style}
<style>
.btn{font:inherit;font-weight:600;font-size:14px;padding:10px 18px;border-radius:8px;border:none;cursor:pointer;transition:filter .15s}
.btn:hover{filter:brightness(1.15)}
.btn:disabled{opacity:.5;cursor:not-allowed;filter:none}
.btn-primario{background:#2f6fed;color:#fff}
.btn-secundario{background:#2a2e33;color:#fff}
.btn-perigo{background:#e4572e;color:#fff}
.row{display:flex;gap:10px;flex-wrap:wrap}
</style>
<div class="row">
  <button class="btn btn-primario">Salvar</button>
  <button class="btn btn-secundario">Cancelar</button>
  <button class="btn btn-perigo">Excluir</button>
  <button class="btn btn-primario" disabled>Desabilitado</button>
</div>`,
  },
  {
    slug: "card-produto",
    title: "Card de produto",
    description: "Card com imagem, título, preço e botão de compra.",
    category: "Cards",
    code: `${style}
<style>
.card{max-width:240px;background:#16191d;border:1px solid #2a2e33;border-radius:14px;overflow:hidden;font-family:system-ui}
.card img{width:100%;height:140px;object-fit:cover;display:block;background:#2a2e33}
.card__body{padding:14px}
.card__titulo{font-weight:600;margin:0 0 4px;font-size:15px}
.card__preco{color:#1f9c7a;font-weight:700;margin:0 0 10px}
.card__btn{width:100%;padding:9px;border:none;border-radius:8px;background:#2f6fed;color:#fff;font-weight:600;cursor:pointer}
.card__btn:hover{background:#1d4ed8}
</style>
<div class="card">
  <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='140'%3E%3Crect width='240' height='140' fill='%232a2e33'/%3E%3C/svg%3E" alt="Produto">
  <div class="card__body">
    <p class="card__titulo">Teclado mecânico RGB</p>
    <p class="card__preco">R$ 349,90</p>
    <button class="card__btn">Adicionar ao carrinho</button>
  </div>
</div>`,
  },
  {
    slug: "modal",
    title: "Modal com overlay",
    description: "Caixa de diálogo centralizada, com fundo escurecido e fechamento por clique fora.",
    category: "Interação",
    code: `${style}
<style>
.abrir{padding:10px 18px;border-radius:8px;border:none;background:#2f6fed;color:#fff;font-weight:600;cursor:pointer}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center}
.overlay.aberto{display:flex}
.modal{background:#16191d;border:1px solid #2a2e33;border-radius:14px;padding:24px;max-width:320px;font-family:system-ui}
.modal h2{margin:0 0 8px;font-size:18px}
.modal p{color:#9aa1a9;font-size:14px;margin:0 0 18px}
.modal .row{display:flex;gap:10px;justify-content:flex-end}
.modal button{padding:8px 16px;border-radius:8px;border:none;font-weight:600;cursor:pointer}
.fechar{background:#2a2e33;color:#fff}
.confirmar{background:#2f6fed;color:#fff}
</style>
<button class="abrir" onclick="document.getElementById('overlay').classList.add('aberto')">Abrir modal</button>
<div class="overlay" id="overlay" onclick="if(event.target===this)this.classList.remove('aberto')">
  <div class="modal">
    <h2>Confirmar ação</h2>
    <p>Tem certeza que deseja continuar? Essa ação não pode ser desfeita.</p>
    <div class="row">
      <button class="fechar" onclick="document.getElementById('overlay').classList.remove('aberto')">Cancelar</button>
      <button class="confirmar" onclick="alert('Confirmado!')">Confirmar</button>
    </div>
  </div>
</div>`,
  },
  {
    slug: "navbar-responsiva",
    title: "Navbar responsiva com menu hambúrguer",
    description: "Vira menu hambúrguer em telas pequenas — redimensione o preview para testar.",
    category: "Navegação",
    code: `${style}
<style>
.nav{display:flex;align-items:center;gap:16px;padding:14px 18px;background:#16191d;border-radius:12px;position:relative}
.nav__logo{font-weight:700}
.nav__links{display:flex;gap:16px;margin-left:auto}
.nav__links a{color:#9aa1a9;text-decoration:none;font-size:14px}
.nav__links a:hover{color:#fff}
.nav__burger{display:none;margin-left:auto;background:none;border:none;color:#fff;font-size:22px;cursor:pointer}
@media (max-width:420px){
  .nav__links{display:none;position:absolute;top:56px;left:0;right:0;flex-direction:column;background:#16191d;padding:14px;border-radius:0 0 12px 12px;gap:12px}
  .nav__links.aberto{display:flex}
  .nav__burger{display:block}
}
</style>
<nav class="nav">
  <span class="nav__logo">Marca</span>
  <div class="nav__links" id="links">
    <a href="#">Início</a><a href="#">Produtos</a><a href="#">Contato</a>
  </div>
  <button class="nav__burger" onclick="document.getElementById('links').classList.toggle('aberto')">☰</button>
</nav>`,
  },
  {
    slug: "acordeao-faq",
    title: "Acordeão de perguntas frequentes",
    description: "Usa <details>/<summary> nativos — funciona sem nenhum JavaScript.",
    category: "Interação",
    code: `${style}
<style>
.faq{max-width:420px;display:flex;flex-direction:column;gap:8px;font-family:system-ui}
.faq details{background:#16191d;border:1px solid #2a2e33;border-radius:10px;padding:12px 16px}
.faq summary{cursor:pointer;font-weight:600;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";float:right;color:#2f6fed}
.faq details[open] summary::after{content:"−"}
.faq p{color:#9aa1a9;font-size:14px;margin:10px 0 0}
</style>
<div class="faq">
  <details open>
    <summary>Preciso saber programar para usar?</summary>
    <p>Não! O objetivo é justamente ajudar quem está aprendendo.</p>
  </details>
  <details>
    <summary>Funciona offline?</summary>
    <p>Sim, as páginas que você já visitou ficam salvas para uso sem internet.</p>
  </details>
  <details>
    <summary>É gratuito?</summary>
    <p>Sim, sem custo nenhum.</p>
  </details>
</div>`,
  },
  {
    slug: "tabela-precos",
    title: "Tabela de preços (3 planos)",
    description: "Layout de pricing com plano em destaque no centro.",
    category: "Marketing",
    code: `${style}
<style>
.planos{display:flex;gap:16px;flex-wrap:wrap;font-family:system-ui}
.plano{flex:1;min-width:160px;background:#16191d;border:1px solid #2a2e33;border-radius:14px;padding:20px;text-align:center}
.plano--destaque{border-color:#2f6fed;background:#161d2e}
.plano h3{margin:0 0 6px;font-size:15px;color:#9aa1a9}
.plano .preco{font-size:26px;font-weight:700;margin:0 0 14px}
.plano .preco span{font-size:13px;font-weight:400;color:#9aa1a9}
.plano ul{list-style:none;padding:0;margin:0 0 16px;font-size:13px;color:#9aa1a9;display:flex;flex-direction:column;gap:6px}
.plano button{width:100%;padding:9px;border:none;border-radius:8px;background:#2a2e33;color:#fff;font-weight:600;cursor:pointer}
.plano--destaque button{background:#2f6fed}
</style>
<div class="planos">
  <div class="plano">
    <h3>Básico</h3>
    <p class="preco">R$19<span>/mês</span></p>
    <ul><li>1 usuário</li><li>5 projetos</li></ul>
    <button>Escolher</button>
  </div>
  <div class="plano plano--destaque">
    <h3>Pro</h3>
    <p class="preco">R$49<span>/mês</span></p>
    <ul><li>5 usuários</li><li>Projetos ilimitados</li></ul>
    <button>Escolher</button>
  </div>
  <div class="plano">
    <h3>Empresa</h3>
    <p class="preco">R$149<span>/mês</span></p>
    <ul><li>Usuários ilimitados</li><li>Suporte prioritário</li></ul>
    <button>Escolher</button>
  </div>
</div>`,
  },
  {
    slug: "toast-notificacao",
    title: "Toast de notificação",
    description: "Aviso temporário que aparece no canto e some sozinho.",
    category: "Feedback",
    code: `${style}
<style>
.btn{padding:10px 18px;border-radius:8px;border:none;background:#2f6fed;color:#fff;font-weight:600;cursor:pointer}
.toast{position:fixed;bottom:20px;right:20px;background:#16191d;border:1px solid #1f9c7a;color:#fff;padding:12px 18px;border-radius:10px;font-family:system-ui;font-size:14px;transform:translateY(20px);opacity:0;transition:all .25s;pointer-events:none}
.toast.mostrar{transform:translateY(0);opacity:1}
</style>
<button class="btn" onclick="mostrarToast()">Salvar alterações</button>
<div class="toast" id="toast">✓ Alterações salvas com sucesso</div>
<script>
function mostrarToast(){
  const t = document.getElementById('toast');
  t.classList.add('mostrar');
  setTimeout(() => t.classList.remove('mostrar'), 2500);
}
</script>`,
  },
  {
    slug: "spinner-carregando",
    title: "Spinner de carregamento",
    description: "Indicador de loading animado, feito só com CSS.",
    category: "Feedback",
    code: `${style}
<style>
.spinner{width:40px;height:40px;border:4px solid #2a2e33;border-top-color:#2f6fed;border-radius:50%;animation:girar 0.8s linear infinite;margin:40px auto}
@keyframes girar{to{transform:rotate(360deg)}}
</style>
<div class="spinner"></div>`,
  },
  {
    slug: "abas-tabs",
    title: "Abas (tabs)",
    description: "Alterna entre painéis de conteúdo sem recarregar a página.",
    category: "Navegação",
    code: `${style}
<style>
.tabs{font-family:system-ui;max-width:360px}
.tabs__nav{display:flex;gap:4px;border-bottom:1px solid #2a2e33}
.tabs__nav button{background:none;border:none;color:#9aa1a9;padding:10px 14px;font-weight:600;cursor:pointer;border-bottom:2px solid transparent}
.tabs__nav button.ativo{color:#fff;border-color:#2f6fed}
.tabs__painel{display:none;padding:16px 4px;color:#9aa1a9;font-size:14px}
.tabs__painel.ativo{display:block}
</style>
<div class="tabs">
  <div class="tabs__nav">
    <button class="ativo" onclick="mudarAba(0)">Descrição</button>
    <button onclick="mudarAba(1)">Especificações</button>
    <button onclick="mudarAba(2)">Avaliações</button>
  </div>
  <div class="tabs__painel ativo">Um teclado mecânico com switches azuis e iluminação RGB.</div>
  <div class="tabs__painel">Layout ABNT2, conexão USB-C, 104 teclas.</div>
  <div class="tabs__painel">★★★★★ — 128 avaliações</div>
</div>
<script>
function mudarAba(i){
  document.querySelectorAll('.tabs__nav button').forEach((b,j)=>b.classList.toggle('ativo', i===j));
  document.querySelectorAll('.tabs__painel').forEach((p,j)=>p.classList.toggle('ativo', i===j));
}
</script>`,
  },
  {
    slug: "dark-mode-toggle",
    title: "Botão de alternar tema (claro/escuro)",
    description: "Troca as variáveis CSS da página inteira ao clicar.",
    category: "UI básica",
    code: `<style>
:root{--bg:#0e1013;--fg:#e8eaec;--card:#16191d}
:root.claro{--bg:#f5f6f8;--fg:#14171a;--card:#fff}
*{box-sizing:border-box}
body{font-family:system-ui,sans-serif;background:var(--bg);color:var(--fg);margin:0;padding:30px;transition:background .2s,color .2s}
.card{background:var(--card);border-radius:14px;padding:20px;max-width:280px}
button{padding:9px 16px;border-radius:8px;border:none;background:#2f6fed;color:#fff;font-weight:600;cursor:pointer}
</style>
<div class="card">
  <p>Este card respeita o tema atual.</p>
  <button onclick="document.documentElement.classList.toggle('claro')">Alternar tema</button>
</div>`,
  },
];

export const snippets: Snippet[] = [...base, ...snippetsExtra];

export function getSnippet(slug: string) {
  return snippets.find((s) => s.slug === slug);
}
