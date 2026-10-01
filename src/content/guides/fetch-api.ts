import { Guide } from "@/lib/types";

const guide: Guide = {
  slug: "consumindo-api-com-fetch",
  title: "Consumindo uma API do zero com fetch",
  summary: "Buscar dados, mostrar 'carregando', tratar erro e exibir a lista — o ciclo completo.",
  level: "intermediário",
  minutes: 10,
  tags: ["js", "fetch", "api", "async"],
  steps: [
    {
      heading: "1. A requisição mais simples",
      text: [
        "fetch() retorna uma Promise que resolve para a resposta bruta. É preciso chamar .json() (que TAMBÉM retorna uma Promise) para ler o corpo como dado utilizável.",
      ],
      code: {
        lang: "js",
        content: `fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((usuarios) => console.log(usuarios));`,
      },
    },
    {
      heading: "2. Reescrevendo com async/await",
      text: ["Faz a mesma coisa, mas lê de cima para baixo como código síncrono — a forma preferida hoje em dia."],
      code: {
        lang: "js",
        content: `async function buscarUsuarios() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const usuarios = await res.json();
  console.log(usuarios);
}
buscarUsuarios();`,
      },
    },
    {
      heading: "3. Tratando erros de verdade",
      text: [
        "Aqui mora uma pegadinha clássica: fetch() só rejeita a Promise em falhas de REDE (sem internet, DNS). Um 404 ou 500 do servidor ainda é uma resposta 'bem-sucedida' para o fetch — por isso sempre confira 'res.ok' manualmente.",
      ],
      code: {
        lang: "js",
        content: `async function buscarUsuarios() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) {
      throw new Error(\`Erro \${res.status}: \${res.statusText}\`);
    }
    const usuarios = await res.json();
    return usuarios;
  } catch (erro) {
    console.error("Falhou ao buscar usuários:", erro.message);
    return [];
  }
}`,
      },
    },
    {
      heading: "4. Estado de carregamento na tela",
      text: [
        "Numa página de verdade, o usuário precisa ver que algo está acontecendo. Mostramos um texto de 'carregando', escondemos ao terminar (com sucesso ou erro).",
      ],
      code: {
        lang: "js",
        content: `const lista = document.querySelector("#lista");
const status = document.querySelector("#status");

async function carregar() {
  status.textContent = "Carregando...";
  lista.innerHTML = "";

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error("Falha na requisição");
    const usuarios = await res.json();

    usuarios.slice(0, 5).forEach((u) => {
      const li = document.createElement("li");
      li.textContent = u.name;
      lista.appendChild(li);
    });
    status.textContent = "";
  } catch (erro) {
    status.textContent = "Não foi possível carregar. Tente novamente.";
  }
}

carregar();`,
      },
      note: "Reparou no padrão? Sempre: mostrar loading → tentar → sucesso (esconder loading, mostrar dado) → erro (esconder loading, mostrar mensagem). Esse é o esqueleto de praticamente toda tela que busca dados.",
    },
  ],
  finalCode: {
    lang: "js",
    label: "Rodar de verdade (faz uma requisição real)",
    content: `async function buscarUsuarios() {
  console.log("Carregando...");
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) throw new Error("Erro " + res.status);
    const usuarios = await res.json();
    usuarios.slice(0, 5).forEach((u) => console.log("-", u.name));
  } catch (erro) {
    console.error("Falhou:", erro.message);
  }
}

await buscarUsuarios();`,
  },
};

export default guide;
