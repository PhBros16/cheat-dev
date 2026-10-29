# cheat/dev — Documento Mestre (handoff completo)

> **Como usar:** cole este arquivo inteiro na primeira mensagem de uma nova conversa com o Claude e diga o que quer atacar.
> Ele contém tudo que é preciso para continuar sem reexplicar nada. Última atualização: 16/10/2026.

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

### Tema e cores (atualizado em 11/10/2026)

Tudo vem de **tokens** em `src/app/globals.css` (`:root` e `.dark`), expostos ao Tailwind via `@theme inline`. **Escuro** = base original (`#0e1013`, `#16191d`, `#1c2024`). **Claro** = cinza-azulado em camadas (`#f3f5f9` de fundo, cards brancos). A paleta creme + sálvia + amarelo (09/10) foi descartada: parecia app de outro nicho, não "dev".

- **Acento da interface:** índigo (`--accent` `#4f46e5` claro / `#8b93ff` escuro; `--accent-fg` para texto; `--accent-soft` para fundos). Não conflita com nenhuma cor de linguagem. Usado em: botões primários (`bg-accent text-on-accent`), foco de teclado, seleção de texto, barra do item ativo da sidebar e um brilho sutil no topo (`body`).
- **Linguagens:** a cor PURA (`--color-html|css|js|sql`) só em pontos, bordas e fundos suaves. **Texto pequeno usa `text-<lang>-fg`** (mesmo matiz, tom ajustado para AA). Não mude as cores puras.
- **Status/níveis:** pares `bg-ok-bg text-ok-fg`, `warn`, `err`, `info`, `boss` (cada par >= 4,5:1, verificado em fundos lisos e tingidos). Níveis: iniciante=ok, intermediário=info, avançado=warn, chefe=boss.
- **Nunca** use cores soltas do Tailwind (`emerald-400`, `red-300`, `amber-500`...) sobre fundo do tema: foram pensadas para o escuro e ficam quase invisíveis no claro. Exceção: painéis escuros fixos (editor, console), onde o `-400` é o certo.
- **Código:** `bg-code` (claro `#f8fafd`, escuro `#0a0c0f`); Shiki `github-light-high-contrast` (claro) e `github-dark` com `colorReplacements` nos comentários (escuro). CodeMirror: One Dark com 4 cores ajustadas em `src/components/lab/Editor.tsx`.
- **Meta de acessibilidade:** contraste WCAG AA (4,5:1; 3:1 para texto grande), medido por `a11y-audit.mjs` e `a11y-states.mjs`. Isentos: o logotipo "/" (identidade da linguagem) e controles desabilitados.
- **Ao trocar a paleta:** recalcule os pares de status e os tons `-fg` das linguagens contra os novos fundos (inclusive o fundo do item ativo da sidebar) e rode as duas auditorias nos 2 temas.

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
    hub/        Hub.tsx (painel+roleta configurável+trilhas), WebRunner.tsx, SqlRunner.tsx, Wheel.tsx (2 a 12 fatias), Learn.tsx (mini-aula)
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
    challenges.ts                      — 58 desafios originais + junta os novos e ordena pelas trilhas (exporta CHALLENGES)
    challenge-kit.ts                   — helpers e construtores (jsFn, jsDom, htmlC, cssC, sqlC) · ch-html|css|js|sql.ts — 75 desafios novos
    tracks.ts                          — 27 TRILHAS ordenadas (a ordem de `ids` é a ordem de aprendizado; todo desafio está em exatamente uma)
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
| Desafios do Hub | 156 em 28 trilhas (HTML 26 · CSS 28 · JS 45 · SQL 57); 156 com mini-aula |
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

