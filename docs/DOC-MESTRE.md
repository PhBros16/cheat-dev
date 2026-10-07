# cheat/dev — Documento Mestre (handoff completo)

> **Como usar:** cole este arquivo inteiro na primeira mensagem de uma nova conversa com o Claude e diga o que quer atacar.
> Ele contém tudo que é preciso para continuar sem reexplicar nada. Última atualização: outubro/2026.

---

## 1. O que é o projeto

**cheat/dev** é um hub de consulta e treino para desenvolvedores: cheatsheet de HTML, CSS, JavaScript e SQL, mas com tudo **explicado e testável na hora, dentro da página**. A regra de ouro do produto, dita pelo autor (Pedro):

> Tudo deve ser bem explicado e passível de teste imediato pelo usuário, com exemplos. O objetivo é ser o hub perfeito do dev, do básico ao complexo.

Por isso quase todo conteúdo tem um playground ao vivo (HTML/CSS/JS rodando em iframe, SQL rodando em banco de verdade dentro do navegador).

## 2. Links e deploy

- **Site ao vivo:** https://cheat-dev.vercel.app
- **Repositório:** https://github.com/PhBros16/cheat-dev (público, branch `main`)
- **Vercel Project ID:** `prj_Ecl2n4EStmVmxQ9RPHgy3w1c4PzF` · **Team ID:** `team_oKkpVA9F7cwuuQZu2o6NQAFX`
- **Deploy automático:** todo `git push` na `main` dispara build + deploy. Não existe upload manual.
- `npm run build` executa antes o script `scripts/copy-pglite.mjs` (copia o Postgres em WebAssembly de `node_modules` para `public/pglite/`, pasta **não versionada**).

## 3. Autenticação com o GitHub (leia antes de pedir push)

**Nenhum token é guardado neste documento, de propósito.**

1. GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
2. **Repository access:** só `cheat-dev`. **Contents:** Read and write. **Expiration:** 7 dias.
3. Cole o token na conversa quando o Claude pedir.
4. O Claude deve usar o token **apenas dentro do comando bash**, trocar o remote por uma URL sem token logo após o push e lembrar de revogar.
5. Depois do push: **revogue o token** (botão *Delete*).

### Identidade dos commits (importante para o gráfico do GitHub)

Os commits só contam no gráfico de contribuições se o **e-mail do commit estiver ligado à conta**. Configure sempre:

```bash
git config user.name  "PhBros16"
git config user.email "264437598+PhBros16@users.noreply.github.com"
```

Aprendizado: no início, os commits saíam com um e-mail fictício (`bot@...`) e não apareciam no perfil. O histórico foi reescrito uma vez (force-push) para corrigir. **Não reescreva histórico de novo sem necessidade.**

### Convenção de commits

Commits **pequenos, atômicos e com mensagem clara** (um por unidade lógica), em português, no padrão `tipo(escopo): descrição`:
`feat`, `fix`, `refactor`, `docs`, `chore`, `build`, `test`. Exemplos: `feat(sql-lab): seletor de motor SQLite/PostgreSQL`, `fix(playground): permite scripts no HTML`, `docs: atualiza o documento mestre`. Não crie commits vazios, nem altere datas: o histórico deve refletir o trabalho real.

## 4. Stack técnica

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Shiki** para syntax highlight (no servidor)
- **CodeMirror 6** (`codemirror`, `@codemirror/lang-html|css|javascript|sql`, tema One Dark) + **Emmet** (`@emmetio/codemirror6-plugin`) no Lab e nos desafios
- **sql.js** (SQLite em WebAssembly, ~650 KB, arquivos copiados e **versionados** em `public/sqljs/`)
- **@electric-sql/pglite** (PostgreSQL real em WebAssembly, ~4 MB; copiado em tempo de build para `public/pglite/`, no `.gitignore`)
- **fflate** (ZIP no navegador: exportar e importar projetos do Lab)
- Sem backend e sem banco de dados próprio: tudo é conteúdo estático (SSG) + `localStorage`
- PWA: manifest, service worker (cache de páginas visitadas), ícones
- Build: `npm run build` · Lint: `npm run lint` (deve passar sem erros) · Dev: `npm run dev`
- O ESLint ignora `public/sqljs/**` e `public/pglite/**` (código de terceiros)

