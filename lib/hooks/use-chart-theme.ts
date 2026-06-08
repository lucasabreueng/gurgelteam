"use client";

import { useMemo } from "react";

import { useTheme } from "@/components/theme-provider";
import {
  chartThemeForResolved,
  type ChartThemeColors,
} from "@/lib/echarts/chart-theme";

/** Cores de gráfico reativas ao tema (ECharts, etc.). */
export function useChartTheme(): ChartThemeColors {
  const { resolvedTheme } = useTheme();
  return useMemo(
    () => chartThemeForResolved(resolvedTheme),
    [resolvedTheme],
  );
}
