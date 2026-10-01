"use client";

import { useRouter } from "next/navigation";

type Payload = { doc: string } | { project: { html: string; css: string; js: string } };

/** Leva o código para o Lab (a entrega é feita via localStorage; o Lab lê e apaga). */
export default function OpenInLab({ payload, label = "Abrir no Lab", className }: { payload: Payload; label?: string; className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        try { localStorage.setItem("cheatdev:lab:inbox", JSON.stringify(payload)); } catch {}
        router.push("/lab");
      }}
      className={className ?? "rounded-md border border-border px-2 py-1 text-xs font-semibold text-foreground hover:border-muted"}
    >
      {label} ↗
    </button>
  );
}
