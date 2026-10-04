/* Camada única para os dois motores do SQL Lab: SQLite (sql.js) e PostgreSQL (PGlite). */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { explainError, getSqlJs, type ResultSet } from "@/lib/sqljs";
import { DBS, type DbId } from "@/lib/sqlDbs";
import { pgScript } from "@/lib/pgScripts";

export type Engine = "sqlite" | "pg";
export type Table = { name: string; cols: { name: string; type: string; pk: boolean }[]; rows: number };
export interface Conn { run(sql: string): Promise<ResultSet[]>; schema(): Promise<Table[]>; close(): void }

export const ENGINES: { id: Engine; label: string; short: string }[] = [
  { id: "sqlite", label: "SQLite", short: "SQLite" },
  { id: "pg", label: "PostgreSQL (= Supabase)", short: "PostgreSQL" },
];

/* ---------------- PGlite ---------------- */
let pgLib: Promise<any> | null = null;
function getPglite() {
  if (!pgLib) {
    const url = "/pglite/index.js";
    pgLib = import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url).catch(() => {
      pgLib = null;
      throw new Error("Não foi possível carregar o motor PostgreSQL (cerca de 4 MB). Verifique sua conexão e recarregue a página.");
    });
  }
  return pgLib;
}

const pad = (n: number) => String(n).padStart(2, "0");
function cell(v: unknown): string | number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "bigint") return Number(v);
  if (v instanceof Date) {
    const d = `${v.getUTCFullYear()}-${pad(v.getUTCMonth() + 1)}-${pad(v.getUTCDate())}`;
    return v.getUTCHours() + v.getUTCMinutes() + v.getUTCSeconds() === 0 ? d : `${d} ${pad(v.getUTCHours())}:${pad(v.getUTCMinutes())}:${pad(v.getUTCSeconds())}`;
  }
  if (typeof v === "object") return JSON.stringify(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  return v as string | number;
}

async function openPg(id: DbId): Promise<Conn> {
  const { PGlite } = await getPglite();
  const db = new PGlite();
  await db.waitReady;
  await db.exec(pgScript(id));
  return {
    async run(sql) {
      const res = await db.exec(sql, { rowMode: "array" });
      return res.filter((r: any) => r.fields?.length).map((r: any) => ({ columns: r.fields.map((f: any) => f.name), values: r.rows.map((row: unknown[]) => row.map(cell)) }));
    },
    async schema() {
      const cols = (await db.query("SELECT table_name, column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' ORDER BY table_name, ordinal_position")).rows as any[];
      const pks = new Set(((await db.query("SELECT kcu.table_name AS t, kcu.column_name AS c FROM information_schema.table_constraints tc JOIN information_schema.key_column_usage kcu ON kcu.constraint_name = tc.constraint_name AND kcu.table_schema = tc.table_schema WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public'")).rows as any[]).map((r) => `${r.t}.${r.c}`));
      const names = [...new Set(cols.map((c) => c.table_name as string))];
      const out: Table[] = [];
      for (const n of names) {
        let rows = 0;
        try { rows = Number(((await db.query(`SELECT COUNT(*)::int AS n FROM "${n}"`)).rows as any[])[0].n); } catch {}
        out.push({ name: n, rows, cols: cols.filter((c) => c.table_name === n).map((c) => ({ name: c.column_name, type: c.data_type, pk: pks.has(`${n}.${c.column_name}`) })) });
      }
      return out;
    },
    close() { void db.close(); },
  };
}

/* ---------------- SQLite ---------------- */
async function openSqlite(id: DbId): Promise<Conn> {
  const S = await getSqlJs();
  const d = new S.Database();
  d.exec(DBS[id].script);
  return {
    async run(sql) { return d.exec(sql) as ResultSet[]; },
    async schema() {
      const names = (d.exec("SELECT name FROM sqlite_master WHERE type IN ('table','view') AND name NOT LIKE 'sqlite_%' ORDER BY type, name")[0]?.values ?? []).map((v: unknown[]) => String(v[0]));
      return names.map((n: string) => {
        const info = d.exec(`PRAGMA table_info("${n}")`)[0]?.values ?? [];
        let rows = 0;
        try { rows = Number(d.exec(`SELECT COUNT(*) FROM "${n}"`)[0].values[0][0]); } catch {}
        return { name: n, rows, cols: info.map((c: unknown[]) => ({ name: String(c[1]), type: String(c[2]).toLowerCase(), pk: Number(c[5]) > 0 })) };
      });
    },
    close() { d.close(); },
  };
}

export function openConn(engine: Engine, id: DbId): Promise<Conn> {
  return engine === "pg" ? openPg(id) : openSqlite(id);
}

/** Dica em português para os erros mais comuns de cada motor. */
export function errHint(engine: Engine, msg: string): string {
  if (engine === "sqlite") return explainError(msg);
  const m = msg.toLowerCase();
  if (m.includes("must appear in the group by")) return "No Postgres, toda coluna do SELECT que não está dentro de uma função de agregação (SUM, COUNT...) precisa estar no GROUP BY. (O SQLite e o MySQL antigo aceitavam; o Postgres não.)";
  if (m.includes("does not exist") && m.includes("relation")) return "Essa tabela não existe neste banco. Veja a lista de tabelas ao lado; no Postgres, nomes com maiúsculas só funcionam entre aspas duplas.";
  if (m.includes("column") && m.includes("does not exist")) return "Essa coluna não existe na tabela. Confira o nome no esquema e o alias usado (c.nome, p.id).";
  if (m.includes("is ambiguous")) return "O nome existe em mais de uma tabela do comando. Diga de qual: use tabela.coluna ou um alias.";
  if (m.includes("syntax error")) return "Erro de sintaxe perto do trecho indicado: confira vírgulas, parênteses, aspas simples nos textos e a ordem das cláusulas.";
  if (m.includes("duplicate key")) return "Violação de UNIQUE/PRIMARY KEY: esse valor já existe em uma coluna que não aceita repetição.";
  if (m.includes("foreign key constraint")) return "Violação de chave estrangeira: o valor não existe na tabela referenciada, ou ainda há linhas que dependem dele (apague as filhas primeiro).";
  if (m.includes("null value in column")) return "Violação de NOT NULL: a coluna não aceita valor vazio. Se ela é uma chave automática, crie-a como SERIAL ou IDENTITY.";
  if (m.includes("check constraint")) return "Violação de CHECK: o valor não respeita a regra definida para a coluna.";
  if (m.includes("does not exist") && m.includes("function")) return "O Postgres não achou essa função para esses tipos. Provavelmente falta um CAST (ex.: valor::numeric) ou o nome da função é de outro banco (strftime e group_concat são do SQLite).";
  if (m.includes("invalid input syntax")) return "Tipo incompatível: o valor não pode ser convertido para o tipo da coluna (texto onde se espera número ou data).";
  if (m.includes("permission denied") || m.includes("row-level security")) return "O papel atual não tem permissão (ou a política de RLS barrou o comando). Verifique GRANT e as policies.";
  return "";
}
