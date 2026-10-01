import { J, cat } from "@/content/helpers";

export const jsB = [
  cat("controle-fluxo", "Controle de Fluxo", "Como decidir e repetir ações em JavaScript.", [
    J({ s: "if-else", t: "if / else / else if", d: "Executa um bloco de código só se uma condição for verdadeira.", x: `if (condicao) {\n} else if (outra) {\n} else {\n}`,
      ex: `const idade = 20;
if (idade < 18) {
  console.log("menor de idade");
} else if (idade < 65) {
  console.log("adulto");
} else {
  console.log("idoso");
}`, L: 1, k: "condicional|se então|decisão|if else" }),
    J({ s: "switch", t: "switch", d: "Compara um valor contra vários casos possíveis.", x: `switch (valor) {\n  case 1: ...; break;\n  default: ...;\n}`,
      n: "Não esqueça o 'break' em cada case — sem ele, a execução 'cai' para o próximo case (fall-through), o que às vezes é intencional, mas geralmente é bug.",
      ex: `const dia = 3;
switch (dia) {
  case 1: console.log("Segunda"); break;
  case 2: console.log("Terça"); break;
  case 3: console.log("Quarta"); break;
  default: console.log("Outro dia");
}`, L: 1, a: "Esquecer o break — causa execução em cascata sem querer",
      k: "switch case|multiplas condições|comparar vários valores" }),
    J({ s: "for", t: "for", d: "Repete um bloco um número definido de vezes.", x: `for (let i = 0; i < n; i++) { }`,
      ex: `for (let i = 0; i < 5; i++) {
  console.log(i);
}
// 0 1 2 3 4`, L: 1, k: "laço for|repetir n vezes|loop com contador" }),
    J({ s: "for-of-in", t: "for...of / for...in", d: "Percorrem os valores de um iterável, ou as chaves de um objeto.", x: `for (const v of array) { }\nfor (const k in objeto) { }`,
      n: "for...of pega os VALORES de arrays, strings, Maps, Sets. for...in pega as CHAVES de um objeto (ou índices de um array, mas isso raramente é o que você quer).",
      ex: `for (const cor of ["azul", "verde"]) {
  console.log(cor);
}

const pessoa = { nome: "Ana", idade: 28 };
for (const chave in pessoa) {
  console.log(chave, pessoa[chave]);
}`, L: 1, k: "percorrer array|percorrer objeto|for de cada|iterar" }),
    J({ s: "while", t: "while / do...while", d: "Repete um bloco enquanto uma condição for verdadeira.", x: `while (condicao) { }\ndo { } while (condicao);`,
      n: "while checa a condição antes de rodar (pode nunca executar). do...while executa pelo menos uma vez, checando a condição só no final.",
      ex: `let n = 5;
while (n > 0) {
  console.log(n);
  n--;
}`, L: 1, k: "repetir enquanto|loop condicional|while loop" }),
    J({ s: "ternario", t: "Operador ternário (? :)", d: "Um if/else compacto que retorna um valor.", x: `condicao ? valorSeVerdade : valorSeFalso`,
      ex: `const idade = 16;
const status = idade >= 18 ? "maior" : "menor";
console.log(status); // "menor"`, L: 1, k: "if em uma linha|condicional curta|operador condicional" }),
  ]),

  cat("numeros-math", "Números & Math", "Conversão, arredondamento e operações matemáticas.", [
    J({ s: "parseint-parsefloat", t: "parseInt() / parseFloat() / Number()", d: "Convertem texto em número.", x: `parseInt("42");\nparseFloat("3.14");\nNumber("10");`,
      n: "parseInt para de ler no primeiro caractere não-numérico ('42px' vira 42). Number() é mais rígido: se a string inteira não for um número válido, retorna NaN.",
      ex: `parseInt("42px"); // 42
parseFloat("3.14kg"); // 3.14
Number("10"); // 10
Number("10px"); // NaN`, L: 1, k: "converter texto em número|string para número|texto para int" }),
    J({ s: "math-round-ceil-floor", t: "Math.round() / ceil() / floor()", d: "Arredondam um número decimal.", x: `Math.round(x);\nMath.ceil(x);\nMath.floor(x);`,
      n: "round arredonda pro mais próximo. ceil sempre arredonda pra CIMA (teto). floor sempre arredonda pra BAIXO (piso).",
      ex: `Math.round(4.5); // 5
Math.ceil(4.1);  // 5
Math.floor(4.9); // 4`, L: 1, k: "arredondar número|teto|piso|arredondamento para cima|arredondamento para baixo" }),
    J({ s: "math-random", t: "Math.random()", d: "Gera um número decimal aleatório entre 0 (incluso) e 1 (exclusivo).", x: `Math.random();`,
      ex: `// Número aleatório entre 1 e 10
const n = Math.floor(Math.random() * 10) + 1;
console.log(n);`, L: 1, k: "número aleatório|sortear número|gerar aleatório|randomizar" }),
    J({ s: "math-max-min", t: "Math.max() / Math.min()", d: "Retornam o maior ou menor valor de uma lista de números.", x: `Math.max(a, b, c);\nMath.min(...array);`,
      n: "Para usar com um array, é preciso espalhar com '...' — Math.max não aceita array diretamente.",
      ex: `Math.max(3, 7, 2); // 7

const numeros = [3, 7, 2, 9];
Math.max(...numeros); // 9`, L: 1, k: "maior número|menor número|máximo de uma lista|mínimo de um array" }),
    J({ s: "tofixed", t: "number.toFixed()", d: "Formata um número com um número fixo de casas decimais.", x: `numero.toFixed(2);`,
      n: "Retorna uma STRING, não um número — se for usar em cálculo depois, converta de volta com Number().",
      ex: `(9.999).toFixed(2); // "10.00"
(5).toFixed(2); // "5.00"`, L: 1, k: "casas decimais|duas casas decimais|formatar preço|arredondar para exibição" }),
  ]),

  cat("classes", "Classes & Programação Orientada a Objetos", "Como modelar objetos com comportamento reutilizável em JS.", [
    J({ s: "class-basica", t: "class / constructor", d: "Declara um molde para criar objetos com propriedades e métodos.", x: `class Nome {\n  constructor(args) { }\n  metodo() { }\n}`,
      n: "O constructor roda automaticamente quando você faz 'new Nome(...)' — é onde normalmente se define as propriedades iniciais.",
      ex: `class Usuario {
  constructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }
  saudacao() {
    return \`Oi, eu sou \${this.nome}\`;
  }
}

const u = new Usuario("Ana", 28);
console.log(u.saudacao());`, L: 1,
      k: "criar classe|orientação a objetos|construtor|molde de objeto|instanciar classe" }),
    J({ s: "extends-super", t: "extends / super", d: "Cria uma classe que herda de outra.", x: `class Filha extends Pai {\n  constructor() { super(); }\n}`,
      n: "'extends' herda propriedades e métodos da classe pai. 'super()' chama o constructor do pai — é obrigatório antes de usar 'this' numa classe filha.",
      ex: `class Animal {
  constructor(nome) { this.nome = nome; }
  falar() { return \`\${this.nome} faz um som\`; }
}

class Cachorro extends Animal {
  falar() { return \`\${this.nome} late\`; }
}

new Cachorro("Rex").falar(); // "Rex late"`, L: 1, k: "herança|classe filha|extender classe|super construtor" }),
    J({ s: "getters-setters", t: "get / set", d: "Propriedades calculadas que se comportam como valores normais.", x: `class C {\n  get prop() { return ...; }\n  set prop(v) { ...; }\n}`,
      ex: `class Retangulo {
  constructor(largura, altura) {
    this.largura = largura;
    this.altura = altura;
  }
  get area() {
    return this.largura * this.altura;
  }
}

const r = new Retangulo(4, 5);
console.log(r.area); // 20, sem precisar chamar como função`, L: 1,
      k: "propriedade calculada|getter setter|valor derivado da classe" }),
    J({ s: "static", t: "static", d: "Método ou propriedade que pertence à classe, não a cada instância.", x: `class C {\n  static metodo() { }\n}`,
      ex: `class MathUtils {
  static dobro(n) {
    return n * 2;
  }
}

MathUtils.dobro(5); // 10, sem precisar de 'new'`, L: 1, k: "método estático|função utilitária de classe|static class" }),
  ]),

  cat("json-armazenamento", "JSON & Armazenamento", "Converter dados e guardar informação no navegador.", [
    J({ s: "json-stringify-parse", t: "JSON.stringify() / JSON.parse()", d: "Convertem entre objeto JavaScript e texto JSON.", x: `JSON.stringify(obj);\nJSON.parse(texto);`,
      n: "stringify() é usado antes de guardar/enviar um objeto (localStorage, fetch). parse() faz o caminho inverso, ao ler de volta.",
      ex: `const obj = { nome: "Ana", idade: 28 };
const texto = JSON.stringify(obj);
// '{"nome":"Ana","idade":28}'

const devolta = JSON.parse(texto);
console.log(devolta.nome); // "Ana"`, L: 1,
      k: "converter objeto em texto|salvar objeto|json para objeto|serializar dados" }),
    J({ s: "localstorage", t: "localStorage", d: "Guarda dados no navegador, que persistem mesmo fechando a aba.", x: `localStorage.setItem(chave, valor);\nlocalStorage.getItem(chave);\nlocalStorage.removeItem(chave);`,
      n: "Só aceita strings — para guardar objetos, use JSON.stringify() antes de salvar e JSON.parse() ao ler.",
      ex: `localStorage.setItem("tema", "escuro");
const tema = localStorage.getItem("tema");

localStorage.setItem("user", JSON.stringify({ nome: "Ana" }));
const user = JSON.parse(localStorage.getItem("user"));`, L: 1,
      u: "Preferências do usuário, tema, dados que devem sobreviver ao fechar o navegador",
      k: "salvar no navegador|guardar dados localmente|persistir dados|armazenamento local" }),
    J({ s: "sessionstorage", t: "sessionStorage", d: "Igual ao localStorage, mas os dados somem ao fechar a aba.", x: `sessionStorage.setItem(chave, valor);`,
      ex: `sessionStorage.setItem("passo", "2");
// some quando a aba é fechada`, L: 1,
      k: "dados temporários da aba|sessão do navegador|armazenamento temporário" }),
  ]),

  cat("dom-avancado", "DOM Avançado", "Manipulação mais profunda de elementos da página.", [
    J({ s: "classlist", t: "element.classList", d: "Adiciona, remove ou alterna classes CSS de um elemento.", x: `el.classList.add("ativo");\nel.classList.remove("ativo");\nel.classList.toggle("ativo");`,
      ex: `const menu = document.querySelector(".menu");
menu.classList.toggle("aberto");

if (menu.classList.contains("aberto")) {
  console.log("está aberto");
}`, L: 1, k: "adicionar classe|remover classe|alternar classe|toggle classe css" }),
    J({ s: "dataset", t: "element.dataset", d: "Lê atributos data-* de um elemento HTML.", x: `<div data-id="42"></div>\nel.dataset.id; // "42"`,
      ex: `// HTML: <button data-produto-id="42">Comprar</button>
document.querySelector("button").addEventListener("click", (e) => {
  console.log(e.target.dataset.produtoId); // "42"
});`, L: 1, k: "atributo data|data attribute|ler data-id|dados customizados no html" }),
    J({ s: "createelement", t: "createElement() / appendChild()", d: "Criam e inserem novos elementos no DOM via JavaScript.", x: `const el = document.createElement("div");\npai.appendChild(el);`,
      ex: `const li = document.createElement("li");
li.textContent = "Novo item";
document.querySelector("ul").appendChild(li);`, L: 1,
      k: "criar elemento com javascript|adicionar elemento na página|inserir elemento no dom" }),
    J({ s: "style-property", t: "element.style", d: "Muda o CSS inline de um elemento diretamente pelo JavaScript.", x: `el.style.propriedade = valor;`,
      n: "Propriedades com hífen viram camelCase: background-color → style.backgroundColor. Para mudanças permanentes, prefira classList + CSS em vez de muitos style diretos.",
      ex: `const caixa = document.querySelector(".caixa");
caixa.style.backgroundColor = "crimson";
caixa.style.transform = "scale(1.1)";`, L: 1,
      k: "mudar cor com javascript|estilo inline|css via javascript|alterar estilo" }),
    J({ s: "innerhtml-textcontent", t: "innerHTML vs textContent", d: "Duas formas de ler/escrever o conteúdo de um elemento.", x: `el.textContent = "texto";\nel.innerHTML = "<b>html</b>";`,
      n: "textContent trata tudo como texto puro (seguro contra XSS). innerHTML interpreta como HTML — nunca insira texto de usuário direto em innerHTML sem sanitizar.",
      ex: `const div = document.querySelector(".msg");
div.textContent = "<script>alert(1)</script>"; // aparece como texto literal
div.innerHTML = "<strong>Negrito</strong>"; // renderiza o negrito`, L: 1,
      a: "innerHTML com texto vindo do usuário sem sanitizar — risco de XSS",
      k: "inserir html com javascript|texto vs html|conteúdo do elemento|inner html" }),
  ]),

  cat("erros-assincrono-avancado", "Erros & Assíncrono Avançado", "Tratamento de erro e formas mais avançadas de lidar com tempo e concorrência.", [
    J({ s: "try-catch-finally", t: "try / catch / finally", d: "Captura erros para que não quebrem a aplicação inteira.", x: `try {\n} catch (erro) {\n} finally {\n}`,
      n: "'finally' roda sempre, tenha dado erro ou não — ótimo para limpar recursos (fechar loading, liberar conexão).",
      ex: `try {
  JSON.parse("{ invalido");
} catch (erro) {
  console.error("Falhou:", erro.message);
} finally {
  console.log("Terminou a tentativa");
}`, L: 1, k: "capturar erro|tratar exceção|try catch|lidar com erro" }),
    J({ s: "settimeout-setinterval", t: "setTimeout() / setInterval()", d: "Executam código depois de um tempo, ou repetidamente.", x: `setTimeout(fn, ms);\nsetInterval(fn, ms);`,
      n: "setTimeout roda uma vez após o tempo. setInterval repete indefinidamente até você chamar clearInterval() — sempre guarde o ID retornado para poder cancelar depois.",
      ex: `const id = setInterval(() => {
  console.log("tick");
}, 1000);

setTimeout(() => clearInterval(id), 5000);`, L: 1, k: "esperar tempo|atrasar execução|repetir a cada segundo|temporizador" }),
    J({ s: "new-promise", t: "new Promise()", d: "Cria uma Promise do zero, para envolver código assíncrono customizado.", x: `new Promise((resolve, reject) => { });`,
      ex: `function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function exemplo() {
  console.log("início");
  await esperar(1000);
  console.log("1 segundo depois");
}`, L: 1, k: "criar promise|promise customizada|envolver callback em promise" }),
    J({ s: "promise-race-allsettled", t: "Promise.race() / allSettled()", d: "Outras formas de combinar múltiplas Promises.", x: `Promise.race([...]);\nPromise.allSettled([...]);`,
      n: "race() resolve/rejeita assim que a PRIMEIRA Promise terminar (útil para timeout). allSettled() espera todas terminarem e retorna o resultado de cada uma (sucesso ou erro), sem parar no primeiro erro como Promise.all faz.",
      ex: `const resultado = await Promise.allSettled([
  fetch("/api/a"),
  fetch("/api/b-que-pode-falhar"),
]);
resultado.forEach((r) => console.log(r.status));`, L: 1,
      k: "primeira promise a terminar|timeout de requisição|todas as promises mesmo com erro" }),
  ]),
];
