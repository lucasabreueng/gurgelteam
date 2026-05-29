"use client";

import { useCallback, useEffect, useState } from "react";

/** Primeiro toque arma o item (tooltip); segundo toque navega. */
export function useCollapsedNavArm() {
  const [armedKey, setArmedKey] = useState<string | null>(null);

  const arm = useCallback((key: string) => {
    setArmedKey(key);
  }, []);

  const clearArm = useCallback(() => {
    setArmedKey(null);
  }, []);

  const isArmed = useCallback((key: string) => armedKey === key, [armedKey]);

  useEffect(() => {
    if (!armedKey) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-collapsed-nav-item]")) return;
      setArmedKey(null);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [armedKey]);

  return { armedKey, arm, clearArm, isArmed };
}
