# cheat/dev — Documento Mestre (handoff completo)

> **Como usar:** cole a **cópia PRIVADA** deste arquivo (a que traz o token) **inteira** na primeira mensagem de uma nova conversa e diga **"siga"**. **Leia a seção 0 primeiro**: ela é o manual de trabalho, o plano de etapas e os lotes. As demais seções são a referência técnica. Última atualização: 29/10/2026.

---

## 0. LEIA PRIMEIRO — manual de passagem e de trabalho (atualizado em 29/10/2026)

> **Este documento é o ÚNICO contexto de uma conversa nova.** As conversas anteriores são apagadas de propósito (gastam muitos tokens). Leia a seção 0 inteira antes de agir. Se algo nas outras seções contradisser a seção 0, **vale a seção 0**. As seções 1 a 14 são a referência técnica detalhada.

### 0.1 Resumo em 12 linhas
1. **Projeto:** cheat/dev, site de consulta e treino de HTML, CSS, JavaScript e SQL (Next.js 16, React 19, Tailwind 4, Vercel). Repositório **público** `PhBros16/cheat-dev`. Dono: **Pedro (usuário GitHub `PhBros16`)**, estudante de Sistemas para Internet e co-fundador da Alpine AI; usa o projeto como produto e como portfólio.
2. **O que já existe** (números reais em "Totais", mais abaixo; confira sempre com `inventory.mts`): 503 comandos, 156 desafios em 28 trilhas (todos com mini-aula), Lab (editor ao vivo com simulador de telas), SQL Lab (SQLite e PostgreSQL no navegador), Essencial, receitas, guias, comparativos, snippets, templates, atalhos do VS Code, favoritos, PWA.
3. **Tema e acessibilidade já revisados** em todo o site (escuro original + claro cinza-azulado + acento índigo; contraste AA medido em estados interativos).
4. **Página Desafios já foi turbinada** (trilhas, roleta configurável, mini-aulas, soluções alternativas, backup de dados). Ela é o **modelo** de como queremos revisar as outras páginas.
5. **Etapa em andamento: Etapa 1 (catálogo "completão" de desafios)**. Lote 1 (SQL) está **publicado**. **O próximo passo imediato é o Lote 2 (CSS)**, seção 0.9.
6. **Depois:** Etapa 2 (conta, login e banco), Etapa 3 (revisar as demais páginas, uma por vez, começando pelo Lab), Etapa 4 (LinkedIn, conduzida pelo dono).
7. **Hoje os dados do usuário ficam só no navegador** (sem conta nem servidor). A Etapa 2 muda isso, sempre com login **opcional**.
8. **Método:** uma página (ou um lote) por vez, em passos pequenos, com testes, **commit e push ao fim de cada lote**, relatório curto e honesto.
9. **Os commits têm de subir na conta do dono** (para contar no gráfico de contribuições do GitHub): seção 0.4.
10. **O ambiente de trabalho é frágil** (pode reiniciar e apagar tudo que não foi publicado): seção 0.5. Publique cedo e sempre.
11. O dono costuma responder só **"Continuar"** ou **"siga"**: significa "execute o próximo passo do plano, sem pedir permissão a cada etapa". Pergunte **apenas** nas decisões marcadas na seção 0.12.
12. Quando a conversa nova começar, **confirme o estado real** antes de qualquer coisa: clone, `git log`, `inventory.mts --check` (seção 0.5).

### 0.2 O dono e como atendê-lo (preferências dele, valem em toda conversa)
- **Idioma:** português do Brasil. Tom direto e profissional. Sem bajulação ("ótimo", "brilhante") a menos que haja razão concreta, e mesmo assim comece pelo que está errado ou falta.
- **Fazer exatamente o que ele pede.** Não decida sozinho "não vou fazer". Se discordar, diga o motivo **e** faça, ou ofereça a alternativa; a decisão é dele.
- **Procure o ponto mais fraco** de qualquer ideia ou estratégia **antes** de concordar. Quanto mais empolgado ele estiver, mais contrapontos. Concorde só depois de testar a ideia e explique por que, de um jeito que acrescente algo.
- **Nunca aplique nada pela metade e nunca deixe de testar devidamente.** "Testar" significa rodar os testes de verdade, ver os resultados, e **desconfiar de teste que passa fácil demais** (já tivemos relatório de "0 problemas" porque o servidor tinha caído).
- **Seja conciso.** Sem introduções vazias. Se a resposta é "não" ou "não funciona", diga na primeira frase.
- **Sempre mostre o caminho dos arquivos entregues** (ex.: `/mnt/user-data/outputs/...` ou `src/...` dentro do repositório) para ele não se confundir sobre onde salvar.
- **Relatório ao fim de cada lote** (formato na seção 0.6): o que mudou, o que passou (com números), **o que NÃO foi testado**, pontos fracos e decisões que dependem dele. Nunca declare "pronto" sem evidência.
- **No máximo uma pergunta por resposta**, e só quando for decisão dele. Quando for possível, escolha o padrão recomendado e avise.
- Ele quer ajuda para **crescer o produto de verdade**: qualidade e honestidade valem mais que volume.

