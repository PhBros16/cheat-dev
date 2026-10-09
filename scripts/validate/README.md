# Scripts de validação

O projeto não tem testes unitários: o conteúdo é validado em **navegador real** (Chromium headless) e executando todo o SQL nos dois motores.

## Preparação (uma vez por sessão)

```bash
mkdir -p /tmp/val && cd /tmp/val && npm init -y && npm i puppeteer-core @sparticuz/chromium
cd <raiz do repo> && npm ci
npm run build && npx next start -p 3111      # só para os scripts e2e (precisa estar no ar)
```

## Scripts (rodar na raiz do repositório)

| Script | Para que serve |
|---|---|
| `npx tsx scripts/validate/sql-all.mts` | Roda todas as consultas SQL em SQLite **e** PostgreSQL (comandos, dialetos, exclusivos do Postgres, desafios SQL) |
| `npx tsx scripts/validate/links.mts` | Acha links "relacionados" e da trilha Essencial que não existem |
| `npx tsx scripts/validate/challenges.mts` + `node scripts/validate/challenges-run.mjs` | Cada desafio web: a solução deve passar 100% e o código inicial deve falhar |
| `npx tsx scripts/validate/js-examples.mts` + `node scripts/validate/js-examples-run.mjs` | Executa os exemplos de JavaScript e acusa erros |
| `npx tsx scripts/validate/css-demos.mts` | Acha demos de CSS sem efeito visível |
| `node scripts/validate/e2e-hub.mjs` · `e2e-lab.mjs` | Fluxos reais (roleta, testes, Emmet, multi-tela, ZIP, compartilhar). Exigem o servidor na porta 3111 |
| `node scripts/validate/a11y-audit.mjs <light\|dark> <largura> <rotas.txt> <saida.json> [conc]` | Contraste WCAG de todo texto visível, erros de console, requisições com falha e overflow, por página |
| `node scripts/validate/a11y-states.mjs <light\|dark> <largura> [pasta-de-prints]` | A mesma auditoria em ~83 estados interativos. Antes: `npx tsx scripts/validate/challenges.mts`. Leva ~4-5 min |
| `node scripts/validate/overflow-all.mjs <largura> <rotas.txt> <saida.json> [conc]` | Overflow horizontal em todas as rotas (use 320, 390, 768, 1024) |
| `scripts/validate/serve-and-run.sh "<comando>"` | Sobe o servidor, roda o comando e derruba, tudo na mesma chamada |

Observações:
- Os `.mjs` carregam o Puppeteer de `/tmp/val` e leem/gravam JSON em `/tmp/val`.
- Use **uma página nova por execução** em testes de código (variáveis globais vazam entre `setContent`).
- Mate servidores antigos antes de subir outro: `pkill -9 -f 'next-serve[r]'` (nunca `pkill -f "next build"`: casa com a própria linha de comando). Gere o arquivo de rotas a partir do `/sitemap.xml`.
- `sql-all.mts` pode passar de 300 s e sair sem imprimir nada: confira o código de saída.
