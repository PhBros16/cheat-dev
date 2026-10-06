# cheat/dev no LinkedIn — plano completo de lançamento em posts sequenciais

> Documento de trabalho: estratégia, preparação, **14 posts prontos para copiar e colar** (com mídia sugerida, comentário fixado e CTA), 10 microposts de apoio, respostas para comentários e mensagens, e como medir. Escrito para Pedro, em primeira pessoa.
> Troque `[LINK]` pela URL do site (https://cheat-dev.vercel.app) e `[REPO]` pelo repositório (https://github.com/PhBros16/cheat-dev).

---

## PARTE 1 — Estratégia

### 1.1 Objetivo
Transformar o cheat/dev em **prova pública de capacidade de entrega**: produto completo, com decisões técnicas e disciplina de engenharia visíveis. Três resultados desejados: (1) visibilidade e conexões qualificadas, (2) oportunidades de trabalho/freelas, (3) feedback e uso real do produto.

### 1.2 Narrativa central (a "tese" de todos os posts)
> **"Material de estudo que você não pode testar é decoração. Eu construí um hub onde tudo roda na hora, do HTML ao Postgres, direto no navegador."**

Todo post deve reforçar uma destas ideias: *testável na hora*, *explicado de verdade (o porquê)*, *do básico ao chefe*, *engenharia séria por trás*.

### 1.3 Público
- Iniciantes e estudantes de programação (principal consumidor do produto).
- Devs júnior/pleno que querem consultar e praticar.
- Recrutadores, tech leads e clientes (consumidores da prova de competência).

### 1.4 Tom de voz
Direto, honesto e didático. Mostre o **processo e os erros**, não só o resultado. Evite superlativos vazios ("o melhor", "revolucionário", "único"): use números e demonstrações.

### 1.5 Regras de ouro
1. **Um post, uma ideia.** Um gancho claro nas 2 primeiras linhas (é o que aparece antes do "ver mais").
2. **Mostre, não conte:** todo post com uma mídia (GIF, print, vídeo curto ou carrossel).
3. **Números verdadeiros.** Use somente os do inventário abaixo (ou os que você confirmar no dia).
4. **Transparência sobre IA.** Você construiu com apoio do Claude, dirigindo produto, revisão, testes e decisões. Dizer isso aumenta a credibilidade (e é a verdade). Frase sugerida: *"Construí com o Claude como parceiro de código: eu defini o produto, revisei, testei e decidi."*
5. **Link no primeiro comentário** (o LinkedIn tende a dar menos alcance a posts com link no corpo).
6. **Responda todo comentário nas primeiras 2 horas** (peso grande no algoritmo).
7. **Não poste e suma:** fique disponível 30 a 60 minutos depois de publicar.

### 1.6 Inventário real (use nos posts; confirme antes de publicar)
| Item | Quantidade |
|---|---|
| Comandos (HTML 135 · CSS 196 · JS 86 · SQL 86) | **503** |
| Desafios práticos com testes automáticos | **58** |
| Passos da trilha "Essencial" | **53** |
| Snippets de componentes | **65** |
| Templates de site (combinações de estilo) | **11** (**43**) |
| Comparativos · Receitas · Guias | 18 · 13 · 6 |
| Atalhos de VS Code (`cd-`) | 40 |
| Motores SQL no navegador | SQLite e PostgreSQL (o do Supabase) |
| Dispositivos no simulador de tela | 17 |
| Commits atômicos no repositório | 30+ |

### 1.7 Cadência
- **4 semanas, 14 posts principais** (3 a 4 por semana) + microposts nos dias vazios.
- Melhores janelas (teste e ajuste): terça a quinta, 8h–10h ou 12h–13h (horário de Brasília).
- Reserve **1 post por semana para conteúdo "puro valor"** (sem falar do produto), que é o que mais traz público novo.

### 1.8 Hashtags (3 a 5 por post, no final)
- Base: `#desenvolvimentoweb #programacao #frontend #sql`
- Por tema: `#css #html #javascript #postgresql #supabase #acessibilidade #opensource #buildinpublic #carreiraemtecnologia`
- Evite passar de 5: poluem e reduzem alcance.

---

## PARTE 2 — Preparação (faça antes do Post 1)

### 2.1 Perfil
- **Título (headline):** *"Desenvolvedor Web · Criei o cheat/dev: hub com 503 comandos testáveis na hora (HTML, CSS, JS, SQL)"* — ajuste para refletir sua atuação (cofundador da Alpine AI, freelancer, estudante) sem perder o foco do projeto.
- **Seção "Em destaque":** fixe o link do site, o repositório e o Post 1 (depois que publicar).
- **Seção "Projetos":** adicione o cheat/dev com este texto:

> **cheat/dev** — Hub de consulta e treino para desenvolvedores. 503 comandos de HTML, CSS, JavaScript e SQL, todos explicados e testáveis no próprio navegador (inclusive PostgreSQL rodando em WebAssembly). Inclui editor ao vivo com simulador de telas, SQL Lab, 58 desafios com testes automáticos, trilha de conhecimentos essenciais e 11 templates de site. Next.js, TypeScript, CodeMirror, sql.js e PGlite. [LINK]

### 2.2 Mídias para produzir (grave tudo antes; reutilize nos posts)
| ID | O que gravar/capturar | Duração/tamanho | Usado em |
|---|---|---|---|
| M1 | Página de um comando CSS: editar o código e ver o resultado mudar | GIF 10 s | 1, 2 |
| M2 | Lab: digitar `ul>li*3` + Tab, trocar para iPhone, depois multi-tela com 3 dispositivos | vídeo 30 s | 3 |
| M3 | SQL Lab com Postgres: rodar a consulta de RLS (Ana vê 2 linhas, Bruno vê 1) | print + GIF 15 s | 4, 6 |
| M4 | Aba **Dialetos** com a mesma consulta nos 4 bancos | prints | 5 |
| M5 | Roleta de desafios girando, sorteando e resolvendo (testes ficando verdes) | vídeo 30 s | 7 |
| M6 | Página Essencial com um passo aberto (por que importa / se pular / faça agora) | print | 8 |
| M7 | Templates: o mesmo site em 4 estilos (claro, escuro, neon, pastel) | prints lado a lado | 11 |
| M8 | Terminal: `git log --oneline` mostrando commits atômicos | print | 9, 10 |
| M9 | Gráfico de contribuições do GitHub | print | 9, 13 |

Dica de formato: vídeo vertical ou quadrado, com legenda queimada (a maioria assiste sem som), 20 a 45 segundos, gancho nos 3 primeiros segundos.

### 2.3 Checklist de lançamento
- [ ] Site abre rápido no celular e o Lab/SQL Lab funcionam (teste em dois aparelhos).
- [ ] README do repositório com prints e instruções.
- [ ] Revogar tokens do GitHub usados.
- [ ] Todas as mídias M1 a M9 prontas.
- [ ] Textos revisados (números conferidos com a tabela 1.6).
- [ ] Planilha de métricas criada (Parte 6).

---

## PARTE 3 — Os 14 posts

> Formato de cada post: **Objetivo · Mídia · Texto (copiar e colar) · Primeiro comentário · Hashtags · Dica de interação.**

---

### POST 1 — Lançamento (Dia 1)
**Objetivo:** apresentar o projeto e a tese.
**Mídia:** M1 (GIF) + print da home.

**Texto:**
```
Material de estudo que você não pode testar é decoração.

Por isso construí o cheat/dev: um hub com 503 comandos de HTML, CSS, JavaScript e SQL em que TUDO roda na hora, dentro da página.

Em vez de copiar um exemplo e torcer para funcionar, você:
→ edita o código e vê o resultado mudar
→ roda SQL de verdade (SQLite e PostgreSQL) sem instalar nada
→ resolve desafios com testes automáticos
→ entende o PORQUÊ, não só a sintaxe

São 58 desafios, 65 snippets, 11 templates de site, simulador com 17 dispositivos e uma trilha com os 53 passos que ninguém deveria pular.

Foi um projeto grande, feito em público e com muito teste de verdade. Nos próximos dias vou contar como cada parte funciona e o que deu errado no caminho.

O link está no primeiro comentário. Me conta: qual linguagem você mais gostaria de treinar assim?
```
**Primeiro comentário:** `Link do projeto: [LINK] · Código aberto: [REPO]`
**Hashtags:** `#desenvolvimentoweb #programacao #frontend #sql #buildinpublic`
**Dica:** responda cada comentário com uma pergunta de volta ("o que você está estudando agora?").

**Variações de gancho (teste A/B em outro dia):**
- A: "Cansei de cheatsheet que só mostra código e não deixa testar."
- B: "503 comandos. 58 desafios. Zero instalação. Tudo roda no navegador."
- C: "Rodei PostgreSQL dentro de uma aba do navegador. Foi assim."

---

### POST 2 — O problema (Dia 3)
**Objetivo:** explicar a filosofia e gerar identificação.
**Mídia:** M1 (antes/depois: exemplo estático vs. playground ao vivo).

**Texto:**
```
Quantas vezes você copiou um exemplo de internet e ele não funcionou?

O problema raramente é você. É que a maioria dos materiais mostra o CÓDIGO, não o COMPORTAMENTO.

No cheat/dev, cada comando segue o mesmo molde:

1. O que é e para que serve (em português claro)
2. Por que importa e a armadilha mais comum
3. Exemplo que você EDITA e roda ali mesmo
4. Quando usar e quando evitar
5. Comandos relacionados

Exemplo: o comando `align-items`. Em vez de uma tabela de valores, você muda para `center`, `baseline`, `stretch` e VÊ o que acontece com as caixas.

Aprender mexendo é mais rápido do que aprender lendo. E quem erra num ambiente seguro aprende mais.

Qual conceito de programação você só entendeu depois de ver rodando?
```
**Primeiro comentário:** `Exemplo ao vivo: [LINK]/css (escolha qualquer comando e edite o código)`
**Hashtags:** `#css #html #aprendizado #desenvolvimentoweb`

---

### POST 3 — O Lab: "Go Live" dentro do navegador (Dia 5)
**Objetivo:** demonstrar a ferramenta mais visual.
**Mídia:** M2 (vídeo 30 s: Emmet, trocar de aparelho, multi-tela).

**Texto:**
```
Eu queria o "Go Live" do VS Code, mas dentro de uma página web. Então construí o Lab.

Em 30 segundos:
• digito `ul>li*3` + Tab e o Emmet expande, igual no VS Code
• troco o preview para iPhone, iPad e Full HD (são 17 dispositivos)
• ativo o multi-tela: celular, tablet e desktop lado a lado, atualizando juntos
• console com erros e um terminal de expressões
• compartilho o projeto por link ou exporto um .zip com index.html, style.css e script.js

O detalhe técnico que mais gosto: o CSS é injetado SEM recarregar a página. Então animações e formulários não reiniciam enquanto você ajusta o estilo.

Para quem ensina, estuda ou só quer testar uma ideia rápido, é um laboratório sem instalação.

Qual recurso faltou aqui? Estou montando a lista de melhorias.
```
**Primeiro comentário:** `Experimente: [LINK]/lab`
**Hashtags:** `#frontend #css #responsivo #produtividade #buildinpublic`

---

### POST 4 — PostgreSQL dentro do navegador (Dia 8)
**Objetivo:** post técnico de alto impacto (gera discussão entre devs).
**Mídia:** M3 (print do resultado de RLS) + trecho de código.

**Texto:**
```
Rodei um PostgreSQL de verdade dentro de uma aba do navegador.

Sem servidor. Sem Docker. Sem cadastro. Cerca de 4 MB que carregam só quando você usa.

É o PGlite: o Postgres compilado para WebAssembly. No cheat/dev ele roda ao lado do SQLite e dá para alternar entre os dois na mesma consulta.

O que isso destrava para quem estuda:
→ testar RETURNING, JSONB, arrays, LATERAL e triggers de verdade
→ ver o plano de execução com EXPLAIN
→ praticar RLS (row level security), o coração do Supabase

E o melhor: cada execução abre um banco novo. Dá para apagar tabela, errar JOIN, quebrar tudo. Nada persiste.

Uma coisa que NÃO consegui: MySQL. Não existe motor WebAssembly maduro. Falo disso em outro post.

Você já usou Postgres no navegador? Qual seria seu primeiro experimento?
```
**Primeiro comentário:** `SQL Lab: [LINK]/sql-lab · O motor: PGlite (open source)`
**Hashtags:** `#postgresql #sql #webassembly #supabase #banco_de_dados`

---

### POST 5 — Carrossel: 7 diferenças entre bancos (Dia 10)
**Objetivo:** conteúdo de valor para atrair público novo.
**Mídia:** carrossel de 8 slides (M4).

**Roteiro dos slides:**
1. **Capa:** "O mesmo SQL, 4 bancos, 7 jeitos diferentes de errar"
2. **Limitar linhas:** `LIMIT 3` (SQLite, MySQL, Postgres) × `TOP 3` (SQL Server)
3. **Juntar textos:** `||` (Postgres, SQLite) × `CONCAT()` (MySQL) × `+` (SQL Server). No MySQL, `||` normalmente significa OU.
4. **Datas:** `date('now')` × `CURRENT_DATE` × `CURDATE()` × `GETDATE()`
5. **Chave automática:** `AUTOINCREMENT` × `IDENTITY` × `AUTO_INCREMENT` × `IDENTITY(1,1)`
6. **Upsert:** `ON CONFLICT` × `ON DUPLICATE KEY` × `MERGE`
7. **FULL JOIN:** não existe no MySQL (UNION de LEFT e RIGHT)
8. **Fechamento:** "Tudo isso, lado a lado e testável (SQLite e Postgres), no SQL Lab. Salve para a próxima migração."

**Texto de apoio:**
```
Quem migra de banco descobre rápido: SQL é um padrão... com sotaque.

Montei uma comparação lado a lado das diferenças que mais quebram consultas (carrossel). Salve para a próxima vez que o erro for "syntax error" e o código parecer correto.

No SQL Lab da página, dá para testar a versão SQLite e a PostgreSQL de cada receita com um clique.

Qual dessas diferenças já te pegou?
```
**Primeiro comentário:** `Todas as receitas, com teste: [LINK]/sql-lab (aba "Dialetos")`
**Hashtags:** `#sql #mysql #postgresql #sqlserver #bancodedados`

---

### POST 6 — Supabase e RLS (Dia 12)
**Objetivo:** educar sobre segurança com um caso prático.
**Mídia:** M3 (Ana vê 2 tarefas, Bruno vê 1).

**Texto:**
```
No Supabase, o navegador fala direto com o banco. Então o que impede um usuário de ler os dados do outro?

Uma única coisa: o RLS (Row Level Security).

Com RLS ligado e uma policy como esta:

CREATE POLICY "ver só as próprias tarefas" ON tarefas
FOR SELECT TO authenticated
USING (user_id = auth.uid());

...cada usuário só enxerga as próprias linhas. Sem a policy, o padrão é negar tudo. Sem RLS ligado, a tabela pública fica aberta para quem tiver a chave anon.

Montei esse cenário completo no SQL Lab, simulando o auth.uid(): você alterna entre a Ana (vê 2 tarefas) e o Bruno (vê 1) e entende o mecanismo na prática, sem criar projeto no Supabase.

Regra que repito para mim mesmo: tabela com dado de usuário sem RLS é vazamento esperando acontecer.

Você já revisou as policies do seu projeto esta semana?
```
**Primeiro comentário:** `Teste no navegador: [LINK]/sql/postgres-supabase/rls-policies`
**Hashtags:** `#supabase #postgresql #segurança #backend #rls`

---

### POST 7 — A roleta de desafios (Dia 15)
**Objetivo:** mostrar a gamificação e o motor de testes.
**Mídia:** M5 (vídeo 30 s).

**Texto:**
```
Estudar sem treinar é só leitura. Por isso criei uma roleta de desafios.

Você gira, sorteia HTML, CSS, JavaScript ou SQL, e recebe um desafio prático. Escreve o código e os TESTES rodam de verdade:

• HTML: o teste consulta o DOM da sua página (o formulário tem label? o título segue a ordem?)
• CSS: o teste mede a posição e os estilos calculados dos elementos
• JavaScript: o teste executa as suas funções (inclusive assíncronas)
• SQL: o teste compara o seu resultado com o da solução

São 58 desafios em 4 níveis, de iniciante a "chefe" (implementar um cache LRU, o seu próprio Promise.all, um organograma com CTE recursiva).

No modo adaptativo, você sempre recebe o nível mais baixo que ainda não completou. XP, patentes e sequência diária para criar o hábito.

O detalhe de engenharia: validei TODOS em navegador real. A solução precisa passar em 100% dos testes e o código inicial precisa falhar. Teste ruim é pior que nenhum teste.

Qual você acha que seria o "chefe" mais difícil?
```
**Primeiro comentário:** `Gire a roleta: [LINK]/desafios`
**Hashtags:** `#javascript #css #sql #aprenderprogramar #gamificacao`

---

### POST 8 — O Essencial: "o que acontece se você pular" (Dia 17)
**Objetivo:** conteúdo de valor + apresentar a trilha.
**Mídia:** M6 (print).

**Texto:**
```
Entre milhares de comandos, o que NÃO dá para pular?

Montei uma trilha chamada Essencial. Cada passo diz por que importa, o que acontece se você pular e dá uma tarefa prática. Cinco que mais vejo gente ignorar:

1. box-sizing: border-box → sem ele, larguras "estouram" a tela em todo projeto.
2. label em todo campo → sem ele, o formulário é inacessível e difícil de tocar no celular.
3. === em vez de == → evita uma classe inteira de bugs de coerção.
4. NULL não é zero → COUNT(*) e COUNT(coluna) dão números diferentes (e relatórios errados).
5. E-mail certo no Git → commit com e-mail errado não aparece no seu gráfico do GitHub (aprendi na pele).

São 53 passos em 6 trilhas: HTML, CSS, JavaScript, SQL, Git/deploy e qualidade (acessibilidade, segurança, performance). O progresso fica salvo no navegador.

Qual passo você pularia achando que "não faz diferença"?
```
**Primeiro comentário:** `A trilha completa: [LINK]/essencial`
**Hashtags:** `#carreiraemtecnologia #desenvolvimentoweb #boaspraticas #iniciante`

---

### POST 9 — Bastidores: 5 bugs reais (Dia 19)
**Objetivo:** humanizar, mostrar rigor. Posts de erro costumam ter ótimo engajamento.
**Mídia:** M8 + M9.

**Texto:**
```
Cinco bugs reais que achei construindo o cheat/dev (e o que cada um ensinou):

1. Meus commits não apareciam no GitHub.
Causa: o e-mail do commit não era o da minha conta. Lição: configure o noreply do GitHub desde o dia 1.

2. Exemplos com <script> não rodavam na página.
Causa: o iframe de preview bloqueava scripts. Lição: testei de verdade e só então percebi.

3. O popup de autocompletar nunca aparecia.
Causa: eu recriava a fonte de sugestões a cada tecla. Lição: o editor identifica a fonte por referência.

4. O localStorage quebrava dentro do preview.
Causa: o iframe isolado não tem acesso ao armazenamento. Lição: isolar é bom, mas precisa de um plano B.

5. Um dos pontos de arrastar da curva de animação ficava invisível.
Causa: o gráfico não comportava curvas "elásticas". Lição: teste com os casos extremos, não só com o feliz.

Como achei tudo isso? Escrevi scripts que abrem o site num Chromium de verdade, clicam, digitam, arrastam e conferem o resultado.

Teste manual no seu notebook não pega o que teste automatizado pega. E teste automatizado sem navegador real não pega o que importa.

Qual foi o bug mais bobo que já te ensinou algo importante?
```
**Primeiro comentário:** `Código e histórico de commits: [REPO]`
**Hashtags:** `#buildinpublic #engenhariadesoftware #testes #aprendizado`

---

### POST 10 — Como construí com IA sem perder o controle (Dia 22)
**Objetivo:** posicionamento maduro sobre IA (muito demandado por recrutadores).
**Mídia:** M8 (histórico de commits).

**Texto:**
```
Construí o cheat/dev com o Claude como parceiro de código. Isso não significa que a IA "fez sozinha". Significa que eu precisei de MAIS disciplina, não de menos.

O que eu fiz para manter o controle:

→ Defini o produto e as prioridades (e discordei várias vezes das sugestões)
→ Exigi que todo conteúdo fosse TESTÁVEL na página e validei em navegador real
→ Pedi lint e build limpos antes de cada publicação
→ Mantive commits pequenos e com mensagem clara (feat, fix, refactor...), para poder revisar e reverter
→ Pedi que cada limitação fosse dita em voz alta (ex.: "MySQL não roda no navegador, e eis o motivo")

O que a IA acelerou: escrever 500+ explicações, montar bancos de exemplo, gerar variações de templates, escrever os scripts de teste.

O que continuou comigo: decidir o que construir, revisar o que importa, notar que algo estava errado e saber quando parar.

IA não substitui critério. Ela cobra mais dele.

Como você usa IA no seu fluxo de desenvolvimento hoje?
```
**Primeiro comentário:** `Histórico de commits (um por decisão): [REPO]/commits/main`
**Hashtags:** `#ia #desenvolvimento #claude #produtividade #engenhariadesoftware`

---

### POST 11 — Templates e estilos (Dia 24)
**Objetivo:** post visual (alto alcance).
**Mídia:** M7 (4 estilos lado a lado do mesmo template) ou carrossel.

**Texto:**
```
Um layout. Quatro personalidades. Zero reescrita.

Nos templates do cheat/dev, o visual inteiro vive em variáveis CSS: cores, bordas arredondadas e fontes ficam em um bloco :root. Trocar o estilo é trocar esse bloco.

São 11 sites completos: blog, loja virtual, SaaS, restaurante, agência, link na bio, documentação, evento, landing page, portfólio e painel. Os 8 mais novos têm de 4 a 6 estilos cada: claro, escuro, neon, pastel, minimalista, editorial, natureza...

Total: 43 combinações, todas responsivas, cada uma em um único arquivo .html, que você pode baixar, editar no Lab ou usar de base para um projeto de cliente.

A lição de design: quando o estilo vem de tokens (variáveis), mudar a identidade de um site vira uma decisão de 10 segundos, não um refactor de uma semana.

Se você pudesse ter um template a mais, qual seria?
```
**Primeiro comentário:** `Escolha o estilo e baixe: [LINK]/templates`
**Hashtags:** `#webdesign #css #frontend #designsystem #ux`

---

### POST 11b — (opcional, mesma semana) Geradores
Post curto com GIF dos geradores (sombra em camadas, curva de animação arrastável). Gancho: "Parei de decorar `cubic-bezier`. Agora eu arrasto."

---

### POST 12 — Decisão honesta: por que o MySQL não roda (Dia 26)
**Objetivo:** mostrar maturidade técnica e transparência (tipo de post que gera respeito).
**Mídia:** print da aba Dialetos com "só referência" em MySQL e SQL Server.

**Texto:**
```
Alguém me perguntou: "por que seu SQL Lab não roda MySQL?"

Resposta honesta, com o que eu verifiquei:

→ PostgreSQL roda no navegador (PGlite, WebAssembly, ~4 MB).
→ SQLite também (sql.js).
→ MySQL: não encontrei nenhum motor maduro em WebAssembly. Pesquisei no npm e na web.

As opções que sobraram:
1. Rodar MySQL de verdade num servidor: viável, mas exige isolamento por usuário, custo e manutenção contínua.
2. "Simular" MySQL em cima do SQLite: eu descartei. Ensinaria comportamento errado (||, GROUP BY, datas, collation).
3. Manter o MySQL como referência: é o que fiz. A aba Dialetos mostra o MySQL ao lado dos outros três, marcado como "só referência".

Prefiro dizer "isso não roda" a fingir que roda. Quem estuda precisa confiar no que vê.

Se houver demanda, o próximo passo é um servidor real. Você usaria? Ou preferiria mais conteúdo comparativo?
```
**Primeiro comentário:** `Dialetos lado a lado: [LINK]/sql-lab`
**Hashtags:** `#mysql #sql #produto #transparencia #bancodedados`

---

### POST 13 — Resultados e aprendizados (Dia 29)
**Objetivo:** prestação de contas + prova social. **Preencha com números reais do dia.**
**Mídia:** M9 + prints do analytics/GitHub.

**Texto:**
```
Duas semanas depois de publicar o cheat/dev, os números (os reais, sem arredondar para cima):

• [N] visitantes · [N] páginas vistas
• [N] estrelas no GitHub · [N] contribuições novas no gráfico
• Páginas mais acessadas: [1º], [2º], [3º]
• [N] pessoas mandaram feedback

O que eu aprendi:
1. O que mais atrai não é o que eu esperava: foi [descoberta].
2. [Algo que o público pediu e eu não tinha pensado].
3. [Algo que deu errado e eu vou corrigir].

O que vem agora: [próximo item do roadmap: ex.: mais desafios de CSS, trilhas guiadas, equivalente em Tailwind].

Obrigado a quem testou, quebrou e reportou. Esse é o melhor tipo de revisão.

O que você mudaria primeiro?
```
**Dica:** se os números forem modestos, **publique mesmo assim**. Honestidade com aprendizado performa melhor que vitrine inflada.
**Hashtags:** `#buildinpublic #produto #aprendizado #opensource`

---

### POST 14 — Convite aberto (Dia 31)
**Objetivo:** converter atenção em conexões, contribuições e oportunidades.

**Texto:**
```
O cheat/dev é aberto, e ainda tem muito para fazer.

Se você quer contribuir, tem espaço para:
→ novos desafios (CSS e HTML ainda têm poucos)
→ revisão de conteúdo (achou um erro? abra uma issue)
→ traduções
→ ideias de recursos (a lista de pendências está no repositório)

Se você é recrutador ou lidera um time: o projeto é minha melhor demonstração de como eu trabalho. Produto de ponta a ponta, testes em navegador real, commits atômicos, decisões documentadas. Vale uma olhada no código e na conversa.

Se você precisa de [seu tipo de serviço: sites, automações, integrações com WhatsApp e IA...], me chama aqui ou por mensagem.

Link do projeto e do repositório no primeiro comentário.
```
**Primeiro comentário:** `Site: [LINK] · Repositório: [REPO] · Pendências: [REPO]/blob/main/docs/DOC-MESTRE.md`
**Hashtags:** `#opensource #contribua #desenvolvimentoweb #carreira`

---

## PARTE 4 — 10 microposts de apoio (preencher os dias vazios)

Formato curto (5 a 8 linhas), imagem opcional com o código. Cada um aponta para um comando do site (use o link no comentário).

1. **`0.1 + 0.2`** — "`0.1 + 0.2 === 0.3` dá false em qualquer linguagem. Não é bug do JavaScript: é ponto flutuante. Para dinheiro, guarde centavos (inteiros). Quem nunca? 😅"
2. **`typeof null`** — "`typeof null` devolve 'object'. É um bug de 1995 que ficou para sempre por compatibilidade. Para checar null, compare `x === null`."
3. **`NOT IN` com NULL** — "Um único NULL na lista faz `NOT IN` devolver ZERO linhas. Troque por `NOT EXISTS`. Já perdi uma tarde por isso."
4. **`||` vs `??`** — "`quantidade || 10` troca o 0 por 10. `quantidade ?? 10` só troca null e undefined. Se 0 é um valor válido, você quer `??`."
5. **`justify-content` vs `align-items`** — "justify = eixo PRINCIPAL; align = eixo CRUZADO. Se mudar `flex-direction: column`, eles trocam de direção. A confusão acaba quando você pensa em eixos."
6. **`display:none` vs `opacity:0`** — "`opacity:0` esconde, mas o elemento continua clicável e lido por leitores de tela. Para esconder de verdade, `display:none` ou `visibility:hidden`."
7. **`<button>` dentro de `<form>`** — "Botão sem `type` dentro de um form envia e recarrega a página. Para ação de interface, `type=\"button\"`."
8. **COUNT(*) vs COUNT(coluna)** — "`COUNT(*)` conta linhas; `COUNT(email)` ignora os NULL. Mesma tabela, números diferentes."
9. **Debounce** — "Busca que dispara um fetch por letra digitada? Debounce: só executa quando o usuário para. 8 linhas de código resolvem."
10. **`31/01 + 1 mês`** — "No SQLite e no JavaScript dá 02/03. No MySQL e no Postgres dá 29/02. Somar meses é uma das fontes mais traiçoeiras de bug em relatórios."

---

## PARTE 5 — Interação

### 5.1 Respostas rápidas para comentários
- **"Parabéns, muito bom!"** → "Obrigado! O que você está estudando agora? Posso sugerir um desafio para o seu nível."
- **"Isso é open source?"** → "Sim! Está no [REPO]. Contribuições são bem-vindas, principalmente desafios novos."
- **"Roda MySQL?"** → "Hoje não: SQLite e PostgreSQL rodam no navegador; MySQL aparece como referência na aba Dialetos. Expliquei o motivo no post [link do Post 12]."
- **"Como você fez X?"** → Responda com 2 linhas + convide: "Posso detalhar num próximo post se tiver interesse. Reaja com 👍 se quiser."
- **Crítica / bug encontrado** → "Boa pegada, obrigado! Vou corrigir. Abre uma issue com o passo a passo? Assim fica registrado." (e agradeça publicamente depois da correção).

### 5.2 Mensagens diretas (quando alguém demonstra interesse)
**Recrutador/líder:**
> Oi, [nome]! Obrigado pelo interesse no cheat/dev. Se quiser conhecer como eu trabalho, vale olhar o histórico de commits e o documento mestre no repositório. Tenho interesse em [tipo de vaga/projeto]. Podemos conversar?

**Potencial cliente:**
> Oi, [nome]! Vi que você se interessou pelo projeto. Eu trabalho com [sites / automação / integrações]. Qual desafio você está enfrentando aí? Posso te dar um retorno rápido de como eu resolveria.

**Estudante pedindo ajuda:**
> Oi, [nome]! Que bom que está usando. Para o seu nível, sugiro começar pela trilha Essencial ([LINK]/essencial) e depois girar a roleta no modo adaptativo. Qualquer dúvida de um desafio, me manda o enunciado.

---

## PARTE 6 — Métricas

### 6.1 Planilha de acompanhamento (por post)
| Post | Data/hora | Impressões | Reações | Comentários | Compartilhamentos | Cliques no link (analytics do site) | Seguidores ganhos | Observações |
|---|---|---|---|---|---|---|---|---|

### 6.2 O que olhar
- **Taxa de engajamento** = (reações + comentários + compartilhamentos) ÷ impressões. Compare entre os posts para descobrir o que funciona.
- **Comentários > reações** em valor: priorize formatos que geram conversa.
- **Origem do tráfego do site:** use parâmetros `?utm_source=linkedin&utm_campaign=post-N` nos links do primeiro comentário.
- **GitHub:** estrelas, forks, issues, visitantes do repositório (aba Insights → Traffic).

### 6.3 Como decidir o que repetir
Depois do Post 5, identifique qual formato foi melhor (carrossel, vídeo ou texto puro) e **dobre a aposta** nesse formato nos posts restantes (ajuste o plano sem medo).

---

## PARTE 7 — Pitches reutilizáveis

- **30 segundos (fala):** "Criei o cheat/dev, um hub para desenvolvedores em que todo comando de HTML, CSS, JavaScript e SQL é explicado e pode ser testado na hora, dentro da página. Roda até PostgreSQL no navegador. Tem 58 desafios com testes automáticos e uma trilha com o que não dá para pular."
- **2 linhas (bio/projeto):** "Hub com 503 comandos testáveis na hora (HTML, CSS, JS, SQL), SQL Lab com PostgreSQL no navegador e 58 desafios com testes automáticos."
- **1 linha (assinatura de e-mail):** "cheat/dev: aprenda testando — [LINK]"

## PARTE 8 — Cuidados finais
- Revise cada número antes de publicar; se um dado mudou, atualize.
- Se algo no site estiver quebrado no dia do post, **adie** o post: primeira impressão conta.
- Não use IA para escrever os comentários por você: a conversa é o ativo.
- Cite as ferramentas de terceiros com crédito (CodeMirror, sql.js, PGlite) quando falar de tecnologia.
- Revogue qualquer token do GitHub depois de cada sessão de trabalho.
