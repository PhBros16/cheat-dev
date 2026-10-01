import { Guide } from "@/lib/types";

const guide: Guide = {
  slug: "flexbox-do-zero",
  title: "Flexbox do zero ao avançado",
  summary: "Entenda de vez os dois eixos do flexbox construindo uma barra de navegação real.",
  level: "iniciante",
  minutes: 12,
  tags: ["css", "flexbox", "layout"],
  steps: [
    {
      heading: "1. Ativando o flex",
      text: [
        "Tudo começa com display:flex no elemento pai. A partir daí, todo filho direto vira um 'item flex' e se organiza em linha, da esquerda para a direita, por padrão.",
      ],
      code: { lang: "css", content: `.navbar {\n  display: flex;\n}` },
      note: "Sem mais nada, os itens só ficam um do lado do outro — a mágica vem das próximas propriedades.",
    },
    {
      heading: "2. Os dois eixos: principal e cruzado",
      text: [
        "Isso é o que mais confunde no começo: flexbox tem DOIS eixos. Com flex-direction:row (padrão), o eixo principal é horizontal e o cruzado é vertical. justify-content controla o principal; align-items controla o cruzado.",
      ],
      code: {
        lang: "css",
        content: `.navbar {\n  display: flex;\n  justify-content: space-between; /* eixo horizontal */\n  align-items: center;            /* eixo vertical */\n}`,
      },
    },
    {
      heading: "3. Espaçamento com gap",
      text: [
        "Em vez de margin em cada item (que sempre sobra uma ponta), use gap no container. Funciona em flex e grid, e é suportado por todos os navegadores modernos.",
      ],
      code: { lang: "css", content: `.navbar__links {\n  display: flex;\n  gap: 24px;\n}` },
    },
    {
      heading: "4. Fazendo um item 'empurrar' os outros",
      text: [
        "Um truque clássico: dar margin-left:auto (ou margin-right:auto) num item específico faz ele absorver todo o espaço livre daquele lado, empurrando-se para a ponta — ótimo para separar 'logo + menu' de 'botão de login'.",
      ],
      code: {
        lang: "html",
        content: `<nav class="navbar">
  <span class="logo">MinhaMarca</span>
  <div class="navbar__links">
    <a href="#">Início</a>
    <a href="#">Produtos</a>
  </div>
  <button class="cta" style="margin-left:auto">Entrar</button>
</nav>`,
      },
    },
    {
      heading: "5. Quando os itens não cabem: flex-wrap",
      text: [
        "Em telas pequenas, uma navbar com muitos links pode não caber. flex-wrap:wrap deixa os itens que sobrarem 'quebrarem' para a linha de baixo, em vez de espremer tudo ou estourar a tela.",
      ],
      code: { lang: "css", content: `.navbar {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 12px;\n}` },
    },
    {
      heading: "6. Controlando o tamanho de um item específico",
      text: [
        "flex-grow, flex-shrink e flex-basis (juntos, o atalho 'flex') dizem como CADA item se comporta com o espaço extra ou faltante. 'flex:1' é o mais comum: 'ocupe todo o espaço que sobrar, dividido igualmente'.",
      ],
      code: {
        lang: "css",
        content: `.sidebar { flex: 0 0 240px; } /* tamanho fixo, não cresce nem encolhe */\n.conteudo { flex: 1; }       /* ocupa todo o resto */`,
      },
    },
  ],
  finalCode: {
    lang: "html",
    label: "Testar a navbar completa",
    content: `<style>
* { box-sizing: border-box; margin: 0; }
body { font-family: system-ui, sans-serif; padding: 0; }
.navbar {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding: 14px 20px;
  background: #16191d;
  color: white;
}
.logo { font-weight: 700; }
.navbar__links { display: flex; gap: 18px; }
.navbar__links a { color: #9aa1a9; text-decoration: none; font-size: 14px; }
.navbar__links a:hover { color: white; }
.cta {
  margin-left: auto;
  background: #2f6fed;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
</style>
<nav class="navbar">
  <span class="logo">MinhaMarca</span>
  <div class="navbar__links">
    <a href="#">Início</a>
    <a href="#">Produtos</a>
    <a href="#">Sobre</a>
    <a href="#">Contato</a>
  </div>
  <button class="cta">Entrar</button>
</nav>
<p style="padding:20px;color:#666;font-family:system-ui">Encolha a janela do preview para ver o flex-wrap em ação.</p>`,
  },
};

export default guide;
