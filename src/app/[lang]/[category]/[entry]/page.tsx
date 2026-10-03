import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { languages, getEntry, resolveRelated, entryHref } from "@/lib/content";
import { langStyles } from "@/lib/langStyles";
import CodeBlock from "@/components/CodeBlock";
import Playground from "@/components/Playground";
import SqlPlay from "@/components/SqlPlay";
import FavoriteButton from "@/components/FavoriteButton";
import TrackView from "@/components/TrackView";

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

type P = { params: Promise<{ lang: string; category: string; entry: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, category, entry: entrySlug } = await params;
  const found = getEntry(lang, category, entrySlug);
  if (!found) return {};
  return {
    title: found.entry.title,
    description: found.entry.summary,
  };
}

export default async function EntryPage({ params }: P) {
  const { lang, category: categorySlug, entry: entrySlug } = await params;
  const found = getEntry(lang, categorySlug, entrySlug);
  if (!found) notFound();
  const { language, category, entry } = found;
  const style = langStyles[language.slug];
  const related = resolveRelated(entry.related);
  const idx = category.entries.findIndex((e) => e.slug === entry.slug);
  const prev = category.entries[idx - 1];
  const next = category.entries[idx + 1];
  const saved = {
    href: entryHref(language.slug, category.slug, entry.slug),
    title: entry.title,
    lang: language.slug,
    langTitle: language.title,
    summary: entry.summary,
  };
  const playCode = entry.examples[0]?.code ?? "";

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <TrackView item={saved} />
      <div className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          <Link href={`/${language.slug}`} className={`font-medium ${style.text}`}>
            {language.title}
          </Link>
          <span>/</span>
          <Link href={`/${language.slug}/${category.slug}`} className="hover:text-foreground">
            {category.title}
          </Link>
        </div>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <h1 className="font-mono text-3xl font-bold text-foreground sm:text-4xl">{entry.title}</h1>
          <FavoriteButton item={saved} />
        </div>
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
                <CodeBlock key={i} code={example.code} lang={language.codeLang} caption={example.caption} />
              ))}
            </div>
          </div>
        )}

        {entry.sql && (
          <div className="mt-6">
            <SqlPlay db={entry.sql.db} query={entry.sql.query} />
          </div>
        )}

        {entry.play && entry.play !== "sql" && playCode && (
          <div className="mt-6">
            <Playground kind={entry.play} code={entry.demo?.css ?? playCode} mode={entry.demo?.mode} />
          </div>
        )}

        {((entry.useWhen && entry.useWhen.length > 0) || (entry.avoidWhen && entry.avoidWhen.length > 0)) && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {entry.useWhen && entry.useWhen.length > 0 && (
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-sm font-semibold text-foreground">Use quando</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-muted">
                  {entry.useWhen.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${style.dot}`} />
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
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
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
                <Link key={r.href} href={r.href} className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:bg-surface-muted">
                  {r.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {entry.keywords && entry.keywords.length > 0 && (
          <div className="mt-10">
            <SectionLabel>Você também pode procurar por</SectionLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              {entry.keywords.slice(0, 10).map((k) => (
                <Link key={k} href={`/busca?q=${encodeURIComponent(k)}`} className="rounded-full bg-surface-muted px-3 py-1 text-xs text-muted hover:text-foreground">
                  {k}
                </Link>
              ))}
            </div>
          </div>
        )}

        <nav aria-label="Anterior e próximo" className="mt-12 grid grid-cols-2 gap-3 border-t border-border pt-6">
          {prev ? (
            <Link href={entryHref(language.slug, category.slug, prev.slug)} className="rounded-xl border border-border p-3 hover:bg-surface-muted">
              <span className="text-xs text-muted">Anterior</span>
              <span className="block truncate font-mono text-sm text-foreground">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={entryHref(language.slug, category.slug, next.slug)} className="rounded-xl border border-border p-3 text-right hover:bg-surface-muted">
              <span className="text-xs text-muted">Próximo</span>
              <span className="block truncate font-mono text-sm text-foreground">{next.title}</span>
            </Link>
          ) : <span />}
        </nav>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-semibold text-foreground">{children}</p>;
}
