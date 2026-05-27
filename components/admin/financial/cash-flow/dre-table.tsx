"use client";

import { useState } from "react";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";
import { FinancialChartCard } from "../financial-chart-card";

type ViewMode = "values" | "percent";

type Props = {
  compact?: boolean;
};

export function DreTable({ compact = false }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("values");
  const dreMonths = CashFlowServiceMock.getDreMonths();
  const dreRows = CashFlowServiceMock.getDreRows();
  const dreGrossRevenue = CashFlowServiceMock.getDreGrossRevenue();

  return (
    <FinancialChartCard
      title="DRE — Demonstrativo de Resultado"
      subtitle={`Comparativo ${dreMonths.previous} × ${dreMonths.current}`}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">
          Valores consolidados · margens sobre receita bruta
        </p>
        <div className="inline-flex rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] p-1">
          {(
            [
              ["values", "Valores"],
              ["percent", "% do faturamento"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setViewMode(key)}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition ${
                viewMode === key
                  ? "bg-[#0d1f3c] text-white"
                  : "text-neutral-600 hover:text-[#0d1f3c]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[rgba(17,17,17,0.08)]">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              <th className="px-4 py-3">Conta</th>
              <th className="px-3 py-3 text-right">{dreMonths.current}</th>
              <th className="px-3 py-3 text-right">%</th>
              <th className="px-3 py-3 text-right">{dreMonths.previous}</th>
              <th className="px-3 py-3 text-right">%</th>
              <th className="px-3 py-3 text-right">Variação</th>
              <th className="px-4 py-3 text-right">%</th>
            </tr>
          </thead>
          <tbody>
            {dreRows.map((row) => {
              const isTotal = row.kind === "total";
              const isSubtotal =
                row.kind === "subtotal" || row.kind === "section";
              const indent = row.indent ? row.indent * 12 : 0;

              const currentDisplay =
                viewMode === "values"
                  ? CashFlowServiceMock.formatBrl(row.currentValue)
                  : CashFlowServiceMock.formatPercent(
                      row.currentValue,
                      dreGrossRevenue,
                    );
              const previousDisplay =
                viewMode === "values"
                  ? CashFlowServiceMock.formatBrl(row.previousValue)
                  : CashFlowServiceMock.formatPercent(
                      row.previousValue,
                      dreGrossRevenue,
                    );

              const valueColor =
                row.currentValue > 0
                  ? "text-emerald-700"
                  : row.currentValue < 0
                    ? "text-red-700"
                    : "text-[#111]";

              return (
                <tr
                  key={row.id}
                  className={`border-b border-[rgba(17,17,17,0.05)] last:border-0 ${
                    isTotal
                      ? "bg-emerald-50/80"
                      : isSubtotal
                        ? "bg-[rgba(13,31,60,0.03)]"
                        : "hover:bg-[#fafbfc]/60"
                  }`}
                >
                  <td
                    className={`px-4 py-2.5 ${
                      isSubtotal || isTotal
                        ? "font-bold text-[#0d1f3c]"
                        : "text-neutral-700"
                    } ${compact ? "py-2 text-[12px]" : ""}`}
                    style={{ paddingLeft: `${16 + indent}px` }}
                  >
                    {row.label}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-semibold tabular-nums ${valueColor} ${
                      isSubtotal || isTotal ? "font-bold" : ""
                    }`}
                  >
                    {currentDisplay}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-neutral-500">
                    {CashFlowServiceMock.formatPercent(
                      row.currentValue,
                      dreGrossRevenue,
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-neutral-700">
                    {previousDisplay}
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-neutral-500">
                    {CashFlowServiceMock.formatPercent(
                      row.previousValue,
                      dreGrossRevenue,
                    )}
                  </td>
                  <td
                    className={`px-3 py-2.5 text-right font-semibold tabular-nums ${
                      row.currentValue >= row.previousValue
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {viewMode === "values"
                      ? CashFlowServiceMock.formatBrl(
                          row.currentValue - row.previousValue,
                        )
                      : CashFlowServiceMock.formatVariation(
                          row.currentValue,
                          row.previousValue,
                        )}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-neutral-600">
                    {CashFlowServiceMock.formatVariation(
                      row.currentValue,
                      row.previousValue,
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </FinancialChartCard>
  );
}
