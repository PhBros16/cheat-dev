import { Language } from "@/lib/types";

const css: Language = {
  slug: "css",
  title: "CSS",
  short: "Cascading Style Sheets",
  tagline: "Como cada elemento se parece e se posiciona.",
  color: "#2F6FED",
  codeLang: "css",
  categories: [
    {
      slug: "layout",
      title: "Layout Moderno",
      description:
        "As ferramentas que decidem onde cada coisa fica na tela — a base de qualquer layout responsivo hoje em dia.",
      entries: [
        {
          slug: "display-flex",
          title: "display: flex",
          summary: "Organiza filhos em uma linha ou coluna flexível.",
          syntax: `.container {\n  display: flex;\n}`,
          description: [
            "Transforma o elemento em um contêiner flexível: seus filhos diretos se alinham em linha (padrão) ou coluna, e você controla espaçamento e alinhamento com poucas propriedades.",
            "As propriedades mais usadas junto com flex: justify-content (eixo principal), align-items (eixo cruzado) e gap (espaço entre itens).",
          ],
          examples: [
            {
              code: `.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}`,
              caption: "Barra de navegação com itens espaçados e centralizados verticalmente",
            },
          ],
          useWhen: ["Alinhar itens em uma linha/coluna", "Distribuir espaço entre poucos elementos", "Centralizar algo vertical e horizontalmente"],
          avoidWhen: ["Layouts de grade 2D complexos com muitas linhas e colunas — aí Grid costuma ser mais direto"],
          related: ["css/layout/display-grid", "css/layout/gap"],
        },
        {
          slug: "display-grid",
          title: "display: grid",
          summary: "Cria uma grade bidimensional de linhas e colunas.",
          syntax: `.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}`,
          description: [
            "Enquanto Flexbox pensa em uma dimensão por vez, Grid controla linhas E colunas ao mesmo tempo — ideal para layouts de página inteira ou cards em grade.",
            "'fr' é uma unidade de fração do espaço disponível: repeat(3, 1fr) cria 3 colunas de largura igual.",
          ],
          examples: [
            {
              code: `.galeria {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}`,
              caption: "Grade responsiva que ajusta o nº de colunas automaticamente",
            },
          ],
          useWhen: ["Grades de cards, galerias, layout de página (header/sidebar/main/footer)"],
          avoidWhen: ["Alinhar poucos itens em uma única linha — Flexbox é mais simples"],
          related: ["css/layout/display-flex"],
        },
        {
          slug: "position",
          title: "position",
          summary: "Define como um elemento é posicionado no fluxo.",
          syntax: `.el {\n  position: static | relative | absolute | fixed | sticky;\n}`,
          description: [
            "static (padrão): segue o fluxo normal. relative: sai um pouco do lugar mas ainda ocupa espaço, e vira referência para filhos absolute. absolute: sai do fluxo e se posiciona em relação ao ancestral posicionado mais próximo. fixed: fica fixo na tela mesmo com scroll. sticky: gruda ao rolar até um limite.",
          ],
          examples: [
            {
              code: `.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.5);
}

.tooltip-container {
  position: relative;
}
.tooltip {
  position: absolute;
  top: 100%;
  left: 0;
}`,
            },
          ],
          useWhen: ["fixed: modais, header fixo", "sticky: cabeçalhos de tabela ou sidebar que acompanham o scroll", "absolute: elementos posicionados dentro de um container relative (tooltips, badges)"],
          avoidWhen: ["absolute para montar o layout inteiro da página — geralmente Grid/Flex resolve melhor"],
        },
        {
          slug: "gap",
          title: "gap",
          summary: "Espaço entre itens de um flex ou grid.",
          syntax: `.container {\n  display: flex; /* ou grid */\n  gap: 16px; /* ou row-gap / column-gap */\n}`,
          description: [
            "Define o espaçamento entre os itens de um flex ou grid container, sem precisar de margin manual em cada filho (e sem o problema de margin sobrando na borda).",
          ],
          examples: [
            {
              code: `.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 24px;
  column-gap: 16px;
}`,
            },
          ],
          useWhen: ["Sempre que for espaçar itens dentro de flex/grid"],
          avoidWhen: ["Não funciona fora de flex/grid — para isso use margin"],
          related: ["css/layout/display-flex", "css/layout/display-grid"],
        },
        {
          slug: "media-query",
          title: "@media",
          summary: "Aplica regras CSS só sob certas condições (ex: largura da tela).",
          syntax: `@media (max-width: 768px) {\n  /* regras para telas menores */\n}`,
          description: [
            "Permite mudar o estilo conforme características da tela — mais comum: largura (max-width/min-width) para responsividade.",
            "Convenção comum: escrever o CSS 'mobile first' (estilo base para celular) e usar min-width para ir adicionando regras em telas maiores.",
          ],
          examples: [
            {
              code: `.grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}`,
              caption: "1 coluna no celular, 3 colunas a partir de 768px",
            },
          ],
          useWhen: ["Adaptar layout, tamanho de fonte ou espaçamento por tamanho de tela"],
          avoidWhen: ["Duplicar o arquivo CSS inteiro por breakpoint — sobrescreva só o necessário"],
        },
      ],
    },
    {
      slug: "selecao",
      title: "Seletores & Variáveis",
      description:
        "Como escolher exatamente quais elementos estilizar, e como reutilizar valores pelo CSS todo.",
      entries: [
        {
          slug: "combinadores",
          title: "Combinadores (>, ~, +)",
          summary: "Selecionam elementos com base na relação entre eles.",
          syntax: `A > B  /* B filho direto de A */\nA B    /* B descendente de A, qualquer nível */\nA + B  /* B logo depois de A, mesmo pai */\nA ~ B  /* B depois de A, mesmo pai, não precisa ser imediato */`,
          description: [
            "'>' seleciona só filhos diretos (evita pegar netos). '+' pega o irmão imediatamente seguinte. '~' pega qualquer irmão seguinte, não só o próximo.",
          ],
          examples: [
            {
              code: `/* Só os <li> filhos diretos de .menu, não os de sub-listas */
.menu > li { color: #111; }

/* O parágrafo logo depois de um título */
h2 + p { margin-top: 0; }`,
            },
          ],
          useWhen: ["Evitar que o estilo vaze para elementos aninhados (netos, sub-listas)"],
          avoidWhen: ["Cadeias muito longas (A > B > C > D) deixam o CSS frágil a mudanças de estrutura"],
        },
        {
          slug: "pseudo-classes",
          title: "Pseudo-classes (:hover, :nth-child, :focus)",
          summary: "Estilizam um elemento num estado ou posição específica.",
          syntax: `.el:hover { }\n.el:focus { }\nli:nth-child(2n) { }`,
          description: [
            ":hover e :focus reagem à interação do usuário. :nth-child(n) seleciona pela posição entre os irmãos — 2n pega os pares, 2n+1 os ímpares, útil para zebrar tabelas.",
          ],
          examples: [
            {
              code: `button:hover {
  background: #1d4ed8;
}

tr:nth-child(even) {
  background: #f3f4f6;
}`,
            },
          ],
          useWhen: ["Feedback visual de interação (hover/focus)", "Estilizar itens alternados de uma lista/tabela"],
          avoidWhen: ["Depender só de :hover para algo essencial em telas touch (não existe hover no toque)"],
        },
        {
          slug: "pseudo-elementos",
          title: "Pseudo-elementos (::before, ::after)",
          summary: "Inserem conteúdo gerado antes/depois de um elemento.",
          syntax: `.el::before {\n  content: "";\n}`,
          description: [
            "Criam um 'elemento virtual' dentro do elemento selecionado, sem precisar de HTML extra. Precisam da propriedade 'content' para existir (mesmo vazia).",
            "Muito usados para ícones decorativos, aspas de citação, ou aquele 'quadradinho' antes de um item de lista customizado.",
          ],
          examples: [
            {
              code: `.aviso::before {
  content: "⚠ ";
}

.card::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent, rgb(0 0 0 / 0.4));
}`,
            },
          ],
          useWhen: ["Conteúdo puramente decorativo ou visual, que não muda o significado"],
          avoidWhen: ["Conteúdo importante para o entendimento — leitores de tela costumam ignorar/tratar mal o 'content' gerado"],
        },
        {
          slug: "especificidade",
          title: "Especificidade",
          summary: "A regra que decide qual estilo 'vence' quando há conflito.",
          syntax: `#id (1,0,0) > .classe (0,1,0) > tag (0,0,1)`,
          description: [
            "Quando dois seletores miram o mesmo elemento, vence o mais específico: ID bate classe, classe bate tag/elemento. Em empate, vence o que vem depois no arquivo.",
            "!important ignora a especificidade e sempre vence (por isso é considerado um recurso de último caso — dificulta manutenção).",
          ],
          examples: [
            {
              code: `/* especificidade 0,1,0 */
.botao { background: blue; }

/* especificidade 1,0,0 — esta vence, mesmo vindo antes no arquivo */
#botao-principal { background: red; }`,
            },
          ],
          useWhen: ["Entender por que um estilo 'não está aplicando' mesmo parecendo correto"],
          avoidWhen: ["Resolver conflitos empilhando !important — prefira reorganizar os seletores"],
        },
        {
          slug: "custom-properties",
          title: "Variáveis CSS (--var / var())",
          summary: "Valores reutilizáveis e atualizáveis em tempo real.",
          syntax: `:root {\n  --cor-primaria: #2563eb;\n}\n.el {\n  color: var(--cor-primaria);\n}`,
          description: [
            "Custom properties guardam um valor (cor, tamanho, o que for) que pode ser reaproveitado em várias regras — e, ao contrário de variáveis do Sass, existem de verdade no navegador e podem mudar via JavaScript ou media query.",
            "var(--nome, valorPadrao) aceita um segundo argumento como fallback caso a variável não exista.",
          ],
          examples: [
            {
              code: `:root {
  --cor-primaria: #2563eb;
  --espaco: 16px;
}

.botao {
  background: var(--cor-primaria);
  padding: var(--espaco);
}

@media (prefers-color-scheme: dark) {
  :root {
    --cor-primaria: #60a5fa;
  }
}`,
            },
          ],
          useWhen: ["Temas (claro/escuro)", "Valores repetidos em várias regras (cores da marca, espaçamentos)"],
          avoidWhen: ["Valores usados uma única vez, sem chance de mudar — aí é só complexidade extra"],
        },
      ],
    },
    {
      slug: "tipografia",
      title: "Tipografia",
      description:
        "Como controlar a aparência do texto — fonte, espaçamento, quebras de linha e truncamento.",
      entries: [
        {
          slug: "font-family-weight",
          title: "font-family / font-weight",
          summary: "Define a fonte usada e sua espessura.",
          syntax: `.el {\n  font-family: "Inter", sans-serif;\n  font-weight: 600;\n}`,
          description: [
            "font-family aceita uma lista de fontes em ordem de preferência — o navegador usa a primeira disponível, com a última sendo um fallback genérico (sans-serif, serif, monospace). font-weight vai de 100 (fino) a 900 (muito negrito); 400 é o normal e 700 o negrito padrão.",
          ],
          examples: [
            {
              code: `body {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  font-weight: 400;
}

h1 {
  font-weight: 700;
}`,
            },
          ],
          useWhen: ["Definir a identidade tipográfica do site e hierarquia de pesos"],
          avoidWhen: ["Usar um peso que a fonte carregada não tem — o navegador simula e fica feio"],
          related: ["css/tipografia/font-face"],
        },
        {
          slug: "line-height",
          title: "line-height",
          summary: "Controla o espaçamento vertical entre linhas de texto.",
          syntax: `.el {\n  line-height: 1.5;\n}`,
          description: [
            "Um número sem unidade (ex: 1.5) é multiplicado pelo tamanho da fonte do próprio elemento — é a forma recomendada, porque escala corretamente se o font-size mudar. Textos de leitura longa costumam ficar melhores entre 1.4 e 1.7.",
          ],
          examples: [
            {
              code: `p {
  font-size: 16px;
  line-height: 1.6;
}`,
              caption: "Altura de linha de 25.6px, escalável",
            },
          ],
          useWhen: ["Parágrafos de leitura — melhora legibilidade"],
          avoidWhen: ["Valores fixos em px — não escalam bem se o font-size mudar depois"],
        },
        {
          slug: "text-overflow",
          title: "text-overflow + white-space",
          summary: "Corta um texto longo com reticências (...).",
          syntax: `.el {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}`,
          description: [
            "As três propriedades precisam vir juntas: white-space:nowrap impede a quebra de linha, overflow:hidden esconde o que passar do limite, e text-overflow:ellipsis troca o excesso por '...'. Só funciona em texto de uma linha só.",
          ],
          examples: [
            {
              code: `.titulo-card {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`,
              caption: "Título longo vira 'Como aprender program...'",
            },
          ],
          useWhen: ["Títulos de card, nomes de arquivo, qualquer texto de uma linha com largura fixa"],
          avoidWhen: ["Texto de múltiplas linhas — para isso use -webkit-line-clamp"],
        },
        {
          slug: "letter-spacing",
          title: "letter-spacing",
          summary: "Aumenta ou diminui o espaço entre letras.",
          syntax: `.el {\n  letter-spacing: 0.05em;\n}`,
          description: [
            "Valores positivos afastam as letras, negativos aproximam. 'em' é a unidade mais comum aqui, porque escala com o tamanho da fonte. Muito usado em textos pequenos em maiúsculas (labels, badges) para melhorar a leitura.",
          ],
          examples: [
            {
              code: `.label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}`,
            },
          ],
          useWhen: ["Textos pequenos em caixa alta (labels, badges, eyebrows)"],
          avoidWhen: ["Parágrafos longos — espaçamento extra prejudica a leitura em textos grandes"],
        },
        {
          slug: "font-face",
          title: "@font-face",
          summary: "Carrega uma fonte customizada (própria ou de terceiros).",
          syntax: `@font-face {\n  font-family: "MinhaFonte";\n  src: url("/fonte.woff2") format("woff2");\n  font-display: swap;\n}`,
          description: [
            "Define uma fonte a partir de um arquivo, dando um nome que depois é usado normalmente em font-family. 'font-display: swap' mostra uma fonte de fallback imediatamente e troca quando a customizada carregar, evitando texto invisível.",
          ],
          examples: [
            {
              code: `@font-face {
  font-family: "Satoshi";
  src: url("/fonts/satoshi.woff2") format("woff2");
  font-weight: 400 700;
  font-display: swap;
}

body {
  font-family: "Satoshi", sans-serif;
}`,
            },
          ],
          useWhen: ["Usar uma fonte que não vem instalada no sistema do usuário nem via Google Fonts"],
          avoidWhen: ["Sempre defina font-display, senão o texto pode ficar invisível até a fonte carregar"],
          related: ["css/tipografia/font-family-weight"],
        },
      ],
    },
    {
      slug: "efeitos",
      title: "Efeitos Visuais",
      description:
        "Sombras, transições, transformações e filtros — o polimento visual que dá vida à interface.",
      entries: [
        {
          slug: "box-shadow",
          title: "box-shadow",
          summary: "Adiciona uma sombra ao redor de um elemento.",
          syntax: `.el {\n  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);\n}`,
          description: [
            "Os valores são: deslocamento horizontal, deslocamento vertical, desfoque (blur), e opcionalmente espalhamento (spread) e cor. Pode empilhar várias sombras separadas por vírgula para efeitos em camadas.",
          ],
          examples: [
            {
              code: `.card {
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.06),
    0 4px 12px rgb(0 0 0 / 0.12);
}`,
              caption: "Duas sombras empilhadas para um efeito mais suave",
            },
          ],
          useWhen: ["Dar profundidade a cards, modais, dropdowns"],
          avoidWhen: ["Sombras muito escuras/grandes em excesso — poluem a interface"],
        },
        {
          slug: "transition",
          title: "transition",
          summary: "Anima suavemente a mudança de uma propriedade CSS.",
          syntax: `.el {\n  transition: propriedade duração timing-function;\n}`,
          description: [
            "Faz o navegador interpolar automaticamente entre o valor antigo e o novo de uma propriedade (cor, tamanho, posição...) quando ela muda — por hover, foco, ou classe adicionada via JS. 'all' anima qualquer propriedade que mudar, mas é mais previsível listar as propriedades específicas.",
          ],
          examples: [
            {
              code: `.botao {
  background: #2563eb;
  transition: background 0.2s ease, transform 0.15s ease;
}
.botao:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}`,
            },
          ],
          useWhen: ["Suavizar hover, foco, abertura/fechamento de elementos"],
          avoidWhen: ["transition: all em componentes complexos — pode animar coisas indesejadas e pesar performance"],
          related: ["css/efeitos/transform"],
        },
        {
          slug: "transform",
          title: "transform",
          summary: "Move, rotaciona, escala ou inclina um elemento sem afetar o layout.",
          syntax: `.el {\n  transform: translateX(10px) rotate(5deg) scale(1.1);\n}`,
          description: [
            "Diferente de mudar 'top/left' ou 'width/height', transform não recalcula o layout da página (é só uma transformação visual), o que o torna muito mais performático para animações. Pode combinar várias funções na mesma declaração.",
          ],
          examples: [
            {
              code: `.card:hover {
  transform: translateY(-4px) scale(1.02);
}`,
              caption: "Efeito clássico de 'levantar' um card no hover",
            },
          ],
          useWhen: ["Animações de hover, drag, carrosséis — qualquer movimento visual"],
          avoidWhen: ["Precisa que o elemento realmente ocupe outro espaço no layout — use position/margin"],
          related: ["css/efeitos/transition"],
        },
        {
          slug: "filter",
          title: "filter",
          summary: "Aplica efeitos visuais tipo blur, brilho e escala de cinza.",
          syntax: `.el {\n  filter: blur(4px) brightness(0.9) grayscale(1);\n}`,
          description: [
            "Funções comuns: blur() desfoca, brightness()/contrast() ajustam luz, grayscale()/sepia() mudam a cor, drop-shadow() é uma sombra que respeita a forma real do conteúdo (diferente de box-shadow, que é sempre retangular).",
          ],
          examples: [
            {
              code: `.imagem-fundo {
  filter: brightness(0.6) blur(2px);
}

.icone {
  filter: drop-shadow(0 2px 4px rgb(0 0 0 / 0.3));
}`,
            },
          ],
          useWhen: ["Escurecer imagens de fundo, efeitos de hover em fotos, sombra em ícones com transparência"],
          avoidWhen: ["blur() pesado em muitos elementos — pode pesar a renderização em telas fracas"],
        },
        {
          slug: "clamp-min-max",
          title: "clamp() / min() / max()",
          summary: "Valores CSS que se ajustam dentro de limites, sem media query.",
          syntax: `.el {\n  font-size: clamp(1rem, 2vw + 1rem, 2rem);\n}`,
          description: [
            "clamp(mínimo, preferido, máximo) escolhe o valor preferido, mas nunca deixa passar do mínimo nem do máximo — ótimo para tipografia e espaçamentos fluidos sem precisar de várias @media. min()/max() escolhem o menor/maior entre os valores dados.",
          ],
          examples: [
            {
              code: `h1 {
  font-size: clamp(1.75rem, 4vw, 3rem);
}

.container {
  width: min(90%, 1200px);
}`,
              caption: "Título fluido e um container que nunca passa de 1200px",
            },
          ],
          useWhen: ["Tipografia e espaçamentos responsivos sem escrever várias media queries"],
          avoidWhen: ["Casos onde você precisa de saltos bruscos em breakpoints específicos — aí @media é mais previsível"],
          related: ["css/layout/media-query"],
        },
      ],
    },
  ],
};

export default css;