## 5. Mapa de pastas

```
scripts/copy-pglite.mjs       — copia o PGlite para public/pglite (predev/prebuild)
public/sqljs/                 — sql-wasm.js + sql-wasm.wasm (versionados)
docs/                         — DOC-MESTRE.md (este) e LINKEDIN-SERIE.md
src/
  app/
    [lang]/[category]/[entry]/   — página de cada comando (playground, relacionados, prev/next)
    essencial/  desafios/  lab/  sql-lab/  geradores/  vscode/  favoritos/
    receitas/[slug]  comparativos/[slug]  guias/[slug]  snippets/[slug]  templates/[slug]
    busca/  todos/  search-index.json/  sitemap.ts  robots.ts  offline/
  components/
    lab/        Lab.tsx (editor ao vivo), Editor.tsx (CodeMirror+Emmet+gatilhos cd-), doc.ts (monta o documento do iframe,
                ponte de console, ZIP), devices.ts, starters.ts, LabLoader.tsx
    sql/        SqlLab.tsx, Dialects.tsx, SqlLabLoader.tsx
    hub/        Hub.tsx (painel+roleta+lista), WebRunner.tsx, SqlRunner.tsx, Wheel.tsx
    Playground.tsx (HtmlPlay/CssPlay/JsPlay), SqlPlay.tsx, SqlResults.tsx, Live.tsx, LazyPreview.tsx,
    SnippetBrowser.tsx (abas por categoria + filtro), TemplateStudio.tsx (estilos visuais),
    Generators.tsx, EssencialTracker.tsx, Sidebar.tsx (server), TopBar.tsx, SearchBox.tsx ...
  content/
    html.ts css.ts js.ts sql.ts        — comandos ORIGINAIS (estrutura em objeto)
    extra/                             — lotes adicionados (helpers compactos): html-1..3, css-1..4, js-1..3, sql-1..4
    extra/index.ts                     — registra os lotes (EXTRA) · extra/keywords.ts (keywords pt-BR dos originais)
    helpers.ts                         — H() / S() / J() / Q() / cat()
    sql-demos.ts  pg-demos.ts          — consultas executáveis (SQLite) e versões PostgreSQL
    sql-dialects.ts  sql-exercises.ts  — dialetos lado a lado; exercícios e aulas do SQL Lab
    challenges.ts                      — 58 desafios do Hub (com testes)
    essencial.ts                       — trilha "Essencial" (53 passos)
    snippets.ts + snippets-extra.ts · templates.ts + templates-extra.ts + themes.ts
    comparisons.ts  recipes.ts  vscode.ts  guides/
  lib/
    content.ts      — junta tudo, anexa demos SQL, monta o índice de busca
    search.ts       — motor de busca em linguagem natural
    sqlDbs.ts pgScripts.ts sqlEngine.ts sqljs.ts sqlCheck.ts — bancos de exemplo e motores SQL
    hubStore.ts challengeDoc.ts essLinks.ts store.ts types.ts langStyles.ts
```

## 6. Inventário de conteúdo (outubro/2026)

| Área | Quantidade |
|---|---|
| Comandos HTML | 135 (16 categorias) |
| Comandos CSS | 196 (31 categorias) |
| Comandos JavaScript | 86 (19 categorias) |
| Comandos SQL | 86 (20 categorias, inclui PostgreSQL & Supabase) |
| **Total de comandos** | **503** |
| Snippets de componentes | 65 (11 categorias, abas + filtro) |
| Templates de site | 11 (43 combinações de estilo visual) |
| Receitas "como fazer X" | 13 |
| Comparativos | 18 |
| Guias e tutoriais | 6 (inclui "Do zero ao site no ar: GitHub + Vercel") |
| Desafios do Hub | 58 (HTML 8 · CSS 11 · JS 15 · SQL 24) |
| Passos da trilha Essencial | 53 (6 trilhas) |
| Gatilhos VS Code (`cd-`) | 40 |
| Receitas de dialetos SQL | 17 |
| Aulas guiadas / exercícios SQL | 18 / 18 (+6 desafios extras no Hub) |
| Bancos de exemplo | 3 (loja, escola, RH) |

## 7. Funcionalidades principais

