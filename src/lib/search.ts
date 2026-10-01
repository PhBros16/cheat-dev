import { SearchItem } from "@/lib/types";

/** minúsculas + sem acentos */
export const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const split = (s: string) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);

const STOP = new Set(
  (
    "comando comandos para de do da dos das o a os as um uma uns umas como fazer faz faco quero " +
    "preciso precisa usar uso que em na no nas nos e ou se com sem por ao aos eu meu minha meus " +
    "qual quais tem ter coisa aquele aquela esse essa isso mais quando onde deixar colocar pra " +
    "pro pelo pela ha eh sao ficar"
  ).split(" ")
);

/** pt-BR (sem acento) -> termos técnicos relacionados */
const SYN_RAW =
  "direita:right|esquerda:left|cima:top|topo:top|superior:top|baixo:bottom|embaixo:bottom|inferior:bottom|" +
  "borda:border|bordas:border|contorno:outline border|moldura:border|margem:margin|margens:margin|" +
  "afastar:margin gap|afastamento:margin gap|espacamento:padding margin gap spacing|espaco:padding margin gap spacing|" +
  "preenchimento:padding|interno:padding|externo:margin|cor:color|cores:color|colorido:color background|" +
  "fundo:background|plano:background|sombra:shadow|sombreado:shadow|transicao:transition|animacao:animation keyframes|" +
  "animar:animation transition|movimento:animation transform translate|tamanho:size width height font-size|" +
  "largura:width|altura:height|maximo:max maximum|minimo:min minimum|centralizar:center align justify|centro:center|" +
  "alinhar:align justify|alinhamento:align justify|texto:text|fonte:font|letra:font letter|negrito:bold font-weight strong|" +
  "italico:italic font-style em|sublinhado:underline text-decoration|maiusculo:uppercase text-transform|" +
  "maiuscula:uppercase text-transform|minusculo:lowercase text-transform|arredondar:radius round|arredondado:radius|" +
  "redondo:radius circle|circulo:radius circle|transparente:opacity transparent|transparencia:opacity|opaco:opacity|" +
  "esconder:hidden display none visibility|ocultar:hidden display none|sumir:hidden display none|mostrar:display show visible|" +
  "exibir:display show|rolagem:scroll overflow|rolar:scroll overflow|barra:scrollbar|girar:rotate|rotacionar:rotate|" +
  "rotacao:rotate|aumentar:scale zoom size|ampliar:scale zoom|diminuir:scale size|mover:translate transform|deslocar:translate|" +
  "lista:list ul ol array|listas:list|link:a href anchor|links:a href|ancora:anchor a|imagem:img image|imagens:img|foto:img|" +
  "video:video|audio:audio|som:audio|tabela:table|formulario:form|botao:button|campo:input|caixa:box input checkbox|" +
  "senha:password|arquivo:file|upload:file|marcar:checkbox checked|opcao:option radio|selecionar:select|dropdown:select|" +
  "suspensa:select|grade:grid|flexivel:flex|coluna:column columns|colunas:columns|linha:row line|quebra:break wrap|" +
  "quebrar:break wrap|cortar:overflow ellipsis slice|truncar:ellipsis overflow truncate|reticencias:ellipsis|" +
  "repetir:repeat loop for while|repeticao:loop for while|laco:loop for while|loop:for while loop|condicao:if condition|" +
  "condicional:if condition else|senao:else|ordenar:sort order|ordem:order sort|filtrar:filter where|filtro:filter where|" +
  "buscar:find search select fetch|procurar:find search|encontrar:find search|achar:find search|pesquisar:search find|" +
  "somar:sum reduce add|soma:sum|contar:count length|contagem:count|juntar:join concat merge union|unir:join union concat merge|" +
  "combinar:join merge concat|dividir:split divide|separar:split|remover:remove delete drop splice filter|" +
  "apagar:delete remove drop|deletar:delete|excluir:delete remove drop|adicionar:add insert push append create|" +
  "inserir:insert add append|incluir:include add insert|criar:create new|atualizar:update set|alterar:alter update change|" +
  "editar:edit update|modificar:update change|mudar:change update|trocar:replace swap change|substituir:replace|" +
  "copiar:copy clone|clonar:clone copy|converter:convert cast parse|transformar:transform map convert|" +
  "aleatorio:random|sorteio:random|sortear:random|numero:number|numeros:number|arredondamento:round|data:date|hora:time|" +
  "horario:time|tempo:time timeout interval|esperar:timeout delay await|atrasar:timeout delay|atraso:delay timeout|" +
  "intervalo:interval|erro:error catch throw try|erros:error|excecao:exception error try catch|salvar:save storage|" +
  "armazenar:storage save|guardar:storage save|armazenamento:storage|requisicao:fetch request http|api:fetch http api|" +
  "clique:click event|clicar:click|teclado:keyboard key keydown|tecla:key keydown|mouse:mouse hover|passar:hover|foco:focus|" +
  "tela:screen viewport media|celular:mobile media viewport responsive|responsivo:responsive media|" +
  "responsividade:responsive media|escuro:dark|claro:light|variavel:variable var let const|constante:const|" +
  "objeto:object|vetor:array|palavra:string|booleano:boolean|verdadeiro:true boolean|falso:false boolean|nulo:null|" +
  "vazio:empty null|indefinido:undefined|duplicado:distinct unique|duplicados:distinct unique|repetido:distinct duplicate|" +
  "unico:unique distinct|agrupar:group|agrupamento:group|relacionar:join foreign|relacionamento:join foreign|chave:key|" +
  "indice:index|desfazer:rollback undo|confirmar:commit|limitar:limit|limite:limit|paginar:offset limit pagination|" +
  "paginacao:pagination offset limit|pular:offset skip|media:avg average|total:sum count|ajustar:set adjust|" +
  "deixar:set|espelhar:flip scale|inclinar:skew|piscar:animation blink|pulsar:animation pulse|girando:rotate spin|" +
  "empilhar:z-index stack|sobrepor:z-index overlay|camada:z-index layer|fixar:fixed sticky|fixo:fixed sticky|grudar:sticky|" +
  "desfocar:blur filter|desfoque:blur|brilho:brightness|nitidez:contrast|cinza:grayscale|cursor:cursor|seta:cursor|" +
  "selecionavel:user-select|selecao:selection select|placeholder:placeholder|obrigatorio:required|desabilitado:disabled|" +
  "somente:readonly only|leitura:readonly|validar:validation pattern required|validacao:validation pattern required|" +
  "expressao:regex regexp pattern|regular:regex regexp|classe:class|herdar:extends inherit|heranca:extends inherit|" +
  "importar:import|exportar:export|modulo:module import export|assincrono:async await promise|assincrona:async await promise|" +
  "esperar:await timeout|promessa:promise|evento:event listener|ouvinte:listener event|elemento:element node|" +
  "pai:parent|filho:child children|irmao:sibling|proximo:next|anterior:previous|primeiro:first|ultimo:last|" +
  "par:even|impar:odd|nome:name|valor:value|titulo:title|descricao:description|semantica:semantic|acessibilidade:aria accessibility|" +
  "acessivel:aria accessibility|leitor:screen reader aria|imprimir:print|impressao:print|traducao:translate|idioma:lang|" +
  "emoji:emoji unicode|icone:icon favicon|favicon:icon|compartilhar:share og open graph|previa:preview og|" +
  "consulta:query select|consultar:query select|subconsulta:subquery|tabelas:table join|juncao:join|uniao:union|intersecao:intersect|" +
  "diferenca:except difference|janela:window over partition|classificacao:rank|ranking:rank row_number|acumulado:running sum over|" +
  "anterior:lag previous|hierarquia:recursive cte|recursivo:recursive|temporario:temp|visao:view|gatilho:trigger|" +
  "permissao:grant permission|permissoes:grant revoke|seguranca:security injection|injecao:injection|desempenho:performance index explain|" +
  "lento:performance index explain|otimizar:performance index explain|bloquear:lock for update|concorrencia:isolation lock transaction|" +
  "arredondar:round ceil floor|teto:ceil|piso:floor|resto:mod modulo|potencia:pow power|raiz:sqrt|absoluto:abs|" +
  "aparar:trim|espacos:trim|preencher:pad fill|completar:pad fill|zeros:padstart pad|inverter:reverse|achatar:flat|" +
  "aninhado:nested flat|desestruturar:destructuring|espalhar:spread|argumentos:arguments rest params|parametros:params arguments|" +
  "retornar:return|retorno:return|escopo:scope|fechamento:closure|contexto:this|instancia:instance new|construtor:constructor|" +
  "privado:private|estatico:static|getter:get|setter:set|clonar:clone structuredclone|congelar:freeze|imutavel:freeze immutable";