### 7.4 Desafios (`/desafios`) — trilhas, mini-aulas e roleta
- **Trilhas** (`src/content/tracks.ts`): 28 sequências do básico ao avançado (HTML 7, CSS 6, JS 8, SQL 7). A lista mostra o progresso de cada trilha, o "próximo passo" e um botão **▶ Continuar**; há também a visão **Por nível**. Dentro do desafio: "Trilha X · passo 3 de 6" e **Próximo passo →**.
- **Mini-aula** (`learn`, componente `Learn.tsx`): "📘 Aprenda antes de praticar", com parágrafos, `código` em linha, **negrito** e blocos ```cercados```. Os **133 desafios têm mini-aula**: as dos 75 novos ficam no próprio desafio (`ch-*.ts`) e as dos 58 originais em `src/content/learn-extra.ts` (ligadas por id). O validador de integridade exige >= 60 caracteres em todos e `learn-render.mts` varre as 133 aulas procurando marcação sobrando. O interpretador do texto é `src/lib/learnParse.ts` (negrito pode conter código).
- **Roleta configurável** (`wheelPool.ts`, persistida em `cheatdev:hub:wheel:v1`): escolha **linguagens** e **níveis**, "só os que ainda não resolvi" e/ou **marque desafios um a um** (modo "Escolher um a um": a seleção manual manda no filtro). Com até 12 desafios cada fatia é **um desafio**; acima disso as fatias são linguagens, depois trilhas, depois níveis. Com 1 desafio vira um botão "Abrir". Dentro do grupo sorteado o comportamento é **adaptativo** (nível mais baixo ainda pendente). Se tudo da seleção já foi resolvido, os resolvidos voltam à roleta (aviso na tela).
- **Desafio do dia** continua. 4 níveis: iniciante (10 XP), intermediário (25), avançado (50), **chefe** (100).
- Testes automáticos: HTML/CSS/JS rodam **dentro do iframe** do aluno (`challengeDoc.ts` injeta o executor; os `check` são expressões JS avaliadas por `eval` indireto; aceitam Promises, timeout de 3 s; a página de teste tem 560 px de largura). SQL compara o resultado com o da solução (`sqlCheck.ts`: ignora nomes de coluna; só considera a ordem se a solução tiver `ORDER BY`).
- Gamificação: XP (total possível 4460), 6 patentes (Aprendiz 0, Construtor 150, Desenvolvedor 500, Pleno 1200, Sênior 2400, Mestre 3600), sequência diária, 11 conquistas (inclui Trilheiro, Explorador e Meio caminho), progresso por linguagem e por trilha. Tudo em `localStorage` (`cheatdev:hub:v1`).
- **Como criar um desafio novo:** use os construtores de `challenge-kit.ts` num dos `ch-*.ts`, acrescente o id na trilha certa em `tracks.ts` escreva a `learn` e 1 a 2 **soluções alternativas** em `src/content/alts.ts` (o validador exige que passem 100%: pega testes rígidos demais) e rode `integrity.mts`, `learn-render.mts` e `challenges-run.mjs`. A regra do validador: a **solução passa 100%** dos testes e o **código inicial não passa tudo**; prefira testes que o código inicial não satisfaça por acaso (um `<h1>` já tem 32px e negrito por padrão; "não altera o original" passa se a função devolve `undefined`: combine com o resultado esperado).

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
| `e2e-hub.mjs`, `e2e-lab.mjs`, `e2e-roleta.mjs` | fluxos reais (roleta, testes, Emmet, multi-tela, ZIP, compartilhar; `e2e-roleta`: filtros, seleção um a um, persistência, sorteio, trilhas, próximo passo, mini-aula, conquistas) |
| `e2e-links-backup.mjs`, `backup.mts`, `learn-render.mts` | ligações trilha↔guia/receita e link `#trilha-…`; backup (exportar, apagar, importar, arquivo inválido); mini-aulas dos originais e **uma única mini-aula ao trocar de desafio**; testes unitários do backup; varredura das 133 aulas |
| `integrity.mts` | catálogo: ids únicos, toda trilha aponta para desafios que existem, todo desafio está em exatamente uma trilha, mini-aula nos novos, testes com nomes únicos |
| `wheel.mts` | testes unitários da roleta (pool, fatias, sorteio adaptativo, localStorage adulterado) e da navegação por trilhas |
| `inventory.mts [--fix\|--check]` | **inventário real** do produto (comandos, desafios por linguagem, trilhas, snippets, templates e estilos, comparativos, receitas, guias, atalhos, dispositivos, commits) gerado do código; com `--check` falha se os números escritos neste doc ou no plano do LinkedIn estiverem errados |
| `sql-alts.mts` | SQL: o corretor **aceita** consultas alternativas corretas (`SQL_ALTS` em `alts.ts`) e **recusa** erros plausíveis (`SQL_WRONG`); roda no SQLite com o mesmo `sameResult` do Hub |
| `a11y-audit.mjs` | por página: contraste WCAG de todo texto visível, erros de console, requisições com falha e overflow horizontal |
| `a11y-states.mjs` | o mesmo, em ~90 **estados interativos** (desafios com erro/sucesso, SQL nos 2 motores, console do Lab, abas dos Geradores…). Rode nos 2 temas e em 390, 768 e 1440 px |
| `overflow-all.mjs` | overflow horizontal em TODAS as rotas numa largura (rápido); rode em 320, 390, 768 e 1024 |
| `serve-and-run.sh` | sobe o servidor, roda o comando e derruba (na MESMA chamada) |

