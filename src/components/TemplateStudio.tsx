"use client";

import { useState, type ReactNode } from "react";
import Live from "@/components/Live";
import OpenInLab from "@/components/OpenInLab";
import DownloadButton from "@/components/DownloadButton";

type Variant = { id: string; name: string; doc: string };

/** Escolhe o estilo visual: o preview e o código mudam juntos. */
export default function TemplateStudio({ slug, variants, blocks }: { slug: string; variants: Variant[]; blocks: Record<string, ReactNode> }) {
  const [id, setId] = useState(variants[0].id);
  const cur = variants.find((v) => v.id === id) ?? variants[0];

  return (
    <div>
      {variants.length > 1 && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-semibold text-foreground">Estilo visual</p>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Estilos">
            {variants.map((v) => (
              <button
                key={v.id}
                role="tab"
                aria-selected={v.id === id}
                onClick={() => setId(v.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${v.id === id ? "border-foreground bg-foreground text-background" : "border-border text-muted hover:text-foreground"}`}
              >
                {v.name}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">Cada estilo troca só o bloco <code className="font-mono">:root</code> (cores, bordas e fontes). O layout é o mesmo.</p>
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <DownloadButton code={cur.doc} filename={`${slug}-${cur.id}.html`} />
        <OpenInLab payload={{ doc: cur.doc }} label="Editar no Lab" className="rounded-lg border border-border px-3.5 py-2 text-sm font-semibold text-foreground hover:border-muted" />
      </div>

      <p className="mb-2 text-sm font-semibold text-foreground">Preview ao vivo</p>
      <Live doc={cur.doc} height={640} lab={false} />

      <p className="mb-2 mt-8 text-sm font-semibold text-foreground">Código completo (um único arquivo .html)</p>
      {blocks[cur.id]}
    </div>
  );
}
