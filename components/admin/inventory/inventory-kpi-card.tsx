import type { IconType } from "react-icons/lib";
import { ThemedECharts } from "@/components/charts/themed-echarts";
import type { EChartsOption } from "echarts";
import { useMemo } from "react";

type Props = {
  label: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  sparkline: number[];
  Icon?: IconType;
};

export function InventoryKpiCard({
  label,
  value,
  delta,
  deltaPositive,
  sparkline,
  Icon,
}: Props) {
  const chartOption: EChartsOption = useMemo(() => {
    const color = deltaPositive ? "#059669" : "#dc2626";
    return {
      grid: { left: 0, right: 0, top: 2, bottom: 2 },
      xAxis: { type: "category", show: false, data: sparkline.map((_, i) => i) },
      yAxis: { type: "value", show: false, scale: true },
      series: [
        {
          type: "line",
          data: sparkline,
          smooth: true,
          symbol: "none",
          lineStyle: { color, width: 2 },
          areaStyle: {
            color: deltaPositive
              ? "rgba(5,150,105,0.12)"
              : "rgba(220,38,38,0.12)",
          },
        },
      ],
    };
  }, [sparkline, deltaPositive]);

  return (
    <div className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-[0_2px_12px_rgba(13,31,60,0.04)] transition hover:shadow-[0_6px_24px_rgba(13,31,60,0.08)] md:p-5">
      <div className="flex items-start justify-between gap-3">
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[rgba(13,31,60,0.06)] text-[#0d1f3c]">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        ) : (
          <span className="h-10 w-10 shrink-0" />
        )}
        <span
          className={`shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-bold ${
            deltaPositive
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60"
              : "bg-red-50 text-red-700 ring-1 ring-red-200/60"
          }`}
        >
          {delta}
        </span>
      </div>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold leading-tight tracking-tight text-[#0d1f3c] md:text-2xl">
        {value}
      </p>
      <div className="mt-3 h-10 w-full">
        <ThemedECharts
          option={chartOption}
          style={{ height: 40, width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
    </div>
  );
}