### 0.3 Acesso ao GitHub e segurança do token
- **Nenhum token fica no repositório.** O repositório é **público**: um token commitado vazaria na hora (e o GitHub o revogaria sozinho). Este campo existe só para lembrar o procedimento:

```
TOKEN_GITHUB = (a cópia PRIVADA deste documento, que o dono leva para a conversa nova, traz o token aqui; no repositório este campo fica vazio)
```

- **Como usar o token:** apenas **dentro do comando de push**, assim (e **mascarando** a saída):

```
git push https://<TOKEN>@github.com/PhBros16/cheat-dev.git main 2>&1 | sed 's/github_pat_[A-Za-z0-9_]*/***TOKEN***/g'
```

  O `remote origin` do clone fica **sem token** (`https://github.com/PhBros16/cheat-dev.git`). Nunca imprima o token, nunca o escreva em arquivos do repositório, nunca o coloque na memória da conversa.
- O token é *fine-grained*, só para este repositório (permissão de **Contents: read and write**). Se o push falhar com "could not read Password" ou 403, **o token expirou ou foi revogado**: peça um novo ao dono (GitHub > Settings > Developer settings > Personal access tokens > Fine-grained). Para mexer em `.github/workflows/` seria preciso também a permissão **Workflows**.
- **Ao terminar a sessão,** lembre o dono de **revogar o token** (botão *Delete*). Quem tiver o arquivo com o token tem acesso de escrita ao repositório.

### 0.4 Commits na conta do dono (gráfico de contribuições)
O dono quer que o trabalho **apareça no gráfico de contribuições** dele. Regras:
1. **Autor dos commits:** `PhBros16` com o e-mail de privacidade do GitHub: `264437598+PhBros16@users.noreply.github.com`. Configure em cada clone novo:
   `git config user.name "PhBros16"` e `git config user.email "264437598+PhBros16@users.noreply.github.com"`.
   (No começo do projeto os commits saíram com um e-mail fictício e **não apareciam** no perfil; o histórico teve de ser reescrito uma vez. **Nunca repita isso.**)
2. Commits vão para a branch **`main`** do repositório **`PhBros16/cheat-dev`** (a branch padrão do próprio repositório dele, não um fork). Só assim contam.
3. **Nunca reescreva histórico publicado** (sem `push --force`, sem `rebase` de commits já enviados). **Nunca falsifique datas** (a data real do commit é a que vale).
4. **Commits pequenos e atômicos, com mensagem em português** e prefixo (`feat`, `fix`, `docs`, `test`, `chore`, `refactor`), explicando **o que e por quê**. Um lote ou etapa vira 1 a 3 commits temáticos. Commits reais de trabalho real: nada de commits vazios só para encher o gráfico.
5. **O dono também commita** (em 29/10 ele adicionou a licença MIT e reescreveu o `README.md`). Por isso, **antes de todo push**: `git fetch` e, se houver commits novos no remoto, `git rebase origin/main`. **Em conflito no `README.md` ou em arquivos que o dono mexeu, a versão dele prevalece** (use `git checkout --ours` durante o rebase, que é a do remoto). Nunca sobrescreva trabalho dele.
6. **Publique ao fim de cada lote validado.** Se o push falhar, **gere um backup do commit** (`git format-patch -1` e `git bundle`) em `/mnt/user-data/outputs/` e explique ao dono em duas frases o que são esses arquivos (ele não conhece o termo).
7. Para conferir: no perfil do GitHub do dono, o gráfico mostra um quadrado a mais por dia com commit; o histórico do repositório mostra o autor `PhBros16`. A Vercel publica sozinha a cada push na `main`.

### 0.5 O ambiente de trabalho (sandbox) e como montá-lo em poucos minutos
**Limitações conhecidas (planeje em volta delas):**
- Cada comando de terminal tem **limite de ~300 s**. Rodadas longas (estados interativos, varreduras) devem ser **uma por chamada**, com `timeout 280`.
- **Processos em segundo plano não sobrevivem** entre comandos (servidor, navegador). Suba o servidor e rode o teste **na mesma chamada** (`scripts/validate/serve-and-run.sh`).
- O ambiente **pode reiniciar** e apagar o repositório e `/tmp` (**já aconteceu duas vezes, e uma delas levou um trabalho não publicado**): **só o que está no GitHub sobrevive** (ver 0.4, item 6). **Commite e publique ao fim de cada passo concluído, não só de cada lote.**
- **Sem acesso à internet geral:** a rede permite `github.com`, `npmjs.org` e poucos outros; **`vercel.app` e `supabase.co` NÃO são acessíveis**, então o site publicado não pode ser aberto de lá e **testes de navegador contra o Supabase não funcionam** (ver Etapa 2). O Google Fonts também é bloqueado: os prints usam a fonte reserva, e os testes bloqueiam essa requisição.
- Só há **Chromium** (celular emulado). Safari, Firefox e aparelhos reais **não foram testados**: diga isso nos relatórios.
- Builds interrompidos deixam processos órfãos. **Mate por PID** (`ps -eo pid,cmd | grep -E "next (build|start)|next-server|turbopack"`), **nunca** `pkill -f "next build"` (ele casa com a própria linha de comando e se mata). Se der `ENOTEMPTY` ou "Another next build", apague `.next` depois de matar os processos.
- `cut -c` quebra caracteres acentuados (UTF-8): leia arquivos com Python.