### 7.1 Páginas de comando
Cada comando tem sintaxe, explicação, exemplos, "use quando / evite quando", relacionados, palavras-chave em linguagem natural e **playground**: HTML/CSS (cenas de preview), JavaScript (console capturado) e **SQL** (banco real). Comandos citados na trilha Essencial ganham a etiqueta **★ Essencial**.

### 7.2 Lab (`/lab`)
Editor HTML/CSS/JS com resultado ao vivo (equivalente ao "Go Live" do VS Code, dentro da página):
- Emmet (Tab) e gatilhos `cd-` iguais aos snippets de VS Code; CodeMirror com tema escuro.
- Telas: Responsivo, tamanho livre (alças de arrastar), **17 dispositivos**, chips de breakpoint (320 a 1536), proporções, girar, zoom e **multi-tela** (até 4 dispositivos ao mesmo tempo).
- CSS é injetado **sem recarregar** (preserva estado); HTML recarrega; JS conforme a opção "JS auto".
- Console (com REPL), contornos, grade de 8 px, tela cheia, link compartilhável (`#p=` deflate+base64), baixar `.html`, **exportar/importar ZIP** (`index.html`, `style.css`, `script.js`) e arrastar-e-soltar.
- Proteção contra laço infinito (flag `cheatdev:lab:running`).
- O iframe é isolado (sem `allow-same-origin`); `localStorage` dentro dele é **em memória** (shim injetado).
- Botão "Abrir no Lab" em snippets, templates, receitas e playgrounds (entrega via `cheatdev:lab:inbox`).

### 7.3 SQL Lab (`/sql-lab`)
SQL de verdade no navegador, com **dois motores selecionáveis**:
- **SQLite** (sql.js) e **PostgreSQL** (PGlite, o mesmo motor do **Supabase**).
- 3 bancos de exemplo; esquema clicável; plano de execução (`EXPLAIN QUERY PLAN` / `EXPLAIN`); reiniciar banco; exportar CSV; histórico.
- Aulas guiadas, exercícios com correção automática (sempre em SQLite), aba **Dialetos** (SQLite, PostgreSQL, MySQL e SQL Server lado a lado; MySQL e SQL Server são só referência).
- Comandos do PostgreSQL & Supabase (uuid, JSONB, arrays, LATERAL, triggers, views materializadas, **RLS com `auth.uid()` simulado**, tradutor supabase-js ⇄ SQL) rodam num Postgres real.
- **MySQL não roda** no navegador (não existe motor WebAssembly maduro; verificado). Seria preciso um servidor real (decisão pendente).

### 7.4 Desafios (`/desafios`) — "roleta"
- Roleta animada de linguagens (HTML/CSS/JS/SQL); modo **adaptativo** (sempre o nível mais baixo ainda incompleto) ou nível fixo; **desafio do dia**.
- 4 níveis: iniciante (10 XP), intermediário (25), avançado (50), **chefe** (100).
- Testes automáticos: HTML/CSS/JS rodam **dentro do iframe** do aluno (`challengeDoc.ts` injeta o executor; os `check` são expressões JS avaliadas por `eval` indireto; aceitam Promises, timeout de 3 s). SQL compara o resultado com o da solução (`sqlCheck.ts`).
- Gamificação: XP, 6 patentes (Aprendiz a Mestre), sequência diária, 8 conquistas, progresso por linguagem. Tudo em `localStorage` (`cheatdev:hub:v1`).
- Todos os desafios foram **validados em Chromium headless**: a solução passa em 100% dos testes e o código inicial falha.

### 7.5 Essencial (`/essencial`)
O conhecimento primordial em 6 trilhas (HTML, CSS, JS, SQL, Git/Deploy, Qualidade), 53 passos em ordem. Cada passo traz **por que importa**, **o que acontece se pular**, **tarefa prática** e links para comandos/guias/ferramentas. Progresso salvo (`cheatdev:essencial:v1`). Os links usam o formato `lang:slug` ou `/rota` e são resolvidos por `lib/essLinks.ts`.

### 7.6 Outros
Geradores de CSS (sombra, gradiente, flexbox, grid, curva `cubic-bezier` arrastável, `border-radius`); Receitas; Comparativos; Guias; Snippets (65) e Templates (11, com seletor de estilo visual que troca só o bloco `:root`); página VS Code (download dos snippets `cd-`); Favoritos por linguagem; busca em linguagem natural que também indexa receitas, comparativos, guias, snippets e templates.

