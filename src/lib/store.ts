"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { SearchItem } from "@/lib/types";

export type Saved = Pick<SearchItem, "href" | "title" | "lang" | "langTitle" | "summary">;

const KEYS = { fav: "cheatdev:favs", recent: "cheatdev:recent" } as const;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function read(key: string) {
  try {
    return localStorage.getItem(key) ?? "[]";
  } catch {
    return "[]";
  }
}

function write(key: string, list: Saved[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    /* storage indisponível */
  }
  notify();
}

export function useSaved(kind: keyof typeof KEYS): Saved[] {
  const raw = useSyncExternalStore(subscribe, () => read(KEYS[kind]), () => "[]");
  return useMemo(() => {
    try {
      return JSON.parse(raw) as Saved[];
    } catch {
      return [];
    }
  }, [raw]);
}

export function toggleFav(item: Saved) {
  const list = JSON.parse(read(KEYS.fav)) as Saved[];
  const has = list.some((i) => i.href === item.href);
  write(KEYS.fav, has ? list.filter((i) => i.href !== item.href) : [item, ...list]);
}

export function addRecent(item: Saved) {
  const list = (JSON.parse(read(KEYS.recent)) as Saved[]).filter((i) => i.href !== item.href);
  write(KEYS.recent, [item, ...list].slice(0, 8));
}

/* estado do menu lateral no mobile */
let navOpen = false;
const navListeners = new Set<() => void>();
export function setNavOpen(v: boolean) {
  if (navOpen === v) return;
  navOpen = v;
  navListeners.forEach((l) => l());
}
export function useNavOpen() {
  return useSyncExternalStore(
    (cb) => {
      navListeners.add(cb);
      return () => navListeners.delete(cb);
    },
    () => navOpen,
    () => false
  );
}
