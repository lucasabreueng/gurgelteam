"use client";

import { useEffect, useState } from "react";

const QUERY = "(max-width: 1023px)";

/** true quando viewport ≤ breakpoint lg do Tailwind (1023px). */
export function useMaxLg(): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return matches;
}
