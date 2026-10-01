import { J, cat } from "@/content/helpers";

export const jsA = [
  cat("arrays-avancado", "Arrays em Detalhe", "Métodos que faltavam para buscar, testar, ordenar e recortar arrays.", [
    J({ s: "find-findindex", t: "array.find() / findIndex()", d: "Acham o primeiro item (ou sua posição) que passa num teste.", x: "array.find(fn)\narray.findIndex(fn)",
      n: "find() retorna o próprio item (ou undefined se nenhum bater). findIndex() retorna a posição dele no array (ou -1). Param logo no primeiro que casar, sem checar o resto.",
      ex: `const usuarios = [{ id: 1 }, { id: 2 }, { id: 3 }];
const alvo = usuarios.find((u) => u.id === 2);
console.log(alvo); // { id: 2 }`, L: 1,
      k: "achar item no array|buscar por id|encontrar elemento|procurar no array|achar posição" }),
    J({ s: "includes-some-every", t: "includes() / some() / every()", d: "Testam a presença ou uma condição sobre os itens de um array.", x: "array.includes(valor)\narray.some(fn)\narray.every(fn)",
      n: "includes() checa se um valor exato existe. some() retorna true se PELO MENOS UM item passar no teste. every() só retorna true se TODOS passarem.",
      ex: `const numeros = [2, 4, 6, 8];
numeros.includes(4);           // true
numeros.some((n) => n > 5);    // true
numeros.every((n) => n % 2 === 0); // true`, L: 1,
      k: "array contém valor|verificar se existe no array|todos os itens passam|algum item passa|testar array" }),
    J({ s: "sort", t: "array.sort()", d: "Ordena os itens de um array, no próprio array (in-place).", x: "array.sort((a, b) => a - b);",
      n: "Sem função de comparação, ordena como texto (10 vem antes de 2!). Para números, sempre passe (a,b) => a-b (crescente) ou (a,b) => b-a (decrescente). Como muta o array original, copie antes com [...array] se precisar preservar a ordem original.",
      ex: `const numeros = [10, 2, 33, 4];
numeros.sort((a, b) => a - b);
// [2, 4, 10, 33]

const nomes = ["Carlos", "Ana", "Bruno"];
nomes.sort();
// ["Ana", "Bruno", "Carlos"]`, L: 1,
      a: "sort() sem comparador em números — a ordenação vira texto e fica errada",
      k: "ordenar array|classificar lista|ordem crescente|ordem decrescente|sort numérico" }),
    J({ s: "flat-flatmap", t: "array.flat() / flatMap()", d: "'Achatam' arrays aninhados em um único nível.", x: "array.flat(profundidade);\narray.flatMap(fn);",
      n: "flat() une sub-arrays num só nível (flat(Infinity) achata todos os níveis). flatMap() é um map() seguido de flat(1) — útil quando cada item pode virar 0, 1 ou vários itens.",
      ex: `const aninhado = [1, [2, 3], [4, [5, 6]]];
aninhado.flat(); // [1, 2, 3, 4, [5, 6]]
aninhado.flat(Infinity); // [1, 2, 3, 4, 5, 6]

[1, 2, 3].flatMap((n) => [n, n * 2]);
// [1, 2, 2, 4, 3, 6]`, L: 1,
      k: "array aninhado|achatar array|array dentro de array|unificar arrays" }),
    J({ s: "slice-splice", t: "array.slice() / splice()", d: "Recortam um pedaço do array — slice sem alterar, splice alterando.", x: "array.slice(inicio, fim);\narray.splice(inicio, quantidade, ...novos);",
      n: "slice() retorna uma cópia do trecho, sem tocar no original — ótimo para 'remover' um item sem mutar (filtrando ou recombinando slices). splice() modifica o array original: remove itens e pode inserir outros no lugar.",
      ex: `const letras = ["a", "b", "c", "d"];

letras.slice(1, 3); // ["b", "c"], original intacto

letras.splice(1, 1); // remove "b" do próprio array
console.log(letras); // ["a", "c", "d"]

letras.splice(1, 0, "x"); // insere "x" na posição 1, sem remover nada`, L: 1,
      u: "slice para copiar um trecho sem mutar|splice para remover/inserir no próprio array",
      k: "remover item do array|copiar parte do array|inserir no meio do array|recortar array|deletar item pelo índice" }),
    J({ s: "join-indexof", t: "array.join() / indexOf()", d: "Transformam array em texto, ou acham a posição de um valor.", x: "array.join(separador);\narray.indexOf(valor);",
      n: "join() junta todos os itens numa única string com o separador escolhido (padrão é vírgula). indexOf() retorna a posição da primeira ocorrência de um valor exato, ou -1 se não achar.",
      ex: `const tags = ["css", "html", "js"];
tags.join(", "); // "css, html, js"
tags.indexOf("html"); // 1
tags.indexOf("python"); // -1`, L: 1,
      k: "juntar array em texto|transformar array em string|posição do item|indice do valor" }),
  ]),

  cat("strings-metodos", "Métodos de String", "Cortar, limpar, buscar e transformar texto.", [
    J({ s: "split", t: "string.split()", d: "Quebra uma string em um array, usando um separador.", x: `string.split(",")`,
      ex: `"a,b,c".split(","); // ["a", "b", "c"]
"2026-09-28".split("-"); // ["2026", "09", "28"]
"ola mundo".split(""); // ["o","l","a"," ","m",...]`, L: 1,
      k: "separar string|quebrar texto em array|dividir string|string para array" }),
    J({ s: "trim", t: "string.trim() / trimStart() / trimEnd()", d: "Remove espaços em branco das pontas de uma string.", x: `string.trim();`,
      ex: `"  ola mundo  ".trim(); // "ola mundo"
"  oi".trimStart(); // "oi"
"oi  ".trimEnd(); // "oi"`, L: 1,
      k: "remover espaços|limpar string|tirar espaço em branco|trim de texto" }),
    J({ s: "replace-replaceall", t: "string.replace() / replaceAll()", d: "Substituem trechos de uma string por outro texto.", x: `string.replace(busca, novo);\nstring.replaceAll(busca, novo);`,
      n: "replace() troca só a primeira ocorrência (a menos que use regex com /g). replaceAll() troca todas as ocorrências direto.",
      ex: `"2026-09-28".replace("-", "/"); // "2026/09-28"
"2026-09-28".replaceAll("-", "/"); // "2026/09/28"`, L: 1,
      k: "substituir texto|trocar parte da string|find and replace|substituir todas as ocorrências" }),
    J({ s: "case-transform", t: "toUpperCase() / toLowerCase()", d: "Transformam o texto em maiúsculas ou minúsculas.", x: `string.toUpperCase();\nstring.toLowerCase();`,
      ex: `"Ola Mundo".toUpperCase(); // "OLA MUNDO"
"Ola Mundo".toLowerCase(); // "ola mundo"`, L: 1,
      k: "texto maiúsculo|texto minúsculo|caixa alta|caixa baixa" }),
    J({ s: "string-search", t: "includes() / startsWith() / endsWith()", d: "Testam se uma string contém, começa ou termina com um trecho.", x: `string.includes(trecho);\nstring.startsWith(trecho);\nstring.endsWith(trecho);`,
      ex: `const email = "ana@email.com";
email.includes("@"); // true
email.startsWith("ana"); // true
email.endsWith(".com"); // true`, L: 1,
      k: "string contém|começa com|termina com|validar formato de texto" }),
    J({ s: "padstart-padend", t: "padStart() / padEnd()", d: "Completa uma string até um tamanho, adicionando caracteres.", x: `string.padStart(tamanho, caractere);`,
      ex: `"7".padStart(2, "0"); // "07"
"5".padStart(3, "0"); // "005"
"3".padEnd(5, "*"); // "3****"`, L: 1,
      k: "completar com zero|zero à esquerda|formatar número com zeros|preencher string" }),
    J({ s: "slice-substring", t: "string.slice() / substring()", d: "Extraem um trecho de uma string pela posição.", x: `string.slice(inicio, fim);`,
      ex: `"JavaScript".slice(0, 4); // "Java"
"JavaScript".slice(-6); // "Script"`, L: 1,
      k: "cortar parte da string|extrair trecho do texto|pegar caracteres" }),
    J({ s: "repeat", t: "string.repeat()", d: "Repete uma string N vezes.", x: `string.repeat(n);`,
      ex: `"ab".repeat(3); // "ababab"
"-".repeat(20); // linha separadora`, L: 1, k: "repetir texto|duplicar string|linha de traços" }),
  ]),
];