Preparação: `puppeteer-core` e `@sparticuz/chromium` em `/tmp/val` (o Chromium vem dentro do pacote npm, útil sem acesso à internet), `npm run build && npx next start -p 3111` para os e2e. Rode também `npm run lint` e `npm run build` antes de cada push. Rode `links.mts` **sempre que escrever um lote novo** (referências `r:` quebradas são descartadas em silêncio; já tivemos 3 assim).

Notas de execução (aprendidas em 09/10): ambientes com limite de ~300 s por comando cortam `sql-all.mts` (cria um PGlite por consulta) **e ele sai sem imprimir nada**, o que parece sucesso: confira o código de saída (`exit=124` é timeout) ou divida em partes. Em 09/10 todas as 211 execuções foram validadas em 6 partes, 0 falhas. Rodadas completas de `a11y-states.mjs` levam ~4-5 min: uma por chamada.


### Onde ficam os dados do usuário (e o que acontece se ele limpar, trocar de aparelho ou reinstalar)
Tudo (progresso dos Desafios, Essencial, favoritos, projetos do Lab e do SQL Lab, tema) fica em **`localStorage` do navegador**, por aparelho e por navegador: **não há conta, banco nem sincronização**. Fatos verificados em 16/10/2026:
- **Chrome desktop/Android:** o app instalado (PWA) usa o armazenamento do próprio navegador. Desinstalar o app **não** apaga os dados, a menos que se marque "Também apagar dados do Chrome". Limpar os dados do site ou do Chrome apaga tudo (inclusive do app instalado).
- **Safari/iOS:** em abas do Safari, o armazenamento gravado por script (localStorage, IndexedDB) pode ser apagado após **7 dias de uso do Safari sem visitar o site** (ITP). Apps adicionados à tela inicial têm contagem própria e são tratados à parte.
- Modo anônimo, "limpar dados do site" e falta de espaço também apagam. **Instalar de novo não restaura** o que foi apagado.
- Mitigação atual: `BackupPanel` (Desafios, Essencial e Favoritos): **exportar/importar** um `.json` (só chaves `cheatdev:*` e `theme`; recusa arquivo de outro app, versão futura e valores que não são texto) e botão **"Proteger contra limpeza automática"** (`navigator.storage.persist()`). Solução definitiva = conta + banco (ver pendências).

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
16. **Grid sem coluna definida estoura no celular**: `grid gap-4 lg:grid-cols-[...]` usa uma coluna `auto` que adota o min-content de `<pre>`, `<input range>` etc., ignorando `overflow-x-auto`. Use `grid-cols-1` (ou `grid-cols-[minmax(0,1fr)]`) no mobile. Já corrigido em Geradores e Dialetos.
17. **Títulos com palavra longa** (`element.addEventListener()`, "Compartilhamento") estouram 320 px: há `h1 { overflow-wrap: anywhere }` global.
18. **Barra do topo**: o `<nav>` só aparece a partir de `lg` (1024 px). Entre 768 e 1023 px ele estourava a largura em TODAS as rotas (agora o hambúrguer cobre essa faixa). Ao adicionar link no topo, rode `overflow-all.mjs` em 768.
19. **Cores de status só aparecem após interagir** (acertar desafio, rodar SQL com erro). A varredura estática não as vê: use `a11y-states.mjs`.
20. **Falsos positivos da auditoria**: texto `text-transparent` (o ✓ do checkbox não marcado) e captura no meio de `transition` de cor (espera de 700 ms resolve).
21. **Ambiente de desenvolvimento**: processos em background (`next start`/`next build`) não sobrevivem entre comandos e builds interrompidos deixam órfãos (`Another next build process`, `ENOTEMPTY`). Mate por PID; `pkill -f "next build"` casa com a própria linha de comando e se mata. `cut -c` quebra caracteres acentuados (UTF-8): use Python.
22. **`WebRunner` (Desafios)**: digitar e rodar em < 500 ms deixava o botão preso em "Testando…" (o `setTimeout` lia `running` velho e a pré-visualização recarregava o iframe no meio do teste). Corrigido com `runningRef` e sem recarregar durante a execução. Padrão a evitar: ler estado React dentro de `setTimeout`.
23. **Roteiro de estados precisa de asserções**: um estado não alcançado é auditado como se fosse o certo (tela errada, "0 problemas"). `a11y-states.mjs` falha com `ESTADO NÃO ALCANÇADO` e mostra a tela. Nunca use `.catch(() => {})` em clique de roteiro.
24. O botão "Solução" dos Desafios usa `confirm()`: em teste automatizado trate o diálogo (`page.on('dialog', d => d.accept())`) ou a página parece travada.
25. **`innerText` devolve o texto já transformado pelo CSS**: títulos com `uppercase` viram "DESAFIO DO DIA" e buscas exatas falham; use `textContent` ou regex sem distinguir maiúsculas. Não amarre números de contagem (`0/58`) em testes: use `\d+`.
26. **`role="status"` na página do Hub**: há mais de um (o contador da roleta e o veredito dos desafios). Em testes, mire dentro de `#area-do-desafio`.
27. **Patente "Mestre" era inalcançável** (pedia 2400 XP; o total possível era 2300). Ao mexer no número de desafios, recalcule os limites em `RANKS` (hubStore.ts) para que o topo seja alcançável.
28. **Teste "que o código inicial já passa"** não ensina nada e o validador não reclama (só exige que NÃO passe tudo). Veja a coluna "inicial N/M" na saída de `challenges-run.mjs`: o ideal é 0.
29. **Componente com `key` dentro de `{cond && <X key=.../>}` pode NÃO remontar** ao trocar de desafio: a mini-aula antiga ficava no DOM e a nova aparecia embaixo (duas caixas). A correção foi dar `key={sel.id}` ao contêiner do corpo inteiro. Sempre teste a troca A→B (e se a referência ao nó antigo ficou desconectada), não só o primeiro estado.
30. **O ambiente de desenvolvimento pode ser reiniciado** (repositório e `/tmp` somem). Só o que está no GitHub sobrevive: commite a cada etapa concluída; a pasta `/tmp/val` (puppeteer, soluções exportadas) é refeita com `npm i puppeteer-core @sparticuz/chromium` e `npx tsx scripts/validate/challenges.mts`.
31. **Números escritos à mão envelhecem** (o "58 desafios" ficou em 3 arquivos quando o catálogo passou de 133). Nunca digite contagens de cabeça: rode `npx tsx scripts/validate/inventory.mts --check` e copie dele. Cuidado ao "corrigir" um número que o `--check` acusar: confira a definição antes (o "43 estilos" estava certo; o erro era do inventário).

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
- **Acessibilidade (09/10):** auditada só em Chromium (celular emulado), com o Google Fonts bloqueado no ambiente: as fontes Space Grotesk e Inter não foram vistas nos testes, só a fonte reserva. Nada de leitor de tela, Safari, Firefox ou aparelho real.
- `js-examples-run.mjs` acusa 1 falha de 25 (`eventos-modulos/modulos-esm`: `export` não roda como script clássico) e `css-demos.mts` mostra 3 "declarações sem efeito" (`text-gradient`, `background-size`). Já existiam antes de 09/10; são limitações dos validadores, não regressões.
- Exemplos de demonstração geram 404 de propósito (`<script src="/js/app.js">`, `<embed>`): não são bugs do site.

