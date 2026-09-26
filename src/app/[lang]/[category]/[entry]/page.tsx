import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { languages, getEntry, resolveRelated } from "@/lib/content";
import { langStyles } from "@/lib/langStyles";
import CodeBlock from "@/components/CodeBlock";

export function generateStaticParams() {
  return languages.flatMap((language) =>
    language.categories.flatMap((category) =>
      category.entries.map((entry) => ({
        lang: language.slug,
        category: category.slug,
        entry: entry.slug,
      }))
    )
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string; entry: string }>;
}): Promise<Metadata> {
  const { lang, category, entry: entrySlug } = await params;
  const found = getEntry(lang, category, entrySlug);
  if (!found) return {};
  return {
    title: found.entry.title,
    description: found.entry.summary,
  };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string; entry: string }>;
}) {
  const { lang, category: categorySlug, entry: entrySlug } = await params;
  const found = getEntry(lang, categorySlug, entrySlug);
  if (!found) notFound();
  const { language, category, entry } = found;
  const style = langStyles[language.slug];
  const related = resolveRelated(entry.related);

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href={`/${language.slug}`} className={`font-medium ${style.text}`}>
            {language.title}
          </Link>
          <span>/</span>
          <Link href={`/${language.slug}/${category.slug}`} className="hover:text-foreground">
            {category.title}
          </Link>
        </div>

        <h1 className="mt-3 font-mono text-3xl font-bold text-foreground sm:text-4xl">
          {entry.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{entry.summary}</p>

        {entry.syntax && (
          <div className="mt-6">
            <SectionLabel>Sintaxe</SectionLabel>
            <div className="mt-2">
              <CodeBlock code={entry.syntax} lang={language.codeLang} />
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3">
          {entry.description.map((paragraph, i) => (
            <p key={i} className="leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        {entry.examples.length > 0 && (
          <div className="mt-8">
            <SectionLabel>{entry.examples.length > 1 ? "Exemplos" : "Exemplo"}</SectionLabel>
            <div className="mt-2 flex flex-col gap-4">
              {entry.examples.map((example, i) => (
                <CodeBlock
                  key={i}
                  code={example.code}
                  lang={language.codeLang}
                  caption={example.caption}
                />
              ))}
            </div>
          </div>
        )}

        {((entry.useWhen && entry.useWhen.length > 0) ||
          (entry.avoidWhen && entry.avoidWhen.length > 0)) && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {entry.useWhen && entry.useWhen.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-foreground">Use quando</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted">
                  {entry.useWhen.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {entry.avoidWhen && entry.avoidWhen.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-foreground">Evite quando</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted">
                  {entry.avoidWhen.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-10">
            <SectionLabel>Relacionados</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:bg-surface-muted"
                >
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-foreground">{children}</p>;
}
