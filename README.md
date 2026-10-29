# cheat/dev

Hub de consulta e treino para quem programa: **503 comandos** de HTML, CSS, JavaScript e SQL em que **tudo é explicado e pode ser testado na hora**, dentro da página. Sem instalar nada e sem cadastro.

🔗 **Site:** https://cheat-dev.vercel.app

> Material de estudo que você não pode testar é decoração.

<!-- Quando tiver os prints, descomente e ajuste os nomes:
![Página inicial do cheat/dev](docs/img/home.png)
-->

## Por que existe

A maioria dos materiais mostra o **código**, não o **comportamento**. Aqui, cada comando segue o mesmo molde: o que é e para que serve, por que importa (com a armadilha mais comum), um exemplo que você **edita e roda ali mesmo**, quando usar e quando evitar, e comandos relacionados.

## O que tem aqui

| Recurso | O que faz |
|---|---|
| **Comandos** (503) | HTML 135 · CSS 196 · JavaScript 86 · SQL 86. Sintaxe, explicação do porquê, armadilha comum e playground ao vivo |
| **Lab** `/lab` | Editor HTML/CSS/JS com resultado ao vivo, Emmet, 17 dispositivos, multi-tela, console, link compartilhável e exportar/importar ZIP |
| **SQL Lab** `/sql-lab` | SQLite e **PostgreSQL** (o motor do Supabase) rodando no navegador; 3 bancos de exemplo, aulas, exercícios com correção e dialetos lado a lado |
| **Desafios** `/desafios` | 133 desafios em 27 trilhas, do zero ao avançado, com mini-aulas, testes automáticos, roleta configurável, XP, patentes e sequência diária |
| **Essencial** `/essencial` | 53 passos que não dá para pular, com o risco de pular cada um e uma tarefa prática |
| **Geradores** `/geradores` | Sombra, gradiente, flexbox, grid, curva de animação e border-radius |
| **Receitas · Comparativos · Guias** | 13 "como fazer X", 18 comparativos lado a lado (let/const/var, JOINs...) e 6 tutoriais |
| **Snippets (65) e Templates (11)** | Componentes e sites completos, com abas por categoria e 43 combinações de estilo visual |
| **VS Code** `/vscode` | 40 gatilhos `cd-` (`cd-html`, `cd-css`...) para baixar |

## Seus dados

Não há servidor nem conta. O progresso (desafios, trilhas, favoritos) fica **só no seu navegador** (`localStorage`). Dá para exportar e importar um backup pela própria página.

## Rodando localmente

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # gera o site estático
```

O `predev`/`prebuild` copia o PostgreSQL em WebAssembly para `public/pglite/` (pasta não versionada).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Shiki · CodeMirror 6 + Emmet · sql.js (SQLite) · PGlite (PostgreSQL em WebAssembly) · fflate. Sem backend: conteúdo estático (SSG) e `localStorage`.

## Como o conteúdo é validado

Não há testes unitários; a validação é feita em **Chromium headless real**: cada demo CSS é comparada com a cena sem o CSS, todas as consultas SQL rodam em SQLite e PostgreSQL, cada desafio precisa passar na solução e falhar no código inicial, e as interações (digitar, arrastar, clicar) são exercitadas. Os scripts ficam em [`scripts/validate/`](scripts/validate/README.md).

Para conferir que os números citados na documentação batem com o código:

```bash
npx tsx scripts/validate/inventory.mts --check
```

## Documentação

- [`docs/DOC-MESTRE.md`](docs/DOC-MESTRE.md): arquitetura, convenções, como validar conteúdo, armadilhas conhecidas e roadmap.
- [`docs/LINKEDIN-SERIE.md`](docs/LINKEDIN-SERIE.md): plano de divulgação do projeto.

## Contribuindo

Issues e PRs são bem-vindos, principalmente:

- **novos desafios** (use `src/content/challenge-kit.ts` e acrescente o id em `src/content/tracks.ts`);
- correções de conteúdo (achou um erro? abra uma issue com o passo a passo);
- ideias de recursos.

Antes de abrir um PR, rode `npm run lint` e `npm run build`. Commits pequenos, em português, no formato `tipo(escopo): descrição` (`feat`, `fix`, `refactor`, `docs`, `chore`, `build`, `test`).


## Créditos

Este projeto usa, entre outras, as bibliotecas open source [CodeMirror](https://codemirror.net/), [Emmet](https://emmet.io/), [sql.js](https://github.com/sql-js/sql.js), [PGlite](https://pglite.dev/), [Shiki](https://shiki.style/) e [fflate](https://github.com/101arrowz/fflate), cada uma sob a sua própria licença.

## Licença

Distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE).
