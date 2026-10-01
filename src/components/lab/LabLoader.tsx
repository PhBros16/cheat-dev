"use client";

import dynamic from "next/dynamic";

const Lab = dynamic(() => import("./Lab"), {
  ssr: false,
  loading: () => <div className="grid h-[60dvh] place-items-center text-muted">Carregando o Lab…</div>,
});

export default function LabLoader() {
  return <Lab />;
}
