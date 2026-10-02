export type Device = { id: string; name: string; w: number; h: number; group: "Celular" | "Tablet" | "Computador" };

export const DEVICES: Device[] = [
  { id: "fold", name: "Galaxy Fold (fechado)", w: 280, h: 653, group: "Celular" },
  { id: "galaxy-s24", name: "Galaxy S24", w: 360, h: 780, group: "Celular" },
  { id: "iphone-se", name: "iPhone SE", w: 375, h: 667, group: "Celular" },
  { id: "iphone-15", name: "iPhone 15", w: 393, h: 852, group: "Celular" },
  { id: "pixel-8", name: "Pixel 8", w: 412, h: 915, group: "Celular" },
  { id: "iphone-max", name: "iPhone 15 Pro Max", w: 430, h: 932, group: "Celular" },
  { id: "fold-open", name: "Galaxy Fold (aberto)", w: 673, h: 841, group: "Celular" },
  { id: "ipad-mini", name: "iPad Mini", w: 768, h: 1024, group: "Tablet" },
  { id: "ipad-air", name: "iPad Air", w: 820, h: 1180, group: "Tablet" },
  { id: "ipad-pro", name: "iPad Pro 11\"", w: 834, h: 1194, group: "Tablet" },
  { id: "surface", name: "Surface Pro", w: 912, h: 1368, group: "Tablet" },
  { id: "ipad-pro-129", name: "iPad Pro 12,9\"", w: 1024, h: 1366, group: "Tablet" },
  { id: "laptop", name: "Notebook", w: 1280, h: 720, group: "Computador" },
  { id: "desktop", name: "Desktop / MacBook", w: 1440, h: 900, group: "Computador" },
  { id: "fullhd", name: "Full HD", w: 1920, h: 1080, group: "Computador" },
  { id: "qhd", name: "2K (QHD)", w: 2560, h: 1440, group: "Computador" },
  { id: "ultrawide", name: "Ultrawide 21:9", w: 2560, h: 1080, group: "Computador" },
];

export const DEFAULT_MULTI = ["iphone-se", "ipad-mini", "desktop"];

/** Larguras de breakpoint mais usadas (Tailwind/Bootstrap) para troca rápida. */
export const BREAKPOINT_CHIPS = [320, 375, 480, 640, 768, 1024, 1280, 1536];

/** Proporções (altura = largura × fator). */
export const RATIOS: { id: string; name: string; f: number }[] = [
  { id: "16-9", name: "16:9 (paisagem)", f: 9 / 16 },
  { id: "4-3", name: "4:3", f: 3 / 4 },
  { id: "1-1", name: "1:1 (quadrado)", f: 1 },
  { id: "3-4", name: "3:4 (retrato)", f: 4 / 3 },
  { id: "9-16", name: "9:16 (story/celular)", f: 16 / 9 },
  { id: "21-9", name: "21:9 (ultrawide)", f: 9 / 21 },
];

/** Nome do breakpoint (escala usada por Tailwind/Bootstrap) para a largura atual. */
export function breakpointOf(w: number) {
  if (w < 640) return "base (< 640px)";
  if (w < 768) return "sm (≥ 640px)";
  if (w < 1024) return "md (≥ 768px)";
  if (w < 1280) return "lg (≥ 1024px)";
  if (w < 1536) return "xl (≥ 1280px)";
  return "2xl (≥ 1536px)";
}
