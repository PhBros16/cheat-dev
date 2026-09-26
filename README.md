# cheat/dev

Uma referência rápida, moderna e explicativa de **HTML**, **CSS**, **JavaScript** e **SQL** —
no espírito da W3Schools/MDN, mas enxuta e feita pra aquele momento
*"caramba, qual é aquele comando mesmo?"*.

- 🔎 Busca instantânea (atalho `⌘K` / `Ctrl+K`)
- 🎨 Uma cor de identidade por linguagem, usada de forma consistente na navegação e nos badges
- 🖤 Modo claro/escuro
- 🧠 Cada comando com sintaxe, exemplo(s) reais, e um "use quando / evite quando"
- ⚡ 100% estático (SSG) — rápido e barato de hospedar

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [Shiki](https://shiki.style) para o realce de sintaxe (renderizado no servidor, zero JS extra no cliente)

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Para gerar o build de produção:

```bash
npm run build
npm run start
```

## Estrutura do projeto

```
src/
  app/
    page.tsx                        # Home (busca em destaque + populares)
    [lang]/page.tsx                 # Visão geral de uma linguagem (ex: /css)
    [lang]/[category]/page.tsx      # Lista de comandos de uma categoria
    [lang]/[category]/[entry]/      # Página de um comando específico
  components/                       # Sidebar, SearchBox, CodeBlock, TopBar, etc.
  content/
    html.ts                         # Todo o conteúdo de HTML
    css.ts                          # Todo o conteúdo de CSS
    js.ts                           # Todo o conteúdo de JavaScript
    sql.ts                          # Todo o conteúdo de SQL
  lib/
    types.ts                        # Tipos: Language, Category, Entry
    content.ts                      # Funções para ler/buscar o conteúdo
    search.ts                       # Lógica de busca (usada pelo SearchBox)
    langStyles.ts                   # Classes Tailwind por linguagem (cores)
```

## Como adicionar um novo comando

Todo o conteúdo vive em `src/content/*.ts` como objetos TypeScript comuns —
não precisa mexer em nenhuma página. Abra o arquivo da linguagem desejada,
encontre (ou crie) a categoria certa, e adicione um objeto `Entry` na lista
`entries`:

```ts
{
  slug: "meu-comando",           // vira a URL: /js/categoria/meu-comando
  title: "meuComando()",
  summary: "Uma frase curta explicando o que ele faz.",
  syntax: "meuComando(argumento)",
  description: [
    "Primeiro parágrafo explicando em mais detalhes.",
    "Segundo parágrafo, se precisar.",
  ],
  examples: [
    { code: "meuComando(42);", caption: "Opcional: legenda do exemplo" },
  ],
  useWhen: ["Quando usar isso"],
  avoidWhen: ["Quando NÃO usar"],
  related: ["js/outra-categoria/outro-comando"], // opcional
}
```

O TypeScript avisa se algum campo obrigatório faltar (veja `src/lib/types.ts`).
Depois de salvar, o comando já aparece na sidebar, na busca e ganha sua
própria página automaticamente — nenhuma rota precisa ser criada manualmente.

## Como adicionar uma nova linguagem (Python, etc.)

1. Crie `src/content/python.ts` seguindo o mesmo formato de `html.ts` (exporte
   um objeto `Language`).
2. Escolha uma cor de identidade e adicione em `src/lib/langStyles.ts`
   (precisa ser uma classe Tailwind **literal**, não construída dinamicamente,
   por causa de como o Tailwind detecta classes usadas).
3. Adicione a cor em `src/app/globals.css`, no bloco `:root` e no `@theme inline`
   (ex: `--color-python: #3776AB;`).
4. Registre a linguagem no array `languages` em `src/lib/content.ts`.

Pronto — todas as rotas, a busca e a sidebar já enxergam a nova linguagem
automaticamente, porque tudo é gerado a partir desse array.

## Deploy na Vercel

1. Suba este projeto para um repositório no GitHub (veja o passo a passo abaixo).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. A Vercel detecta o Next.js automaticamente — não precisa configurar nada.
4. Cada push na branch principal gera um novo deploy.

### Subindo para o GitHub pela primeira vez

```bash
git init
git add .
git commit -m "primeira versão do cheat/dev"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git
git push -u origin main
```

## Roadmap / ideias para turbinar mais

- [ ] Mais comandos por categoria (o conteúdo atual é uma base sólida, não o catálogo completo)
- [ ] Novas linguagens: Python, Git, Bash, React
- [ ] Preview ao vivo para exemplos de HTML/CSS (iframe sandboxed)
- [ ] Página "todos os comandos" por linguagem, ordenável e filtrável
- [ ] Botão de sugestão/edição levando direto para o arquivo no GitHub
