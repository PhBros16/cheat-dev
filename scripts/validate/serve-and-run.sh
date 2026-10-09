#!/bin/bash
# Sobe `next start` (porta 3111), espera responder, roda o comando a partir da raiz do repo e derruba o servidor.
# (Em alguns ambientes processos em background não sobrevivem entre comandos: suba e teste na MESMA chamada.)
# Uso: scripts/validate/serve-and-run.sh "node scripts/validate/a11y-audit.mjs light 1440 /tmp/val/top.txt /tmp/val/out.json"
cd "$(git rev-parse --show-toplevel)" || exit 1
for p in $(pgrep -f 'next-serve[r]'); do kill -9 "$p" 2>/dev/null; done; sleep 1
nohup npx next start -p 3111 > /tmp/next.log 2>&1 &
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3111/ && break; sleep 1; done
curl -s -o /dev/null -w "servidor HTTP %{http_code}\n" http://localhost:3111/
eval "$1"
for p in $(pgrep -f 'next-serve[r]'); do kill -9 "$p" 2>/dev/null; done
