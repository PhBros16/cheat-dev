import Link from "next/link";
import type { Metadata } from "next";
import { comparisons } from "@/content/comparisons";

export const metadata: Metadata = {
  title: "Comparativos",
  description: "let vs const, == vs ===, margin vs padding, INNER vs LEFT JOIN e outras diferenças lado a lado, com exemplos.",
};

const LANG: Record<string, { label: string; dot: string }> = {
  html: { label: "HTML", dot: "bg-html" },
  css: { label: "CSS", dot: "bg-css" },
  js: { label: "JavaScript", dot: "bg-js" },
  sql: { label: "SQL", dot: "bg-sql" },
};

export default function ComparativosPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Comparativos</h1>
        <p className="mt-3 text-lg text-muted">As dúvidas do tipo &ldquo;qual a diferença entre X e Y?&rdquo;, lado a lado, com um veredicto de quando usar cada um.</p>
      </div>
      <div className="mt-8 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
        {comparisons.map((c) => (
          <Link key={c.slug} href={`/comparativos/${c.slug}`} className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-5 hover:border-css">
            <span className="flex items-center gap-2 text-xs text-muted"><span className={`h-2 w-2 rounded-full ${LANG[c.lang].dot}`} />{LANG[c.lang].label}</span>
            <p className="font-display text-lg font-semibold text-foreground">{c.title}</p>
            <p className="text-sm text-muted">{c.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
