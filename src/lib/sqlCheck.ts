import type { ResultSet } from "@/lib/sqljs";

/** Compara o resultado do aluno com o da solução: ignora nomes de coluna; a ordem só conta se a solução usa ORDER BY. */
export function sameResult(user: ResultSet | undefined, sol: ResultSet | undefined, ordered: boolean): { ok: boolean; msg: string } {
  if (!user) return { ok: false, msg: "Sua consulta não devolveu linhas. Falta um SELECT?" };
  if (!sol) return { ok: false, msg: "Erro interno ao ler a solução." };
  if (user.columns.length !== sol.columns.length) return { ok: false, msg: `Quase! O resultado esperado tem ${sol.columns.length} coluna(s) e o seu tem ${user.columns.length}. Releia o enunciado para ver o que deve ser mostrado.` };
  const norm = (v: unknown) => (typeof v === "number" ? Math.round(v * 10000) / 10000 : v);
  const rows = (r: ResultSet) => r.values.map((x) => JSON.stringify(x.map(norm)));
  let a = rows(user), b = rows(sol);
  if (!ordered) { a = [...a].sort(); b = [...b].sort(); }
  if (a.length !== b.length) return { ok: false, msg: `O resultado esperado tem ${b.length} linha(s) e o seu tem ${a.length}. Revise o filtro (WHERE/HAVING) ou o JOIN.` };
  const bad = a.findIndex((x, i) => x !== b[i]);
  if (bad >= 0) return { ok: false, msg: ordered ? "A quantidade de linhas está certa, mas os valores ou a ordem diferem. Confira o ORDER BY e as colunas." : "Mesma quantidade de linhas, mas algum valor difere. Confira cálculos, arredondamentos e colunas." };
  return { ok: true, msg: "Correto! Seu resultado é idêntico ao esperado." };
}
