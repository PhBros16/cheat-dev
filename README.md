# cheat/dev

Hub de consulta e treino para quem programa: **503 comandos** de HTML, CSS, JavaScript e SQL em que **tudo é explicado e pode ser testado na hora**, dentro da página.

🔗 **Site:** https://cheat-dev.vercel.app

> Material de estudo que você não pode testar é decoração.

## O que tem aqui

| Recurso | O que faz |
|---|---|
| **Comandos** (503) | Sintaxe, explicação do porquê, armadilha comum, "use quando / evite quando" e playground ao vivo (HTML, CSS, JavaScript e SQL) |
| **Lab** `/lab` | Editor HTML/CSS/JS com resultado ao vivo, Emmet, 17 dispositivos, multi-tela, console, link compartilhável e exportar/importar ZIP |
| **SQL Lab** `/sql-lab` | SQLite e **PostgreSQL** (o motor do Supabase) rodando no navegador; 3 bancos de exemplo, aulas, exercícios com correção e dialetos lado a lado |
| **Desafios** `/desafios` | Roleta com 58 desafios (do iniciante ao chefe), testes automáticos, XP, patentes e sequência diária |
| **Essencial** `/essencial` | 53 passos que não dá para pular, com o risco de pular cada um e uma tarefa prática |
| **Geradores** `/geradores` | Sombra, gradiente, flexbox, grid, curva de animação e border-radius |
| **Receitas · Comparativos · Guias** | "Como fazer X", diferenças lado a lado (let/const/var, JOINs...) e tutoriais |
| **Snippets (65) e Templates (11)** | Componentes e sites completos, com abas por categoria e seletor de estilo visual |
| **VS Code** `/vscode` | Gatilhos `cd-html`, `cd-css` e mais 38 para baixar |

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Shiki · CodeMirror 6 + Emmet · sql.js (SQLite) · PGlite (PostgreSQL em WebAssembly) · fflate. Sem backend: conteúdo estático (SSG) e `localStorage`.

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # gera o site estático
```

O `predev`/`prebuild` copia o PostgreSQL em WebAssembly para `public/pglite/` (pasta não versionada).

## Documentação

- [`docs/DOC-MESTRE.md`](docs/DOC-MESTRE.md): arquitetura, convenções, como validar conteúdo, armadilhas conhecidas e roadmap.
- [`docs/LINKEDIN-SERIE.md`](docs/LINKEDIN-SERIE.md): plano de divulgação do projeto.

## Como o conteúdo é validado

Não há testes unitários; a validação é feita em **Chromium headless real**: cada demo CSS é comparada com a cena sem o CSS, todas as consultas SQL rodam em SQLite e PostgreSQL, cada desafio precisa passar na solução e falhar no código inicial, e as interações (digitar, arrastar, clicar) são exercitadas. Detalhes no documento mestre.

## Contribuindo

Issues e PRs são bem-vindos, principalmente **novos desafios** (HTML e CSS ainda têm poucos), correções de conteúdo e ideias de recursos. Antes de abrir um PR, rode `npm run lint` e `npm run build`. Commits pequenos, em português, no formato `tipo(escopo): descrição`.

## Licença

Defina a licença do projeto antes de divulgar (sugestão: MIT).