## 8. Como o conteúdo é escrito

### 8.1 Helpers (`src/content/helpers.ts`)
Formato compacto: `H()` (HTML), `S()` (CSS), `J()` (JS), `Q()` (SQL), `cat(slug, título, descrição, [entradas])`.
Campos: `s` slug · `t` título · `d` resumo · `x` sintaxe · `n` explicação (parágrafos separados por `\n`) · `ex` exemplos (separados por `\n---\n`) · `u` use quando · `a` evite quando · `r` relacionados (`lang/categoria/slug` separados por `|`) · `k` palavras-chave (`|`) · `v` cena de demo CSS · `L: 1` (JS executável).

### 8.2 Regras de conteúdo
- Português do Brasil, com acentos; explicar o **porquê**, não só o quê; incluir a armadilha comum.
- **Todo exemplo deve rodar** no playground. Valide antes de commitar (ver seção 10).
- Sem imagens remotas nos templates/snippets (usar gradientes/emoji/`data:`).
- Recursos novos de navegador: avisar para conferir o suporte no caniuse (o suporte foi escrito de memória).
- `k:` (keywords) devem ter frases como alguém **sem conhecer o nome técnico** descreveria ("borda embaixo", "texto na vertical").
- Referências `r:` quebradas são descartadas silenciosamente; confira com o script de resolução (seção 10).
- Categorias de lotes novos são mescladas por slug com as existentes (`content.ts`).

### 8.3 SQL executável
- `sql-demos.ts` mapeia `slug → { db, query }` (SQLite). `pg-demos.ts` guarda a versão PostgreSQL só onde difere. Comandos exclusivos do Postgres usam `SQL_PG_ONLY` (em `extra/sql-4.ts`).
- `content.ts` (`sqlProps`) anexa `entry.sql = { db, query, pg?, only? }`; a página renderiza `SqlPlay`.
- Cada execução abre um banco **novo** (`sqlEngine.openConn`), então o usuário não quebra nada.

## 9. Sistema de busca

`src/lib/search.ts` (stopwords, ~150 sinônimos pt-BR → termos técnicos, pontuação por título/keyword/resumo). **Cuidado:** palavras de domínio ("elemento", "tag", "função", "propriedade") **não** podem estar nas stopwords (bug já corrigido). O índice (`/search-index.json`) inclui comandos e também receitas, comparativos, guias, snippets e templates (com link próprio).

## 10. Como testar (scripts versionados em `scripts/validate/`)

Não há suíte de testes unitários; a validação é feita com **navegador headless real** e executando todo o SQL nos dois motores. Os scripts estão no repositório, com instruções em `scripts/validate/README.md`:

| Script | Valida |
|---|---|
| `sql-all.mts` | todas as consultas SQL em SQLite **e** PostgreSQL (comandos, dialetos, exclusivos do Postgres, desafios) |
| `links.mts` | links "relacionados" dos comandos e links da trilha Essencial |
| `challenges.mts` + `challenges-run.mjs` | cada desafio web: a solução passa 100% e o código inicial falha |
| `js-examples.mts` + `js-examples-run.mjs` | executa os exemplos de JavaScript e acusa erros |
| `css-demos.mts` | demos de CSS sem efeito visível e declarações inúteis |
| `e2e-hub.mjs`, `e2e-lab.mjs` | fluxos reais (roleta, testes, Emmet, multi-tela, ZIP, compartilhar) |

Preparação: `puppeteer-core` e `@sparticuz/chromium` em `/tmp/val` (o Chromium vem dentro do pacote npm, útil sem acesso à internet), `npm run build && npx next start -p 3111` para os e2e. Rode também `npm run lint` e `npm run build` antes de cada push. Rode `links.mts` **sempre que escrever um lote novo** (referências `r:` quebradas são descartadas em silêncio; já tivemos 3 assim).

## 11. Armadilhas já descobertas (não repetir)

