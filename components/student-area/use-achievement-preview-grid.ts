"use client";

import { useEffect, useRef, useState } from "react";

const PREVIEW_ROWS = 2;
const MIN_COL_WIDTH = 92;
const GRID_GAP = 16;
const MAX_COLUMNS = 5;

export function useAchievementPreviewGrid(total: number) {
  const gridRef = useRef<HTMLUListElement>(null);
  const [layout, setLayout] = useState(() => ({
    columns: Math.min(MAX_COLUMNS, 3, total),
    previewCount: Math.min(total, Math.min(MAX_COLUMNS, 3) * PREVIEW_ROWS),
  }));

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      if (width <= 0) return;

      const columns = Math.max(
        2,
        Math.min(
          MAX_COLUMNS,
          total,
          Math.floor((width + GRID_GAP) / (MIN_COL_WIDTH + GRID_GAP))
        )
      );
      const previewCount = Math.min(total, columns * PREVIEW_ROWS);

      setLayout((prev) =>
        prev.columns === columns && prev.previewCount === previewCount
          ? prev
          : { columns, previewCount }
      );
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => ro.disconnect();
  }, [total]);

  return { gridRef, ...layout };
}
