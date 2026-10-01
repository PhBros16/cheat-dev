import { Guide } from "@/lib/types";

const guide: Guide = {
  slug: "formulario-de-login",
  title: "Formulário de login completo, do zero",
  summary: "HTML semântico, CSS bonito e validação em JavaScript — sem nenhuma biblioteca.",
  level: "iniciante",
  minutes: 15,
  tags: ["html", "css", "js", "formulário"],
  steps: [
    {
      heading: "1. A estrutura HTML",
      text: [
        "Todo formulário de login precisa, no mínimo, de um campo de e-mail, um de senha e um botão. Vamos usar <form>, <label> (sempre!) e os tipos certos de <input> para ganhar validação e teclado corretos de graça.",
      ],
      code: {
        lang: "html",
        content: `<form class="login" novalidate>
  <h1>Entrar</h1>

  <div class="campo">
    <label for="email">E-mail</label>
    <input id="email" name="email" type="email" required />
    <span class="erro" data-erro="email"></span>
  </div>

  <div class="campo">
    <label for="senha">Senha</label>
    <input id="senha" name="senha" type="password" minlength="6" required />
    <span class="erro" data-erro="senha"></span>
  </div>

  <button type="submit">Entrar</button>
</form>`,
      },
      note: "'novalidate' desliga a validação padrão do navegador — vamos fazer a nossa própria em JS, com mensagens customizadas.",
    },
    {
      heading: "2. Estilizando com CSS",
      text: [
        "Um formulário centralizado, com espaçamento respirável e um botão que dá feedback visual no hover. Nada de framework — só flexbox e algumas variáveis.",
      ],
      code: {
        lang: "css",
        content: `.login {
  max-width: 340px;
  margin: 40px auto;
  padding: 32px;
  border-radius: 16px;
  background: #16191d;
  border: 1px solid #2a2e33;
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-family: system-ui, sans-serif;
}

.login h1 {
  margin: 0 0 4px;
  color: #fff;
  font-size: 22px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo label {
  font-size: 13px;
  color: #9aa1a9;
}

.campo input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #2a2e33;
  background: #0e1013;
  color: #fff;
  font-size: 14px;
}

.campo input:focus {
  outline: 2px solid #2f6fed;
  outline-offset: 1px;
}

.campo input.invalido {
  border-color: #e4572e;
}

.erro {
  min-height: 16px;
  font-size: 12px;
  color: #e4572e;
}

.login button {
  padding: 11px;
  border: none;
  border-radius: 8px;
  background: #2f6fed;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.login button:hover {
  background: #1d4ed8;
}`,
      },
    },
    {
      heading: "3. Validação em JavaScript",
      text: [
        "Escutamos o evento 'submit', prevenimos o comportamento padrão (que recarregaria a página) e checamos cada campo manualmente — assim controlamos exatamente a mensagem de erro exibida.",
      ],
      code: {
        lang: "js",
        content: `const form = document.querySelector(".login");

function mostrarErro(campo, mensagem) {
  const input = form.querySelector(\`[name="\${campo}"]\`);
  const spanErro = form.querySelector(\`[data-erro="\${campo}"]\`);
  input.classList.toggle("invalido", Boolean(mensagem));
  spanErro.textContent = mensagem || "";
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const email = form.email.value.trim();
  const senha = form.senha.value;
  let valido = true;

  if (!email.includes("@")) {
    mostrarErro("email", "Digite um e-mail válido");
    valido = false;
  } else {
    mostrarErro("email", "");
  }

  if (senha.length < 6) {
    mostrarErro("senha", "A senha precisa ter pelo menos 6 caracteres");
    valido = false;
  } else {
    mostrarErro("senha", "");
  }

  if (valido) {
    console.log("Login OK, enviando para o servidor...", { email });
    // aqui entraria o fetch() de verdade para sua API
  }
});`,
      },
      note: "Em produção, a validação real de credenciais sempre acontece no servidor — isso aqui só evita enviar dados obviamente incompletos.",
    },
  ],
  finalCode: {
    lang: "html",
    label: "Testar o formulário completo",
    content: `<style>
* { box-sizing: border-box; }
.login {
  max-width: 340px;
  margin: 20px auto;
  padding: 28px;
  border-radius: 16px;
  background: #16191d;
  border: 1px solid #2a2e33;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: system-ui, sans-serif;
}
.login h1 { margin: 0; color: #fff; font-size: 20px; }
.campo { display: flex; flex-direction: column; gap: 6px; }
.campo label { font-size: 13px; color: #9aa1a9; }
.campo input {
  padding: 10px 12px; border-radius: 8px; border: 1px solid #2a2e33;
  background: #0e1013; color: #fff; font-size: 14px;
}
.campo input:focus { outline: 2px solid #2f6fed; outline-offset: 1px; }
.campo input.invalido { border-color: #e4572e; }
.erro { min-height: 14px; font-size: 12px; color: #e4572e; }
.login button {
  padding: 10px; border: none; border-radius: 8px; background: #2f6fed;
  color: white; font-weight: 600; cursor: pointer;
}
.login button:hover { background: #1d4ed8; }
</style>
<form class="login" novalidate>
  <h1>Entrar</h1>
  <div class="campo">
    <label for="email">E-mail</label>
    <input id="email" name="email" type="email" />
    <span class="erro" data-erro="email"></span>
  </div>
  <div class="campo">
    <label for="senha">Senha</label>
    <input id="senha" name="senha" type="password" />
    <span class="erro" data-erro="senha"></span>
  </div>
  <button type="submit">Entrar</button>
</form>
<script>
const form = document.querySelector(".login");
function mostrarErro(campo, msg) {
  form.querySelector(\`[name="\${campo}"]\`).classList.toggle("invalido", Boolean(msg));
  form.querySelector(\`[data-erro="\${campo}"]\`).textContent = msg || "";
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  if (!form.email.value.includes("@")) { mostrarErro("email", "Digite um e-mail válido"); ok = false; }
  else mostrarErro("email", "");
  if (form.senha.value.length < 6) { mostrarErro("senha", "Mínimo 6 caracteres"); ok = false; }
  else mostrarErro("senha", "");
  if (ok) mostrarErro("email", "") , alert("Login válido! (isso é só uma demo)");
});
</script>`,
  },
};

export default guide;
