import { Guide } from "@/lib/types";

const guide: Guide = {
  slug: "layout-com-grid",
  title: "Montando o layout de uma página inteira com Grid",
  summary: "Header, sidebar, conteúdo e footer — o clássico layout de aplicação, em poucas linhas de CSS.",
  level: "intermediário",
  minutes: 12,
  tags: ["css", "grid", "layout"],
  steps: [
    {
      heading: "1. Desenhando o layout com grid-template-areas",
      text: [
        "Antes de qualquer coluna/linha numérica, dá pra literalmente 'desenhar' o layout com nomes. Cada string é uma linha do grid, cada palavra uma coluna — o resultado é um CSS que se lê como um mapa.",
      ],
      code: {
        lang: "css",
        content: `.pagina {
  display: grid;
  grid-template-columns: 220px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar conteudo"
    "footer footer";
  min-height: 100vh;
}`,
      },
    },
    {
      heading: "2. Encaixando cada elemento na sua área",
      text: [
        "Cada elemento filho recebe grid-area com o nome correspondente definido acima. Não precisa se preocupar com a ordem no HTML — o CSS decide onde cada um aparece visualmente.",
      ],
      code: {
        lang: "css",
        content: `.header { grid-area: header; }\n.sidebar { grid-area: sidebar; }\n.conteudo { grid-area: conteudo; }\n.footer { grid-area: footer; }`,
      },
    },
    {
      heading: "3. O HTML correspondente",
      text: ["Simples e semântico — nenhuma div extra só para posicionar coisas."],
      code: {
        lang: "html",
        content: `<div class="pagina">
  <header class="header">Minha Aplicação</header>
  <aside class="sidebar">Menu lateral</aside>
  <main class="conteudo">Conteúdo principal aqui</main>
  <footer class="footer">Rodapé</footer>
</div>`,
      },
    },
    {
      heading: "4. Tornando responsivo",
      text: [
        "Em telas pequenas, a sidebar lateral raramente faz sentido. Redefinimos grid-template-areas inteiro dentro de uma media query — o CSS Grid permite reorganizar tudo sem tocar no HTML.",
      ],
      code: {
        lang: "css",
        content: `@media (max-width: 700px) {
  .pagina {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "conteudo"
      "sidebar"
      "footer";
  }
}`,
      },
      note: "A sidebar 'desce' para depois do conteúdo principal e ocupa a largura toda — sem duplicar HTML.",
    },
  ],
  finalCode: {
    lang: "html",
    label: "Testar o layout completo",
    content: `<style>
* { box-sizing: border-box; margin: 0; }
body { font-family: system-ui, sans-serif; }
.pagina {
  display: grid;
  grid-template-columns: 180px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "sidebar conteudo"
    "footer footer";
  min-height: 320px;
  gap: 1px;
  background: #ddd;
}
.pagina > * { background: #fff; padding: 16px; }
.header { grid-area: header; background: #16191d; color: #fff; font-weight: 700; }
.sidebar { grid-area: sidebar; background: #f3f4f6; }
.conteudo { grid-area: conteudo; }
.footer { grid-area: footer; text-align: center; color: #888; font-size: 13px; }
@media (max-width: 480px) {
  .pagina {
    grid-template-columns: 1fr;
    grid-template-areas: "header" "conteudo" "sidebar" "footer";
  }
}
</style>
<div class="pagina">
  <header class="header">Minha Aplicação</header>
  <aside class="sidebar">Menu lateral</aside>
  <main class="conteudo">Conteúdo principal aqui. Redimensione a janela do preview!</main>
  <footer class="footer">© 2026</footer>
</div>`,
  },
};

export default guide;
