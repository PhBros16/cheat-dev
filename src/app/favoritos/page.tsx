import type { Metadata } from "next";
import FavoritesBrowser from "@/components/FavoritesBrowser";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Seus comandos favoritos, organizados por linguagem.",
  robots: { index: false },
};

export default function FavoritosPage() {
  return (
    <div className="px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">★ Favoritos</h1>
        <p className="mt-3 text-lg text-muted">
          Os comandos que você marcou, agrupados por linguagem. Ficam salvos neste navegador.
        </p>
      </div>
      <div className="mt-8 max-w-5xl">
        <FavoritesBrowser />
      </div>
    </div>
  );
}
