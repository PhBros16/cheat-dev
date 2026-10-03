"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor from "@/components/lab/Editor";
import SqlResults, { toCsv } from "@/components/SqlResults";
import { explainError, getSqlJs, type ResultSet } from "@/lib/sqljs";
import { DBS, DB_IDS, type DbId } from "@/lib/sqlDbs";
import { SQL_DEMOS } from "@/content/sql-demos";
import { SQL_EXERCISES, SQL_LESSONS, type SqlExercise } from "@/content/sql-exercises";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Table = { name: string; cols: { name: string; type: string; pk: boolean }[]; rows: number };
type Tab = "aulas" | "exercicios" | "historico";

const KEY = "cheatdev:sqllab:v1";
const INBOX = "cheatdev:sqllab:inbox";
const DEFAULT_Q = `-- Escreva seu SQL aqui e aperte Ctrl+Enter\nSELECT nome, cidade, estado\nFROM clientes\nORDER BY nome\nLIMIT 5;`;

const btn = "rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground hover:border-muted disabled:opacity-40";
const LEVEL_DOT: Record<string, string> = { "iniciante": "bg-emerald-500", "intermediário": "bg-amber-500", "avançado": "bg-rose-500" };

/** Compara o resultado do aluno com o da solução (ignora nomes de coluna; ordem só importa se a solução usa ORDER BY). */
function sameResult(user: ResultSet | undefined, sol: ResultSet | undefined, ordered: boolean): { ok: boolean; msg: string } {
  if (!user) return { ok: false, msg: "Sua consulta não devolveu linhas. Falta um SELECT?" };
  if (!sol) return { ok: false, msg: "Erro interno ao ler a solução." };
  if (user.columns.length !== sol.columns.length) return { ok: false, msg: `Quase! O resultado esperado tem ${sol.columns.length} coluna(s) e o seu tem ${user.columns.length}. Releia o enunciado para ver o que deve ser mostrado.` };
  const norm = (v: unknown) => (typeof v === "number" ? Math.round(v * 10000) / 10000 : v);
  const rows = (r: ResultSet) => r.values.map((x) => JSON.stringify(x.map(norm)));
  let a = rows(user), b = rows(sol);
  if (!ordered) { a = [...a].sort(); b = [...b].sort(); }
  if (a.length !== b.length) return { ok: false, msg: `O resultado esperado tem ${b.length} linha(s) e o seu tem ${a.length}. Revise o filtro (WHERE/HAVING) ou o JOIN.` };
  const bad = a.findIndex((x, i) => x !== b[i]);
  if (bad >= 0) return { ok: false, msg: ordered ? "As linhas estão certas em quantidade, mas os valores ou a ordem diferem. Confira o ORDER BY e as colunas." : "Mesma quantidade de linhas, mas algum valor difere. Confira cálculos, arredondamentos e colunas." };
  return { ok: true, msg: "Correto! Seu resultado é idêntico ao esperado." };
}

/** Estado inicial: o que foi salvo antes, ou uma consulta enviada de outra página (ex.: "Abrir no SQL Lab"). */
function loadInit(): { db: DbId; query: string; history: { q: string; db: DbId; ok: boolean }[]; solved: string[] } {
  const init = { db: "loja" as DbId, query: DEFAULT_Q, history: [] as { q: string; db: DbId; ok: boolean }[], solved: [] as string[] };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved) {
      if (saved.db in DBS) init.db = saved.db;
      init.query = saved.query ?? DEFAULT_Q;
      init.history = saved.history ?? [];
      init.solved = saved.solved ?? [];
    }
    const inbox = localStorage.getItem(INBOX);
    if (inbox) {
      localStorage.removeItem(INBOX);
      const o = JSON.parse(inbox);
      if (o.db in DBS) { init.db = o.db; init.query = o.query; }
    }
  } catch {}
  return init;
}

