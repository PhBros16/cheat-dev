/** Backup dos dados do usuário (que vivem só no navegador): exportar/importar um arquivo JSON. */
export const BACKUP_APP = "cheat-dev";
export const BACKUP_VERSION = 1;
const PREFIX = "cheatdev:";
/** Chaves temporárias (ponte entre abas e estado de execução): nunca entram no backup. */
const SKIP = new Set(["cheatdev:lab:running", "cheatdev:lab:inbox", "cheatdev:sqllab:inbox"]);
const MAX_BYTES = 5 * 1024 * 1024;

export type Backup = { app: string; version: number; exportedAt: string; data: Record<string, string> };

const isUserKey = (k: string) => (k.startsWith(PREFIX) && !SKIP.has(k)) || k === "theme";

export function buildBackup(storage: Pick<Storage, "length" | "key" | "getItem">, now = new Date()): Backup {
  const data: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k && isUserKey(k)) { const v = storage.getItem(k); if (v !== null) data[k] = v; }
  }
  return { app: BACKUP_APP, version: BACKUP_VERSION, exportedAt: now.toISOString(), data };
}

export type ImportResult = { ok: true; keys: number } | { ok: false; error: string };

/** Valida o arquivo e devolve o que será gravado. Nada é gravado aqui. */
export function parseBackup(text: string): { ok: true; data: Record<string, string> } | { ok: false; error: string } {
  if (text.length > MAX_BYTES) return { ok: false, error: "O arquivo é grande demais para ser um backup do cheat/dev." };
  let j: unknown;
  try { j = JSON.parse(text); } catch { return { ok: false, error: "Esse arquivo não é um JSON válido." }; }
  const o = j as Partial<Backup> | null;
  if (!o || typeof o !== "object" || o.app !== BACKUP_APP) return { ok: false, error: "Esse arquivo não parece ser um backup do cheat/dev." };
  if (typeof o.version !== "number" || o.version > BACKUP_VERSION) return { ok: false, error: "Backup de uma versão mais nova que esta página entende. Atualize o site e tente de novo." };
  if (!o.data || typeof o.data !== "object" || Array.isArray(o.data)) return { ok: false, error: "O backup está sem dados." };
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(o.data)) if (isUserKey(k) && typeof v === "string") data[k] = v;
  if (!Object.keys(data).length) return { ok: false, error: "O backup não tem nenhum dado do cheat/dev para restaurar." };
  return { ok: true, data };
}

export function applyBackup(text: string, storage: Pick<Storage, "setItem">): ImportResult {
  const r = parseBackup(text);
  if (!r.ok) return r;
  try { for (const [k, v] of Object.entries(r.data)) storage.setItem(k, v); } catch { return { ok: false, error: "Não foi possível gravar (sem espaço ou armazenamento bloqueado)." }; }
  return { ok: true, keys: Object.keys(r.data).length };
}

export const backupFileName = (d = new Date()) => `cheat-dev-backup-${d.toLocaleDateString("sv-SE")}.json`;
