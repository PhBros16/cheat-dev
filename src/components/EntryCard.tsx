import Link from "next/link";
import { LangSlug, SearchItem } from "@/lib/types";
import { langStyles } from "@/lib/langStyles";

type CardItem = Pick<SearchItem, "href" | "title" | "lang" | "langTitle" | "summary">;

export default function EntryCard({ item }: { item: CardItem }) {
  const style = langStyles[item.lang as LangSlug];
  return (
    <Link
      href={item.href}
      className={`group flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 transition-colors ${style.hoverBorder}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-sm font-semibold text-foreground">{item.title}</span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.bgSoft} ${style.text}`}>
          {item.langTitle}
        </span>
      </div>
      <p className="text-sm text-muted">{item.summary}</p>
    </Link>
  );
}
