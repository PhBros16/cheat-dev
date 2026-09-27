import { Language } from "@/lib/types";

const html: Language = {
  slug: "html",
  title: "HTML",
  short: "HyperText Markup Language",
  tagline: "A estrutura de toda página web.",
  color: "#E4572E",
  codeLang: "html",
  categories: [
    {
      slug: "estrutura",
      title: "Estrutura & Semântica",
      description:
        "As tags que organizam o esqueleto de uma página e dizem ao navegador (e a quem lê o código) o papel de cada parte.",
      entries: [
        {
          slug: "header",
          title: "<header>",
          summary: "Cabeçalho de uma página ou de uma seção.",
          syntax: "<header>...</header>",
          description: [
            "Agrupa o conteúdo introdutório de uma página ou de uma <section>/<article>: normalmente logo, título e navegação principal.",
            "Pode existir mais de um <header> na mesma página — um para o site inteiro e outros dentro de artigos, por exemplo.",
          ],
          examples: [
            {
              code: `<header>
  <img src="/logo.svg" alt="Logo da empresa" />
  <h1>Minha Loja</h1>
  <nav>
    <a href="/">Início</a>
    <a href="/produtos">Produtos</a>
  </nav>
</header>`,
            },
          ],
          useWhen: [
            "Para o cabeçalho principal do site (logo + navegação)",
            "Para introduzir um <article> ou <section> específico",
          ],
          avoidWhen: [
            "Só porque é 'a primeira coisa da página' — se não é conteúdo introdutório, use <div>",
          ],
          related: ["html/estrutura/nav", "html/estrutura/main"],
        },
        {
          slug: "nav",
          title: "<nav>",
          summary: "Bloco de links de navegação.",
          syntax: "<nav>...</nav>",
          description: [
            "Marca um grupo de links usados para navegar pelo site ou pela página atual (menu principal, breadcrumbs, sumário).",
            "Nem todo grupo de links precisa de <nav> — reserve para os blocos de navegação de fato, não para qualquer lista de links no rodapé.",
          ],
          examples: [
            {
              code: `<nav aria-label="Navegação principal">
  <ul>
    <li><a href="/">Início</a></li>
    <li><a href="/sobre">Sobre</a></li>
    <li><a href="/contato">Contato</a></li>
  </ul>
</nav>`,
            },
          ],
          useWhen: [
            "Menu principal do site",
            "Breadcrumbs (trilha de navegação)",
            "Sumário/índice de um artigo longo",
          ],
          avoidWhen: ["Um ou dois links soltos no meio de um parágrafo"],
          related: ["html/estrutura/header"],
        },
        {
          slug: "main",
          title: "<main>",
          summary: "O conteúdo principal e único da página.",
          syntax: "<main>...</main>",
          description: [
            "Envolve o conteúdo central da página — aquilo que a diferencia de qualquer outra página do site (sem contar header, nav, sidebar e footer repetidos).",
            "Deve aparecer só uma vez por página e nunca dentro de <article>, <aside>, <header/nav/footer>.",
          ],
          examples: [
            {
              code: `<body>
  <header>...</header>
  <main>
    <h1>Bem-vindo</h1>
    <p>Este é o conteúdo único desta página.</p>
  </main>
  <footer>...</footer>
</body>`,
            },
          ],
          useWhen: ["Sempre — toda página deveria ter exatamente um <main>"],
          avoidWhen: ["Mais de um <main> visível na mesma página"],
        },
        {
          slug: "section",
          title: "<section>",
          summary: "Agrupa conteúdo tematicamente relacionado.",
          syntax: "<section>\n  <h2>Título</h2>\n  ...\n</section>",
          description: [
            "Representa uma seção genérica de conteúdo que, em geral, tem seu próprio título (h2, h3...).",
            "Se o bloco não tiver um título nem fizer sentido sozinho no sumário do documento, provavelmente é só uma <div> de estilo — não uma <section>.",
          ],
          examples: [
            {
              code: `<section>
  <h2>Depoimentos</h2>
  <p>O que nossos clientes dizem...</p>
</section>`,
            },
          ],
          useWhen: [
            "Blocos de conteúdo com título próprio (capítulos, depoimentos, features)",
          ],
          avoidWhen: [
            "Só para agrupar elementos visualmente — nesse caso use <div>",
          ],
          related: ["html/estrutura/article"],
        },
        {
          slug: "article",
          title: "<article>",
          summary: "Conteúdo independente e reutilizável.",
          syntax: "<article>...</article>",
          description: [
            "Um bloco que faz sentido sozinho, fora de contexto — um post de blog, uma notícia, um comentário, um card de produto.",
            "A diferença para <section>: um <article> poderia ser copiado para outro site e ainda fazer sentido.",
          ],
          examples: [
            {
              code: `<article>
  <h2>Como escolher seu primeiro teclado mecânico</h2>
  <p>Publicado em 12/03/2026</p>
  <p>Texto do artigo...</p>
</article>`,
            },
          ],
          useWhen: ["Posts de blog", "Notícias", "Comentários", "Cards de produto em uma listagem"],
          avoidWhen: ["Conteúdo que só faz sentido dentro do layout da página"],
          related: ["html/estrutura/section"],
        },
      ],
    },
    {
      slug: "formularios",
      title: "Formulários & Inputs",
      description:
        "Os elementos que capturam dados do usuário — a base de qualquer cadastro, login ou busca.",
      entries: [
        {
          slug: "form",
          title: "<form>",
          summary: "Envolve os campos que serão enviados juntos.",
          syntax: `<form action="/enviar" method="post">...</form>`,
          description: [
            "Agrupa campos de entrada e define para onde (action) e como (method: get ou post) os dados vão quando o formulário é enviado.",
            "Em apps modernos, é comum usar method='post' e capturar o evento 'submit' via JavaScript em vez de deixar o navegador navegar de fato.",
          ],
          examples: [
            {
              code: `<form action="/login" method="post">
  <label for="email">E-mail</label>
  <input id="email" name="email" type="email" required />

  <button type="submit">Entrar</button>
</form>`,
            },
          ],
          useWhen: ["Qualquer conjunto de campos que será enviado junto (login, cadastro, busca)"],
          avoidWhen: ["Um único botão de ação que não envia dados — aí um <button> solto basta"],
          related: ["html/formularios/input", "html/formularios/button"],
        },
        {
          slug: "input",
          title: "<input>",
          summary: "Campo de entrada — muda de comportamento pelo atributo type.",
          syntax: `<input type="text|email|password|number|checkbox|radio|date..." />`,
          description: [
            "É o elemento mais versátil de formulário: o atributo 'type' decide se vira campo de texto, número, data, checkbox, seletor de arquivo, etc.",
            "Atributos úteis: 'required' (obrigatório), 'placeholder' (texto de exemplo), 'pattern' (validação por regex), 'min/max' (para number e date).",
          ],
          examples: [
            {
              code: `<input type="email" placeholder="voce@email.com" required />
<input type="password" minlength="8" required />
<input type="checkbox" id="aceite" />
<label for="aceite">Aceito os termos</label>`,
            },
          ],
          useWhen: ["Sempre prefira o 'type' correto (email, tel, number...) — melhora teclado mobile e validação nativa"],
          avoidWhen: ["type='text' para tudo, quando existe um tipo mais específico"],
          related: ["html/formularios/label", "html/formularios/select"],
        },
        {
          slug: "label",
          title: "<label>",
          summary: "Rótulo acessível para um campo de formulário.",
          syntax: `<label for="id-do-campo">Texto</label>`,
          description: [
            "Conecta um texto descritivo a um input pelo atributo 'for' (que deve bater com o 'id' do input).",
            "Clicar no label foca/ativa o campo automaticamente — essencial para acessibilidade e para checkboxes/radios fáceis de clicar.",
          ],
          examples: [
            {
              code: `<label for="nome">Nome completo</label>
<input id="nome" name="nome" type="text" />

<!-- ou envolvendo o input, sem precisar de 'for' -->
<label>
  Nome completo
  <input name="nome" type="text" />
</label>`,
            },
          ],
          useWhen: ["Todo campo de formulário deveria ter um label — mesmo que visualmente escondido"],
          avoidWhen: ["Nunca pule o label só usando placeholder como substituto"],
        },
        {
          slug: "select",
          title: "<select>",
          summary: "Lista suspensa de opções.",
          syntax: `<select>\n  <option value="valor">Texto</option>\n</select>`,
          description: [
            "Cria uma caixa de seleção com várias <option>. O atributo 'value' de cada option é o que é enviado no formulário — o texto entre as tags é só o que aparece.",
            "Use 'multiple' para permitir mais de uma seleção, e <optgroup> para agrupar opções relacionadas.",
          ],
          examples: [
            {
              code: `<label for="estado">Estado</label>
<select id="estado" name="estado">
  <option value="">Selecione...</option>
  <option value="RN">Rio Grande do Norte</option>
  <option value="SP">São Paulo</option>
</select>`,
            },
          ],
          useWhen: ["Poucas a médias opções conhecidas de antemão (estados, categorias)"],
          avoidWhen: ["Dezenas de opções que precisam de busca — considere um combobox customizado"],
        },
        {
          slug: "button",
          title: "<button>",
          summary: "Botão clicável — o type decide o que ele faz dentro de um form.",
          syntax: `<button type="button|submit|reset">Texto</button>`,
          description: [
            "Dentro de um <form>, type='submit' (padrão) envia o formulário; type='reset' limpa os campos; type='button' não faz nada sozinho — só dispara o JavaScript que você conectar a ele.",
            "Prefira <button> a uma <div> ou <a> clicável: ele já vem com foco de teclado, Enter/Espaço para ativar e semântica correta de graça.",
          ],
          examples: [
            {
              code: `<form>
  <button type="submit">Salvar</button>
  <button type="button" onclick="fecharModal()">Cancelar</button>
</form>`,
            },
          ],
          useWhen: ["Qualquer ação clicável que não navega para outra URL"],
          avoidWhen: ["Navegação para outra página — nesse caso use <a href>"],
          related: ["html/formularios/form"],
        },
      ],
    },
    {
      slug: "tabelas",
      title: "Tabelas",
      description:
        "As tags certas pra exibir dados tabulares — sem abusar de tabela pra fazer layout, coisa do passado.",
      entries: [
        {
          slug: "table",
          title: "<table>",
          summary: "Envolve uma tabela de dados completa.",
          syntax: "<table>\n  <thead>...</thead>\n  <tbody>...</tbody>\n</table>",
          description: [
            "Marca o início de uma tabela. Hoje em dia serve só para dados tabulares de verdade (planilhas, comparativos, relatórios) — layout de página é trabalho do CSS (flex/grid).",
          ],
          examples: [
            {
              code: `<table>
  <caption>Preços por plano</caption>
  <thead>
    <tr><th>Plano</th><th>Preço</th></tr>
  </thead>
  <tbody>
    <tr><td>Básico</td><td>R$ 19</td></tr>
  </tbody>
</table>`,
            },
          ],
          useWhen: ["Exibir dados que fazem sentido em linhas e colunas (preços, comparativos, planilhas)"],
          avoidWhen: ["Montar o layout visual da página — isso é papel do CSS"],
          related: ["html/tabelas/tr-td", "html/tabelas/thead-tbody"],
        },
        {
          slug: "tr-td",
          title: "<tr> / <td> / <th>",
          summary: "Linha, célula de dado e célula de cabeçalho.",
          syntax: "<tr>\n  <th>Cabeçalho</th>\n  <td>Dado</td>\n</tr>",
          description: [
            "<tr> é uma linha da tabela. <td> é uma célula comum de dado. <th> é uma célula de cabeçalho (linha ou coluna) — navegadores a exibem em negrito/centralizada por padrão, e leitores de tela usam <th> para anunciar a que coluna/linha um <td> pertence.",
          ],
          examples: [
            {
              code: `<tr>
  <th>Nome</th>
  <th>Idade</th>
</tr>
<tr>
  <td>Ana</td>
  <td>28</td>
</tr>`,
            },
          ],
          useWhen: ["<th> para os cabeçalhos de linha/coluna, <td> para os dados"],
          avoidWhen: ["Usar <td> em negrito via CSS no lugar de <th> — perde a semântica para acessibilidade"],
          related: ["html/tabelas/table", "html/tabelas/th-scope"],
        },
        {
          slug: "thead-tbody",
          title: "<thead> / <tbody> / <tfoot>",
          summary: "Agrupam as linhas de cabeçalho, corpo e rodapé da tabela.",
          syntax: "<table>\n  <thead>...</thead>\n  <tbody>...</tbody>\n  <tfoot>...</tfoot>\n</table>",
          description: [
            "Organizam a tabela em três blocos semânticos. Não são obrigatórios para a tabela funcionar visualmente, mas ajudam leitores de tela e permitem estilizar cada bloco separadamente com CSS (ex: fixar o thead ao rolar).",
          ],
          examples: [
            {
              code: `<table>
  <thead>
    <tr><th>Produto</th><th>Total</th></tr>
  </thead>
  <tbody>
    <tr><td>Mouse</td><td>R$ 80</td></tr>
  </tbody>
  <tfoot>
    <tr><td>Total</td><td>R$ 80</td></tr>
  </tfoot>
</table>`,
            },
          ],
          useWhen: ["Tabelas com mais de uma linha de dados — organiza e melhora acessibilidade"],
          avoidWhen: ["Tabelas de uma linha só, onde a estrutura extra não ajuda muito"],
          related: ["html/tabelas/table"],
        },
        {
          slug: "th-scope",
          title: "th[scope]",
          summary: "Diz se um cabeçalho se refere à linha ou à coluna.",
          syntax: `<th scope="col">...</th>\n<th scope="row">...</th>`,
          description: [
            "O atributo 'scope' remove a ambiguidade para leitores de tela: 'col' indica que aquele <th> é cabeçalho de uma coluna inteira, 'row' que é cabeçalho daquela linha. Essencial em tabelas com cabeçalhos nos dois eixos.",
          ],
          examples: [
            {
              code: `<tr>
  <th scope="row">Janeiro</th>
  <td>120</td>
  <td>80</td>
</tr>`,
            },
          ],
          useWhen: ["Tabelas com cabeçalho de linha E de coluna ao mesmo tempo"],
          avoidWhen: ["Tabelas simples com cabeçalho só no topo — ainda assim não faz mal usar 'col'"],
          related: ["html/tabelas/tr-td"],
        },
        {
          slug: "colspan-rowspan",
          title: "colspan / rowspan",
          summary: "Faz uma célula ocupar mais de uma coluna ou linha.",
          syntax: `<td colspan="2">...</td>\n<td rowspan="3">...</td>`,
          description: [
            "'colspan' estica a célula por N colunas; 'rowspan' estica por N linhas. Útil para células de totais, agrupamentos e cabeçalhos que abrangem várias colunas.",
          ],
          examples: [
            {
              code: `<tr>
  <td colspan="2">Total geral</td>
  <td>R$ 500</td>
</tr>`,
              caption: "A primeira célula ocupa o espaço de duas colunas",
            },
          ],
          useWhen: ["Células de totais/resumo que abrangem múltiplas colunas ou linhas"],
          avoidWhen: ["Excesso de spans deixa a tabela difícil de ler por leitores de tela — use com moderação"],
        },
      ],
    },
    {
      slug: "midia",
      title: "Mídia",
      description:
        "Como colocar imagens, vídeo e áudio na página de forma responsiva e acessível.",
      entries: [
        {
          slug: "img",
          title: "<img>",
          summary: "Exibe uma imagem — o atributo alt é obrigatório de verdade.",
          syntax: `<img src="caminho.jpg" alt="Descrição" width="800" height="600" />`,
          description: [
            "'alt' descreve a imagem para quem usa leitor de tela ou quando a imagem falha ao carregar — deixe vazio (alt=\"\") só se a imagem for puramente decorativa.",
            "Sempre defina 'width' e 'height' (ou aspect-ratio via CSS): isso evita que a página 'pule' enquanto a imagem carrega (Cumulative Layout Shift).",
          ],
          examples: [
            {
              code: `<img
  src="/gato.jpg"
  alt="Gato laranja dormindo em um sofá"
  width="800"
  height="600"
  loading="lazy"
/>`,
            },
          ],
          useWhen: ["Toda imagem de conteúdo — sempre com alt descritivo"],
          avoidWhen: ["alt genérico tipo 'imagem' ou 'foto1.jpg' — não ajuda ninguém"],
          related: ["html/midia/picture"],
        },
        {
          slug: "picture",
          title: "<picture>",
          summary: "Serve imagens diferentes conforme a tela ou formato suportado.",
          syntax: `<picture>\n  <source srcset="img.webp" type="image/webp" />\n  <img src="img.jpg" alt="..." />\n</picture>`,
          description: [
            "Permite oferecer várias fontes de imagem (formatos modernos como WebP/AVIF, ou tamanhos diferentes por breakpoint) e o navegador escolhe a melhor. O <img> dentro é obrigatório como fallback final.",
          ],
          examples: [
            {
              code: `<picture>
  <source srcset="banner.avif" type="image/avif" />
  <source srcset="banner.webp" type="image/webp" />
  <img src="banner.jpg" alt="Banner promocional" />
</picture>`,
            },
          ],
          useWhen: ["Servir formatos modernos (WebP/AVIF) com fallback, ou imagens diferentes por tamanho de tela"],
          avoidWhen: ["Um único formato/tamanho de imagem já resolve — <img> sozinho basta"],
          related: ["html/midia/img"],
        },
        {
          slug: "video",
          title: "<video>",
          summary: "Player de vídeo nativo do navegador.",
          syntax: `<video controls width="640" poster="capa.jpg">\n  <source src="video.mp4" type="video/mp4" />\n</video>`,
          description: [
            "'controls' mostra os controles nativos (play, volume, tela cheia). 'poster' é a imagem exibida antes do play. 'autoplay' só funciona de fato combinado com 'muted' na maioria dos navegadores.",
          ],
          examples: [
            {
              code: `<video controls width="640" poster="/capa.jpg">
  <source src="/demo.mp4" type="video/mp4" />
  Seu navegador não suporta vídeo HTML5.
</video>`,
            },
          ],
          useWhen: ["Vídeo próprio, sem precisar de player de terceiros (YouTube, Vimeo)"],
          avoidWhen: ["autoplay com som — a maioria dos navegadores bloqueia e irrita o usuário"],
        },
        {
          slug: "audio",
          title: "<audio>",
          summary: "Player de áudio nativo do navegador.",
          syntax: `<audio controls>\n  <source src="musica.mp3" type="audio/mpeg" />\n</audio>`,
          description: [
            "Mesma lógica do <video>, mas para áudio: 'controls' exibe os controles nativos, pode ter múltiplos <source> como fallback de formato.",
          ],
          examples: [
            {
              code: `<audio controls>
  <source src="/podcast.mp3" type="audio/mpeg" />
  <source src="/podcast.ogg" type="audio/ogg" />
</audio>`,
            },
          ],
          useWhen: ["Player de áudio simples (podcast, efeito sonoro, trilha)"],
          avoidWhen: ["Precisa de recursos avançados (playlist, visualizador) — aí vale um player em JS"],
        },
        {
          slug: "figure-figcaption",
          title: "<figure> / <figcaption>",
          summary: "Agrupa uma mídia com sua legenda.",
          syntax: `<figure>\n  <img src="..." alt="..." />\n  <figcaption>Legenda</figcaption>\n</figure>`,
          description: [
            "<figure> marca um conteúdo autocontido (imagem, gráfico, código, vídeo) que poderia ser movido para outro lugar do documento sem quebrar o fluxo do texto — normalmente citado a partir do texto principal. <figcaption> é a legenda associada.",
          ],
          examples: [
            {
              code: `<figure>
  <img src="/grafico.png" alt="Gráfico de vendas por mês" />
  <figcaption>Fig. 1 — Vendas cresceram 20% no trimestre</figcaption>
</figure>`,
            },
          ],
          useWhen: ["Imagens/gráficos com legenda explicativa"],
          avoidWhen: ["Só para estilizar uma imagem sem legenda nenhuma — <div> já resolve"],
        },
      ],
    },
  ],
};

export default html;
