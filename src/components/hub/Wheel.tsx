"use client";

import { useRef, useState } from "react";
import { LANG_META, type Lang } from "@/content/challenges";

const SECTORS: Lang[] = ["html", "css", "js", "sql"];
const R = 130;

function sector(i: number) {
  const a0 = (i * 90 - 90) * (Math.PI / 180), a1 = ((i + 1) * 90 - 90) * (Math.PI / 180);
  const p = (a: number) => `${150 + R * Math.cos(a)} ${150 + R * Math.sin(a)}`;
  return `M150 150 L${p(a0)} A${R} ${R} 0 0 1 ${p(a1)} Z`;
}

/** Roleta: gira e sorteia a linguagem do próximo desafio. */
export default function Wheel({ onResult, disabled }: { onResult: (lang: Lang) => void; disabled?: boolean }) {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function spin() {
    if (spinning || disabled) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = rot + 360 * (reduce ? 1 : 6) + Math.random() * 360;
    setSpinning(true);
    setRot(next);
    timer.current = setTimeout(() => {
      const under = (360 - (next % 360)) % 360; // ângulo original que está sob o ponteiro (topo)
      setSpinning(false);
      onResult(SECTORS[Math.floor(under / 90)]);
    }, reduce ? 50 : 4300);
  }

  return (
    <div className="relative mx-auto w-full max-w-[300px] select-none">
      <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 text-3xl leading-none text-foreground drop-shadow" aria-hidden>▼</div>
      <svg viewBox="0 0 300 300" className="w-full" role="img" aria-label="Roleta de linguagens: HTML, CSS, JavaScript e SQL">
        <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: "150px 150px", transition: spinning ? "transform 4.2s cubic-bezier(.12,.7,.1,1)" : "none" }}>
          {SECTORS.map((l, i) => (
            <g key={l}>
              <path d={sector(i)} fill={LANG_META[l].color} stroke="#0e1013" strokeWidth="3" />
              <text x={150 + 82 * Math.cos((i * 90 + 45 - 90) * (Math.PI / 180))} y={150 + 82 * Math.sin((i * 90 + 45 - 90) * (Math.PI / 180))} textAnchor="middle" dominantBaseline="middle" fontSize="19" fontWeight="800" fill="#fff"
                transform={`rotate(${i * 90 + 45}, ${150 + 82 * Math.cos((i * 90 + 45 - 90) * (Math.PI / 180))}, ${150 + 82 * Math.sin((i * 90 + 45 - 90) * (Math.PI / 180))})`}>
                {LANG_META[l].label === "JavaScript" ? "JS" : LANG_META[l].label}
              </text>
            </g>
          ))}
        </g>
        <circle cx="150" cy="150" r="30" fill="#0e1013" stroke="#fff" strokeWidth="3" />
        <text x="150" y="151" textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="800" fill="#fff">SORTEAR</text>
      </svg>
      <button onClick={spin} disabled={spinning || disabled} className="absolute left-1/2 top-[150px] h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-label="Girar a roleta" tabIndex={-1} />
      <button onClick={spin} disabled={spinning || disabled} className="mt-3 w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-60">{spinning ? "Girando…" : "🎲 Girar a roleta"}</button>
    </div>
  );
}
