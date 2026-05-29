"use client";

import { useEffect, useState } from "react";

/** Mobile + tablet (até 1366px) — abre controles nativos do SO (select, date, etc.). */
export const PREFER_NATIVE_FORM_CONTROLS_MQ = "(max-width: 1366px)";

/** @deprecated Use {@link PREFER_NATIVE_FORM_CONTROLS_MQ} */
export const PREFER_NATIVE_SELECT_MQ = PREFER_NATIVE_FORM_CONTROLS_MQ;

function readPreferNativeSelect(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(PREFER_NATIVE_FORM_CONTROLS_MQ).matches;
}

export function usePreferNativeSelect(): boolean {
  const [preferNative, setPreferNative] = useState(readPreferNativeSelect);

  useEffect(() => {
    const mq = window.matchMedia(PREFER_NATIVE_FORM_CONTROLS_MQ);
    const onChange = () => setPreferNative(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return preferNative;
}
