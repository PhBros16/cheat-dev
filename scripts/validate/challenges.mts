// Gera os arquivos que o navegador usa para validar os desafios. Uso: npx tsx scripts/validate/challenges.mts && node scripts/validate/challenges-run.mjs
import fs from "fs";
const { CHALLENGES } = await import("@/content/challenges"); const { buildChallengeDoc } = await import("@/lib/challengeDoc");
const web = CHALLENGES.filter((c) => c.kind === "web").map((c: any) => ({ id: c.id, lang: c.lang, tests: c.tests, solution: buildChallengeDoc(c.solution), starter: buildChallengeDoc(c.starter) }));
fs.writeFileSync("/tmp/val/web-challenges.json", JSON.stringify(web));
fs.writeFileSync("/tmp/val/solutions.json", JSON.stringify(Object.fromEntries(CHALLENGES.filter((c) => c.kind === "web").map((c: any) => [c.id, c.solution]))));
console.log(web.length, "desafios web exportados para /tmp/val");