1. **Next.js 16: `params` é Promise** — sempre `await params`.
2. **Tailwind v4 não detecta classes montadas dinamicamente** — use classes literais completas.
3. **Nunca aninhar `<button>` dentro de `<a>`/`<Link>`** (HTML inválido). Cards usam `lab={false}`.
4. **`/bin/sh` não suporta `${PIPESTATUS[0]}`** — use sintaxe POSIX.
5. Favicon: usar `app/icon.svg`, não `.ico` binário grande.
6. **Regras do ESLint do React 19** (`react-hooks/set-state-in-effect`, `react-hooks/refs`): não chame setState direto no corpo de um efeito; leia/escreva refs só em efeitos ou handlers; use `useSyncExternalStore` para `localStorage` (evita erro de hidratação).
7. **iframe `sandbox` sem `allow-same-origin`**: `localStorage` lança erro; injete o shim em memória (já feito no Lab, no `Live` e no playground HTML). O playground HTML só habilita scripts se o exemplo os usa.
8. **`setContent` do Puppeteer reaproveita o escopo global**: classes e `const` de um teste vazam para o próximo. Use uma página nova por teste.
9. **Servidor de teste "fantasma"**: ao subir `next start` repetidas vezes, o processo antigo pode segurar a porta e servir um build velho. Mate por nome (`pkill -9 -f next-serve[r]`) e confira `EADDRINUSE` no log.
10. **CodeMirror**: fontes de autocomplete precisam ser **uma única instância** (não recriar a cada tecla) ou o popup nunca aparece.
11. **PGlite**: carregar por `import(/* webpackIgnore: true */ /* turbopackIgnore: true */ "/pglite/index.js")` a partir de `public/`; não deixar o bundler processar os `.wasm`.
12. **SQLite vs PostgreSQL**: PG exige `GREATEST` em vez de `MAX(a,b)`, `STRING_AGG`, `to_char`, e respeita chaves estrangeiras sempre (apague os filhos antes).
13. Datas: `31/01 + 1 mês` cai em 02/03 no SQLite/JS e em 29/02 no MySQL/Postgres. Os textos já avisam.
14. **Não reescrever histórico do Git** sem necessidade (ver seção 3).
15. Upload de arquivo binário grande via API da Vercel falha; use sempre o fluxo Git (push → deploy automático).

## 12. Chaves do `localStorage`

`cheatdev:favs` · `cheatdev:recent` · `cheatdev:lab:v1` · `cheatdev:lab:inbox` · `cheatdev:lab:running` · `cheatdev:sqllab:v1` · `cheatdev:sqllab:inbox` · `cheatdev:hub:v1` · `cheatdev:essencial:v1`.
Mudar o formato de uma chave exige migração (ou trocar para `:v2`).

## 12b. Guia de manutenção: como adicionar...

**Um comando novo.** Crie ou edite um arquivo em `src/content/extra/` (próximo número do lote), use `H/S/J/Q` + `cat(...)`, registre o lote em `extra/index.ts`. Preencha `n` (o porquê), `ex` (exemplo que **roda**), `a` (armadilha), `r` e `k` (frases em linguagem natural). Rode `links.mts` e os validadores do tipo (JS: `js-examples`; CSS: `css-demos`; SQL: `sql-all`).

**Uma consulta SQL executável.** SQLite em `sql-demos.ts` (`slug → {db, query}`). Se o Postgres precisar de outra sintaxe, `pg-demos.ts`. Se o recurso só existe no Postgres, use `P()` em `extra/sql-4.ts` (entra em `SQL_PG_ONLY`). Rode `sql-all.mts`.

**Um desafio.** Em `src/content/challenges.ts`, use os construtores `js()/css()/html()/sqlNew()`. Campos: `id` único, `level` (`iniciante|intermediário|avançado|chefe`), `brief`, `hint`, `starter`, `solution` e `tests`. Cada teste é `{ name, check }` com `check` = **expressão JavaScript** avaliada dentro da página do aluno (verdadeiro = passou; pode ser uma Promise, com limite de 3 s; classes e funções do código do aluno ficam visíveis). Para CSS, meça `getComputedStyle` e `getBoundingClientRect` (a página de teste tem **560 px de largura**); para regras que dependem de `:hover` ou `@media`, leia `document.styleSheets`. SQL: forneça `db` e a consulta `solution` (a comparação ignora nomes de coluna e só considera a ordem se a solução tem `ORDER BY`). **Sempre** rode `challenges.mts` + `challenges-run.mjs`.

