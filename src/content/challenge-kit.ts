import type { Code, Level, SqlChallenge, Test, WebChallenge } from "@/content/challenges";
import type { DbId } from "@/lib/sqlDbs";

/* Helpers e construtores compartilhados pelos arquivos de desafios.
   Este módulo só importa TIPOS de challenges.ts (nada em tempo de execução), para não criar import circular. */

export const E: Code = { html: "", css: "", js: "" };
export const page = (body: string, head = "") => `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Minha página</title>${head}\n</head>\n<body>\n${body}\n</body>\n</html>`;
export const q = (sel: string) => `document.querySelector('${sel}')`;
export const qa = (sel: string) => `document.querySelectorAll('${sel}')`;
export const cs = (sel: string, prop: string) => `getComputedStyle(${q(sel)}).${prop}`;
export const rect = (sel: string) => `${q(sel)}.getBoundingClientRect()`;
/** Teste curto: [nome, expressão JavaScript que deve dar verdadeiro]. */
export type TT = [name: string, check: string];
const tests = (t: TT[]): Test[] => t.map(([name, check]) => ({ name, check }));

/** JavaScript puro: o aluno escreve funções; os testes as chamam. */
export const jsFn = (id: string, level: Level, title: string, brief: string, hint: string, starter: string, solution: string, t: TT[], learn?: string): WebChallenge => ({
  kind: "web", id, lang: "js", level, title, brief, hint, learn, starter: { ...E, js: starter }, solution: { ...E, js: solution }, tests: tests(t),
});
/** JavaScript com DOM: o aluno recebe um HTML (e opcionalmente CSS) e escreve o script. */
export const jsDom = (id: string, level: Level, title: string, brief: string, hint: string, html: string, starterJs: string, solutionJs: string, t: TT[], learn?: string, css = ""): WebChallenge => ({
  kind: "web", id, lang: "js", level, title, brief, hint, learn, starter: { html, css, js: starterJs }, solution: { html, css, js: solutionJs }, tests: tests(t),
});
/** HTML: o aluno escreve/corrige marcação. */
export const htmlC = (id: string, level: Level, title: string, brief: string, hint: string, starter: string, solution: string, t: TT[], learn?: string): WebChallenge => ({
  kind: "web", id, lang: "html", level, title, brief, hint, learn, starter: { ...E, html: starter }, solution: { ...E, html: solution }, tests: tests(t),
});
/** CSS: o aluno recebe HTML pronto e escreve as regras. */
export const cssC = (id: string, level: Level, title: string, brief: string, hint: string, html: string, starterCss: string, solutionCss: string, t: TT[], learn?: string): WebChallenge => ({
  kind: "web", id, lang: "css", level, title, brief, hint, learn, starter: { html, css: starterCss, js: "" }, solution: { html, css: solutionCss, js: "" }, tests: tests(t),
});
/** SQL: corrigido comparando o resultado da consulta do aluno com o da solução. */
export const sqlC = (id: string, db: DbId, level: Level, title: string, brief: string, hint: string, solution: string, learn?: string): SqlChallenge => ({
  kind: "sql", id, lang: "sql", level, title, brief, hint, learn, db, solution,
});
