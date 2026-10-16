"use client";

import { useRef, useState } from "react";
import type { Slice } from "@/lib/wheelPool";

const R = 130;
const rad = (deg: number) => (deg - 90) * (Math.PI / 180);
const pt = (a: number, r = R) => `${150 + r * Math.cos(a)} ${150 + r * Math.sin(a)}`;

/** Texto escuro sobre cores claras (amarelo do JS) e claro sobre as escuras. */
function textOn(hex: string) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#0e1013" : "#ffffff";
}

/** Roleta genérica de 2 a 12 fatias: gira e devolve a chave da fatia sorteada. */
export default function Wheel({ slices, onResult, disabled, ariaLabel }: { slices: Slice[]; onResult: (key: string) => void; disabled?: boolean; ariaLabel: string }) {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = slices.length;
  const step = 360 / n;
  const size = n <= 4 ? 19 : n <= 6 ? 15 : n <= 8 ? 12 : 10;

  function spin() {
    if (spinning || disabled || n < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = rot + 360 * (reduce ? 1 : 6) + Math.random() * 360;
    setSpinning(true);
    setRot(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const under = (360 - (next % 360)) % 360; // ângulo original que está sob o ponteiro (topo)
      setSpinning(false);
      onResult(slices[Math.min(n - 1, Math.floor(under / step))].key);
    }, reduce ? 50 : 4300);
  }

  return (
    <div className="relative mx-auto w-full max-w-[300px] select-none">
      <div className="absolute left-1/2 top-[-6px] z-10 -translate-x-1/2 text-3xl leading-none text-foreground drop-shadow" aria-hidden>▼</div>
      <svg viewBox="0 0 300 300" className="w-full" role="img" aria-label={ariaLabel}>
        <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: "150px 150px", transition: spinning ? "transform 4.2s cubic-bezier(.12,.7,.1,1)" : "none" }}>
          {slices.map((s, i) => {
            const a0 = rad(i * step), a1 = rad((i + 1) * step), mid = (i + 0.5) * step;
            const am = rad(mid), tx = 150 + R * 0.6 * Math.cos(am), ty = 150 + R * 0.6 * Math.sin(am);
            const flip = mid > 180 ? 180 : 0; // texto da metade esquerda não fica de cabeça para baixo
            const rot = mid - 90 + flip;
            const max = Math.max(4, Math.floor(96 / (size * 0.58)));
            const label = s.label.length > max ? s.label.slice(0, max - 1).trimEnd() + "…" : s.label;
            return (
              <g key={s.key}>
                <path d={n === 1 ? "" : `M150 150 L${pt(a0)} A${R} ${R} 0 ${step > 180 ? 1 : 0} 1 ${pt(a1)} Z`} fill={s.color} stroke="#0e1013" strokeWidth="3" />
                <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize={size} fontWeight="800" fill={textOn(s.color)} transform={`rotate(${rot}, ${tx}, ${ty})`}>{label}</text>
              </g>
            );
          })}
        </g>
        <circle cx="150" cy="150" r="30" fill="#0e1013" stroke="#fff" strokeWidth="3" />
        <text x="150" y="151" textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="800" fill="#fff">GIRAR</text>
      </svg>
      <button onClick={spin} disabled={spinning || disabled} className="absolute left-1/2 top-[150px] h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full" aria-label="Girar a roleta" tabIndex={-1} />
      <button onClick={spin} disabled={spinning || disabled} className="mt-3 w-full rounded-xl bg-foreground px-4 py-2.5 text-sm font-bold text-background hover:opacity-90 disabled:opacity-60">{spinning ? "Girando…" : "🎲 Girar a roleta"}</button>
    </div>
  );
}