**Um passo da trilha Essencial.** Em `src/content/essencial.ts`: `id`, `title`, `why`, `skip` (o risco de pular), `task` e `links` (`lang:slug` ou `/rota`). Rode `links.mts`.

**Um template ou estilo.** Template: `T({...})` em `templates-extra.ts`, usando **somente** as variáveis do `:root` (`--bg --surface --text --muted --brand --brand2 --on --radius --font --head`). Estilo novo: entrada em `THEME_LIB` (`themes.ts`) e inclua o id na lista `themes` do template. A página troca só o bloco `:root`.

**Um snippet.** `S(slug, título, descrição, categoria, css, html, {light?, js?})` em `snippets-extra.ts` (base escura por padrão; `light: true` para fundo claro). A categoria vira uma aba automaticamente.

**Um gatilho do VS Code.** Em `vscode.ts` (tabstops no formato `[[1:texto]]`, `[[0]]` para o final). A exportação e o autocompletar do Lab são derivados dele.

## 12c. Como o Pedro trabalha (para manter o mesmo padrão)

- Quer ser **direto**: sem bajulação nem introduções vazias; quando algo não funciona ou não é viável, dizer logo, com o motivo e alternativas.
- Quer que cada limitação seja dita em voz alta (ex.: "MySQL não roda no navegador") e que os pontos fracos do que foi entregue sejam apontados.
- Gosta de seguir em blocos grandes ("pode seguir"), mas espera que **tudo seja testado de verdade** antes de ser publicado.
- Prefere **commits pequenos e atômicos** e quer ver sempre **o caminho dos arquivos entregues** (ex.: `/mnt/user-data/outputs/...`).
- Deixa a ordem de prioridade a critério do Claude quando diz "pode seguir pro lado que achar melhor", mas pede que a ordem escolhida seja justificada.
- Escreve em português; o produto é todo em português do Brasil.

## 12d. Limitações conhecidas e o que NÃO foi testado

- Testes apenas em **Chromium headless**: não houve teste em celular real nem em Safari/Firefox.
- Laço infinito no código do aluno (Lab/desafios) pode travar a aba; o Hub avisa após 9 s, mas esse cenário não foi exercitado.
- Os exemplos de **CDNs externas** (Tailwind, React via CDN) no Lab não foram testados (o ambiente de desenvolvimento não tinha internet).
- O suporte a recursos novos de CSS/HTML (anchor positioning, `@scope`, `popover` etc.) foi escrito de memória: conferir no caniuse.
- As tarefas da trilha Essencial **não são verificadas automaticamente** (o usuário marca).
- Supabase: só a parte SQL (incluindo RLS com `auth.uid()` simulado) roda; login, storage, realtime e a API automática não.
- Não há analytics instalado: as métricas do plano de LinkedIn dependem do analytics da Vercel ou de uma ferramenta que você adicione.

## 13. Estado atual e próximos passos sugeridos

### Já entregue
Comandos de HTML/CSS/JS/SQL em 4 lotes cada; Lab; SQL Lab com SQLite + PostgreSQL; Hub de desafios; Essencial; Geradores; Receitas; Comparativos; Guias; Snippets e Templates organizados; VS Code; Favoritos; busca ampla; documentos mestre e do LinkedIn.

### Pendências (por ordem de valor)
1. **Mais variações de layout nos templates** (hoje a variação é de estilo visual, não de layout) e mais variações de snippets.
2. **Trilhas guiadas** ligando guia → receita → desafio → comparativo (hoje o Essencial aponta, mas não conduz).
3. **Equivalente em Tailwind** e **compatibilidade de navegador** (caniuse) em cada comando CSS.
4. **Auditoria de acessibilidade** dentro do Lab (axe-core) e mais desafios de HTML/CSS (hoje 8 e 11).
5. **Link curto para projetos do Lab** (exigiria salvar no Supabase; atenção a abuso, moderação e LGPD).
6. **MySQL executável**: só com servidor real (container por sessão); decisão de custo pendente.
7. Mais comandos: CSS ainda está longe das 500+ propriedades; JS pode ganhar Web Workers, IndexedDB, Canvas, Web Components avançados.
8. Seção de Git/terminal; OG image dinâmica por comando; versão em inglês; testes automatizados; GitHub Actions (lint + build).
9. Sincronizar progresso (favoritos, Hub, Essencial) entre dispositivos com login (Supabase).

