"use client";

import dynamic from "next/dynamic";

const SqlLab = dynamic(() => import("./SqlLab"), {
  ssr: false,
  loading: () => <div className="grid h-[60dvh] place-items-center text-muted">Carregando o SQL Lab…</div>,
});

export default function SqlLabLoader() {
  return <SqlLab />;
}
