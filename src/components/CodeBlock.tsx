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
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });

  return (
    <figure className="group relative overflow-hidden rounded-xl border border-border bg-surface-muted">
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