**Montagem (copie e cole):**
```
cd /home/claude && git clone https://github.com/PhBros16/cheat-dev.git && cd cheat-dev
git config user.name "PhBros16"
git config user.email "264437598+PhBros16@users.noreply.github.com"
npm ci --no-audit --no-fund
mkdir -p /tmp/val && cd /tmp/val && npm init -y >/dev/null && npm i puppeteer-core @sparticuz/chromium --no-audit --no-fund
cd /home/claude/cheat-dev && npx tsx scripts/validate/challenges.mts      # gera /tmp/val/solutions.json e web-challenges.json
npx tsx scripts/validate/inventory.mts --check                           # confirma o estado real do produto
```
**Rotina de build e teste:**
```
npm run lint && npx tsc --noEmit -p .
rm -rf .next && (timeout 280 npm run build > /tmp/build.log 2>&1; echo "exit=$?" >> /tmp/build.log); tail -1 /tmp/build.log
timeout 280 scripts/validate/serve-and-run.sh 'node scripts/validate/e2e-roleta.mjs'
```
O type-check do build **inclui `scripts/validate/*.mts`**: nos scripts use `createRequire(import.meta.url)("sql.js")` (como `sql-all.mts`), nunca `import("sql.js")` direto.

### 0.6 O método: uma página (ou lote) por vez
**Ciclo de cada lote ou página:**
1. **Levantar:** ler o código da página, rodar, fotografar (claro, escuro, celular) e listar problemas conhecidos.
2. **Decidir:** se houver decisão do dono, apresente o padrão recomendado; senão, siga.
3. **Implementar em passos pequenos** (um arquivo ou conceito por vez), conferindo `tsc` e `lint`.
4. **Validar** com o pacote mínimo da seção 0.7. **Desconfie de teste que passa fácil:** confira que os estados esperados foram **de fato alcançados** (o roteiro `a11y-states.mjs` já falha com "ESTADO NÃO ALCANÇADO").
5. **Atualizar documentos:** `npx tsx scripts/validate/inventory.mts --fix` (regenera os números) e o texto das seções afetadas, mais uma linha no changelog (13a).
6. **Commit e push** (seção 0.4).
7. **Relatório ao dono** (formato abaixo).

**Definição de pronto de uma página** (o que fizemos em Navegação/tema e em Desafios):
- [ ] **Cores e contraste AA** em todos os estados interativos, claro e escuro (`a11y-states`, `a11y-audit`). Use **apenas os tokens** do tema (seção 4): nunca cores soltas do Tailwind sobre o fundo do tema.
- [ ] **Responsivo:** sem rolagem horizontal em 320, 390, 768, 1024 e 1440 px (`overflow-all.mjs` ou `widths`).
- [ ] **Acessibilidade de teclado e leitor de tela:** foco visível, nomes acessíveis, `label` em campos, `aria-*` onde preciso.
- [ ] **Fluxo principal testado de ponta a ponta** (e2e novo ou existente), incluindo estados de erro e sucesso e a **troca de A para B** (componentes que não remontam).
- [ ] **Conteúdo verificado por amostragem** (rodar exemplos; nada afirmado "de memória").
- [ ] **Nenhum número escrito à mão** nos documentos (use `inventory.mts --fix`).
- [ ] **Publicado** e relatório entregue.

**Formato do relatório ao dono** (curto): (1) hash do commit publicado e conferência de que o remoto bate com o local; (2) o que mudou; (3) o que passou, **com números**; (4) **o que NÃO foi testado** e riscos; (5) pontos fracos e o que eu faria diferente; (6) decisão pendente dele, se houver (no máximo uma pergunta).

### 0.7 Pacote mínimo de testes por tipo de mudança
| Mudança | Rodar (nesta ordem) |
|---|---|
| **Desafios (conteúdo)** | `integrity.mts`, `learn-render.mts`, `wheel.mts`, `sql-alts.mts` (SQL), `challenges.mts` + `challenges-run.mjs` (web, **com alternativas**), `inventory.mts --fix` e `--check`; build; `e2e-roleta`, `e2e-hub`, `e2e-links-backup`; `a11y-states ONLY=desafios` (claro e escuro, 1440 e 390); overflow de `/desafios` |
| **Tema, layout ou componente compartilhado** | `lint`, `tsc`, build; `a11y-audit` (páginas principais e novas, 4 combinações); `a11y-states` (6 combinações: claro/escuro × 1440, 768, 390); `overflow-all` (320, 390, 768, 1024) |
| **Comandos (conteúdo das páginas de comando)** | `sql-all` (em 6 partes, ver nota abaixo), `js-examples-run`, `css-demos`, `links`; `a11y-audit` em amostra |
| **Lab** | `e2e-lab` e `a11y-states ONLY=lab` |
| **Só documentação** | `inventory.mts --fix` e `--check` |
Nota `sql-all.mts`: estoura 300 s e **sai sem imprimir nada**, parecendo sucesso. Confira o código de saída (`exit=124` = timeout) ou divida em partes (cópia temporária com parâmetro de fatia, como feito em 09/10).

