import type { ResolvedTheme } from "@/components/theme-provider";

export type ChartThemeColors = {
  grid: string;
  axis: string;
  line: string;
  area: string;
  accent: string;
  tooltipBg: string;
  tooltipText: string;
  splitLine: string;
  /** Borda entre fatias de donut/pie (fundo do card). */
  pieBorder: string;
  /** Paleta para séries múltiplas / pizza. */
  palette: readonly string[];
};

/** Lê tokens CSS do tema atual (client-side). */
export function readChartThemeFromDom(): ChartThemeColors {
  if (typeof window === "undefined") {
    return {
      grid: "#e2e8f0",
      axis: "#64748b",
      line: "#0d1f3c",
      area: "rgba(13, 31, 60, 0.12)",
      accent: "#c41e3a",
      tooltipBg: "#ffffff",
      tooltipText: "#0d1f3c",
      splitLine: "rgba(17, 17, 17, 0.06)",
      pieBorder: "#ffffff",
      palette: ["#0d1f3c", "#1e3a5f", "#c41e3a", "#64748b"],
    };
  }

  const style = getComputedStyle(document.documentElement);
  const pick = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;
  const isDark =
    document.documentElement.getAttribute("data-color-mode") === "dark";

  const line = pick("--ds-chart-line", "#0d1f3c");
  const accent = pick("--color-accent", "#0d1f3c");

  return {
    grid: pick("--ds-chart-grid", "#e2e8f0"),
    axis: pick("--ds-chart-axis", "#64748b"),
    line,
    area: pick("--ds-chart-area", "rgba(13, 31, 60, 0.12)"),
    accent,
    tooltipBg: pick("--ds-chart-tooltip-bg", "#ffffff"),
    tooltipText: pick("--ds-chart-tooltip-text", "#0d1f3c"),
    splitLine: isDark
      ? "rgba(255, 255, 255, 0.06)"
      : "rgba(17, 17, 17, 0.06)",
    pieBorder: pick("--ds-bg-card", "#ffffff"),
    palette: isDark
      ? [line, "#3d5a80", accent, "#8b9bb5"]
      : ["#0d1f3c", "#1e3a5f", "#c41e3a", "#64748b"],
  };
}

export function chartThemeForResolved(_resolved: ResolvedTheme): ChartThemeColors {
  return readChartThemeFromDom();
}
