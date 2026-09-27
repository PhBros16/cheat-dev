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
    {
      slug: "objetos",
      title: "Objetos & Desestruturação",
      description:
        "Sintaxes modernas para extrair, combinar e checar valores de objetos e arrays sem repetição.",
      entries: [
        {
          slug: "destructuring",
          title: "Desestruturação ({ a, b } = obj)",
          summary: "Extrai propriedades de um objeto (ou itens de um array) em variáveis.",
          syntax: `const { nome, idade } = pessoa;\nconst [primeiro, segundo] = lista;`,
          description: [
            "Em vez de acessar pessoa.nome e pessoa.idade separadamente, a desestruturação cria as duas variáveis de uma vez, com o mesmo nome da propriedade. Pode renomear (: novoNome) e dar valor padrão (= valor) para quando a propriedade não existir.",
          ],
          examples: [
            {
              code: `const usuario = { nome: "Ana", email: "ana@email.com" };
const { nome, email } = usuario;

const { nome: nomeCompleto = "Sem nome" } = {};
// nomeCompleto = "Sem nome"`,
            },
            {
              code: `function saudacao({ nome, idade }) {
  return \`\${nome} tem \${idade} anos\`;
}`,
              caption: "Muito comum para desestruturar parâmetros de função direto",
            },
          ],
          useWhen: ["Extrair várias propriedades de um objeto, ou parâmetros de função"],
          avoidWhen: ["O objeto pode ser undefined — desestruturar de undefined lança erro, confira antes"],
          related: ["js/objetos/spread-rest"],
        },
        {
          slug: "spread-rest",
          title: "Spread / Rest (...)",
          summary: "Espalha itens de um array/objeto, ou agrupa argumentos restantes.",
          syntax: `const copia = { ...original, novaProp: 1 };\nfunction f(...args) { }`,
          description: [
            "O mesmo '...' tem dois papéis conforme o contexto: 'spread' expande um array/objeto em itens individuais (útil para copiar e mesclar sem mutar o original); 'rest' faz o oposto, agrupando múltiplos argumentos/itens soltos em um único array.",
          ],
          examples: [
            {
              code: `const base = { tema: "escuro", idioma: "pt" };
const config = { ...base, idioma: "en" };
// { tema: "escuro", idioma: "en" }

const numeros = [1, 2, 3];
const maisNumeros = [...numeros, 4, 5];`,
            },
            {
              code: `function soma(...valores) {
  return valores.reduce((a, b) => a + b, 0);
}
soma(1, 2, 3, 4); // 10`,
              caption: "Rest params: junta quantos argumentos vierem em um array",
            },
          ],
          useWhen: ["Copiar/mesclar objetos e arrays sem mutar o original", "Funções com número variável de argumentos"],
          avoidWhen: ["Objetos muito grandes/profundos — spread só copia o primeiro nível (shallow copy)"],
          related: ["js/objetos/destructuring"],
        },
        {
          slug: "object-entries",
          title: "Object.keys() / values() / entries()",
          summary: "Transformam um objeto em array para poder iterar.",
          syntax: `Object.keys(obj);   // array de chaves\nObject.values(obj); // array de valores\nObject.entries(obj); // array de [chave, valor]`,
          description: [
            "Objetos não têm .map()/.filter() nativos — esses três métodos convertem um objeto em array (de chaves, valores, ou pares) para então usar os métodos de array normalmente.",
          ],
          examples: [
            {
              code: `const precos = { cafe: 8, bolo: 12 };

Object.entries(precos).forEach(([produto, preco]) => {
  console.log(\`\${produto}: R$ \${preco}\`);
});

const total = Object.values(precos).reduce((a, b) => a + b, 0);`,
            },
          ],
          useWhen: ["Percorrer, filtrar ou transformar as propriedades de um objeto"],
          avoidWhen: ["O objeto tem métodos herdados relevantes — Object.keys só pega propriedades próprias, o que geralmente é o desejado"],
        },
        {
          slug: "optional-chaining",
          title: "Optional chaining (?.)",
          summary: "Acessa uma propriedade aninhada sem quebrar se algo no meio for null/undefined.",
          syntax: `const cidade = usuario?.endereco?.cidade;`,
          description: [
            "Sem '?.', acessar usuario.endereco.cidade quando 'endereco' é undefined lança um erro e quebra a aplicação. Com '?.', a expressão inteira simplesmente retorna undefined em vez de quebrar. Funciona também para chamar métodos: obj.metodo?.().",
          ],
          examples: [
            {
              code: `const usuario = { nome: "Ana" };

console.log(usuario.endereco.cidade);
// ❌ TypeError: Cannot read properties of undefined

console.log(usuario.endereco?.cidade);
// ✅ undefined, sem quebrar`,
            },
          ],
          useWhen: ["Acessar dados que vieram de uma API e podem estar incompletos"],
          avoidWhen: ["Usar em tudo por preguiça de validar — às vezes é melhor tratar o erro de verdade"],
          related: ["js/objetos/nullish-coalescing"],
        },
        {
          slug: "nullish-coalescing",
          title: "Nullish coalescing (??)",
          summary: "Define um valor padrão só quando o original é null ou undefined.",
          syntax: `const valor = entrada ?? "padrão";`,
          description: [
            "Diferente do '||', que também troca valores 'falsy' como 0, '' ou false, o '??' só entra em ação se o valor for especificamente null ou undefined — preservando zeros e strings vazias legítimas.",
          ],
          examples: [
            {
              code: `const desconto = 0;

console.log(desconto || 10);  // 10 (bug! 0 é válido)
console.log(desconto ?? 10);  // 0 (correto)`,
              caption: "O clássico bug de usar || quando o valor 0 é válido",
            },
          ],
          useWhen: ["Valores numéricos ou strings onde 0/'' são respostas válidas, não 'ausência de valor'"],
          avoidWhen: ["Quer tratar qualquer valor falsy como ausente — aí '||' é o certo mesmo"],
          related: ["js/objetos/optional-chaining"],
        },
      ],
    },
    {
      slug: "funcoes",
      title: "Funções & Escopo",
      description:
        "Como declarar funções modernas em JS e entender o que cada uma enxerga ao seu redor.",
      entries: [
        {
          slug: "arrow-functions",
          title: "Arrow functions (=>)",
          summary: "Sintaxe curta para funções, que não redefine o 'this'.",
          syntax: `const soma = (a, b) => a + b;\nconst dobro = (x) => { return x * 2; };`,
          description: [
            "Com um único parâmetro os parênteses são opcionais; com uma expressão só, o 'return' é implícito. A diferença mais importante para funções tradicionais: arrow functions não têm seu próprio 'this' — elas usam o 'this' do escopo onde foram definidas.",
          ],
          examples: [
            {
              code: `const numeros = [1, 2, 3];
const dobrados = numeros.map((n) => n * 2);

const saudacao = (nome) => \`Olá, \${nome}!\`;`,
            },
          ],
          useWhen: ["Callbacks curtos (map, filter, then), funções que precisam herdar o 'this' externo"],
          avoidWhen: ["Métodos de objeto que precisam do próprio 'this' do objeto — use function normal"],
          related: ["js/funcoes/this-context"],
        },
        {
          slug: "this-context",
          title: "this",
          summary: "Referencia o objeto 'dono' da função em execução.",
          syntax: `const obj = {\n  nome: "Ana",\n  falar() { console.log(this.nome); }\n};`,
          description: [
            "O valor de 'this' depende de COMO a função é chamada, não de onde foi definida: como método (obj.metodo()) 'this' é o objeto; solta, é undefined (modo estrito) ou o objeto global. Arrow functions são a exceção — elas sempre herdam o 'this' de fora.",
          ],
          examples: [
            {
              code: `const contador = {
  valor: 0,
  incrementar() {
    this.valor++; // 'this' é o objeto contador
  },
};
contador.incrementar();`,
            },
          ],
          useWhen: ["Métodos de objetos e classes que precisam acessar suas próprias propriedades"],
          avoidWhen: ["Dentro de um callback comum (setTimeout, addEventListener) sem arrow function — 'this' muda e costuma confundir"],
          related: ["js/funcoes/arrow-functions"],
        },
        {
          slug: "closures",
          title: "Closures",
          summary: "Uma função que 'lembra' das variáveis do escopo onde foi criada.",
          syntax: `function criarContador() {\n  let count = 0;\n  return () => ++count;\n}`,
          description: [
            "Quando uma função é definida dentro de outra, ela mantém acesso às variáveis da função externa mesmo depois que essa função externa já terminou de executar. É a base de padrões como contadores privados, memoização e debounce.",
          ],
          examples: [
            {
              code: `function criarContador() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}

const contador = criarContador();
contador(); // 1
contador(); // 2`,
              caption: "'count' continua vivo entre as chamadas, mas é inacessível de fora",
            },
          ],
          useWhen: ["Estado privado, funções de fábrica, debounce/throttle, memoização"],
          avoidWhen: ["Criar closures dentro de loops sem cuidado pode causar bugs de referência compartilhada"],
        },
        {
          slug: "default-params",
          title: "Parâmetros padrão",
          summary: "Define um valor usado quando o argumento não é passado.",
          syntax: `function saudacao(nome = "visitante") { }`,
          description: [
            "Se a função for chamada sem esse argumento (ou passando undefined explicitamente), o valor padrão é usado. Pode referenciar parâmetros anteriores na própria lista.",
          ],
          examples: [
            {
              code: `function criarUsuario(nome, papel = "membro") {
  return { nome, papel };
}

criarUsuario("Ana"); // { nome: "Ana", papel: "membro" }
criarUsuario("Bia", "admin");`,
            },
          ],
          useWhen: ["Argumentos opcionais com um valor sensato de padrão"],
          avoidWhen: ["O padrão depende de outro argumento que também pode faltar — considere validar no corpo da função"],
        },
        {
          slug: "array-from-isarray",
          title: "Array.from() / Array.isArray()",
          summary: "Cria um array a partir de algo parecido com array, ou testa se já é um.",
          syntax: `Array.from(algo, funcaoMapeadora?);\nArray.isArray(valor);`,
          description: [
            "Array.from converte estruturas 'iteráveis' (NodeList, string, Set, argumentos de função) em um array de verdade, com todos os métodos disponíveis. Array.isArray é a forma correta de checar se algo é array (typeof não distingue array de objeto).",
          ],
          examples: [
            {
              code: `const divs = document.querySelectorAll("div");
const arrayDeDivs = Array.from(divs);

Array.from({ length: 5 }, (_, i) => i * 2);
// [0, 2, 4, 6, 8]

Array.isArray([1, 2, 3]); // true
Array.isArray({ length: 3 }); // false`,
            },
          ],
          useWhen: ["Converter NodeList/argumentos em array real", "Gerar um array de N itens programaticamente"],
          avoidWhen: ["typeof valor === 'array' não existe em JS — sempre use Array.isArray"],
        },
      ],
    },
  ],
};

export default js;
