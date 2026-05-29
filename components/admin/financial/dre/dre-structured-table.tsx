"use client";

import type { DreStructuredRow } from "@/lib/admin-dre-mocks";
import { formatDrePeriodLabel } from "@/lib/admin-dre-mocks";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";

import { useMemo, useState } from "react";
import { HiChevronDoubleDown, HiChevronDoubleUp, HiChevronDown } from "react-icons/hi2";

import {
  inventoryTableClass,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "@/components/admin/inventory/inventory-table-shared";

import { FinancialChartCard } from "../financial-chart-card";

type Props = {
  rows: DreStructuredRow[];
  grossRevenue: number;
  periodLabel: string;
  previousPeriodLabel: string;
  viewMode: "comparative" | "monthly";
  monthColumns?: string[];
  onAccountClick?: (row: DreStructuredRow) => void;
};

function isRowVisible(
  row: DreStructuredRow,
  rows: DreStructuredRow[],
  collapsed: Set<string>
): boolean {
  if (!row.parentId) return true;
  let parentId: string | undefined = row.parentId;
  while (parentId) {
    if (collapsed.has(parentId)) return false;
    parentId = rows.find((r) => r.id === parentId)?.parentId;
  }
  return true;
}

function isClickableAccount(row: DreStructuredRow): boolean {
  return row.kind === "line" || row.kind === "subtotal" || row.kind === "total";
}

export function DreStructuredTable({
  rows,
  grossRevenue,
  periodLabel,
  previousPeriodLabel,
  viewMode,
  monthColumns = [],
  onAccountClick,
}: Props) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set());
  const isMonthly = viewMode === "monthly" && monthColumns.length > 0;

  const groupIds = useMemo(
    () => rows.filter((row) => row.kind === "group").map((row) => row.id),
    [rows]
  );

  const allExpanded =
    groupIds.length === 0 || groupIds.every((id) => !collapsed.has(id));

  const visibleRows = useMemo(
    () => rows.filter((row) => isRowVisible(row, rows, collapsed)),
    [rows, collapsed]
  );

  const toggleAllGroups = () => {
    if (allExpanded) {
      setCollapsed(new Set(groupIds));
    } else {
      setCollapsed(new Set());
    }
  };

  const toggleGroup = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isGroupExpanded = (id: string) => !collapsed.has(id);

  const renderValueColor = (value: number, kind: DreStructuredRow["kind"]) => {
    if (kind === "total" || kind === "subtotal") return "text-[#0d1f3c]";
    if (value > 0) return "text-emerald-700";
    if (value < 0) return "text-red-700";
    return "text-neutral-700";
  };

  const handleAccountClick = (row: DreStructuredRow) => {
    if (isClickableAccount(row) && onAccountClick) {
      onAccountClick(row);
    }
  };

  const displayPeriod = formatDrePeriodLabel(periodLabel);
  const displayPrevious = formatDrePeriodLabel(previousPeriodLabel);

  const subtitle = isMonthly
    ? `${displayPeriod} — valores por mês`
    : `${displayPeriod} comparado a ${displayPrevious}`;

  return (
    <FinancialChartCard
      title="DRE - Demonstração do Resultado do Exercício"
      subtitle={subtitle}
      headerAction={
        groupIds.length > 0 ? (
          <button
            type="button"
            onClick={toggleAllGroups}
            className="btn-outline-sm inline-flex items-center gap-1.5 bg-white"
            aria-label={allExpanded ? "Retrair todos os grupos" : "Expandir todos os grupos"}
          >
            {allExpanded ? (
              <>
                <HiChevronDoubleUp className="h-4 w-4 shrink-0" aria-hidden />
                Retrair
              </>
            ) : (
              <>
                <HiChevronDoubleDown className="h-4 w-4 shrink-0" aria-hidden />
                Expandir
              </>
            )}
          </button>
        ) : null
      }
    >
      <div className="hidden overflow-x-auto rounded-xl border border-[rgba(17,17,17,0.08)] lg:block">
        <table className={inventoryTableClass}>
          <thead>
            <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
              <th className={inventoryThFirstClass}>Conta</th>
              <th className={`${inventoryThClass} text-right`}>Valor total</th>
              <th className={`${inventoryThClass} text-right`}>% receita</th>
              {isMonthly ? (
                monthColumns.map((col) => (
                  <th key={col} className={`${inventoryThClass} text-right whitespace-nowrap`}>
                    {col}
                  </th>
                ))
              ) : (
                <>
                  <th className={`${inventoryThClass} text-right`}>
                    {displayPrevious}
                  </th>
                  <th className={`${inventoryThClass} text-right`}>Variação</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const isGroup = row.kind === "group";
              const isTotal = row.kind === "total";
              const isSubtotal = row.kind === "subtotal";
              const expanded = isGroupExpanded(row.id);
              const valueClass = renderValueColor(row.currentValue, row.kind);
              const clickable = isClickableAccount(row);
              const variationPositive = row.currentValue >= row.previousValue;

              return (
                <tr
                  key={row.id}
                  className={`border-b border-[rgba(17,17,17,0.05)] last:border-0 ${
                    isTotal
                      ? "bg-emerald-50/80"
                      : isSubtotal || isGroup
                        ? "bg-[rgba(13,31,60,0.03)]"
                        : "hover:bg-[#fafbfc]/60"
                  } ${clickable ? "cursor-pointer" : ""}`}
                  onClick={() => handleAccountClick(row)}
                >
                  <td
                    className={`${inventoryTdDescClass} ${
                      isTotal || isSubtotal || isGroup ? "font-bold" : ""
                    }`}
                    style={{ paddingLeft: `${16 + row.level * 16}px` }}
                  >
                    {isGroup ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroup(row.id);
                        }}
                        className="inline-flex items-center gap-2 text-left"
                      >
                        <HiChevronDown
                          className={`h-4 w-4 shrink-0 text-accent transition-transform ${
                            expanded ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        />
                        {row.label}
                      </button>
                    ) : (
                      <span className={clickable ? "hover:text-accent" : undefined}>
                        {row.label}
                      </span>
                    )}
                  </td>
                  <td
                    className={`${inventoryTdClass} text-right font-semibold tabular-nums ${valueClass}`}
                  >
                    {FinancialServiceMock.formatDreBrl(row.currentValue)}
                  </td>
                  <td className={`${inventoryTdClass} text-right tabular-nums text-neutral-500`}>
                    {FinancialServiceMock.formatDrePercent(row.currentValue, grossRevenue)}
                  </td>
                  {isMonthly ? (
                    (row.monthlyValues ?? []).map((value, i) => (
                      <td
                        key={`${row.id}-${monthColumns[i] ?? i}`}
                        className={`${inventoryTdClass} text-right tabular-nums text-neutral-700`}
                      >
                        {FinancialServiceMock.formatDreBrl(value)}
                      </td>
                    ))
                  ) : (
                    <>
                      <td className={`${inventoryTdClass} text-right tabular-nums text-neutral-700`}>
                        {FinancialServiceMock.formatDreBrl(row.previousValue)}
                      </td>
                      <td
                        className={`${inventoryTdClass} text-right font-semibold tabular-nums ${
                          variationPositive ? "text-emerald-700" : "text-red-700"
                        }`}
                      >
                        {FinancialServiceMock.formatDreVariation(
                          row.currentValue,
                          row.previousValue
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 lg:hidden">
        {visibleRows.map((row) => {
          const isGroup = row.kind === "group";
          const isTotal = row.kind === "total";
          const isSubtotal = row.kind === "subtotal";
          const expanded = isGroupExpanded(row.id);
          const valueClass = renderValueColor(row.currentValue, row.kind);
          const clickable = isClickableAccount(row);

          return (
            <div
              key={row.id}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              onClick={() => handleAccountClick(row)}
              onKeyDown={(e) => {
                if (clickable && (e.key === "Enter" || e.key === " ")) {
                  e.preventDefault();
                  handleAccountClick(row);
                }
              }}
              className={`rounded-xl border border-[rgba(17,17,17,0.08)] p-3 ${
                isTotal
                  ? "bg-emerald-50/80"
                  : isSubtotal || isGroup
                    ? "bg-[rgba(13,31,60,0.03)]"
                    : "bg-white"
              } ${clickable ? "cursor-pointer active:scale-[0.99]" : ""}`}
              style={{ marginLeft: `${row.level * 12}px` }}
            >
              {isGroup ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroup(row.id);
                  }}
                  className="flex w-full items-center gap-2 text-left text-sm font-bold text-[#0d1f3c]"
                >
                  <HiChevronDown
                    className={`h-4 w-4 shrink-0 text-accent transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                  {row.label}
                </button>
              ) : (
                <p
                  className={`text-sm ${
                    isTotal || isSubtotal ? "font-bold text-[#0d1f3c]" : "font-semibold"
                  }`}
                >
                  {row.label}
                </p>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <p className="text-neutral-500">Valor total</p>
                  <p className={`font-bold tabular-nums ${valueClass}`}>
                    {FinancialServiceMock.formatDreBrl(row.currentValue)}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-500">% receita</p>
                  <p className="font-semibold tabular-nums text-neutral-600">
                    {FinancialServiceMock.formatDrePercent(row.currentValue, grossRevenue)}
                  </p>
                </div>
                {isMonthly
                  ? monthColumns.map((col, i) => (
                      <div key={col}>
                        <p className="text-neutral-500">{col}</p>
                        <p className="font-semibold tabular-nums text-neutral-700">
                          {FinancialServiceMock.formatDreBrl(row.monthlyValues?.[i] ?? 0)}
                        </p>
                      </div>
                    ))
                  : (
                    <>
                      <div>
                        <p className="text-neutral-500">{displayPrevious}</p>
                        <p className="font-semibold tabular-nums text-neutral-700">
                          {FinancialServiceMock.formatDreBrl(row.previousValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-neutral-500">Variação</p>
                        <p
                          className={`font-bold tabular-nums ${
                            row.currentValue >= row.previousValue
                              ? "text-emerald-700"
                              : "text-red-700"
                          }`}
                        >
                          {FinancialServiceMock.formatDreVariation(
                            row.currentValue,
                            row.previousValue
                          )}
                        </p>
                      </div>
                    </>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </FinancialChartCard>
  );
}
