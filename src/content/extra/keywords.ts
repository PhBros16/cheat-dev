/** Palavras-chave para os comandos escritos antes do sistema de keywords (chave: lang/categoria/slug). */
export const OLD_KEYWORDS: Record<string, string> = {
  // HTML — estrutura
  "html/estrutura/header": "cabeçalho da página|topo do site|logo e menu",
  "html/estrutura/nav": "menu de navegação|barra de menu|links do menu",
  "html/estrutura/main": "conteúdo principal|corpo da página",
  "html/estrutura/section": "seção da página|bloco de conteúdo com título",
  "html/estrutura/article": "post de blog|notícia|card de conteúdo|comentário",
  // HTML — formulários
  "html/formularios/form": "formulário|enviar dados|campos de formulário",
  "html/formularios/input": "campo de texto|campo de senha|caixa de entrada|campo de email|tipo de input",
  "html/formularios/label": "rótulo do campo|texto do campo|nome do campo",
  "html/formularios/select": "lista suspensa|dropdown|caixa de seleção|combobox",
  "html/formularios/button": "botão|botão de enviar|botão clicável",
  // HTML — tabelas
  "html/tabelas/table": "criar tabela|tabela html|linhas e colunas",
  "html/tabelas/tr-td": "linha da tabela|célula da tabela|cabeçalho da tabela",
  "html/tabelas/thead-tbody": "cabeçalho e corpo da tabela|estrutura da tabela",
  "html/tabelas/th-scope": "acessibilidade de tabela|cabeçalho de linha ou coluna",
  "html/tabelas/colspan-rowspan": "mesclar células|célula ocupando várias colunas|unir células da tabela",
  // HTML — mídia
  "html/midia/img": "inserir imagem|colocar foto|imagem html|texto alternativo",
  "html/midia/picture": "imagem responsiva|formato webp|imagem por tamanho de tela",
  "html/midia/video": "inserir vídeo|player de vídeo|vídeo html",
  "html/midia/audio": "inserir áudio|tocar música|player de áudio|som html",
  "html/midia/figure-figcaption": "imagem com legenda|legenda de imagem|figura com texto",

  // CSS — layout
  "css/layout/display-flex": "alinhar itens em linha|distribuir itens|flexbox|caixa flexível",
  "css/layout/display-grid": "grade de itens|layout em grade|css grid|colunas e linhas",
  "css/layout/position": "posição fixa|posição absoluta|elemento fixo na tela|sticky",
  "css/layout/gap": "espaço entre itens|espaçamento entre colunas|gap flex grid",
  "css/layout/media-query": "responsivo|adaptar para celular|breakpoint|tela pequena",
  // CSS — seleção
  "css/selecao/combinadores": "selecionar filho direto|selecionar irmão|seletor de descendente",
  "css/selecao/pseudo-classes": "efeito ao passar o mouse|hover|linha par ímpar|estado de foco",
  "css/selecao/pseudo-elementos": "conteúdo antes e depois|ícone decorativo com css|before after",
  "css/selecao/especificidade": "conflito de estilo css|css não aplica|qual estilo vence|important",
  "css/selecao/custom-properties": "variável css|tema claro escuro|valor reutilizável no css",
  // CSS — tipografia
  "css/tipografia/font-family-weight": "trocar fonte|escolher fonte|peso da fonte|negrito com css",
  "css/tipografia/line-height": "espaço entre linhas do texto|altura da linha|entrelinha",
  "css/tipografia/text-overflow": "cortar texto com reticências|truncar texto|texto com três pontinhos",
  "css/tipografia/letter-spacing": "espaço entre letras|espaçamento de letras",
  "css/tipografia/font-face": "fonte customizada|importar fonte própria|carregar fonte",
  // CSS — efeitos
  "css/efeitos/box-shadow": "sombra na caixa|sombra no card|sombra no elemento|box shadow",
  "css/efeitos/transition": "transição de cor|suavizar mudança|animação no hover|efeito suave|transição suave",
  "css/efeitos/transform": "mover elemento com css|girar elemento|aumentar no hover|rotacionar caixa|escalar elemento",
  "css/efeitos/filter": "desfocar imagem|escurecer imagem|efeito de brilho|filtro css",
  "css/efeitos/clamp-min-max": "fonte responsiva sem media query|tamanho fluido|valor fluido",

  // JS — arrays & strings
  "js/arrays-strings/map": "transformar cada item do array|percorrer e transformar",
  "js/arrays-strings/filter": "filtrar array|selecionar itens do array",
  "js/arrays-strings/reduce": "somar valores do array|reduzir array a um valor",
  "js/arrays-strings/foreach": "percorrer array|para cada item do array",
  "js/arrays-strings/template-literals": "concatenar string|juntar texto e variável|interpolação de string",
  // JS — assíncrono & DOM
  "js/async-dom/fetch": "fazer requisição|consumir api|chamar api|requisição http",
  "js/async-dom/async-await": "esperar promise|código assíncrono|lidar com api",
  "js/async-dom/promise-all": "rodar promises juntas|esperar várias requisições",
  "js/async-dom/queryselector": "selecionar elemento no javascript|pegar elemento pelo id ou classe",
  "js/async-dom/addeventlistener": "detectar clique|evento de clique|ouvir evento|adicionar evento",
  // JS — objetos
  "js/objetos/destructuring": "extrair propriedades do objeto|pegar valores do objeto",
  "js/objetos/spread-rest": "copiar objeto|copiar array|mesclar objetos|espalhar array",
  "js/objetos/object-entries": "percorrer objeto|transformar objeto em array|chaves e valores do objeto",
  "js/objetos/optional-chaining": "acessar propriedade sem quebrar|evitar erro de undefined",
  "js/objetos/nullish-coalescing": "valor padrão se nulo|definir valor default",
  // JS — funções & escopo
  "js/funcoes/arrow-functions": "função seta|função curta|arrow function",
  "js/funcoes/this-context": "contexto da função|this em javascript|dono da função",
  "js/funcoes/closures": "função dentro de função|variável privada em javascript|estado privado",
  "js/funcoes/default-params": "valor padrão do parâmetro|argumento opcional",
  "js/funcoes/array-from-isarray": "converter para array|verificar se é um array|criar array com tamanho",

  // SQL — consultas
  "sql/consultas/select-where": "buscar dados com condição|filtrar linhas|selecionar com filtro",
  "sql/consultas/order-by": "ordenar resultado|classificar consulta|ordem crescente decrescente",
  "sql/consultas/limit": "limitar resultado|paginação sql|top n resultados",
  "sql/consultas/distinct": "remover duplicados sql|valores únicos|sem repetição",
  "sql/consultas/like": "buscar texto parecido|filtro de texto sql|busca com curinga",
  // SQL — junções & agregação
  "sql/avancado/inner-join": "juntar duas tabelas|relacionar tabelas|combinar tabelas com correspondência",
  "sql/avancado/group-by-having": "agrupar resultado|total por categoria|relatório agrupado",
  "sql/avancado/insert": "inserir dado na tabela|adicionar registro|cadastrar no banco",
  "sql/avancado/update": "atualizar registro|editar linha da tabela|alterar dado no banco",
  "sql/avancado/delete": "apagar registro|remover linha da tabela|deletar dado",
  // SQL — transações
  "sql/transacoes/begin-commit-rollback": "desfazer operação sql|confirmar mudanças no banco|transação sql",
  "sql/transacoes/primary-key": "chave primária|identificador único da tabela",
  "sql/transacoes/foreign-key": "chave estrangeira|relacionamento entre tabelas",
  "sql/transacoes/unique-not-null": "campo obrigatório|não pode repetir|coluna obrigatória",
  "sql/transacoes/check-constraint": "validar valor no banco|regra de validação sql",
  // SQL — funções & subconsultas
  "sql/funcoes/case-when": "se então no sql|condicional no select|categorizar valor sql",
  "sql/funcoes/coalesce": "valor padrão se nulo sql|substituir nulo",
  "sql/funcoes/cast": "converter tipo sql|transformar texto em número sql",
  "sql/funcoes/subquery": "consulta dentro de consulta|subconsulta sql",
  "sql/funcoes/funcoes-data": "agrupar por mês|funções de data sql|extrair ano mês dia",
};