### 0.8 Roteiro de páginas (ordem de revisão, estado e o que fazer em cada uma)
Regra: **uma página por vez**, na ordem abaixo, cada uma com a "Definição de pronto" (0.6) e publicada antes da próxima. "Revisão padrão" = levantar, corrigir cores/contraste e responsivo, e2e do fluxo principal, conferir conteúdo por amostragem, documentar.

| # | Página (rota) | Estado em 29/10/2026 | O que falta / observações |
|---|---|---|---|
| 1 | **Navegação e tema** (menu lateral, barra do topo, claro/escuro) | **Feito** (09 a 11/10) | Sobras: emojis nas abas do Essencial e nos títulos de página (trocar por ícones SVG como na sidebar); a barra do topo não tem SQL Lab nem Geradores |
| 2 | **Desafios** (`/desafios`) | **Revisado e turbinado** (trilhas, roleta, mini-aulas, alternativas, backup) | Etapa 1: lotes 2 a 4 (0.9); recalcular patentes ao fim |
| 3 | **Lab** (`/lab`) | **PRÓXIMA** | Revisão padrão + backlog "Lab" (seção 13b). Já existem `e2e-lab.mjs` e a etapa `lab` do `a11y-states`. Atenção ao celular (editor), ao console e ao multi-tela. **O Post 3 do LinkedIn depende desta página** |
| 4 | **SQL Lab** (`/sql-lab`) | Só cores e estados revisados | Revisão padrão; **criar `e2e-sqllab.mjs`** (hoje só o roteiro de estados toca nele); painel de dialetos e exercícios (18) e CSV; backlog "SQL e bancos" |
| 5 | **Geradores de CSS** (`/geradores`) | Overflow no celular corrigido (6 abas) | Revisão padrão; **sem e2e** (criar); copiar CSS; possíveis geradores novos |
| 6 | **Essencial** (`/essencial`) | Cores revisadas | 6 trilhas e 53 passos (`localStorage` `cheatdev:essencial:v1`): e2e do progresso; trocar emojis das abas; ligar os passos às trilhas de Desafios |
| 7 | **Receitas** (13), **Guias** (6), **Comparativos** (18) | Cores revisadas; guias e receitas já têm o bloco "Pratique" | Revisão de conteúdo por amostragem (rodar as demos); **ligar comparativos às trilhas**; mini-aulas/links cruzados |
| 8 | **Snippets** (65, 12 abas) e **Templates** (11 templates, 43 estilos) | Cores revisadas | Revisão padrão; e2e (copiar, trocar estilo, baixar); conferir cada template em celular |
| 9 | **Atalhos do VS Code** (40) | Cores revisadas | Revisão padrão; testar o download dos `.code-snippets` e do ZIP do projeto |
| 10 | **Favoritos**, **Busca** (`/busca?q=`), **Todos os comandos** (`/todos`) | Cores revisadas | e2e (favoritar, filtrar, vazio); desempenho do índice de busca; backup já incluído |
| 11 | **Home** (`/`) | Cores revisadas | Revisão de conteúdo e chamadas para ação; números via inventário (nunca à mão) |
| 12 | **Páginas de comando** (HTML 135, CSS 196, JS 86, SQL 86) | Validadores de conteúdo existentes | Revisão por **amostragem** (≥ 10% por linguagem): rodar exemplos, conferir explicações e compatibilidade; playgrounds |
| 13 | **PWA e instalação**, **404** | Não revisados | Testar invalidação de cache do service worker após deploy; fluxo de instalar e desinstalar |

### 0.9 Etapa 1 — Catálogo "completão" de Desafios (do zero ao avançado, tipo Coddy)
**Meta: ~225 desafios (+92).** O lote 1 (SQL) está **publicado**. Os lotes 2, 3 e 4 estão **especificados item a item** abaixo para não perder tempo desenhando.

**Progresso (gerado automaticamente por `npx tsx scripts/validate/inventory.mts --fix`; não edite à mão):**

<!-- progresso-etapa1:inicio (gerado por inventory.mts --fix) -->
| Linguagem | Início (16/10) | Agora | Meta | Feito |
|---|---|---|---|---|
| HTML | 26 | 26 | 43 | 0% |
| CSS | 28 | 28 | 55 | 0% |
| JS | 45 | 45 | 70 | 0% |
| SQL | 34 | 57 | 57 | 100% |
| **Total** | 133 | **156** | 225 | 25% |
<!-- progresso-etapa1:fim -->

