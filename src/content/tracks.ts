import type { Lang } from "@/content/challenges";

/** Trilha = uma sequência ORDENADA de desafios (do básico ao avançado). A ordem do array `ids` é a ordem de aprendizado. */
export type Track = { id: string; lang: Lang; title: string; desc: string; ids: string[] };

export const TRACKS: Track[] = [
  /* ============================== HTML ============================== */
  { id: "html-comecando", lang: "html", title: "Primeiros passos", desc: "Títulos, texto, links, listas e o esqueleto de uma página.",
    ids: ["html-titulos", "html-paragrafos", "html-enfase", "html-links", "html-listas", "html-esqueleto"] },
  { id: "html-estrutura", lang: "html", title: "Estrutura e semântica", desc: "Tags com significado: header, main, section, figure e mais.",
    ids: ["html-semantica", "html-secoes", "html-figure", "html-detalhes"] },
  { id: "html-dados", lang: "html", title: "Tabelas e listas", desc: "Organize dados em tabelas e menus aninhados.",
    ids: ["html-tabela-basica", "html-tabela", "html-lista-aninhada"] },
  { id: "html-formularios", lang: "html", title: "Formulários", desc: "Campos, rótulos, escolhas e validação nativa.",
    ids: ["html-form-basico", "html-select-textarea", "html-radio-check", "html-form", "html-validacao"] },
  { id: "html-midia", lang: "html", title: "Imagens, áudio e vídeo", desc: "Mídia bem feita: acessível e responsiva.",
    ids: ["html-img", "html-video-audio", "html-picture"] },
  { id: "html-qualidade", lang: "html", title: "Acessibilidade e SEO", desc: "Páginas que todos conseguem usar e que os buscadores entendem.",
    ids: ["html-headings", "html-aria", "html-a11y", "html-seo"] },
  { id: "html-projeto", lang: "html", title: "Projeto final", desc: "Junte tudo numa página completa.", ids: ["html-completa"] },

  /* ============================== CSS ============================== */
  { id: "css-comecando", lang: "css", title: "Primeiros passos", desc: "Seletores, cores, fontes, texto e bordas.",
    ids: ["css-azul", "css-seletores", "css-cores-fundo", "css-fonte", "css-texto", "css-borda"] },
  { id: "css-caixa", lang: "css", title: "Modelo de caixa", desc: "Tamanho, margem, espaçamento e sombras.",
    ids: ["css-card", "css-margem", "css-display", "css-sombra"] },
  { id: "css-layout", lang: "css", title: "Layout", desc: "Posicionamento, Flexbox e Grid.",
    ids: ["css-centro", "css-position", "css-navbar", "css-flex-wrap", "css-grid3", "css-grid-auto", "css-sticky"] },
  { id: "css-responsivo", lang: "css", title: "Responsivo", desc: "Unidades relativas, media queries e tipografia fluida.",
    ids: ["css-unidades", "css-media", "css-clamp"] },
  { id: "css-efeitos", lang: "css", title: "Efeitos e animação", desc: "Hover, transformações, gradientes, variáveis e animações.",
    ids: ["css-hover", "css-transform", "css-gradiente", "css-pseudo", "css-vars", "css-flip", "css-anim"] },
  { id: "css-projeto", lang: "css", title: "Projeto final", desc: "Um layout completo com Grid.", ids: ["css-areas"] },

  /* ============================== JAVASCRIPT ============================== */
  { id: "js-basico", lang: "js", title: "Primeiros passos", desc: "Funções, operadores e texto: o começo de tudo.",
    ids: ["js-ola", "js-soma", "js-area", "js-celsius", "js-par"] },
  { id: "js-controle", lang: "js", title: "Decisões e repetições", desc: "if, switch, for e while.",
    ids: ["js-idade", "js-dia-semana", "js-tabuada", "js-somar-ate", "js-fatorial", "js-fizzbuzz"] },
  { id: "js-strings", lang: "js", title: "Textos", desc: "Manipular strings.",
    ids: ["js-capitalizar", "js-contar-palavras", "js-truncar", "js-inverter", "js-vogais", "js-palindromo"] },
  { id: "js-arrays", lang: "js", title: "Arrays", desc: "map, filter, reduce e companhia.",
    ids: ["js-dobrar", "js-filtrar-maiores", "js-somar-lista", "js-maior", "js-soma-pares", "js-duplicados", "js-ordenar-numeros", "js-achatar", "js-chunk"] },
  { id: "js-objetos", lang: "js", title: "Objetos", desc: "Propriedades, spread e desestruturação.",
    ids: ["js-nome-completo", "js-contar-letras", "js-pegar", "js-merge", "js-agrupar"] },
  { id: "js-dom", lang: "js", title: "DOM e eventos", desc: "Faça a página reagir: textos, cliques, classes e listas.",
    ids: ["js-dom-texto", "js-dom-clique", "js-dom-classe", "js-dom-lista", "js-dom-input"] },
  { id: "js-assincrono", lang: "js", title: "Tempo e promessas", desc: "setTimeout, Promises e async/await.",
    ids: ["js-esperar", "js-async-await", "js-retry", "js-debounce", "js-promise-all"] },
  { id: "js-algoritmos", lang: "js", title: "Algoritmos e padrões", desc: "Cache, currying e parsers: nível profissional.",
    ids: ["js-memoize", "js-curry", "js-lru", "js-query"] },

  /* ============================== SQL ============================== */
  { id: "sql-selecionar", lang: "sql", title: "Selecionar dados", desc: "SELECT, DISTINCT, LIMIT e CASE.",
    ids: ["sql-colunas", "sql-alias", "sql-distinct", "loja-2", "sql-order-multi", "sql-limit-offset", "sql-upper-length", "sql-coalesce", "sql-case"] },
  { id: "sql-filtrar", lang: "sql", title: "Filtrar", desc: "WHERE, LIKE, BETWEEN, IN e valores nulos.",
    ids: ["loja-1", "sql-not", "sql-like", "sql-between", "sql-between-datas", "sql-in", "sql-and-or", "loja-3", "loja-4", "escola-1", "rh-1", "sql-datas-texto", "sql-nulos"] },
  { id: "sql-agregar", lang: "sql", title: "Contar, somar e agrupar", desc: "COUNT, AVG, MIN, MAX, GROUP BY e HAVING.",
    ids: ["sql-count", "sql-agregacoes-multiplas", "escola-2", "rh-2", "sql-minmax", "sql-soma-por", "sql-count-distinct", "sql-having", "escola-3", "sql-case-agg", "escola-4", "loja-10"] },
  { id: "sql-juntar", lang: "sql", title: "Juntar tabelas", desc: "INNER JOIN, LEFT JOIN e auto-junção.",
    ids: ["loja-5", "loja-6", "sql-join-tres", "loja-7", "loja-8", "rh-4", "sql-union"] },
  { id: "sql-subconsultas", lang: "sql", title: "Subconsultas", desc: "Consultas dentro de consultas.",
    ids: ["sql-subquery-escalar", "sql-in-subquery", "rh-3", "sql-exists", "loja-9", "loja-11"] },
  { id: "sql-avancado", lang: "sql", title: "CTE e funções de janela", desc: "WITH, RECURSIVE e OVER: o nível dos chefes.",
    ids: ["loja-12", "escola-5", "rh-5", "loja-13", "rh-6"] },
  { id: "sql-projeto", lang: "sql", title: "Projeto: relatório de vendas", desc: "Monte um relatório de vendas completo em 5 passos que se constroem.",
    ids: ["sql-proj-1", "sql-proj-2", "sql-proj-3", "sql-proj-4", "sql-proj-5"] },
];

export const TRACK_BY_ID = new Map(TRACKS.map((t) => [t.id, t]));
export const TRACK_OF = new Map<string, string>(TRACKS.flatMap((t) => t.ids.map((id) => [id, t.id] as [string, string])));
