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

Observações:
- Os `.mjs` carregam o Puppeteer de `/tmp/val` e leem/gravam JSON em `/tmp/val`.
- Use **uma página nova por execução** em testes de código (variáveis globais vazam entre `setContent`).
- Mate servidores antigos antes de subir outro: `pkill -9 -f 'next-serve[r]'`.
