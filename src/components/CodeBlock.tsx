import { codeToHtml } from "shiki";
import CopyButton from "@/components/CopyButton";

export default async function CodeBlock({
  code,
  lang,
  caption,
}: {
  code: string;
  lang: string;
  caption?: string;
}) {
  const html = await codeToHtml(code, {
    lang,
    themes: { light: "github-light-high-contrast", dark: "github-dark" },
    // comentários do github-dark (#6a737d) ficam abaixo de 4.5:1 sobre o fundo do bloco
    colorReplacements: { "github-dark": { "#6a737d": "#8b949e" } },
    defaultColor: false,
  });

  return (
    <figure className="group relative overflow-hidden rounded-xl border border-border bg-code">
      <div
        className="[&>pre]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CopyButton code={code} />
      {caption && (
        <figcaption className="border-t border-border px-4 py-2 text-xs text-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