**Regras de qualidade de TODO desafio novo (todas validadas por scripts):**
1. **Mini-aula** (`learn`) com ≥ 60 caracteres: explica o conceito **sem entregar a solução**; parágrafos separados por linha em branco, `código` em linha, **negrito**, blocos ```cercados```. Negrito pode conter código.
2. **A solução oficial passa 100%** dos testes e o **código inicial passa 0** (nunca um teste que o navegador já satisfaz: um `<h1>` já tem 32px e negrito; "não altera o original" passa se a função devolve `undefined`: combine com o resultado esperado).
3. **Alternativas corretas** em `src/content/alts.ts`: ≥ 1 por desafio (JS e CSS: ≥ 2), com **estilos realmente diferentes** (arrow function em vez de `function`, recursão em vez de laço, `label` envolvendo o campo, `auto-fill` em vez de `auto-fit`). O validador exige que passem. SQL: `SQL_ALTS` (aceita) e `SQL_WRONG` (recusa), validados por `sql-alts.mts`.
4. Os `check` dos testes são expressões JavaScript avaliadas dentro da página (largura de 560 px). Aceitam Promise (timeout 3 s). Em CSS, prefira estilos calculados e medidas de layout.
5. Id na trilha certa em `src/content/tracks.ts` (a **ordem de `ids` é a ordem de aprendizado**) e, quando houver guia ou receita equivalente, em `src/content/trilha-links.ts`.
6. Builders: `challenge-kit.ts` (`jsFn`, `jsDom`, `htmlC`, `cssC`, `sqlC`); arquivos `ch-html.ts`, `ch-css.ts`, `ch-js.ts`, `ch-sql.ts`. **Padrão de TS:** strings com aspas duplas e `\n`; dentro do JS do aluno use aspas simples; crases (template literal) dentro de string de aspas duplas são ok.
7. **Cuidado com SQL:** evite comparar números de ponto flutuante calculados de jeitos diferentes (o corretor arredonda a 4 casas, mas uma conta como `preco * 1.1` pode divergir de `preco * 110 / 100`); confira que a solução devolve linhas **nos dois bancos** (SQLite e PostgreSQL) com o mesmo número de linhas.

**LOTE 2 — CSS (+27)** (próximo). Novas trilhas: `css-seletores` ("Seletores e cascata", entre `css-comecando` e `css-caixa`) e `css-projeto-landing` ("Projeto: landing page responsiva").
- `css-comecando` (+2): `css-listas` (iniciante; menu horizontal sem marcadores: `list-style:none` + inline-block/flex); `css-botao` (iniciante; estilizar `<button>`: fundo, cor, padding, `border:none`, radius, `cursor:pointer`).
- `css-seletores` (+7): `css-combinadores` (iniciante; `nav a`, `ul > li`, `h2 + p`); `css-pseudo-classes` (iniciante; `:first-child`, `:last-child`, `:nth-child(odd)`, zebra); `css-especificidade` (intermediário; deixar o título verde **sem `!important`** quando existe `#t{color:red}`; testar a cor e a ausência de `!important` nas regras do aluno); `css-atributo` (intermediário; `a[target="_blank"]::after`, `input[type="email"]`); `css-not` (intermediário; `li:not(.ativo)`); `css-has` (avançado; `.card:has(img)`; confirmar suporte do Chromium do teste); `css-heranca` (intermediário; `inherit` e `currentColor`).
- `css-caixa` (+3): `css-overflow` (conteúdo longo com altura fixa e `overflow:auto`); `css-ellipsis` (`white-space:nowrap; overflow:hidden; text-overflow:ellipsis`); `css-cover` (`object-fit:cover` + `aspect-ratio:16/9`); todos intermediários.
- `css-layout` (+5): `css-flex-coluna` (iniciante; rodapé do cartão no fim com `flex-direction:column` + `margin-top:auto`); `css-flex-justify` (intermediário; `space-between/around/evenly` medindo posições); `css-flex-grow` (intermediário; sidebar fixa + conteúdo `flex:1`); `css-grid-span` (avançado; destaque com `grid-column: span 2`); `css-position-fixed` (intermediário; botão flutuante no canto, `position:fixed` + `z-index`).
- `css-responsivo` (+2): `css-mobile-first` (intermediário; base + `@media (min-width:600px)` aumenta colunas); `css-imagens-responsivas` (iniciante; `max-width:100%; height:auto`).
- `css-efeitos` (+3): `css-filtros` (intermediário; `filter:grayscale(1)` e hover colorido); `css-scroll-snap` (avançado; carrossel com `scroll-snap-type`); `css-tema-variaveis` (avançado; tema escuro trocando custom properties em `.escuro`).
- **Projeto `css-projeto-landing` (+5, passos que se constroem; cada passo traz pronto o HTML/CSS dos anteriores):** `css-proj-1` cabeçalho com logo e menu (flex, `gap`, `space-between`); `css-proj-2` hero com gradiente e botão; `css-proj-3` grade de 3 cartões (`auto-fit`); `css-proj-4` variáveis de cor e rodapé; `css-proj-5` responsivo (menu empilha e cartões em 1 coluna até 600 px). Ligar a trilha ao guia `layout-com-grid`.

