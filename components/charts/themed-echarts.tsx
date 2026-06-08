"use client";

import dynamic from "next/dynamic";
import type { EChartsOption } from "echarts";
import { useMemo } from "react";

import { mergeChartTheme } from "@/lib/echarts/merge-chart-theme";
import { useChartTheme } from "@/lib/hooks/use-chart-theme";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div
      className="flex min-h-[200px] items-center justify-center rounded-xl bg-[var(--ds-surface-muted)] text-sm text-[var(--ds-text-muted)]"
      aria-hidden
    >
      Carregando gráfico…
    </div>
  ),
});

type ReactEChartsProps = React.ComponentProps<typeof ReactECharts>;

type Props = Omit<ReactEChartsProps, "option"> & {
  option: EChartsOption;
  /** Quando false, não aplica tema em eixos/tooltip (opção já tem cores). */
  applyTheme?: boolean;
};

/** Wrapper ECharts com eixos, tooltip e legenda reativos ao tema. */
export function ThemedECharts({
  option,
  applyTheme = true,
  ...props
}: Props) {
  const chartTheme = useChartTheme();
  const themedOption = useMemo(
    () => (applyTheme ? mergeChartTheme(option, chartTheme) : option),
    [applyTheme, option, chartTheme],
  );

  return <ReactECharts option={themedOption} {...props} />;
}