export default function SqlLab() {
  const [init] = useState(loadInit);
  const [db, setDb] = useState<DbId>(init.db);
  const [query, setQuery] = useState(init.query);
  const [sets, setSets] = useState<ResultSet[] | null>(null);
  const [err, setErr] = useState("");
  const [ms, setMs] = useState<number | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("aulas");
  const [history, setHistory] = useState(init.history);
  const [solved, setSolved] = useState(init.solved);
  const [ex, setEx] = useState<SqlExercise | null>(null);
  const [verdict, setVerdict] = useState<{ ok: boolean; msg: string } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSol, setShowSol] = useState(false);
  const [toast, setToast] = useState("");
  const conn = useRef<any>(null);
  const SQLRef = useRef<any>(null);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2200); };

  const readSchema = useCallback(() => {
    const d = conn.current;
    if (!d) return;
    const names = (d.exec("SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY type, name")[0]?.values ?? []).map((v: unknown[]) => String(v[0]));
    setTables(names.map((n: string) => {
      const info = d.exec(`PRAGMA table_info("${n}")`)[0]?.values ?? [];
      let rows = 0;
      try { rows = Number(d.exec(`SELECT COUNT(*) FROM "${n}"`)[0].values[0][0]); } catch {}
      return { name: n, cols: info.map((c: unknown[]) => ({ name: String(c[1]), type: String(c[2]), pk: Number(c[5]) > 0 })), rows };
    }));
  }, []);

  const fresh = useCallback(async (id: DbId) => {
    const S = SQLRef.current ?? (SQLRef.current = await getSqlJs());
    conn.current?.close();
    const d = new S.Database();
    d.exec(DBS[id].script);
    conn.current = d;
    readSchema();
  }, [readSchema]);

  /* inicialização: carrega o motor SQL e cria o banco do estado inicial */
  useEffect(() => {
    getSqlJs().then(() => fresh(init.db)).then(() => setReady(true)).catch((e) => setErr(String(e.message ?? e)));
  }, [fresh, init.db]);

  useEffect(() => {
    const t = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify({ db, query, history: history.slice(0, 30), solved })); } catch {} }, 400);
    return () => clearTimeout(t);
  }, [db, query, history, solved]);

  async function run(sql = query) {
    if (!ready || !conn.current) return;
    setErr(""); setSets(null);
    try {
      const t = performance.now();
      const r = conn.current.exec(sql) as ResultSet[];
      setMs(Math.round((performance.now() - t) * 10) / 10);
      setSets(r);
      setHistory((h) => [{ q: sql, db, ok: true }, ...h.filter((x) => x.q !== sql)].slice(0, 30));
      readSchema();
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
      setHistory((h) => [{ q: sql, db, ok: false }, ...h.filter((x) => x.q !== sql)].slice(0, 30));
    }
  }

  async function changeDb(id: DbId) {
    setDb(id); setSets(null); setErr("");
    await fresh(id);
    flash(`Banco "${DBS[id].name}" carregado.`);
  }

  async function reset() { await fresh(db); setSets(null); setErr(""); flash("Banco reiniciado ao estado original."); }

  function explainPlan() {
    const clean = query.split("\n").filter((l) => !l.trim().startsWith("--")).join("\n");
    const first = clean.split(";").map((x) => x.trim()).find((x) => /^(select|with)\b/i.test(x));
    if (!first) return flash("Escreva um SELECT para ver o plano de execução.");
    void run(`EXPLAIN QUERY PLAN ${first}`);
  }

  function downloadCsv() {
    if (!sets?.length) return;
    const blob = new Blob([toCsv(sets[0])], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "resultado.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function loadLesson(slug: string) {
    const d = SQL_DEMOS[slug];
    if (!d) return;
    if (d.db !== db) await changeDb(d.db);
    setEx(null); setVerdict(null);
    setQuery(d.query);
  }

  async function openExercise(e: SqlExercise) {
    setEx(e); setVerdict(null); setShowHint(false); setShowSol(false);
    if (e.db !== db) await changeDb(e.db); else await reset();
    setQuery(`-- ${e.title}\n-- ${e.text}\n\n`);
    setSets(null);
  }

  async function check() {
    if (!ex) return;
    const S = SQLRef.current ?? (SQLRef.current = await getSqlJs());
    try {
      const a = new S.Database(); a.exec(DBS[ex.db].script);
      const b = new S.Database(); b.exec(DBS[ex.db].script);
      const user = (a.exec(query) as ResultSet[]).at(-1);
      const sol = (b.exec(ex.solution) as ResultSet[]).at(-1);
      a.close(); b.close();
      const v = sameResult(user, sol, /order\s+by/i.test(ex.solution));
      setVerdict(v);
      if (v.ok && !solved.includes(ex.id)) setSolved((s) => [...s, ex.id]);
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      setVerdict({ ok: false, msg: `Sua consulta deu erro: ${m}. ${explainError(m)}` });
    }
  }

  const grouped = useMemo(() => (["iniciante", "intermediário", "avançado"] as const).map((l) => ({ l, items: SQL_EXERCISES.filter((e) => e.level === l) })), []);
  const hint = err ? explainError(err) : "";

  return (
    <div className="fixed inset-x-0 bottom-0 top-[57px] z-20 flex flex-col bg-background lg:z-[45]">
      {/* barra */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border bg-surface px-3 py-2">
        <label className="flex items-center gap-1.5 text-xs text-muted">Banco
          <select value={db} onChange={(e) => void changeDb(e.target.value as DbId)} className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs font-semibold text-foreground">
            {DB_IDS.map((id) => <option key={id} value={id}>{DBS[id].name}</option>)}
          </select>
        </label>
        <button className="rounded-md border border-[#1f9c7a] bg-[#1f9c7a] px-3 py-1.5 text-xs font-bold text-white hover:brightness-110 disabled:opacity-50" onClick={() => void run()} disabled={!ready}>▶ Rodar</button>
        <button className={btn} onClick={explainPlan} disabled={!ready} title="Mostra COMO o banco vai executar a consulta">⚙ Plano de execução</button>
        <button className={btn} onClick={() => void reset()} disabled={!ready} title="Volta o banco ao estado original">↺ Reiniciar banco</button>
        <button className={btn} onClick={downloadCsv} disabled={!sets?.length}>⬇ CSV</button>
        <span className="ml-auto hidden text-xs text-muted md:block">SQLite rodando no seu navegador · alterações ficam até reiniciar</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* esquema */}
        <aside className="max-h-40 shrink-0 overflow-auto border-b border-border bg-surface p-3 text-xs lg:max-h-none lg:w-64 lg:border-b-0 lg:border-r">
          <p className="mb-1 font-semibold text-foreground">{DBS[db].name}</p>
          <p className="mb-3 text-muted">{DBS[db].desc}</p>
          {!ready && !err && <p className="text-muted">Carregando o motor SQL…</p>}
          {tables.map((t) => (
            <details key={t.name} className="mb-2 rounded-lg border border-border bg-background" open={tables.length <= 4}>
              <summary className="cursor-pointer px-2.5 py-1.5 font-mono font-bold text-foreground">{t.name} <span className="font-normal text-muted">({t.rows})</span></summary>
              <ul className="border-t border-border px-2.5 py-1.5 font-mono">
                {t.cols.map((c) => (
                  <li key={c.name} className="flex justify-between gap-2">
                    <button className="text-left text-foreground hover:text-css" onClick={() => setQuery((q) => q + (q.endsWith("\n") || !q ? "" : " ") + c.name)} title="Inserir no editor">{c.pk ? "🔑 " : ""}{c.name}</button>
                    <span className="text-muted">{c.type.toLowerCase()}</span>
                  </li>
                ))}
                <li className="mt-1 border-t border-border pt-1"><button className="text-css hover:underline" onClick={() => setQuery(`SELECT * FROM ${t.name} LIMIT 10;`)}>ver 10 linhas →</button></li>
              </ul>
            </details>
          ))}
        </aside>

        {/* centro */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          {ex && (
            <div className="border-b border-border bg-surface px-4 py-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${LEVEL_DOT[ex.level]}`} />
                <b className="text-foreground">{ex.title}</b>
                <span className="text-xs text-muted">{ex.level}</span>
                <button className="ml-auto text-xs text-muted hover:text-foreground" onClick={() => { setEx(null); setVerdict(null); }}>fechar exercício ✕</button>
              </div>
              <p className="mt-1 text-foreground">{ex.text}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button className="rounded-md bg-foreground px-3 py-1.5 text-xs font-bold text-background" onClick={() => void check()}>✓ Verificar resposta</button>
                <button className={btn} onClick={() => setShowHint((v) => !v)}>💡 Dica</button>
                <button className={btn} onClick={() => { if (showSol || confirm("Ver a solução agora? Tente mais um pouco antes, é assim que se aprende.")) setShowSol((v) => !v); }}>👁 Solução</button>
              </div>
              {showHint && <p className="mt-2 rounded-md bg-amber-500/10 p-2 text-xs text-foreground">{ex.hint}</p>}
              {showSol && <pre className="mt-2 overflow-x-auto rounded-md bg-[#0e1013] p-2 font-mono text-xs text-[#e8eaec]">{ex.solution}</pre>}
              {verdict && <p className={`mt-2 rounded-md p-2 text-xs font-semibold ${verdict.ok ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/10 text-red-300"}`} role="status">{verdict.ok ? "✅ " : "❌ "}{verdict.msg}</p>}
            </div>
          )}

          <div className="h-44 shrink-0 border-b border-black/40 bg-[#282c34] sm:h-52">
            <Editor lang="sql" value={query} onChange={setQuery} onRun={() => void run()} visible />
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-3" aria-live="polite">
            {err && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm">
                <p className="font-mono text-red-400">{err}</p>
                {hint && <p className="mt-2 text-foreground">💡 {hint}</p>}
              </div>
            )}
            {sets && sets.length > 0 && (
              <>
                <SqlResults sets={sets} />
                {ms !== null && <p className="mt-2 text-[11px] text-muted">{ms} ms</p>}
              </>
            )}
            {sets && sets.length === 0 && !err && <p className="text-sm text-muted">✔ Executado. Este comando altera o banco e não devolve linhas. Rode um SELECT para ver o efeito (o esquema à esquerda já foi atualizado).</p>}
            {!sets && !err && <p className="text-sm text-muted">O resultado aparece aqui. Comece por uma aula ou exercício abaixo, ou escreva sua própria consulta.</p>}
          </div>
        </main>

        {/* aulas / exercícios / histórico */}
        <aside className="max-h-56 shrink-0 overflow-auto border-t border-border bg-surface lg:max-h-none lg:w-80 lg:border-l lg:border-t-0">
          <div className="sticky top-0 flex border-b border-border bg-surface">
            {(["aulas", "exercicios", "historico"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-xs font-semibold ${tab === t ? "bg-surface-muted text-foreground" : "text-muted"}`}>
                {t === "aulas" ? "Aulas" : t === "exercicios" ? `Exercícios ${solved.length}/${SQL_EXERCISES.length}` : "Histórico"}
              </button>
            ))}
          </div>
          <div className="p-2.5 text-xs">
            {tab === "aulas" && (
              <ul className="grid gap-1">
                {SQL_LESSONS.map((l) => (
                  <li key={l.slug}>
                    <button onClick={() => void loadLesson(l.slug)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-foreground hover:bg-surface-muted">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${LEVEL_DOT[l.level]}`} />{l.title}
                    </button>
                  </li>
                ))}
                <li className="mt-2 px-2 text-muted">Cada aula carrega uma consulta comentada no editor. Mude, rode e veja o que acontece.</li>
              </ul>
            )}
            {tab === "exercicios" && grouped.map((g) => (
              <div key={g.l} className="mb-3">
                <p className="mb-1 px-2 font-semibold uppercase tracking-wide text-muted"><span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${LEVEL_DOT[g.l]}`} />{g.l}</p>
                {g.items.map((e) => (
                  // eslint-disable-next-line react-hooks/refs -- falso positivo: openExercise só lê refs dentro do clique, nunca durante a renderização
                  <button key={e.id} onClick={() => void openExercise(e)} className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-surface-muted ${ex?.id === e.id ? "bg-surface-muted" : ""}`}>
                    <span className="w-4 shrink-0">{solved.includes(e.id) ? "✅" : "○"}</span>
                    <span className="flex-1 text-foreground">{e.title}</span>
                    <span className="text-muted">{DBS[e.db].name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            ))}
            {tab === "historico" && (history.length === 0 ? <p className="px-2 text-muted">Suas consultas aparecem aqui.</p> : (
              <ul className="grid gap-1">
                {history.map((h, i) => (
                  <li key={i}>
                    <button onClick={async () => { if (h.db !== db) await changeDb(h.db); setQuery(h.q); }} className="w-full rounded-md border border-border px-2 py-1.5 text-left font-mono text-[11px] text-foreground hover:border-muted">
                      <span className={h.ok ? "text-emerald-400" : "text-red-400"}>{h.ok ? "✓" : "✕"}</span> {h.q.replace(/--.*\n?/g, "").trim().slice(0, 90)}
                    </button>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </aside>
      </div>
      {toast && <div role="status" className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-lg">{toast}</div>}
    </div>
  );
}
