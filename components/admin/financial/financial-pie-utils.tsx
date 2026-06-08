"use client";

import type { EChartsOption } from "echarts";
import type { ChartThemeColors } from "@/lib/echarts/chart-theme";

export type FinancialPieSlice = {
  name: string;
  value: number;
};

export function buildFinancialPieOption(
  slices: FinancialPieSlice[],
  theme: ChartThemeColors,
  tooltipFormatter?: (name: string) => string,
): EChartsOption {
  const data = slices.filter((s) => s.value > 0);
  const hasData = data.length > 0;

  const pieData = hasData
    ? data.map((item, i) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: theme.palette[i % theme.palette.length],
        },
      }))
    : [
        {
          name: "Sem dados",
          value: 1,
          itemStyle: { color: theme.grid },
        },
      ];

  return {
    tooltip: hasData
      ? {
          trigger: "item",
          formatter: (params) => {
            const name =
              typeof params === "object" && params && "name" in params
                ? String(params.name)
                : "";
            if (tooltipFormatter) return tooltipFormatter(name);
            const value =
              typeof params === "object" && params && "value" in params
                ? params.value
                : "";
            const percent =
              typeof params === "object" && params && "percent" in params
                ? params.percent
                : "";
            return `${name}<br/>${value} (${percent}%)`;
          },
        }
      : { show: false },
    series: [
      {
        type: "pie",
        radius: ["42%", "68%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor: theme.pieBorder,
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: { disabled: !hasData },
        data: pieData,
      },
    ],
  };
}
