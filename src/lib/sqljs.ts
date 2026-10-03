/* Carrega o motor SQL (SQLite compilado para WebAssembly) uma única vez, sob demanda. */
/* eslint-disable @typescript-eslint/no-explicit-any */
let loading: Promise<any> | null = null;

export function getSqlJs(): Promise<any> {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const done = () => (window as any).initSqlJs({ locateFile: (f: string) => `/sqljs/${f}` }).then(resolve, reject);
    if ((window as any).initSqlJs) return done();
    const s = document.createElement("script");
    s.src = "/sqljs/sql-wasm.js";
    s.onload = done;
    s.onerror = () => { loading = null; reject(new Error("Não foi possível carregar o motor SQL. Verifique sua conexão e recarregue a página.")); };
    document.head.appendChild(s);
  });
  return loading;
}

export type ResultSet = { columns: string[]; values: (string | number | null | Uint8Array)[][] };

/** Traduz os erros mais comuns do SQLite para uma dica em português. */
export function explainError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("no such table")) return "Essa tabela não existe neste banco. Veja o esquema (lista de tabelas) e confira o nome. Se você a criou em outra execução, lembre que cada teste parte do banco original.";
  if (m.includes("no such column")) return "Essa coluna não existe na tabela. Confira o nome no esquema e se você usou o alias certo (ex.: c.nome em vez de nome).";
  if (m.includes("ambiguous column")) return "O nome da coluna existe em mais de uma tabela do JOIN. Diga de qual: use tabela.coluna ou um alias (c.id, p.id).";
  if (m.includes("syntax error")) return "Erro de sintaxe: confira vírgulas entre as colunas, parênteses fechados, aspas simples nos textos e a ordem das cláusulas (SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT).";
  if (m.includes("unique constraint")) return "Violação de UNIQUE/PRIMARY KEY: você tentou gravar um valor que já existe numa coluna que não aceita repetição.";
  if (m.includes("not null constraint")) return "Violação de NOT NULL: a coluna não aceita valor vazio (NULL).";
  if (m.includes("foreign key constraint")) return "Violação de chave estrangeira: o valor não existe na tabela referenciada (ou ainda há linhas que dependem dele).";
  if (m.includes("check constraint")) return "Violação de CHECK: o valor não respeita a regra definida para a coluna.";
  if (m.includes("incomplete input")) return "A consulta parece incompleta (falta um parêntese, uma aspa ou o fim do comando).";
  if (m.includes("misuse of aggregate") || m.includes("aggregate")) return "Funções de agregação (SUM, COUNT...) não podem ficar no WHERE. Use HAVING para filtrar o resultado agrupado.";
  if (m.includes("datatype mismatch")) return "Tipos incompatíveis: confira se está comparando/gravando o tipo certo (texto entre aspas, números sem aspas).";
  return "";
}