const SYN = new Map<string, string[]>();
for (const pair of SYN_RAW.split("|")) {
  const i = pair.indexOf(":");
  const key = pair.slice(0, i);
  const vals = pair.slice(i + 1).split(" ");
  SYN.set(key, [...new Set([...(SYN.get(key) ?? []), ...vals])]);
}

type Alt = { t: string; w: number };

function expand(token: string): Alt[] {
  const alts: Alt[] = [{ t: token, w: 1 }];
  const stems: string[] = [];
  if (token.length > 3 && token.endsWith("es")) stems.push(token.slice(0, -2));
  if (token.length > 3 && token.endsWith("s")) stems.push(token.slice(0, -1));
  for (const s of stems) alts.push({ t: s, w: 0.9 });
  for (const t of [token, ...stems]) {
    for (const s of SYN.get(t) ?? []) if (s !== token) alts.push({ t: s, w: 0.7 });
  }
  return alts;
}

export function tokenize(query: string): string[] {
  const all = split(query);
  if (all.length < 2) return all;
  const kept = all.filter((t) => !STOP.has(t));
  return kept.length ? kept : all;
}

export type Doc = {
  item: SearchItem;
  tw: string[];
  tn: string;
  kww: string[];
  kwt: string;
  sw: string[];
  cw: string[];
};

