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
  ],
};

export default html;
