import { SiteTemplate, SiteTheme } from "@/lib/types";

const v = (o: Record<string, string>) => Object.entries(o).map(([k, x]) => `--${k}:${x}`).join(";");
const SANS = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

/** Paletas/estilos reutilizáveis: todos os templates novos usam só estas variáveis. */
export const THEME_LIB: Record<string, SiteTheme> = {
  claro: { id: "claro", name: "Claro", vars: v({ bg: "#ffffff", surface: "#f4f6f9", text: "#14171a", muted: "#5b6470", brand: "#2f6fed", brand2: "#7c3aed", on: "#ffffff", radius: "14px", font: SANS, head: SANS }) },
  escuro: { id: "escuro", name: "Escuro", vars: v({ bg: "#0e1013", surface: "#171a1f", text: "#e8eaec", muted: "#9aa3ad", brand: "#6b9bff", brand2: "#a78bfa", on: "#0b1020", radius: "14px", font: SANS, head: SANS }) },
  vibrante: { id: "vibrante", name: "Vibrante", vars: v({ bg: "#fff8f0", surface: "#ffffff", text: "#2b1b14", muted: "#7a6558", brand: "#ff5a36", brand2: "#ffb400", on: "#ffffff", radius: "22px", font: SANS, head: SANS }) },
  natureza: { id: "natureza", name: "Natureza", vars: v({ bg: "#f3f7f2", surface: "#ffffff", text: "#1c2b21", muted: "#59705f", brand: "#2f7d4f", brand2: "#c9a227", on: "#ffffff", radius: "12px", font: SANS, head: SERIF }) },
  minimal: { id: "minimal", name: "Minimalista (P&B)", vars: v({ bg: "#ffffff", surface: "#f5f5f5", text: "#000000", muted: "#666666", brand: "#000000", brand2: "#444444", on: "#ffffff", radius: "0px", font: "Helvetica,Arial,sans-serif", head: "Helvetica,Arial,sans-serif" }) },
  pastel: { id: "pastel", name: "Pastel", vars: v({ bg: "#fdf6ff", surface: "#ffffff", text: "#3b2a4a", muted: "#7d6b8c", brand: "#a78bfa", brand2: "#f9a8d4", on: "#ffffff", radius: "28px", font: SANS, head: SANS }) },
  editorial: { id: "editorial", name: "Editorial (serifa)", vars: v({ bg: "#faf7f2", surface: "#ffffff", text: "#1b1b1b", muted: "#6b6459", brand: "#b3261e", brand2: "#1b1b1b", on: "#ffffff", radius: "4px", font: SERIF, head: SERIF }) },
  neon: { id: "neon", name: "Neon (dark)", vars: v({ bg: "#07070d", surface: "#12121c", text: "#f2f2ff", muted: "#9a9ab8", brand: "#22d3ee", brand2: "#e879f9", on: "#06060c", radius: "10px", font: SANS, head: SANS }) },
};

const BASE = `*{box-sizing:border-box;margin:0}body{font-family:var(--font);background:var(--bg);color:var(--text);line-height:1.6}a{color:inherit;text-decoration:none}img{max-width:100%;display:block}h1,h2,h3,h4{font-family:var(--head);line-height:1.15;text-wrap:balance}.wrap{width:min(100% - 2rem,1100px);margin-inline:auto}section{padding:clamp(2.5rem,6vw,4.5rem) 0}.muted{color:var(--muted)}.card{background:var(--surface);border-radius:var(--radius);padding:1.25rem}.btn{display:inline-block;padding:.75em 1.4em;border-radius:var(--radius);background:var(--brand);color:var(--on);font-weight:700;border:0;cursor:pointer;font:inherit;font-weight:700;transition:transform .15s,filter .15s}.btn:hover{filter:brightness(1.1);transform:translateY(-1px)}.btn.ghost{background:transparent;color:var(--text);border:1.5px solid color-mix(in srgb,var(--text) 25%,transparent)}.tag{display:inline-block;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--brand)}.ph{background:linear-gradient(135deg,var(--brand),var(--brand2));border-radius:var(--radius)}:focus-visible{outline:3px solid color-mix(in srgb,var(--brand) 60%,transparent);outline-offset:3px}@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}`;

type Opts = { slug: string; title: string; description: string; tags: string[]; category: string; themes: string[]; css: string; body: string; js?: string };

export function T(o: Opts): SiteTemplate {
  const themes = o.themes.map((id) => THEME_LIB[id]);
  return {
    slug: o.slug, title: o.title, description: o.description, tags: o.tags, category: o.category, themes,
    code: `<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${o.title}</title>\n<style>\n:root{${themes[0].vars}}\n${BASE}\n${o.css}\n</style>\n</head>\n<body>\n${o.body}${o.js ? `\n<script>\n${o.js}\n</script>` : ""}\n</body>\n</html>`,
  };
}

/** Troca o bloco :root do código pelo do estilo escolhido. */
export function applyTheme(code: string, theme?: SiteTheme) {
  return theme ? code.replace(/:root\s*\{[^}]*\}/, () => `:root{${theme.vars}}`) : code;
}
