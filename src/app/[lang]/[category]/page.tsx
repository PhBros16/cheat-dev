import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { languages, getCategory, entryHref } from "@/lib/content";
import { langStyles } from "@/lib/langStyles";

export function generateStaticParams() {
  return languages.flatMap((language) =>
    language.categories.map((category) => ({
      lang: language.slug,
      category: category.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}): Promise<Metadata> {
  const { lang, category } = await params;
  const found = getCategory(lang, category);
  if (!found) return {};
  return {
    title: `${found.category.title} · ${found.language.title}`,
    description: found.category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string }>;
}) {
  const { lang, category: categorySlug } = await params;
  const found = getCategory(lang, categorySlug);
  if (!found) notFound();
  const { language, category } = found;
  const style = langStyles[language.slug];

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href={`/${language.slug}`} className={`font-medium ${style.text}`}>
            {language.title}
          </Link>
          <span>/</span>
          <span>{category.title}</span>
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
          {category.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{category.description}</p>
      </div>

      <div className="mt-10 flex max-w-3xl flex-col divide-y divide-border rounded-xl border border-border bg-surface">
        {category.entries.map((entry) => (
          <Link
            key={entry.slug}
            href={entryHref(language.slug, category.slug, entry.slug)}
            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-muted"
          >
            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-semibold text-foreground">
                {entry.title}
              </p>
              <p className="mt-0.5 truncate text-sm text-muted">{entry.summary}</p>
            </div>
            <svg
              className={`h-4 w-4 shrink-0 ${style.text}`}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
