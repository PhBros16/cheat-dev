"use client";

import { useRouter } from "next/navigation";

export default function OpenInSqlLab({ db, query }: { db: string; query: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        try { localStorage.setItem("cheatdev:sqllab:inbox", JSON.stringify({ db, query })); } catch {}
        router.push("/sql-lab");
      }}
      className="rounded-md border border-border px-2 py-1 text-xs font-semibold text-foreground hover:border-muted"
    >
      Abrir no SQL Lab ↗
    </button>
  );
}
