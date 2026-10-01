"use client";

import { useState } from "react";
import { htmlDoc } from "@/components/Playground";
import OpenInLab from "@/components/OpenInLab";

/** Preview de um documento HTML completo (snippets e templates). */
export default function Live({ doc, height = 320, editable = false }: { doc: string; height?: number; editable?: boolean }) {
  const [code, setCode] = useState(doc);
  return (
    <div className="grid gap-3">
      <div className="flex justify-end"><OpenInLab payload={{ doc: code }} label="Editar no Lab (HTML + CSS + JS)" /></div>
      {editable && (
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          aria-label="Código"
          className="h-64 w-full resize-y rounded-lg border border-border bg-surface-muted p-3 font-mono text-[13px] text-foreground outline-none"
        />
      )}
      <iframe
        title="Preview"
        sandbox="allow-scripts"
        srcDoc={/<html|<!doctype/i.test(code) ? code : htmlDoc(code)}
        style={{ height }}
        className="w-full rounded-lg border border-border bg-white"
      />
    </div>
  );
}
