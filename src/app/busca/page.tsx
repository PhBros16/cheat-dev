import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResults from "@/components/SearchResults";

export const metadata: Metadata = { title: "Busca", robots: { index: false } };

export default function BuscaPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-4xl">
        <Suspense fallback={<p className="text-muted">Carregando…</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