**LOTE 3 — JavaScript (+25).** Novas trilhas: `js-funcoes` ("Funções e escopo", entre `js-controle` e `js-strings`) e `js-projeto-tarefas` ("Projeto: lista de tarefas").
- `js-controle` (+3): `js-while-break` (iniciante; menor potência de 2 maior que n com `while`); `js-continue` (iniciante; somar só os ímpares com `continue`); `js-aninhado` (intermediário; laços aninhados gerando um triângulo ou matriz de strings).
- `js-strings` (+2): `js-starts-ends` (iniciante; `startsWith/endsWith/includes`); `js-slug` (intermediário; `replace` com regex: minúsculas, sem acento, hífens).
- `js-arrays` (+4): `js-find-includes` (iniciante); `js-some-every` (intermediário); `js-set-intersecao` (intermediário); `js-ordenar-objetos` (intermediário; vários campos).
- `js-objetos` (+3): `js-entries` (`Object.entries/fromEntries`); `js-optional-chaining` (`?.` e `??`); `js-json-seguro` (`JSON.parse` com `try/catch` e valor padrão); todos intermediários.
- `js-funcoes` (+3): `js-closure-contador` (intermediário; `criarContador()`); `js-compose` (avançado; `compor(...fns)`); `js-callback` (intermediário; `repetir(n, fn)`).
- `js-dom` (+2): `js-dom-submit` (intermediário; `preventDefault` + mensagem); `js-dom-delegacao` (avançado; evento no `<ul>` valendo para `<li>` criados depois).
- `js-assincrono` (+2): `js-fetch-simulado` (intermediário; `fakeFetch` fornecido, `await`, tratar `ok=false`); `js-timeout-promise` (avançado; `comTimeout(promise, ms)` com `Promise.race`).
- `js-algoritmos` (+1): `js-busca-binaria` (avançado).
- **Projeto `js-projeto-tarefas` (+5, DOM):** `js-proj-1` renderizar a lista a partir de um array; `js-proj-2` adicionar tarefa por formulário; `js-proj-3` marcar como concluída (alternar classe); `js-proj-4` remover (delegação de eventos); `js-proj-5` contador de pendentes e filtro. Nos testes de DOM, **simule os eventos** (`click()`, `dispatchEvent`); lembre que o script roda no fim do `<body>`. Ligar à receita `modal-com-dialog`/`abas-tabs` se fizer sentido.

**LOTE 4 — HTML (+17).** Nova trilha: `html-projeto-perfil` ("Projeto: página de perfil").
- `html-comecando` (+4): `html-entidades` (iniciante; `&lt; &gt; &amp; &copy;`); `html-citacao-abbr` (iniciante; `blockquote`, `q`, `abbr title`); `html-nav-menu` (iniciante; `<nav>` com lista de links); `html-botao-vs-link` (iniciante; corrigir `<a>`/`<div>` usados como botão).
- `html-estrutura` (+3): `html-time-address-mark` (intermediário); `html-data-attr` (intermediário; atributos `data-*`); `html-head-completo` (intermediário; `meta`, `link`, `script defer`).
- `html-dados` (+2): `html-tabela-span` (`colspan`/`rowspan`); `html-tabela-caption-scope` (`caption` + `scope`); intermediários.
- `html-formularios` (+2): `html-input-tipos` (intermediário; `date`, `range`, `color`, `tel`); `html-datalist-output` (avançado).
- `html-midia` (+1): `html-iframe` (intermediário; `title`, `loading="lazy"`, `sandbox`).
- **Projeto `html-projeto-perfil` (+5):** `html-proj-1` esqueleto + cabeçalho (foto e nome); `html-proj-2` seção "sobre mim" (parágrafos e lista de habilidades); `html-proj-3` tabela de experiências; `html-proj-4` formulário de contato; `html-proj-5` acessibilidade e SEO finais (landmarks, `aria`, metadados).

**Fim da Etapa 1 (depois do lote 4):** (1) **recalcular `RANKS`** em `src/lib/hubStore.ts` (o XP total será ~6,5 mil; "Mestre" ≈ 92% do total, senão fica inalcançável; o total sai do `--fix`); (2) rodar `a11y-states ONLY=desafios` nas 6 combinações (claro/escuro × 1440, 768, 390) e o overflow de `/desafios`; (3) `inventory.mts --fix`, atualizar o plano do LinkedIn e o changelog; (4) relatório final da etapa.

### 0.10 Etapa 2 — Conta, banco e sincronização (Supabase)
**Princípios:** (1) **login opcional**: o site continua 100% útil sem conta (preserva a promessa "sem cadastro"); (2) **offline-first**: o `localStorage` segue como fonte local; a conta só sincroniza; (3) coleta mínima (LGPD), com **exportar e excluir conta**; (4) segredos: só a chave pública (`anon`) no navegador, **nunca** a chave de serviço.

**Armadilha de ambiente:** o terminal do sandbox **não alcança `supabase.co`** e não tem Docker. Portanto: a lógica de sincronização deve ser **pura e testável** (cliente injetável); a mesclagem e as políticas de segurança (RLS) são testadas com **PGlite** (Postgres real em WebAssembly, emulando `auth.uid()` e papéis); o banco real é operado pelo **conector do Supabase** (ferramentas MCP: carregar com `tool_search`), e o fluxo de login no navegador só pode ser verificado pelo dono (ou por testes com um servidor simulado).

