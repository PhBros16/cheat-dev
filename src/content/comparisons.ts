import { Comparison } from "@/lib/types";

export const comparisons: Comparison[] = [
  {
    slug: "let-const-var", lang: "js", tags: ["javascript", "variáveis", "escopo"],
    title: "let vs const vs var", summary: "Qual declarar variável usar, e por que var ficou para trás.",
    columns: ["var", "let", "const"],
    rows: [
      { label: "Escopo", cells: ["Função (ignora blocos { })", "Bloco { }", "Bloco { }"] },
      { label: "Reatribuir valor", cells: ["Sim", "Sim", "Não (dá erro)"] },
      { label: "Redeclarar no mesmo escopo", cells: ["Sim (esconde bugs)", "Não", "Não"] },
      { label: "Usar antes de declarar", cells: ["Vale undefined", "Erro (zona morta temporal)", "Erro (zona morta temporal)"] },
      { label: "Precisa de valor inicial", cells: ["Não", "Não", "Sim"] },
      { label: "Vira propriedade de window (global)", cells: ["Sim", "Não", "Não"] },
    ],
    verdict: "Use const por padrão. Troque para let apenas quando o valor precisar mudar (contadores, acumuladores). Evite var em código novo. Atenção: const protege a variável, não o conteúdo: um objeto ou array declarado com const ainda pode ser alterado por dentro.",
    examples: [
      { lang: "js", caption: "var vaza do bloco; let não", content: `if (true) {\n  var a = 1;\n  let b = 2;\n}\nconsole.log(a); // 1  (vazou do if)\nconsole.log(b); // ReferenceError: b is not defined` },
      { lang: "js", caption: "const não congela objetos", content: `const user = { nome: "Ana" };\nuser.nome = "Bia";   // permitido\nuser = {};           // TypeError: Assignment to constant variable.\n\nObject.freeze(user); // para impedir mudanças internas` },
      { lang: "js", caption: "O clássico do laço com var", content: `for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3\nfor (let j = 0; j < 3; j++) setTimeout(() => console.log(j)); // 0 1 2` },
    ],
  },
  {
    slug: "igual-duplo-vs-triplo", lang: "js", tags: ["javascript", "comparação", "tipos"],
    title: "== vs ===", summary: "Igualdade frouxa e estrita: quando o JavaScript converte tipos sem avisar.",
    columns: ["== (frouxa)", "=== (estrita)"],
    rows: [
      { label: "Converte tipos antes de comparar", cells: ["Sim", "Não"] },
      { label: "0 == \"0\"  /  0 === \"0\"", cells: ["true", "false"] },
      { label: "\"\" == 0  /  \"\" === 0", cells: ["true", "false"] },
      { label: "null == undefined  /  null === undefined", cells: ["true", "false"] },
      { label: "NaN contra NaN", cells: ["false", "false (use Number.isNaN)"] },
      { label: "Previsibilidade", cells: ["Baixa: regras de coerção difíceis de lembrar", "Alta"] },
    ],
    verdict: "Use sempre === e !==. A única exceção aceita por muita gente é x == null, que testa null e undefined de uma vez. Fora isso, == só gera bugs difíceis de achar.",
    examples: [
      { lang: "js", content: `console.log(1 == "1");   // true  (converteu a string)\nconsole.log(1 === "1");  // false (tipos diferentes)\n\nconsole.log([] == false);  // true  (!)\nconsole.log([] === false); // false\n\nconsole.log(NaN === NaN);          // false\nconsole.log(Number.isNaN(NaN));    // true` },
    ],
  },
  {
    slug: "margin-vs-padding", lang: "css", tags: ["css", "caixa", "espaçamento"],
    title: "margin vs padding", summary: "Espaço de fora ou de dentro da borda: qual usar em cada caso.",
    columns: ["margin", "padding"],
    rows: [
      { label: "Onde fica", cells: ["Fora da borda (entre elementos)", "Dentro da borda (entre a borda e o conteúdo)"] },
      { label: "Recebe a cor de fundo", cells: ["Não (transparente)", "Sim"] },
      { label: "Faz parte da área de clique", cells: ["Não", "Sim"] },
      { label: "Valores negativos", cells: ["Permitidos", "Não"] },
      { label: "Valor auto", cells: ["Sim (centraliza blocos com largura)", "Não"] },
      { label: "Colapso vertical entre irmãos", cells: ["Sim (vale o maior)", "Não"] },
    ],
    verdict: "Padding para dar respiro ao conteúdo de um componente (botões, cards). Margin para separar componentes entre si. Para espaço entre filhos de flex/grid, prefira gap, que evita sobras na borda e o colapso de margens.",
    examples: [
      { lang: "css", content: `.botao {\n  padding: 12px 24px; /* aumenta o botão e a área de clique */\n  background: #2f6fed;\n}\n.card + .card {\n  margin-top: 16px; /* afasta um card do outro */\n}\n.lista {\n  display: flex;\n  gap: 16px; /* melhor que margin nos filhos */\n}` },
    ],
  },
  {
    slug: "inner-vs-left-join", lang: "sql", tags: ["sql", "join", "consultas"],
    title: "INNER vs LEFT vs RIGHT vs FULL JOIN", summary: "Que linhas cada tipo de junção devolve quando falta correspondência.",
    columns: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"],
    rows: [
      { label: "Devolve", cells: ["Só linhas que casam nas duas tabelas", "Todas da esquerda + as que casam", "Todas da direita + as que casam", "Todas das duas tabelas"] },
      { label: "Sem correspondência", cells: ["A linha some", "Colunas da direita vêm NULL", "Colunas da esquerda vêm NULL", "NULL do lado que falta"] },
      { label: "Uso típico", cells: ["Pedidos com cliente", "Clientes, mesmo sem pedidos", "Raro (inverta as tabelas e use LEFT)", "Auditoria, comparar duas fontes"] },
      { label: "Suporte", cells: ["Todos os bancos", "Todos os bancos", "Todos os bancos", "Não existe no MySQL (use LEFT + UNION + RIGHT)"] },
    ],
    verdict: "INNER JOIN quando você só quer o que tem par. LEFT JOIN quando a tabela principal deve aparecer sempre (e para achar o que NÃO tem par: LEFT JOIN + WHERE coluna_da_direita IS NULL).",
    examples: [
      { lang: "sql", caption: "Todos os clientes, com a quantidade de pedidos (0 para quem nunca comprou)", content: `SELECT c.nome, COUNT(p.id) AS pedidos\nFROM clientes c\nLEFT JOIN pedidos p ON p.cliente_id = c.id\nGROUP BY c.id, c.nome;` },
      { lang: "sql", caption: "Clientes que nunca fizeram pedido", content: `SELECT c.*\nFROM clientes c\nLEFT JOIN pedidos p ON p.cliente_id = c.id\nWHERE p.id IS NULL;` },
    ],
  },
  {
    slug: "flexbox-vs-grid", lang: "css", tags: ["css", "layout", "flexbox", "grid"],
    title: "Flexbox vs Grid", summary: "Uma dimensão ou duas: como escolher a ferramenta de layout certa.",
    columns: ["Flexbox", "Grid"],
    rows: [
      { label: "Dimensões", cells: ["Uma por vez (linha OU coluna)", "Duas (linhas E colunas)"] },
      { label: "Quem manda no layout", cells: ["O conteúdo (itens crescem e encolhem)", "O contêiner (você desenha a grade)"] },
      { label: "Melhor para", cells: ["Menus, barras, botões em linha, centralizar", "Páginas inteiras, galerias, dashboards"] },
      { label: "Alinhar itens de linhas diferentes", cells: ["Cada linha é independente", "Colunas alinhadas entre todas as linhas"] },
      { label: "Sobrepor elementos", cells: ["Difícil", "Fácil (mesma célula)"] },
      { label: "Responsivo automático", cells: ["flex-wrap + flex-basis", "repeat(auto-fit, minmax(240px, 1fr))"] },
    ],
    verdict: "Não é um ou outro: Grid para a estrutura da página e das galerias, Flexbox para alinhar o conteúdo dentro de cada peça. Se você está pensando em linhas E colunas ao mesmo tempo, é Grid.",
    examples: [
      { lang: "css", caption: "Grid na estrutura, flex no componente", content: `.pagina { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }\n.card   { display: flex; justify-content: space-between; align-items: center; }` },
    ],
  },
  {
    slug: "px-vs-rem-vs-em", lang: "css", tags: ["css", "unidades", "responsivo"],
    title: "px vs rem vs em", summary: "Qual unidade usar para fonte, espaçamento e componentes.",
    columns: ["px", "rem", "em"],
    rows: [
      { label: "Relativo a", cells: ["Nada (valor fixo)", "Fonte do <html> (16px por padrão)", "Fonte do próprio elemento"] },
      { label: "Respeita a fonte configurada pelo usuário", cells: ["Não", "Sim", "Sim"] },
      { label: "Efeito em elementos aninhados", cells: ["Nenhum", "Nenhum (previsível)", "Acumula (1.2em dentro de 1.2em = 1.44)"] },
      { label: "Bom para", cells: ["Bordas finas, sombras, detalhes", "Fontes e espaçamentos globais", "Padding de botões e componentes que escalam com o texto"] },
    ],
    verdict: "rem para tipografia e espaçamento, em para ajustar componentes ao tamanho do próprio texto (padding: .6em 1.2em), px para detalhes que não devem escalar (borda de 1px).",
    examples: [
      { lang: "css", content: `html { font-size: 100%; }          /* respeita a preferência do usuário */\nh1   { font-size: 2.5rem; }          /* 40px por padrão */\n.btn { font-size: 1rem; padding: .6em 1.2em; border: 1px solid; }` },
    ],
  },
  {
    slug: "display-none-vs-visibility-vs-opacity", lang: "css", tags: ["css", "visibilidade", "acessibilidade"],
    title: "display:none vs visibility:hidden vs opacity:0", summary: "Três jeitos de esconder, com efeitos bem diferentes em layout, clique e leitores de tela.",
    columns: ["display: none", "visibility: hidden", "opacity: 0"],
    rows: [
      { label: "Ocupa espaço no layout", cells: ["Não", "Sim", "Sim"] },
      { label: "Recebe cliques e foco", cells: ["Não", "Não", "Sim (continua clicável!)"] },
      { label: "Leitores de tela", cells: ["Ignoram", "Ignoram", "Ainda leem"] },
      { label: "Dá para animar", cells: ["Só com transition-behavior: allow-discrete", "Sim (salto discreto)", "Sim, suave"] },
      { label: "Uso típico", cells: ["Remover de verdade (abas, menus fechados)", "Esconder mantendo o espaço", "Fade in/out"] },
    ],
    verdict: "Para fade, combine opacity com visibility (ou pointer-events: none) para que o elemento invisível não receba cliques. Para remover de verdade, display: none.",
    examples: [
      { lang: "css", content: `.toast {\n  opacity: 0;\n  visibility: hidden;      /* some do foco e dos cliques */\n  transition: opacity .3s, visibility .3s;\n}\n.toast.visivel { opacity: 1; visibility: visible; }` },
    ],
  },
  {
    slug: "block-vs-inline-vs-inline-block", lang: "css", tags: ["css", "display", "caixa"],
    title: "block vs inline vs inline-block", summary: "Como cada tipo de display se comporta com largura, altura e quebra de linha.",
    columns: ["block", "inline", "inline-block"],
    rows: [
      { label: "Começa em nova linha", cells: ["Sim", "Não", "Não"] },
      { label: "Largura padrão", cells: ["100% do pai", "Só o conteúdo", "Só o conteúdo"] },
      { label: "Aceita width e height", cells: ["Sim", "Não", "Sim"] },
      { label: "Margin/padding verticais", cells: ["Sim", "Não afetam o layout das linhas", "Sim"] },
      { label: "Exemplos", cells: ["div, p, section, h1", "span, a, strong", "button, img, input"] },
    ],
    verdict: "Precisa de largura/altura em um item que fica no meio do texto: inline-block. Hoje, para alinhar coisas lado a lado, flexbox/grid substituem a maioria dos usos de inline-block.",
    examples: [
      { lang: "css", content: `a.botao {\n  display: inline-block; /* a (inline) passa a aceitar padding e largura */\n  padding: 10px 20px;\n  min-width: 120px;\n  text-align: center;\n}` },
    ],
  },
  {
    slug: "map-foreach-filter-reduce", lang: "js", tags: ["javascript", "arrays"],
    title: "map vs forEach vs filter vs reduce", summary: "Os quatro métodos de array mais usados e o que cada um devolve.",
    columns: ["map", "forEach", "filter", "reduce"],
    rows: [
      { label: "Devolve", cells: ["Novo array, mesmo tamanho", "undefined", "Novo array, só os que passam no teste", "Um único valor (número, objeto, array...)"] },
      { label: "Para que serve", cells: ["Transformar cada item", "Executar efeito colateral (log, DOM)", "Selecionar itens", "Somar, agrupar, montar objeto"] },
      { label: "Encadeável", cells: ["Sim", "Não", "Sim", "Sim"] },
      { label: "Altera o array original", cells: ["Não", "Não (a menos que você faça)", "Não", "Não"] },
    ],
    verdict: "Se precisa do resultado: map, filter ou reduce. Se só quer 'fazer algo' com cada item: forEach (ou for...of). Usar map sem aproveitar o retorno é um sinal de que você queria forEach.",
    examples: [
      { lang: "js", content: `const preços = [10, 25, 40, 5];\n\nconst comImposto = preços.map((p) => p * 1.1);      // [11, 27.5, 44, 5.5]\nconst caros = preços.filter((p) => p > 20);         // [25, 40]\nconst total = preços.reduce((soma, p) => soma + p, 0); // 80\npreços.forEach((p) => console.log(p));               // só imprime\n\n// encadeando\nconst totalCaros = preços.filter((p) => p > 20).reduce((s, p) => s + p, 0); // 65` },
    ],
  },
  {
    slug: "where-vs-having", lang: "sql", tags: ["sql", "filtros", "agregação"],
    title: "WHERE vs HAVING", summary: "Filtrar linhas antes de agrupar ou grupos depois de agregar.",
    columns: ["WHERE", "HAVING"],
    rows: [
      { label: "Filtra", cells: ["Linhas individuais", "Grupos já formados"] },
      { label: "Executa", cells: ["Antes do GROUP BY", "Depois do GROUP BY"] },
      { label: "Aceita COUNT, SUM, AVG...", cells: ["Não", "Sim"] },
      { label: "Desempenho", cells: ["Melhor: reduz as linhas cedo", "Mais caro: filtra depois de agrupar"] },
    ],
    verdict: "Se a condição pode ser feita sobre a linha crua, use WHERE (mais rápido). Use HAVING só quando o filtro depende de uma agregação, como 'clientes com mais de 5 pedidos'.",
    examples: [
      { lang: "sql", content: `SELECT cliente_id, COUNT(*) AS pedidos, SUM(total) AS gasto\nFROM pedidos\nWHERE status = 'pago'          -- filtra linhas primeiro\nGROUP BY cliente_id\nHAVING COUNT(*) > 5;           -- depois filtra os grupos` },
    ],
  },
];

export const getComparison = (slug: string) => comparisons.find((c) => c.slug === slug);
