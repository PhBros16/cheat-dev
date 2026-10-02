"use client";

import { useEffect, useRef, useState } from "react";
import Live from "@/components/Live";

/** Só monta o iframe quando o card chega perto da tela (centenas de previews pesariam na página). */
export default function LazyPreview({ doc, height = 220 }: { doc: string; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { setOn(true); io.disconnect(); } }, { rootMargin: "240px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} style={{ minHeight: height }}>{on && <Live doc={doc} height={height} lab={false} />}</div>;
}
