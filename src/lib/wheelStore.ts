import { DEFAULT_WHEEL, sanitizeCfg, type WheelCfg } from "@/lib/wheelPool";

const KEY = "cheatdev:hub:wheel:v1";
const subs = new Set<() => void>();
const EMPTY = JSON.stringify(DEFAULT_WHEEL);

export const wheelSnapshot = () => { try { return localStorage.getItem(KEY) ?? EMPTY; } catch { return EMPTY; } };
export const wheelServerSnapshot = () => EMPTY;
export const wheelSubscribe = (cb: () => void) => { subs.add(cb); window.addEventListener("storage", cb); return () => { subs.delete(cb); window.removeEventListener("storage", cb); }; };
export const parseWheel = (raw: string): WheelCfg => { try { return sanitizeCfg(JSON.parse(raw)); } catch { return sanitizeCfg(null); } };
export function saveWheel(cfg: WheelCfg) { try { localStorage.setItem(KEY, JSON.stringify(sanitizeCfg(cfg))); } catch {} subs.forEach((f) => f()); }