**Sublotes (cada um termina com testes verdes, commit e push):**
- **2.1 Projeto e esquema.** Criar o projeto `cheat-dev` (ver 0.12; **o dono precisa aprovar o custo**: usar `get_cost` e `confirm_cost`). Migrações versionadas em `supabase/migrations/` (**nunca** alterar a produção pelo painel): `user_data(user_id uuid, key text, value jsonb, version int, updated_at timestamptz, primary key (user_id, key))` e `profiles(id → auth.users, display_name, created_at)` com gatilho que cria o perfil no cadastro. **RLS ligada em tudo**, `user_id = auth.uid()` para select, insert, update e delete, **sem acesso anônimo**. Limite de tamanho por chave (ex.: 256 KB). Variáveis na Vercel: `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Teste de RLS com dois usuários (PGlite): um nunca lê nem altera dados do outro.
- **2.2 Camada de sincronização.** `src/lib/sync/merge.ts` (puro) e `src/lib/sync/engine.ts` (puxar, mesclar, enviar com *debounce*, fila offline com nova tentativa, `version` do formato). **Mesclagem por chave:** Desafios `solved` = união (vale a data mais antiga), `tries` = máximo, `days` = união; favoritos e Essencial = união; projetos do Lab e do SQL Lab = última gravação vence **por projeto**. Testes unitários `scripts/validate/sync.mts` (união, empate, dado remoto corrompido, versão antiga, payload gigante, dois aparelhos, conta nova com progresso local).
- **2.3 Login e interface.** Página `/conta`, botão "Entrar" na barra do topo (**só aparece se as variáveis de ambiente existirem**), link mágico + Google + GitHub, rota `/auth/callback`, sair, **excluir conta** (apaga os dados e o usuário), indicador de sincronização, diálogo no primeiro login ("Encontramos progresso neste navegador. Importar?") e aviso simples de conflito. Revisão padrão da página nova (cores AA, responsivo, teclado).
- **2.4 Endurecimento e estabilidade.** Captcha no cadastro (ex.: Cloudflare Turnstile) e limites de taxa; e-mail remetente próprio (o SMTP padrão tem limite baixo); monitoramento de erros e de disponibilidade; **backup agendado** (exportação periódica enquanto não houver recuperação pontual); política de privacidade (`/privacidade`) e termos; CSP e cabeçalhos de segurança; `npm audit`; roteiro de incidente no doc (o que fazer se a chave vazar: rotacionar, revogar sessões).
- **2.5 Entrega.** Atualizar o texto do `BackupPanel`, o doc mestre e o plano do LinkedIn (a promessa "sem cadastro" continua válida porque o login é opcional). Relatório com o que o dono precisa testar em aparelho real.

### 0.11 Etapa 4 e tarefas soltas
- **Etapa 4 — LinkedIn.** O dono conduz as publicações em outra conversa, com `docs/LINKEDIN-SERIE.md`. Pré-requisitos: **analytics instalado antes do Post 1** (tarefa T1), `inventory.mts --check` limpo, **Post 3 (Lab) só depois da Etapa 3 página 3**.
- **Tarefas soltas (fazer quando o plano chegar nelas ou quando o dono pedir):** **T1** instalar analytics sem cookies (Vercel Web Analytics: `@vercel/analytics` no `layout.tsx`; o dono precisa **ativar no painel da Vercel**); **T2** CI com GitHub Actions (lint, tipos, build, `integrity`, `inventory --check`; exige a permissão **Workflows** no token); **T3** ligar comparativos às trilhas; **T4** trocar emojis por ícones SVG nas abas do Essencial e nos títulos; **T5** incluir SQL Lab e Geradores na barra do topo; **T6** testar a invalidação de cache do service worker após deploy; **T7** revisão humana do texto das 156+ mini-aulas (do dono ou de terceiros).

### 0.12 Decisões pendentes do dono e padrões a usar se ele disser apenas "siga"
| Decisão | Opções | Padrão recomendado |
|---|---|---|
| Provedores de login | link mágico, Google, GitHub | **Os três** (público de desenvolvedores) |
| Onde criar o banco | projeto novo ou existente no Supabase | Projeto **novo** `cheat-dev`, região São Paulo (`sa-east-1`), plano gratuito. **Pedir o OK do dono antes de criar** (custo) |
| Importar o progresso do navegador ao criar a conta | sim ou não | **Sim**, com mesclagem (nunca perde dados) |
| URL final de produção para os redirecionamentos de login | domínio da Vercel ou próprio | Confirmar o domínio atual da Vercel |
| Analytics | Vercel Web Analytics ou Plausible | Vercel Web Analytics (sem cookies) |
| Ordem das páginas depois do Lab | tabela 0.8 | A da tabela |
Se o dono responder só "Continuar", siga o plano: **Lote 2 (CSS)** agora; a Etapa 2 só começa depois do lote 4, **exceto** o que depender de decisão dele (aí faça a pergunta única).

### 0.13 Registro de decisões do dono (não rediscutir)
- **Visual:** a paleta creme + sálvia + amarelo (da imagem de um app de plantas) foi **descartada** em 11/10 ("não parece dev"). Base atual: **escuro original** (`#0e1013`) + **claro cinza-azulado** + **acento índigo**. Cores das linguagens (HTML laranja, CSS azul, JS amarelo, SQL verde) **não mudam**.
- **Postura:** "foque na versão anterior e turbine"; "faça o que achar melhor" (delegou escolhas de design); "jamais faça aplicações pela metade"; "jamais fique sem testar devidamente".
- **Desafios:** quer um **guia de aprendizado completão, do zero ao avançado, tipo Coddy**; roleta onde se pode **escolher os desafios individualmente**; mini-aulas em todos; ligação com guias e receitas.
- **Dados:** quer **banco, login e estabilidade** (Etapa 2), mas o site deve seguir útil sem conta.
- **Processo:** trabalhar **página por página**; **commits sobem na conta dele**; ele apaga as conversas para economizar tokens, então **todo o contexto vive neste documento**; ele edita arquivos direto no GitHub (licença MIT e `README.md` em 29/10): **nunca sobrescrever**.
- **Token:** vai na cópia privada deste documento; **nunca no repositório**.

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

