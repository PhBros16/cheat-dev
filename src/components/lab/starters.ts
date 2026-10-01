import type { Project } from "./doc";

export type Starter = { id: string; title: string; project: Project };

const PAGE = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Meu teste</title>
</head>
<body>
  <main class="container">
    [[CONTENT]]
  </main>
</body>
</html>`;
const page = (c: string) => PAGE.replace("[[CONTENT]]", c);

const BASE_CSS = `*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; line-height: 1.6; color: #14171a; }
.container { width: min(100% - 2rem, 1000px); margin-inline: auto; padding-block: 2rem; }
`;

export const STARTERS: Starter[] = [
  { id: "blank", title: "Em branco (HTML5)", project: {
    html: page(`<h1>Olá, mundo!</h1>
    <p>Edite à esquerda e veja o resultado ao lado.</p>`),
    css: BASE_CSS, js: "" } },
  { id: "flex", title: "Laboratório de Flexbox", project: {
    html: `<div class="linha">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>`,
    css: `/* Mude as propriedades do container e veja o efeito */
.linha {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-height: 240px;
  padding: 16px;
  border: 2px dashed #9ca3af;
  border-radius: 12px;
}
.item {
  flex: 1 1 120px;
  padding: 24px;
  background: #dbeafe;
  border: 2px solid #2f6fed;
  border-radius: 10px;
  text-align: center;
  font: 700 20px system-ui;
}
body { margin: 24px; font-family: system-ui; }`, js: "" } },
  { id: "grid", title: "Laboratório de Grid responsivo", project: {
    html: `<div class="grade">
  <article class="card">1</article>
  <article class="card">2</article>
  <article class="card">3</article>
  <article class="card">4</article>
  <article class="card">5</article>
  <article class="card">6</article>
</div>`,
    css: `/* Redimensione a tela de preview: as colunas se ajustam sozinhas */
.grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}
.card {
  display: grid;
  place-items: center;
  min-height: 120px;
  border-radius: 14px;
  background: linear-gradient(135deg, #2f6fed, #7c3aed);
  color: #fff;
  font: 800 28px system-ui;
}
body { margin: 24px; }`, js: "" } },
  { id: "anim", title: "Laboratório de transições e animações", project: {
    html: `<button class="botao">Passe o mouse</button>
<div class="bola"></div>`,
    css: `body { margin: 0; min-height: 100dvh; display: grid; place-content: center; gap: 48px; justify-items: center; font-family: system-ui; background: #0e1013; }

.botao {
  padding: 14px 28px;
  border: 0;
  border-radius: 12px;
  background: #2f6fed;
  color: #fff;
  font: 700 16px system-ui;
  cursor: pointer;
  transition: transform .25s cubic-bezier(.34, 1.56, .64, 1), box-shadow .25s;
}
.botao:hover  { transform: translateY(-4px) scale(1.05); box-shadow: 0 12px 28px rgb(47 111 237 / .5); }
.botao:active { transform: scale(.97); }

.bola {
  width: 56px; height: 56px; border-radius: 50%;
  background: #e4572e;
  animation: quica 1s ease-in-out infinite alternate;
}
@keyframes quica { to { transform: translateY(-60px); } }

@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`, js: "" } },
  { id: "form", title: "Formulário estilizado com validação", project: {
    html: `<form class="form" id="form">
  <h1>Criar conta</h1>
  <label>Nome <input name="nome" required minlength="3"></label>
  <label>E-mail <input name="email" type="email" required></label>
  <label>Senha <input name="senha" type="password" required minlength="8"></label>
  <button>Cadastrar</button>
  <p id="msg" role="status"></p>
</form>`,
    css: `body { margin: 0; min-height: 100dvh; display: grid; place-items: center; font-family: system-ui; background: #f3f4f6; }
.form { width: min(100% - 2rem, 380px); display: grid; gap: 14px; padding: 28px; background: #fff; border-radius: 16px; box-shadow: 0 8px 30px rgb(0 0 0 / .1); }
label { display: grid; gap: 6px; font-weight: 600; font-size: 14px; }
input { padding: 11px 12px; border: 1.5px solid #d1d5db; border-radius: 8px; font: inherit; }
input:focus-visible { outline: 3px solid rgb(47 111 237 / .35); border-color: #2f6fed; }
input:user-invalid { border-color: #dc2626; }
button { padding: 12px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; font-weight: 700; cursor: pointer; }
#msg { margin: 0; color: #15803d; font-weight: 600; }`,
    js: `document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(e.target));
  console.log('Enviado:', dados);
  document.getElementById('msg').textContent = 'Conta criada para ' + dados.nome + '!';
});` } },
  { id: "js", title: "JavaScript: lista de tarefas", project: {
    html: `<div class="app">
  <h1>Tarefas</h1>
  <form id="f"><input id="t" placeholder="Nova tarefa" autocomplete="off"><button>Adicionar</button></form>
  <ul id="lista"></ul>
</div>`,
    css: `body { font-family: system-ui; display: grid; place-items: start center; padding: 32px 16px; background: #f3f4f6; }
.app { width: min(100%, 420px); background: #fff; padding: 24px; border-radius: 16px; box-shadow: 0 8px 30px rgb(0 0 0 / .08); }
form { display: flex; gap: 8px; }
input { flex: 1; padding: 10px; border: 1.5px solid #d1d5db; border-radius: 8px; font: inherit; }
button { padding: 10px 14px; border: 0; border-radius: 8px; background: #2f6fed; color: #fff; font-weight: 700; cursor: pointer; }
ul { list-style: none; padding: 0; margin: 16px 0 0; display: grid; gap: 8px; }
li { display: flex; justify-content: space-between; padding: 10px 12px; background: #f9fafb; border-radius: 8px; }
li.feita span { text-decoration: line-through; color: #9ca3af; }`,
    js: `const lista = document.getElementById('lista');
const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]'); // localStorage funciona aqui (em memória)

function render() {
  lista.innerHTML = '';
  tarefas.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = t.feita ? 'feita' : '';
    li.innerHTML = '<span></span><button aria-label="Remover">✕</button>';
    li.querySelector('span').textContent = t.texto;
    li.querySelector('span').onclick = () => { t.feita = !t.feita; salvar(); };
    li.querySelector('button').onclick = () => { tarefas.splice(i, 1); salvar(); };
    lista.append(li);
  });
}
function salvar() { localStorage.setItem('tarefas', JSON.stringify(tarefas)); render(); }

document.getElementById('f').addEventListener('submit', (e) => {
  e.preventDefault();
  const campo = document.getElementById('t');
  if (!campo.value.trim()) return;
  tarefas.push({ texto: campo.value.trim(), feita: false });
  campo.value = '';
  salvar();
  console.log('Total de tarefas:', tarefas.length);
});
render();` } },
];