## 13. Estado atual e próximos passos sugeridos

### Plano de etapas (ordem de execução, definida em 16/10/2026)

**Etapa 1 — Catálogo "completão" de Desafios (PRIMEIRA, antes de seguir).** Por que vale: o catálogo de 16/10 tinha 133 desafios; para ser um guia do zero ao avançado tipo Coddy faltam passos "do zero" em CSS e SQL, tópicos intermediários e **projetos guiados** (vários passos que se constroem). Meta: **~225** (+92), com as 4 linguagens crescendo juntas.

| Linguagem | Início (16/10) | Meta | O que falta (lacunas conhecidas) |
|---|---|---|---|
| HTML | 26 | 43 (+17) | entidades (`&lt;` `&amp;`), citações e `<abbr>`, `colspan`/`rowspan`, tipos de `input` (date, range, color, tel), `<iframe>`, menu com `<nav>`, botão vs link, `<time>`/`<address>`/`<mark>`, atributos `data-*`, `<head>` completo + **Projeto: página de perfil (5 passos)** |
| CSS | 28 | 55 (+27) | pseudo-classes (`:first-child`, `:nth-child`), **especificidade**, `flex-direction: column`, `text-overflow: ellipsis`, `list-style`, estilizar botão, `object-fit` + `aspect-ratio`, `grid-column: span`, combinadores (`>`, `+`, descendente), `:focus-visible`, `position: fixed` + `z-index`, `overflow`, `scroll-snap`, filtros, variáveis para tema + **Projeto: landing page responsiva (5 passos)** |
| JavaScript | 45 | 70 (+25) | `includes`/`find`/`some`/`every`, `Set`, closure (contador), `try/catch` + `throw`, `while`/`break`, `class`, regex (e-mail), datas, `compose`, formulário (submit + `preventDefault`), `localStorage` simulado, `fetch` simulado, ordenação por vários campos + **Projeto: lista de tarefas no DOM (5 passos)** |
| SQL | 34 | 57 (+23) | alias (`AS`), `AND`/`OR` com parênteses, `LIMIT`/`OFFSET` (paginação), `UPPER`/`LENGTH`, `COALESCE`, `UNION`, `EXISTS`, `IN` com subconsulta, JOIN de 3 tabelas, `COUNT(DISTINCT …)`, datas + **Projeto: relatório de vendas (5 passos)** |