## 3. Autenticação com o GitHub (resumo; o detalhe está na seção 0.3 e 0.4)

**O token nunca entra no repositório** (público). A cópia **privada** deste documento, que o dono leva para a conversa nova, traz o token na seção 0.3; a versão publicada no GitHub deixa esse campo vazio de propósito.

1. Para gerar outro: GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
2. **Repository access:** só `cheat-dev`. **Contents:** Read and write (para `.github/workflows/`, também **Workflows**). **Expiration:** 7 dias ou o que o dono preferir.
3. Use o token **apenas dentro do comando de push**, com a saída mascarada; o `remote origin` fica sem token.
4. Ao terminar: o dono **revoga** o token (botão *Delete*).

### Identidade dos commits (importante para o gráfico do GitHub)

Os commits só contam no gráfico de contribuições se o **e-mail do commit estiver ligado à conta**. Configure sempre:

```bash
git config user.name  "PhBros16"
git config user.email "264437598+PhBros16@users.noreply.github.com"
```

Aprendizado: no início, os commits saíam com um e-mail fictício (`bot@...`) e não apareciam no perfil. O histórico foi reescrito uma vez (force-push) para corrigir. **Não reescreva histórico de novo sem necessidade.**

### Convenção de commits

Commits **pequenos, atômicos e com mensagem clara** (um por unidade lógica), em português, no padrão `tipo(escopo): descrição`:
`feat`, `fix`, `refactor`, `docs`, `chore`, `build`, `test`. Exemplos: `feat(sql-lab): seletor de motor SQLite/PostgreSQL`, `fix(playground): permite scripts no HTML`, `docs: atualiza o documento mestre`. Não crie commits vazios, nem altere datas: o histórico deve refletir o trabalho real. **Antes de todo push, `git fetch` e `git rebase origin/main`**: o dono também commita (em conflito, a versão dele prevalece). Detalhes na seção 0.4.

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

### Plano de etapas
O plano de etapas, os **lotes 2, 3 e 4** da Etapa 1 item a item, a Etapa 2 (conta e banco), o roteiro de páginas e as decisões pendentes estão na **seção 0 (0.8 a 0.12)**. Não duplique o plano aqui.

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
| 17 a 29/10 | **Etapa 1, lote 1 (SQL +23)**: 18 lacunas e projeto guiado "relatório de vendas" (5 passos); validador de alternativas de SQL (`sql-alts.mts`); `inventory.mts --fix`/`--check` mantém números dos documentos; e2e leem contagens do inventário. **O dono adicionou licença MIT e reescreveu o README (29/10)**; o rebase preservou ambos. Doc mestre reescrito como manual de passagem (seção 0) |

Totais: 59 commits · 503 comandos · 156 desafios · 65 snippets · 11 templates (43 estilos) · 18 comparativos · 13 receitas · 6 guias · 53 passos Essenciais.

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

1. Cole a **cópia privada** deste documento (com o token) na primeira mensagem e diga **"siga"**.
2. O Claude deve: ler a seção 0; montar o ambiente (0.5); confirmar o estado real (`git log`, `inventory.mts --check`); e executar o **próximo passo do plano** (hoje: **Lote 2 da Etapa 1, CSS**, seção 0.9).
3. O dono só precisa responder **"Continuar"/"siga"**; perguntas só para as decisões da seção 0.12.
4. Ao fim de cada lote: commit, push na conta do dono, `inventory.mts --fix`, relatório curto e honesto (0.6).
5. Ao terminar a sessão: **revogar o token** e salvar a cópia privada atualizada (o Claude deve entregar o doc mestre atualizado em `/mnt/user-data/outputs/`, com o campo do token preenchido só nessa cópia).
