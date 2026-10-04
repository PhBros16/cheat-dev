// Copia os arquivos do PGlite (Postgres em WebAssembly) de node_modules para public/pglite,
// de onde o navegador os carrega sob demanda. A pasta de destino não é versionada (.gitignore).
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const src = "node_modules/@electric-sql/pglite/dist";
const dest = "public/pglite";
if (!existsSync(src)) { console.warn("[pglite] pacote não instalado; pulei a cópia."); process.exit(0); }
rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
let n = 0;
for (const f of readdirSync(src)) {
  if (/\.(map|cjs|d\.ts|d\.cts)$/.test(f) || statSync(join(src, f)).isDirectory()) continue;
  cpSync(join(src, f), join(dest, f)); n++;
}
console.log(`[pglite] ${n} arquivos copiados para ${dest}`);
