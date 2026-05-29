"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const TABLET_VIEWPORT_MQ = "(max-width: 1366px)";

function resetPanelScroll(mainEl: HTMLElement | null) {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
  mainEl?.scrollTo({ top: 0, left: 0 });

  document.querySelectorAll(".admin-kpi-horizontal-strip").forEach((el) => {
    if (el instanceof HTMLElement) el.scrollLeft = 0;
  });

  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--app-vh", `${vh}px`);
  window.dispatchEvent(new Event("resize"));
}

/** Tablet (retrato e paisagem): ao trocar de página, reposiciona scroll e largura visível. */
export function useAdminPanelPageScrollReset(activeNav?: string) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!window.matchMedia(TABLET_VIEWPORT_MQ).matches) return;

    resetPanelScroll(mainRef.current);
    const t1 = window.setTimeout(() => resetPanelScroll(mainRef.current), 50);
    const t2 = window.setTimeout(() => resetPanelScroll(mainRef.current), 200);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname, activeNav]);

  return mainRef;
}
