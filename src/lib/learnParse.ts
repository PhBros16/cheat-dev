/** Interpretador do texto das mini-aulas (puro, testável): `código`, **negrito** (que pode conter `código`) e texto. */
export type Tok = { k: "text" | "code" | "b"; s: string; c?: Tok[] };

const RE = /(`[^`]+`|\*\*(?:[^*`]|`[^`]*`)+\*\*)/g;

export function parseInline(text: string): Tok[] {
  const out: Tok[] = [];
  for (const part of text.split(RE)) {
    if (!part) continue;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 1) out.push({ k: "code", s: part.slice(1, -1) });
    else if (part.startsWith("**") && part.endsWith("**") && part.length > 4) out.push({ k: "b", s: part.slice(2, -2), c: parseInline(part.slice(2, -2)) });
    else out.push({ k: "text", s: part });
  }
  return out;
}

/** Divide a mini-aula em blocos: parágrafos (texto) e blocos de código cercados por ```. */
export type Block = { k: "p"; s: string } | { k: "pre"; s: string };
export function parseBlocks(text: string): Block[] {
  const parts = text.split(/```(?:\w+)?\n([\s\S]*?)```/g); // índices ímpares = código
  const out: Block[] = [];
  parts.forEach((b, i) => {
    if (i % 2 === 1) out.push({ k: "pre", s: b.replace(/\n$/, "") });
    else for (const p of b.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean)) out.push({ k: "p", s: p });
  });
  return out;
}
