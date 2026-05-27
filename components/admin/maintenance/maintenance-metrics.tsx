"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";
import type { MaintenanceOrderDetail } from "@/lib/contracts/maintenance";

type Props = {
  metrics: MaintenanceOrderDetail["metrics"];
};

export function MaintenanceMetrics({ metrics }: Props) {
  const costOption: EChartsOption = {
    grid: { left: 40, right: 16, top: 20, bottom: 28 },
    xAxis: {
      type: "category",
      data: ["Jan", "Fev", "Mar", "Abr", "Mai"],
    },
    yAxis: { type: "value", name: "R$ mil" },
    series: [
      {
        type: "bar",
        data: metrics.monthlyCost,
        itemStyle: { color: "#0d1f3c", borderRadius: [4, 4, 0, 0] },
      },
    ],
  };

  const partsOption: EChartsOption = {
    grid: { left: 80, right: 16, top: 12, bottom: 28 },
    xAxis: { type: "value" },
    yAxis: {
      type: "category",
      data: metrics.topParts.map((p) => p.name),
    },
    series: [
      {
        type: "bar",
        data: metrics.topParts.map((p) => p.count),
        itemStyle: { color: "rgba(13,31,60,0.75)" },
      },
    ],
  };

  const availOption: EChartsOption = {
    grid: { left: 40, right: 16, top: 20, bottom: 28 },
    xAxis: {
      type: "category",
      data: ["S1", "S2", "S3", "S4", "S5"],
    },
    yAxis: { type: "value", max: 100, axisLabel: { formatter: "{value}%" } },
    series: [
      {
        type: "line",
        smooth: true,
        data: metrics.availability,
        lineStyle: { color: "#0d1f3c", width: 2 },
        areaStyle: { color: "rgba(13,31,60,0.08)" },
      },
    ],
  };

  return (
    <section className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-sm md:p-6">
      <h3 className="text-lg font-bold text-[#0d1f3c]">Métricas e performance</h3>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase text-neutral-500">
            Custo mensal
          </p>
          <ReactECharts
            option={costOption}
            style={{ height: 180 }}
            opts={{ renderer: "svg" }}
          />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase text-neutral-500">
            Peças mais trocadas
          </p>
          <ReactECharts
            option={partsOption}
            style={{ height: 180 }}
            opts={{ renderer: "svg" }}
          />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase text-neutral-500">
            Disponibilidade operacional
          </p>
          <ReactECharts
            option={availOption}
            style={{ height: 180 }}
            opts={{ renderer: "svg" }}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#fafbfc] p-4 ring-1 ring-[rgba(17,17,17,0.06)]">
            <p className="text-[10px] font-bold uppercase text-neutral-500">
              Tempo médio parado
            </p>
            <p className="mt-1 text-2xl font-bold text-[#0d1f3c]">
              {metrics.avgStopped.at(-1)} dias
            </p>
          </div>
          <div className="rounded-xl bg-[#fafbfc] p-4 ring-1 ring-[rgba(17,17,17,0.06)]">
            <p className="text-[10px] font-bold uppercase text-neutral-500">
              Falhas recorrentes
            </p>
            <ul className="mt-2 space-y-1 text-sm font-semibold">
              {metrics.failures.map((f) => (
                <li key={f.issue} className="flex justify-between">
                  <span>{f.issue}</span>
                  <span className="text-neutral-500">{f.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-[#fafbfc] p-4 ring-1 ring-[rgba(17,17,17,0.06)] sm:col-span-2">
            <p className="text-[10px] font-bold uppercase text-neutral-500">
              Karts mais problemáticos
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {metrics.problematicKarts.map((k) => (
                <li
                  key={k.number}
                  className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold ring-1 ring-[rgba(17,17,17,0.08)]"
                >
                  Kart {String(k.number).padStart(2, "0")} · {k.os} OS
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
