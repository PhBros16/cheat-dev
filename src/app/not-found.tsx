import Link from "next/link";
import SearchBox from "@/components/SearchBox";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-6xl font-bold text-html">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
        Essa página não existe — mas talvez o comando exista
      </h1>
      <p className="mt-2 text-muted">Tenta buscar pelo que você precisa:</p>
      <div className="mt-6 w-full max-w-lg">
        <SearchBox variant="hero" />
      </div>
      <Link href="/" className="mt-8 text-sm font-medium text-css-fg hover:underline">
        Voltar para a home
      </Link>
    </div>
  );
}