## 13a. Histórico de atualizações (changelog)

Resumo por fase (os commits têm o detalhe; `git log --oneline`):

| Data | O que entrou |
|---|---|
| 26/09 a 01/10 | Primeira versão; 80 comandos; PWA e SEO; "turbinada geral" (264 comandos, busca em linguagem natural, playgrounds, guias, snippets e templates) |
| 01/10 | CSS lote 1 (+94: transições, animações, transformações, posicionamento, scroll, seletores modernos); demos validados em navegador; página **Favoritos** por linguagem; página **VS Code** (40 gatilhos `cd-`); autoria dos commits corrigida (e-mail noreply) |
| 01 a 02/10 | **Lab** (editor ao vivo, Emmet, 17 dispositivos, multi-tela, console, ZIP, link compartilhável); **Receitas** (13), **Comparativos**, guia **GitHub + Vercel**; **Snippets** (65, abas por categoria) e **Templates** (11, com estilos visuais); busca ampliada |
| 03/10 | CSS lote 2 (+36: `@property`, anchor, popover, `@scope`, cores relativas, impressão, fontes variáveis, formulários); **Geradores de CSS**; **SQL Lab** (SQLite) com "Testar na hora" em 76 comandos, aulas e exercícios com correção; +36 comandos SQL e +38 de HTML; 8 comparativos novos; playground HTML passa a rodar scripts |
| 04/10 | **PostgreSQL (PGlite)** no SQL Lab e nos comandos; categoria **PostgreSQL & Supabase** (RLS, JSONB, triggers...); aba **Dialetos** (17 receitas); trilha **Essencial** (53 passos) com etiqueta ★; banco de **58 desafios** com testes validados |
| 05/10 | **Hub de desafios** (roleta, XP, patentes, sequência, desafio do dia); verificador de SQL compartilhado; **JavaScript** +25 comandos (datas, Map/Set, regex, event loop...) |
| 06 a 07/10 | Doc mestre, plano de LinkedIn (14 posts) e README; scripts de validação versionados; correção de 3 links quebrados e do lint |

Totais: 37 commits · 503 comandos · 58 desafios · 65 snippets · 11 templates (43 estilos) · 18 comparativos · 13 receitas · 6 guias · 53 passos Essenciais.

## 13b. Backlog de ideias e aprofundamentos (por área)

Legenda: **valor** (A/M/B) · **esforço** (P/M/G).

### Plataforma e produto
- **Login com Supabase** para sincronizar favoritos, Hub e Essencial entre dispositivos (A · G). Habilita ranking e certificados.
- **Analytics** (Vercel Analytics ou Plausible) para saber o que as pessoas usam (A · P). Hoje não há nenhum.
- **GitHub Actions**: lint + build + `scripts/validate` a cada PR (A · M).
- **OG image dinâmica por comando** para compartilhar bem no WhatsApp/LinkedIn (M · M).
- **Versão em inglês** (i18n) (M · G).
- **PWA offline** também para Lab e SQL Lab (cache dos `.wasm`) (M · P).
- Página de **novidades** (changelog público) e newsletter (B · P).
- Auditoria de acessibilidade do próprio site (axe) e orçamento de performance (M · M).

### Hub de desafios
- **Mais desafios de HTML e CSS** (hoje 8 e 11): meta de 15 novos, com os mesmos testes validados (A · M). **Próximo passo sugerido.**
- **Trilhas guiadas**: sequência guia → receita → comparativo → desafio, com selo ao concluir (A · M).
- **Modo prova** com cronômetro e **modo entrevista** (algoritmos clássicos em JS, dicas de complexidade) (M · M).
- **Revisão espaçada** (flashcards dos comandos que o usuário errou) (M · M).
- **Desafio semanal compartilhado**, ranking e **certificado em PDF** por trilha (depende de login) (M · G).
- **Desafios criados por usuários** com link compartilhável (B · G).
- Mostrar, após acertar, **a solução comentada e uma variação mais elegante** (M · M).

