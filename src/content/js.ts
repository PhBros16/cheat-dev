import { Language } from "@/lib/types";

const js: Language = {
  slug: "js",
  title: "JavaScript",
  short: "A linguagem de programação da web",
  tagline: "O que dá comportamento e interatividade à página.",
  color: "#C9A227",
  codeLang: "javascript",
  categories: [
    {
      slug: "arrays-strings",
      title: "Arrays & Strings",
      description:
        "Os métodos que você vai usar todo dia para transformar listas de dados e textos.",
      entries: [
        {
          slug: "map",
          title: "array.map()",
          summary: "Transforma cada item de um array e retorna um novo array.",
          syntax: `const novoArray = array.map((item, index) => {\n  return novoValor;\n});`,
          description: [
            "Percorre o array original e retorna um array NOVO, do mesmo tamanho, com o resultado da função aplicada a cada item. Não modifica o array original.",
          ],
          examples: [
            {
              code: `const precos = [10, 20, 30];
const comDesconto = precos.map((preco) => preco * 0.9);
// [9, 18, 27]`,
            },
            {
              code: `const usuarios = [{ nome: "Ana" }, { nome: "Bia" }];
const nomes = usuarios.map((u) => u.nome);
// ["Ana", "Bia"]`,
              caption: "Extraindo só um campo de uma lista de objetos",
            },
          ],
          useWhen: ["Transformar cada item de uma lista em outro valor, mantendo a mesma quantidade"],
          avoidWhen: ["Só quer 'percorrer' sem usar o retorno — nesse caso use forEach()", "Quer filtrar itens — use filter()"],
          related: ["js/arrays-strings/filter", "js/arrays-strings/reduce"],
        },
        {
          slug: "filter",
          title: "array.filter()",
          summary: "Retorna um novo array só com os itens que passam num teste.",
          syntax: `const filtrado = array.filter((item) => condicao);`,
          description: [
            "Para cada item, executa a função; se ela retornar 'true' o item entra no novo array, se 'false' ele é descartado. O array original não é alterado.",
          ],
          examples: [
            {
              code: `const numeros = [1, 2, 3, 4, 5, 6];
const pares = numeros.filter((n) => n % 2 === 0);
// [2, 4, 6]`,
            },
            {
              code: `const produtos = [{ nome: "Mouse", estoque: 0 }, { nome: "Teclado", estoque: 5 }];
const disponiveis = produtos.filter((p) => p.estoque > 0);`,
            },
          ],
          useWhen: ["Selecionar um subconjunto de itens que atende a uma condição"],
          avoidWhen: ["Quer transformar valores em vez de selecionar — use map()"],
          related: ["js/arrays-strings/map"],
        },
        {
          slug: "reduce",
          title: "array.reduce()",
          summary: "Reduz um array a um único valor acumulado.",
          syntax: `array.reduce((acumulador, item) => {\n  return novoAcumulador;\n}, valorInicial);`,
          description: [
            "Percorre o array acumulando um resultado a cada passo — soma, agrupa, monta um objeto, o que precisar. O segundo argumento é o valor inicial do acumulador.",
          ],
          examples: [
            {
              code: `const carrinho = [{ preco: 10 }, { preco: 25 }, { preco: 5 }];
const total = carrinho.reduce((soma, item) => soma + item.preco, 0);
// 40`,
            },
          ],
          useWhen: ["Somar, contar, agrupar ou transformar um array inteiro em um único valor (número, objeto, string)"],
          avoidWhen: ["O caso é só mapear ou filtrar — reduce tende a ficar mais difícil de ler para esses casos"],
          related: ["js/arrays-strings/map", "js/arrays-strings/filter"],
        },
        {
          slug: "foreach",
          title: "array.forEach()",
          summary: "Executa uma função para cada item, sem retornar nada.",
          syntax: `array.forEach((item, index) => {\n  // efeito colateral\n});`,
          description: [
            "Parecido com um 'for' tradicional, mas mais legível. Sempre retorna undefined — não serve para criar um novo array (para isso, use map).",
          ],
          examples: [
            {
              code: `const nomes = ["Ana", "Bia", "Caio"];
nomes.forEach((nome, i) => {
  console.log(\`\${i + 1}. \${nome}\`);
});`,
            },
          ],
          useWhen: ["Rodar um efeito colateral para cada item (logar, atualizar a UI, salvar em outro lugar)"],
          avoidWhen: ["Precisa do resultado como novo array — use map()", "Precisa parar no meio do loop — forEach não tem break, use for...of"],
          related: ["js/arrays-strings/map"],
        },
        {
          slug: "template-literals",
          title: "Template literals (`texto ${var}`)",
          summary: "Strings com variáveis interpoladas e múltiplas linhas.",
          syntax: "const texto = `Olá, ${nome}!`;",
          description: [
            "Usam crase (`) em vez de aspas. Permitem inserir expressões dentro de ${...} e escrever strings em várias linhas sem precisar concatenar com '+'.",
          ],
          examples: [
            {
              code: 'const nome = "Marina";\nconst idade = 28;\nconsole.log(`${nome} tem ${idade} anos.`);',
            },
            {
              code: "const html = `\n  <div>\n    <p>${mensagem}</p>\n  </div>\n`;",
              caption: "Ótimo para montar blocos de HTML como string",
            },
          ],
          useWhen: ["Sempre que for combinar texto fixo com variáveis"],
          avoidWhen: ["Strings simples sem nenhuma variável — aspas normais bastam"],
        },
      ],
    },
    {
      slug: "async-dom",
      title: "Assíncrono & DOM",
      description:
        "Como buscar dados de uma API, reagir ao tempo, e manipular elementos da página.",
      entries: [
        {
          slug: "fetch",
          title: "fetch()",
          summary: "Faz uma requisição HTTP e retorna uma Promise.",
          syntax: `fetch(url, opcoes?)\n  .then((res) => res.json())\n  .then((dados) => { ... });`,
          description: [
            "API nativa do navegador para buscar dados de uma URL. Retorna uma Promise que resolve para o objeto Response — é preciso chamar .json(), .text() etc para ler o conteúdo (que também retorna uma Promise).",
          ],
          examples: [
            {
              code: `fetch("https://api.exemplo.com/usuarios")
  .then((res) => res.json())
  .then((usuarios) => console.log(usuarios))
  .catch((erro) => console.error("Falhou:", erro));`,
            },
          ],
          useWhen: ["Buscar ou enviar dados para um servidor/API"],
          avoidWhen: ["fetch() não rejeita a Promise em erros HTTP (404, 500) — sempre confira res.ok manualmente"],
          related: ["js/async-dom/async-await"],
        },
        {
          slug: "async-await",
          title: "async / await",
          summary: "Escreve código assíncrono com aparência síncrona.",
          syntax: `async function nome() {\n  const resultado = await promessa;\n}`,
          description: [
            "'await' pausa a execução da função até a Promise resolver, sem travar o restante da página. Só pode ser usado dentro de uma função marcada como 'async'.",
            "Para tratar erros, envolva o await em try/catch — é o equivalente ao .catch() das Promises encadeadas.",
          ],
          examples: [
            {
              code: `async function buscarUsuarios() {
  try {
    const res = await fetch("/api/usuarios");
    if (!res.ok) throw new Error("Falha na requisição");
    const dados = await res.json();
    return dados;
  } catch (erro) {
    console.error(erro);
  }
}`,
            },
          ],
          useWhen: ["Sempre que tiver mais de um .then() encadeado — costuma ficar mais legível"],
          avoidWhen: ["Operações independentes que poderiam rodar em paralelo — nesse caso use Promise.all"],
          related: ["js/async-dom/fetch", "js/async-dom/promise-all"],
        },
        {
          slug: "promise-all",
          title: "Promise.all()",
          summary: "Roda várias Promises em paralelo e espera todas terminarem.",
          syntax: `const [a, b] = await Promise.all([promessaA, promessaB]);`,
          description: [
            "Recebe um array de Promises e retorna uma única Promise que resolve quando TODAS resolverem (na mesma ordem do array de entrada). Se qualquer uma rejeitar, o Promise.all inteiro rejeita.",
          ],
          examples: [
            {
              code: `async function carregarPagina() {
  const [usuario, pedidos] = await Promise.all([
    fetch("/api/usuario").then((r) => r.json()),
    fetch("/api/pedidos").then((r) => r.json()),
  ]);
  return { usuario, pedidos };
}`,
              caption: "As duas requisições saem ao mesmo tempo, em vez de uma esperar a outra",
            },
          ],
          useWhen: ["Múltiplas operações assíncronas independentes entre si"],
          avoidWhen: ["Uma operação depende do resultado da outra — nesse caso use await sequencial"],
          related: ["js/async-dom/async-await"],
        },
        {
          slug: "queryselector",
          title: "document.querySelector()",
          summary: "Busca o primeiro elemento que casa com um seletor CSS.",
          syntax: `const el = document.querySelector("seletor-css");\nconst todos = document.querySelectorAll("seletor-css");`,
          description: [
            "Aceita qualquer seletor CSS válido (classe, id, atributo, combinadores). querySelector() retorna só o primeiro elemento encontrado (ou null); querySelectorAll() retorna todos, como uma NodeList.",
          ],
          examples: [
            {
              code: `const botao = document.querySelector(".botao-principal");
const itens = document.querySelectorAll("ul.menu > li");

itens.forEach((item) => item.classList.add("visivel"));`,
            },
          ],
          useWhen: ["Selecionar elementos do DOM para ler ou alterar"],
          avoidWhen: ["Buscar o mesmo elemento repetidamente dentro de um loop — guarde numa variável antes"],
          related: ["js/async-dom/addeventlistener"],
        },
        {
          slug: "addeventlistener",
          title: "element.addEventListener()",
          summary: "Registra uma função para rodar quando um evento acontece.",
          syntax: `elemento.addEventListener("evento", funcao);`,
          description: [
            "Conecta uma função a um evento do elemento (click, submit, input, keydown...). Pode adicionar vários listeners para o mesmo evento sem sobrescrever os anteriores — diferente de onclick = função.",
          ],
          examples: [
            {
              code: `const form = document.querySelector("form");

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  console.log("Formulário enviado sem recarregar a página");
});`,
            },
          ],
          useWhen: ["Reagir a cliques, envio de formulário, digitação, scroll, etc."],
          avoidWhen: ["Atributos inline como onclick=\"...\" no HTML — dificultam manutenção"],
          related: ["js/async-dom/queryselector"],
        },
      ],
    },
  ],
};

export default js;
