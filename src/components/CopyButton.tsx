"use client";

import { useState } from "react";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard indisponível — silenciosamente ignora
    }
  }

  return (
    <button
      onClick={handleCopy}
      type="button"
      className="absolute right-2.5 top-2.5 rounded-md border border-border bg-surface/80 px-2 py-1 text-xs font-medium text-muted backdrop-blur transition-colors hover:text-foreground"
      aria-label="Copiar código"
    >
      {copied ? "Copiado ✓" : "Copiar"}
    </button>
  );
}
