import { SiteTemplate } from "@/lib/types";

export const templates: SiteTemplate[] = [
  {
    slug: "landing-page",
    title: "Landing page de produto",
    description: "Hero, funcionalidades, preços e rodapé — a estrutura clássica de página de vendas.",
    tags: ["html", "css", "responsivo"],
    code: `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Produto — Landing Page</title>
<style>
  * { box-sizing: border-box; margin: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; color: #14171a; line-height: 1.5; }
  .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
  a { color: inherit; }

  /* Header */
  header { display: flex; align-items: center; padding: 20px 0; }
  header .container { display: flex; align-items: center; width: 100%; }
  .logo { font-weight: 800; font-size: 20px; }
  nav { display: flex; gap: 24px; margin-left: auto; }
  nav a { text-decoration: none; font-size: 14px; font-weight: 500; color: #5b6169; }
  .btn { padding: 10px 20px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer; font-size: 14px; }
  .btn-primario { background: #2563eb; color: #fff; }
  .btn-primario:hover { background: #1d4ed8; }

  /* Hero */
  .hero { text-align: center; padding: 80px 20px 60px; background: linear-gradient(180deg, #eff6ff, #fff); }
  .hero h1 { font-size: 44px; font-weight: 800; max-width: 700px; margin: 0 auto 16px; line-height: 1.15; }
  .hero p { font-size: 18px; color: #5b6169; max-width: 520px; margin: 0 auto 28px; }
  .hero .btn-primario { font-size: 16px; padding: 14px 28px; }

  /* Features */
  .features { padding: 70px 0; }
  .features h2 { text-align: center; font-size: 28px; margin-bottom: 40px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .feature { padding: 24px; border: 1px solid #e5e7eb; border-radius: 14px; }
  .feature .emoji { font-size: 28px; margin-bottom: 10px; }
  .feature h3 { font-size: 17px; margin-bottom: 6px; }
  .feature p { color: #5b6169; font-size: 14px; }

  /* Pricing */
  .pricing { padding: 70px 0; background: #f9fafb; }
  .pricing h2 { text-align: center; font-size: 28px; margin-bottom: 40px; }
  .planos { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .plano { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 28px; text-align: center; }
  .plano.destaque { border: 2px solid #2563eb; }
  .plano h3 { font-size: 15px; color: #5b6169; margin-bottom: 8px; }
  .plano .preco { font-size: 32px; font-weight: 800; margin-bottom: 18px; }
  .plano .preco span { font-size: 14px; font-weight: 400; color: #5b6169; }
  .plano ul { list-style: none; padding: 0; margin: 0 0 20px; font-size: 14px; color: #5b6169; display: flex; flex-direction: column; gap: 8px; }
  .plano .btn { width: 100%; background: #f3f4f6; }
  .plano.destaque .btn { background: #2563eb; color: #fff; }

  /* Footer */
  footer { padding: 40px 0; text-align: center; color: #9ca3af; font-size: 13px; border-top: 1px solid #e5e7eb; }

  @media (max-width: 720px) {
    .grid-3, .planos { grid-template-columns: 1fr; }
    nav { display: none; }
    .hero h1 { font-size: 32px; }
  }
</style>
</head>
<body>

<header>
  <div class="container">
    <span class="logo">Produto</span>
    <nav>
      <a href="#features">Funcionalidades</a>
      <a href="#precos">Preços</a>
      <a href="#contato">Contato</a>
    </nav>
    <button class="btn btn-primario" style="margin-left:20px">Começar grátis</button>
  </div>
</header>

<section class="hero">
  <h1>Organize seu trabalho sem esforço</h1>
  <p>A ferramenta que sua equipe vai realmente usar. Simples, rápida, sem curva de aprendizado.</p>
  <button class="btn btn-primario">Testar gratuitamente</button>
</section>

<section class="features" id="features">
  <div class="container">
    <h2>Por que escolher a gente</h2>
    <div class="grid-3">
      <div class="feature">
        <div class="emoji">⚡</div>
        <h3>Rápido de verdade</h3>
        <p>Carregamento instantâneo, sem telas de loading eternas.</p>
      </div>
      <div class="feature">
        <div class="emoji">🔒</div>
        <h3>Seguro</h3>
        <p>Seus dados criptografados de ponta a ponta.</p>
      </div>
      <div class="feature">
        <div class="emoji">🤝</div>
        <h3>Feito para equipes</h3>
        <p>Colaboração em tempo real, sem conflitos.</p>
      </div>
    </div>
  </div>
</section>

<section class="pricing" id="precos">
  <div class="container">
    <h2>Planos para todo tamanho de equipe</h2>
    <div class="planos">
      <div class="plano">
        <h3>Básico</h3>
        <p class="preco">R$0<span>/mês</span></p>
        <ul><li>Até 3 usuários</li><li>Projetos ilimitados</li></ul>
        <button class="btn">Começar</button>
      </div>
      <div class="plano destaque">
        <h3>Pro</h3>
        <p class="preco">R$49<span>/mês</span></p>
        <ul><li>Até 20 usuários</li><li>Relatórios avançados</li></ul>
        <button class="btn">Escolher Pro</button>
      </div>
      <div class="plano">
        <h3>Empresa</h3>
        <p class="preco">Sob consulta</p>
        <ul><li>Usuários ilimitados</li><li>Suporte dedicado</li></ul>
        <button class="btn">Falar com vendas</button>
      </div>
    </div>
  </div>
</section>

<footer id="contato">
  <div class="container">© 2026 Produto. Todos os direitos reservados.</div>
</footer>

</body>
</html>`,
  },
  {
    slug: "portfolio-pessoal",
    title: "Portfólio pessoal",
    description: "Sobre mim, projetos em grade e contato — ideal para devs e designers.",
    tags: ["html", "css", "portfólio"],
    code: `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ana Souza — Desenvolvedora</title>
<style>
  * { box-sizing: border-box; margin: 0; }
  body { font-family: system-ui, sans-serif; background: #0e1013; color: #e8eaec; line-height: 1.6; }
  .container { max-width: 860px; margin: 0 auto; padding: 0 20px; }
  a { color: #60a5fa; }

  header { padding: 60px 0 40px; text-align: center; }
  header .avatar { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg,#2f6fed,#1f9c7a); margin: 0 auto 18px; }
  header h1 { font-size: 28px; margin-bottom: 6px; }
  header p { color: #9aa1a9; }
  .links { display: flex; justify-content: center; gap: 16px; margin-top: 18px; }
  .links a { font-size: 14px; text-decoration: none; padding: 8px 16px; border: 1px solid #2a2e33; border-radius: 20px; }
  .links a:hover { border-color: #2f6fed; }

  section { padding: 40px 0; border-top: 1px solid #1c2024; }
  section h2 { font-size: 20px; margin-bottom: 16px; }
  .sobre p { color: #9aa1a9; max-width: 600px; }

  .projetos { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  .projeto { background: #16191d; border: 1px solid #2a2e33; border-radius: 14px; padding: 20px; }
  .projeto h3 { font-size: 16px; margin-bottom: 6px; }
  .projeto p { font-size: 14px; color: #9aa1a9; margin-bottom: 12px; }
  .tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag { font-size: 11px; background: #1c2024; color: #9aa1a9; padding: 3px 9px; border-radius: 20px; }

  footer { padding: 40px 0; text-align: center; color: #5b6169; font-size: 13px; }

  @media (max-width: 600px) {
    .projetos { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<header>
  <div class="container">
    <div class="avatar"></div>
    <h1>Ana Souza</h1>
    <p>Desenvolvedora front-end · Natal, Brasil</p>
    <div class="links">
      <a href="#">GitHub</a>
      <a href="#">LinkedIn</a>
      <a href="mailto:ana@email.com">E-mail</a>
    </div>
  </div>
</header>

<section class="sobre">
  <div class="container">
    <h2>Sobre mim</h2>
    <p>Construo interfaces rápidas e acessíveis há 5 anos. Gosto de resolver problemas de UX com código simples, sem over-engineering.</p>
  </div>
</section>

<section>
  <div class="container">
    <h2>Projetos</h2>
    <div class="projetos">
      <div class="projeto">
        <h3>Dashboard financeiro</h3>
        <p>Painel de controle de gastos com gráficos em tempo real.</p>
        <div class="tags"><span class="tag">React</span><span class="tag">Chart.js</span></div>
      </div>
      <div class="projeto">
        <h3>App de receitas</h3>
        <p>Busca de receitas por ingredientes disponíveis em casa.</p>
        <div class="tags"><span class="tag">Next.js</span><span class="tag">API</span></div>
      </div>
      <div class="projeto">
        <h3>Cheat/dev</h3>
        <p>Referência rápida de comandos de programação.</p>
        <div class="tags"><span class="tag">TypeScript</span><span class="tag">PWA</span></div>
      </div>
      <div class="projeto">
        <h3>Loja virtual</h3>
        <p>E-commerce completo com carrinho e checkout.</p>
        <div class="tags"><span class="tag">Vue</span><span class="tag">Stripe</span></div>
      </div>
    </div>
  </div>
</section>

<footer>© 2026 Ana Souza</footer>

</body>
</html>`,
  },
  {
    slug: "dashboard-admin",
    title: "Dashboard administrativo",
    description: "Sidebar de navegação, cards de métricas e uma tabela — a base de qualquer painel interno.",
    tags: ["html", "css", "js", "dashboard"],
    code: `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel Administrativo</title>
<style>
  * { box-sizing: border-box; margin: 0; }
  body { font-family: system-ui, sans-serif; background: #f3f4f6; color: #14171a; }
  .layout { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }

  aside { background: #111827; color: #fff; padding: 20px; }
  aside .logo { font-weight: 800; font-size: 17px; margin-bottom: 30px; }
  aside nav { display: flex; flex-direction: column; gap: 4px; }
  aside a { color: #9ca3af; text-decoration: none; font-size: 14px; padding: 9px 12px; border-radius: 8px; }
  aside a.ativo, aside a:hover { background: #1f2937; color: #fff; }

  main { padding: 26px 30px; }
  header.top { display: flex; align-items: center; margin-bottom: 24px; }
  header.top h1 { font-size: 20px; }
  header.top .user { margin-left: auto; font-size: 14px; color: #5b6169; }

  .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 26px; }
  .card { background: #fff; border-radius: 12px; padding: 18px; border: 1px solid #e5e7eb; }
  .card .label { font-size: 13px; color: #5b6169; margin-bottom: 6px; }
  .card .valor { font-size: 24px; font-weight: 700; }
  .card .delta { font-size: 12px; margin-top: 4px; }
  .delta.up { color: #1f9c7a; }
  .delta.down { color: #e4572e; }

  table { width: 100%; background: #fff; border-radius: 12px; border-collapse: collapse; overflow: hidden; border: 1px solid #e5e7eb; }
  th, td { text-align: left; padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #f0f0f0; }
  th { color: #5b6169; font-weight: 600; background: #f9fafb; }
  tr:last-child td { border-bottom: none; }
  .status { font-size: 12px; padding: 3px 10px; border-radius: 20px; font-weight: 600; }
  .status.pago { background: #d1fae5; color: #047857; }
  .status.pendente { background: #fef3c7; color: #92400e; }

  @media (max-width: 800px) {
    .layout { grid-template-columns: 1fr; }
    aside { display: none; }
    .cards { grid-template-columns: repeat(2, 1fr); }
  }
</style>
</head>
<body>

<div class="layout">
  <aside>
    <div class="logo">⚙ Painel</div>
    <nav>
      <a href="#" class="ativo">Visão geral</a>
      <a href="#">Pedidos</a>
      <a href="#">Clientes</a>
      <a href="#">Produtos</a>
      <a href="#">Configurações</a>
    </nav>
  </aside>

  <main>
    <header class="top">
      <h1>Visão geral</h1>
      <span class="user">Olá, Ana 👋</span>
    </header>

    <div class="cards">
      <div class="card">
        <div class="label">Receita hoje</div>
        <div class="valor">R$ 4.280</div>
        <div class="delta up">↑ 12% vs ontem</div>
      </div>
      <div class="card">
        <div class="label">Pedidos</div>
        <div class="valor">86</div>
        <div class="delta up">↑ 4%</div>
      </div>
      <div class="card">
        <div class="label">Novos clientes</div>
        <div class="valor">12</div>
        <div class="delta down">↓ 2%</div>
      </div>
      <div class="card">
        <div class="label">Taxa de conversão</div>
        <div class="valor">3.4%</div>
        <div class="delta up">↑ 0.3pp</div>
      </div>
    </div>

    <table>
      <thead>
        <tr><th>Pedido</th><th>Cliente</th><th>Valor</th><th>Status</th></tr>
      </thead>
      <tbody>
        <tr><td>#1042</td><td>Bruno Lima</td><td>R$ 350,00</td><td><span class="status pago">Pago</span></td></tr>
        <tr><td>#1041</td><td>Carla Dias</td><td>R$ 120,00</td><td><span class="status pendente">Pendente</span></td></tr>
        <tr><td>#1040</td><td>Ana Souza</td><td>R$ 890,00</td><td><span class="status pago">Pago</span></td></tr>
      </tbody>
    </table>
  </main>
</div>

</body>
</html>`,
  },
];

export function getTemplate(slug: string) {
  return templates.find((t) => t.slug === slug);
}
