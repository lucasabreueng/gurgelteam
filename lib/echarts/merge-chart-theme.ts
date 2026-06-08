import type { EChartsOption } from "echarts";

import type { ChartThemeColors } from "@/lib/echarts/chart-theme";

type LooseRecord = Record<string, unknown>;

function normalizeAxes(axis: unknown): LooseRecord[] {
  if (!axis) return [];
  if (Array.isArray(axis)) return axis as LooseRecord[];
  return [axis as LooseRecord];
}

function applyAxisTheme(axis: LooseRecord, theme: ChartThemeColors): LooseRecord {
  const next: LooseRecord = { ...axis };

  if (next.axisLine !== false) {
    const axisLine =
      typeof next.axisLine === "object" && next.axisLine
        ? { ...(next.axisLine as LooseRecord) }
        : {};
    const lineStyle =
      typeof axisLine.lineStyle === "object" && axisLine.lineStyle
        ? { ...(axisLine.lineStyle as LooseRecord) }
        : {};
    next.axisLine = {
      ...axisLine,
      lineStyle: { color: theme.grid, ...lineStyle },
    };
  }

  if (next.axisLabel !== false) {
    const axisLabel =
      typeof next.axisLabel === "object" && next.axisLabel
        ? { ...(next.axisLabel as LooseRecord) }
        : {};
    next.axisLabel = { color: theme.axis, ...axisLabel };
  }

  if (next.splitLine !== false) {
    const splitLine =
      typeof next.splitLine === "object" && next.splitLine
        ? { ...(next.splitLine as LooseRecord) }
        : {};
    const lineStyle =
      typeof splitLine.lineStyle === "object" && splitLine.lineStyle
        ? { ...(splitLine.lineStyle as LooseRecord) }
        : {};
    next.splitLine = {
      ...splitLine,
      lineStyle: { color: theme.splitLine, ...lineStyle },
    };
  }

  return next;
}

function applyLegendTheme(
  legend: EChartsOption["legend"],
  theme: ChartThemeColors,
): EChartsOption["legend"] {
  if (!legend) return legend;
  if (Array.isArray(legend)) {
    return legend.map((item) => ({
      ...item,
      textStyle: {
        color: theme.axis,
        ...(typeof item.textStyle === "object" ? item.textStyle : {}),
      },
    }));
  }
  return {
    ...legend,
    textStyle: {
      color: theme.axis,
      ...(typeof legend.textStyle === "object" ? legend.textStyle : {}),
    },
  };
}

function restoreSingleOrArray(
  themed: LooseRecord[],
  original: unknown,
): unknown {
  if (!original) return original;
  if (Array.isArray(original)) return themed;
  return themed[0] ?? original;
}

/** Aplica cores de eixo, tooltip e legenda sem alterar séries. */
export function mergeChartTheme(
  option: EChartsOption,
  theme: ChartThemeColors,
): EChartsOption {
  const next = { ...option } as LooseRecord;

  const tooltip = next.tooltip;
  if (tooltip && typeof tooltip === "object" && !Array.isArray(tooltip)) {
    const tooltipObj = { ...(tooltip as LooseRecord) };
    const textStyle =
      typeof tooltipObj.textStyle === "object" && tooltipObj.textStyle
        ? { ...(tooltipObj.textStyle as LooseRecord) }
        : {};
    next.tooltip = {
      ...tooltipObj,
      backgroundColor: theme.tooltipBg,
      borderColor: theme.grid,
      textStyle: {
        color: theme.tooltipText,
        fontSize: 12,
        ...textStyle,
      },
    };
  }

  next.legend = applyLegendTheme(
    next.legend as EChartsOption["legend"],
    theme,
  );

  const xAxes = normalizeAxes(next.xAxis);
  if (xAxes.length) {
    next.xAxis = restoreSingleOrArray(
      xAxes.map((axis) => applyAxisTheme(axis, theme)),
      next.xAxis,
    );
  }

  const yAxes = normalizeAxes(next.yAxis);
  if (yAxes.length) {
    next.yAxis = restoreSingleOrArray(
      yAxes.map((axis) => applyAxisTheme(axis, theme)),
      next.yAxis,
    );
  }

  return next as EChartsOption;
}