### HTML
- Padrões ARIA completos (combobox, tabs, menu, modal com *focus trap*) com testes (A · M).
- Formulários avançados (`datalist`, `output`, `meter`, validação por país), microdados e schema.org além do JSON-LD (M · M).
- **HTML de e-mail** (tabelas, compatibilidade por cliente) (M · M).
- Web Components avançados (Shadow DOM, `slot`, form-associated) (M · M).

### CSS
- **Lote 3** rumo às 500+ propriedades: `scroll-timeline`, `font-stretch`, `mask`, `columns` avançado, `@font-face` completo, *container style queries*, propriedades lógicas restantes (M · G).
- **Equivalente em Tailwind** e **tabela de compatibilidade (caniuse)** em cada comando (A · G).
- Mais geradores: `clip-path`, grid com áreas nomeadas, glassmorphism/neumorphism, editor visual de `@keyframes`, checador de contraste e paleta (A · M).
- Guia "**por que meu CSS não funciona**" (z-index, flex que não centraliza, overflow, specificity) (A · P).

### JavaScript
- Web Workers, IndexedDB, Canvas, WebSockets/SSE, `Proxy`/`Reflect`, `Symbol`, Service Workers (M · M).
- **Visualizador do event loop** e "JS tutor" passo a passo (A · G).
- Mini **executor de testes** no Lab (estilo Vitest) para escrever funções e testes juntos (M · M).
- Guia de **TypeScript** para quem vem do JS (M · M).
- Fetch avançado (retry, streaming, cancelamento) e padrões de estado no front (M · M).

### SQL e bancos
- **pg_trgm, busca full-text e pgvector** (o lado "IA" do Supabase) com demos no PGlite (A · M; verificar se as extensões estão no PGlite).
- **Laboratório de performance** com dataset grande gerado (100 mil linhas) para *ver* o efeito do índice (A · M).
- **Transações e isolamento** com duas conexões (dirty read, deadlock) (M · G).
- **Gerador de diagrama ER** (Mermaid) a partir do esquema (M · M).
- Supabase além do SQL: schema `auth`, políticas de **storage**, publicações de **realtime**, funções + `.rpc()` (A · M).
- Banco de **séries temporais/vendas** para análise (coorte, retenção, funil) e 30 perguntas de **entrevista de SQL** (A · M).
- **MySQL real** via servidor (contêiner por sessão): só se houver demanda e orçamento (M · G).

### Lab
- **Auditoria de acessibilidade (axe-core)** e checagens de SEO básicas dentro do Lab (A · M).
- **Vários arquivos e pastas**, histórico de versões (desfazer por snapshot) e botão **formatar código** (Prettier) (M · M).
- **Seletor de bibliotecas** por CDN com lista permitida (Tailwind, Alpine, React UMD) (M · P); testar com internet.
- Exportar **capturas de tela** nos vários tamanhos (B · M).
- **Link curto** via Supabase (A · M; atenção a abuso, moderação e LGPD).

### Divulgação
- Gerar os **carrosséis do LinkedIn** (Posts 5, 6 e 11) com o conector do **Canva** que já está disponível na conta (M · P).
- Vídeos curtos (30 s) do Lab, da roleta e do RLS, seguindo o plano em `docs/LINKEDIN-SERIE.md` (A · P).
- Série "bug da semana" reaproveitando os aprendizados da seção 11 (M · P).

### Sugestão de ordem (próximos 3 ciclos)
1. +15 desafios de HTML/CSS e **trilhas guiadas** (completa o "hub": estudar → treinar → comprovar).
2. **Analytics + CI** e **login Supabase** (medir, proteger e sincronizar).
3. **pgvector/full-text** e **laboratório de performance** (diferencial no SQL) + auditoria de acessibilidade no Lab.

## 14. Como continuar numa nova conversa

Cole este documento e diga, por exemplo:
- "Vamos atacar o item 1 das pendências: mais variações de layout para os templates."
- "Crie 15 desafios novos de CSS (nível avançado e chefe) com testes e valide no navegador."

O Claude deve: clonar o repositório, ler `src/content/helpers.ts` e um arquivo `extra/` do mesmo tipo antes de escrever conteúdo, **rodar a validação** da seção 10, fazer `npm run lint && npm run build`, **commitar em commits atômicos** com a identidade da seção 3, publicar com o token efêmero e lembrar de revogá-lo.