**Progresso da Etapa 1 (atualizado automaticamente; rode `npx tsx scripts/validate/inventory.mts --fix` antes de commitar cada lote):**

<!-- progresso-etapa1:inicio (gerado por inventory.mts --fix) -->
| Linguagem | Início (16/10) | Agora | Meta | Feito |
|---|---|---|---|---|
| HTML | 26 | 26 | 43 | 0% |
| CSS | 28 | 28 | 55 | 0% |
| JS | 45 | 45 | 70 | 0% |
| SQL | 34 | 57 | 57 | 100% |
| **Total** | 133 | **156** | 225 | 25% |
<!-- progresso-etapa1:fim -->

*Regras de qualidade (todas obrigatórias, já cobertas pelos validadores):* mini-aula (`learn`) >= 60 caracteres; solução passa 100%, **código inicial passa 0 testes**; **1 a 2 soluções alternativas** em `alts.ts` (JS e CSS pedem 2); id na trilha certa em `tracks.ts`; ligar a trilha a guia/receita em `trilha-links.ts` quando existir assunto equivalente; `integrity.mts`, `learn-render.mts`, `challenges-run.mjs` e `wheel.mts` limpos.
*Como executar:* 4 lotes (um por linguagem, ~23 desafios cada), validando e **commitando ao fim de cada lote**. Ordem sugerida: SQL e CSS (mais curtos) → JS → HTML. Projetos guiados por último, em cada linguagem.
*Atenção ao que muda sozinho:* (1) **recalcular `RANKS`** em `hubStore.ts` (o total de XP vai a ~6,5 mil; "Mestre" deve ficar em ~92% do total, senão fica inalcançável); (2) os e2e `e2e-roleta.mjs` e `e2e-links-backup.mjs` têm **números fixos** (133, 107, 34, "1/133"): trocar por valores lidos de `inventory.mts` antes de começar; (3) rodar `inventory.mts --check` e atualizar os números do doc e do plano do LinkedIn; (4) revisar a etapa Desafios do `a11y-states.mjs` nos 3 tamanhos (a lista fica maior).

