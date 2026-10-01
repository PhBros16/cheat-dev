export type Device = { id: string; name: string; w: number; h: number; group: "Celular" | "Tablet" | "Computador" };

export const DEVICES: Device[] = [
  { id: "fold", name: "Galaxy Fold (fechado)", w: 280, h: 653, group: "Celular" },
  { id: "iphone-se", name: "iPhone SE", w: 375, h: 667, group: "Celular" },
  { id: "iphone-15", name: "iPhone 15", w: 393, h: 852, group: "Celular" },
  { id: "pixel-8", name: "Pixel 8", w: 412, h: 915, group: "Celular" },
  { id: "ipad-mini", name: "iPad Mini", w: 768, h: 1024, group: "Tablet" },
  { id: "ipad-pro", name: "iPad Pro 11\"", w: 834, h: 1194, group: "Tablet" },
  { id: "laptop", name: "Notebook", w: 1280, h: 720, group: "Computador" },
  { id: "desktop", name: "Desktop", w: 1440, h: 900, group: "Computador" },
  { id: "fullhd", name: "Full HD", w: 1920, h: 1080, group: "Computador" },
];

export const MULTI = [DEVICES[1], DEVICES[4], DEVICES[7]];

/** Nome do breakpoint (escala usada por Tailwind/Bootstrap) para a largura atual. */
export function breakpointOf(w: number) {
  if (w < 640) return "base (< 640px)";
  if (w < 768) return "sm (≥ 640px)";
  if (w < 1024) return "md (≥ 768px)";
  if (w < 1280) return "lg (≥ 1024px)";
  if (w < 1536) return "xl (≥ 1280px)";
  return "2xl (≥ 1536px)";
}
