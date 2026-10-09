import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { comparisons, getComparison } from "@/content/comparisons";
import CodeBlock from "@/components/CodeBlock";

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }));
}

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const c = getComparison(slug);
  return c ? { title: c.title, description: c.summary } : {};
}

export default async function ComparisonPage({ params }: P) {
  const { slug } = await params;
  const c = getComparison(slug);
  if (!c) notFound();

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-4xl">
        <Link href="/comparativos" className="text-sm font-medium text-css-fg hover:underline">← Todos os comparativos</Link>
        <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">{c.title}</h1>
        <p className="mt-3 text-lg text-muted">{c.summary}</p>

        <div className="mt-8 overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-surface-muted">
              <tr>
                <th className="px-4 py-3 font-medium text-muted"> </th>
                {c.columns.map((col) => <th key={col} className="px-4 py-3 font-mono font-semibold text-foreground">{col}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {c.rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row" className="px-4 py-3 align-top font-medium text-muted">{r.label}</th>
                  {r.cells.map((cell, i) => <td key={i} className="px-4 py-3 align-top text-foreground/90">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-surface p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Veredicto</p>
          <p className="mt-2 leading-relaxed text-foreground">{c.verdict}</p>
        </div>

        <h2 className="mt-10 font-display text-xl font-semibold text-foreground">Exemplos</h2>
        <div className="mt-4 flex flex-col gap-5">
          {c.examples.map((e, i) => (
            <CodeBlock key={i} code={e.content} lang={e.lang} caption={e.caption} />
          ))}
        </div>
      </div>
    </div>
  );
}