**Etapa 2 — Conta, banco e sincronização (Supabase).** Hoje os dados ficam só no navegador (ver "Onde ficam os dados do usuário"). Princípios: **login OPCIONAL** (o site segue 100% útil sem conta, o que preserva a promessa "sem cadastro"), **offline-first** (o `localStorage` continua sendo a fonte local; a conta só sincroniza), coleta mínima de dados (LGPD) com **exportar e excluir conta**.
- *Decisões pendentes do dono:* (a) provedores de login — recomendo **e-mail com link mágico + Google + GitHub** (público dev); (b) em qual conta/projeto Supabase criar (há conector disponível; confirmar organização, região e o plano — o gratuito tem limites de armazenamento e de usuários ativos que precisam ser conferidos na hora); (c) **importar o progresso que já está no navegador** ao criar a conta (recomendo sim, com mesclagem); (d) URL final de redirecionamento (domínio da Vercel) e e-mail remetente dos links mágicos.
- *Modelo proposto:* tabela `user_data(user_id uuid, key text, value jsonb, version int, updated_at timestamptz, primary key (user_id, key))` espelhando as chaves `cheatdev:*` (hub, wheel, favs, essencial, lab, sqllab) + `profiles(id → auth.users, display_name, created_at)`. **RLS** em tudo: `user_id = auth.uid()` para select/insert/update/delete, **sem acesso anônimo**; testar com 2 usuários.
- *Mesclagem (conflito entre aparelhos):* hub `solved` = união (vale a data mais antiga), `tries` = máximo, `days` = união; favoritos e Essencial = união; projetos do Lab/SQL Lab = última gravação vence **por projeto**. Cada chave carrega `version` do formato para migrar dados antigos.
- *Estabilidade:* migrações versionadas em `supabase/migrations/` (nunca alterar produção pelo painel), ambientes dev e produção separados, **captcha/limite de taxa** no cadastro (ex.: Cloudflare Turnstile), backup agendado (exportação diária como mitigação enquanto não houver recuperação pontual), monitoramento de erros e de disponibilidade, limite de tamanho por chave (ex.: 256 KB), fila com nova tentativa quando a rede cair, política de privacidade e termos, **exclusão de conta em cascata**, chave de serviço **nunca** no cliente, CSP.
- *Testes:* unitários da mesclagem (puros, como `wheel.mts`), e2e com Supabase local (`supabase start`), teste de RLS com dois usuários, e o fluxo "importar progresso ao criar conta".
- *Entregáveis de interface:* botão "Entrar" no topo, página `/conta`, indicador de sincronização, aviso de conflito simples. Só depois disso trocar o texto do `BackupPanel` e do doc/LinkedIn.

**Etapa 3 — Próxima página: Lab.** Mesma abordagem aplicada a Desafios: revisão de cores e acessibilidade em todos os estados, testes ponta a ponta (já existe `e2e-lab.mjs`), depois os itens do backlog "Lab" (vários arquivos, formatar código, axe-core). **O Post 3 do LinkedIn depende desta etapa** (ver `docs/LINKEDIN-SERIE.md`, seção 2.4).

**Etapa 4 — LinkedIn.** A análise do plano está feita (16/10): números conferidos por `inventory.mts --check`, Post 9-B novo, FAQ de dados, e **instalar analytics antes do Post 1**. A publicação é conduzida pelo dono em outra conversa.

### Já entregue
Comandos de HTML/CSS/JS/SQL em 4 lotes cada; Lab; SQL Lab com SQLite + PostgreSQL; Hub de desafios (133 desafios em 27 trilhas, com mini-aulas, roleta configurável e backup); Essencial; Geradores; Receitas; Comparativos; Guias; Snippets e Templates organizados; VS Code; Favoritos; busca ampla; documentos mestre e do LinkedIn.