export function buildDocs(items: SearchItem[]): Doc[] {
  return items.map((item) => {
    const kw = (item.keywords ?? []).map(norm);
    return {
      item,
      tw: split(item.title),
      tn: norm(item.title),
      kww: [...new Set(kw.flatMap((k) => split(k)))],
      kwt: kw.join(" | "),
      sw: split(item.summary),
      cw: split(`${item.categoryTitle} ${item.langTitle} ${item.lang} ${item.slug}`),
    };
  });
}

function lev1(a: string, b: string) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) return a.slice(i + 1) === b.slice(i + 1);
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

function tokenScore(doc: Doc, alts: Alt[]): number {
  let best = 0;
  for (const { t, w } of alts) {
    let s = 0;
    if (doc.tw.includes(t)) s = 10;
    else if (t.length >= 3 && doc.tw.some((x) => x.startsWith(t))) s = 7;
    if (doc.kww.includes(t)) s = Math.max(s, 8);
    else if (t.length >= 3 && doc.kww.some((x) => x.startsWith(t))) s = Math.max(s, 6);
    if (s < 5 && t.length >= 4 && doc.kwt.includes(t)) s = Math.max(s, 4);
    if (s < 5 && t.length >= 3 && doc.tn.includes(t)) s = Math.max(s, 5);
    if (s < 3 && doc.sw.includes(t)) s = 3;
    if (s < 2.5 && doc.cw.includes(t)) s = 2.5;
    best = Math.max(best, s * w);
  }
  if (best === 0) {
    const t = alts[0].t;
    if (t.length >= 5 && (doc.tw.some((x) => lev1(t, x)) || doc.kww.some((x) => lev1(t, x)))) best = 3;
  }
  return best;
}

export function searchDocs(docs: Doc[], query: string, limit = 10): SearchItem[] {
  const q = norm(query).trim();
  if (!q) return [];
  const tokens = tokenize(query);
  if (!tokens.length) return [];
  const alts = tokens.map(expand);
  const phrase = tokens.join(" ");
  const needed = Math.ceil(tokens.length / 2);

  const scored: { item: SearchItem; score: number }[] = [];
  for (const doc of docs) {
    let total = 0;
    let matched = 0;
    for (const a of alts) {
      const s = tokenScore(doc, a);
      if (s > 0) {
        matched++;
        total += s;
      }
    }
    if (matched < needed) continue;
    if (matched === tokens.length) total *= 1.35;
    if (tokens.length > 1 && (doc.kwt.includes(phrase) || doc.tn.includes(phrase))) total += 12;
    if (doc.tn === q) total += 30;
    scored.push({ item: doc.item, score: total });
  }
  scored.sort((a, b) => b.score - a.score || a.item.title.length - b.item.title.length);
  return scored.slice(0, limit).map((x) => x.item);
}
