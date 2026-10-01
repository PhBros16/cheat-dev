import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { languages, getLanguage, countEntries } from "@/lib/content";
import { langStyles } from "@/lib/langStyles";

export function generateStaticParams() {
  return languages.map((l) => ({ lang: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const language = getLanguage(lang);
  if (!language) return {};
  return {
    title: `${language.title} — referência rápida`,
    description: language.tagline,
  };
}

export default async function LanguagePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const language = getLanguage(lang);
  if (!language) notFound();

  const style = langStyles[language.slug];

  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <p className={`font-mono text-xs uppercase tracking-widest ${style.text}`}>
          {language.short}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
          {language.title}
        </h1>
        <p className="mt-3 text-lg text-muted">{language.tagline}</p>
        <p className="mt-1 text-sm text-muted">{countEntries(language)} comandos catalogados</p>
      </div>

      <div className="mt-10 flex max-w-3xl flex-col gap-8">
        {language.categories.map((category) => (
          <div key={category.slug}>
            <Link href={`/${language.slug}/${category.slug}`} className="group">
              <h2 className="font-display text-xl font-semibold text-foreground group-hover:underline">
                {category.title}
              </h2>
            </Link>
            <p className="mt-1 text-sm text-muted">{category.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {category.entries.slice(0, 12).map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/${language.slug}/${category.slug}/${entry.slug}`}
                  className={`rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground transition-colors ${style.hoverBorder}`}
                >
                  {entry.title}
                </Link>
              ))}
              {category.entries.length > 12 && (
                <Link href={`/${language.slug}/${category.slug}`} className="rounded-full px-3 py-1 text-xs font-medium text-muted hover:text-foreground">
                  +{category.entries.length - 12} comandos
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
