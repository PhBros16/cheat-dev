"use client";

import { useEffect } from "react";
import { addRecent, Saved } from "@/lib/store";

export default function TrackView({ item }: { item: Saved }) {
  useEffect(() => {
    addRecent(item);
  }, [item]);
  return null;
}
