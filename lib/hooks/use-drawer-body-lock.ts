"use client";

import { useEffect } from "react";

const VIEWPORT_LOCKED =
  "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";

/** Bloqueia scroll do body e zoom do viewport enquanto drawer/sheet está aberto. */
export function useDrawerBodyLock(open: boolean) {
  useEffect(() => {
    if (!open) return;

    const meta = document.querySelector('meta[name="viewport"]');
    const previousContent = meta?.getAttribute("content") ?? null;
    const previousOverflow = document.body.style.overflow;

    meta?.setAttribute("content", VIEWPORT_LOCKED);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      if (meta) {
        if (previousContent) meta.setAttribute("content", previousContent);
      }
    };
  }, [open]);
}