### Pendências (por ordem de valor)
1. **Mais variações de layout nos templates** (hoje a variação é de estilo visual, não de layout) e mais variações de snippets.
2. ~~Ligar as trilhas ao resto do site~~ **feito (16/10)**: mapa em `src/content/trilha-links.ts` (guias e receitas por trilha), bloco "Pratique isso nos Desafios" nas páginas de guia e receita e chips "Estude também" nas trilhas; falta ligar **comparativos** às trilhas.
3. **Equivalente em Tailwind** e **compatibilidade de navegador** (caniuse) em cada comando CSS.
4. **Auditoria de acessibilidade** dentro do Lab (axe-core).
5. **Link curto para projetos do Lab** (exigiria salvar no Supabase; atenção a abuso, moderação e LGPD).
6. **MySQL executável**: só com servidor real (container por sessão); decisão de custo pendente.
7. Mais comandos: CSS ainda está longe das 500+ propriedades; JS pode ganhar Web Workers, IndexedDB, Canvas, Web Components avançados.
8. Seção de Git/terminal; OG image dinâmica por comando; versão em inglês; testes automatizados; GitHub Actions (lint + build).
9. Sincronizar progresso (favoritos, Hub, Essencial) entre dispositivos com login (Supabase).
10. Trocar os emojis das abas do Essencial e dos títulos de página por ícones SVG (a sidebar já usa); incluir SQL Lab e Geradores na barra do topo; testar em Safari/iOS reais; checar se o padrão de debounce + estado velho corrigido no `WebRunner` existe em `SqlRunner` e `Playground`.

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
| 09 a 11/10 | **Navegação e tema**: sidebar com ícones SVG uniformes e "Todos os comandos" no fim; paleta creme+sálvia (09/10) substituída por escuro original + claro cinza-azulado com acento índigo (11/10); contraste AA em todas as telas e estados; 5 defeitos corrigidos (barra do topo em 768–1023 px, painel Dialetos, Geradores no celular, títulos longos, testes do Hub presos em "Testando…"); auditoria de acessibilidade versionada |
| 12 a 15/10 | **Desafios turbinados**: 58 → 133 desafios (75 novos, todos com mini-aula e validados) em **27 trilhas** do zero ao avançado; roleta configurável (linguagens, níveis, só pendentes e seleção um a um; fatias de desafios individuais); visão por trilhas com Continuar/Próximo passo; 3 conquistas novas; patente Mestre alcançável; 3 validadores novos (integridade, roleta, e2e da roleta) |
| 16/10 | **Qualidade dos Desafios**: mini-aulas nos 58 originais (133/133); renderizador de mini-aulas corrigido (negrito com código mostrava crases); 94 soluções alternativas corretas validadas; **backup** exportar/importar dos dados do usuário; ligação trilha ↔ guia/receita (bloco "Pratique" e chips "Estude também"); corrigida a mini-aula que duplicava ao trocar de desafio |

Totais: 56 commits · 503 comandos · 156 desafios · 65 snippets · 11 templates (43 estilos) · 18 comparativos · 13 receitas · 6 guias · 53 passos Essenciais.

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
- **Continuar ampliando o catálogo** (ver "Progresso da Etapa 1"): mais passos "do zero" em CSS/SQL e projetos guiados de vários passos (A · M). Meta: ~200, sempre com `integrity.mts` e `challenges-run.mjs`.
- **Selo e certificado por trilha concluída** (a conquista "Trilheiro" já existe; falta o selo por trilha) (M · M).
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
Ver o **Plano de etapas** no início desta seção (Etapa 1 catálogo → Etapa 2 conta e banco → Etapa 3 Lab → Etapa 4 LinkedIn). Dentro dele:
1. Ampliar o catálogo de desafios e ligar os **comparativos** às trilhas (completa o "hub": estudar → treinar → comprovar).
2. **Analytics + CI** e **login Supabase** (medir, proteger e sincronizar).
3. **pgvector/full-text** e **laboratório de performance** (diferencial no SQL) + auditoria de acessibilidade no Lab.

## 14. Como continuar numa nova conversa

Cole este documento e diga, por exemplo:
- "Vamos atacar o item 1 das pendências: mais variações de layout para os templates."
- "Crie 15 desafios novos de CSS (nível avançado e chefe), acrescente-os às trilhas e valide com `integrity.mts` e `challenges-run.mjs`."

O Claude deve: clonar o repositório, ler `src/content/helpers.ts` e um arquivo `extra/` do mesmo tipo antes de escrever conteúdo, **rodar a validação** da seção 10, fazer `npm run lint && npm run build`, **commitar em commits atômicos** com a identidade da seção 3, publicar com o token efêmero e lembrar de revogá-lo.
