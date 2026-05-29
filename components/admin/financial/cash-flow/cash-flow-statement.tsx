"use client";

import type { CashFlowStatementRow, MovementType } from "@/lib/contracts/cashflow";

import { useMemo, useState } from "react";
import { HiEllipsisHorizontal, HiMagnifyingGlass } from "react-icons/hi2";

import {
  inventoryTableClass,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "@/components/admin/inventory/inventory-table-shared";
import { filterFieldHeightClass } from "@/components/ui/filter-box";
import { SettingsDropdown } from "../../settings/settings-dropdown";
import { settingsInputClass } from "../../settings/settings-section";
import { CashFlowServiceMock } from "@/services/cashflow/cashFlowServiceMock";

import { FinancialChartCard } from "../financial-chart-card";

type Props = {
  movements: CashFlowStatementRow[];
  categories: string[];
  paymentMethods: string[];
  periodLabel: string;
  onAction?: (message: string) => void;
};

function formatMovementValue(row: CashFlowStatementRow): {
  label: string;
  className: string;
} {
  if (row.type === "entrada") {
    return { label: row.entry, className: "text-emerald-700" };
  }
  return { label: row.exit, className: "text-red-700" };
}

export function CashFlowStatement({
  movements,
  categories,
  paymentMethods,
  periodLabel,
  onAction,
}: Props) {
  const [typeFilter, setTypeFilter] = useState<MovementType | "">("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      CashFlowServiceMock.filterMovements(movements, {
        type: typeFilter,
        category: categoryFilter || undefined,
        paymentMethod: paymentFilter || undefined,
        search: search || undefined,
      }),
    [movements, typeFilter, categoryFilter, paymentFilter, search],
  );

  const handleRowAction = (action: string, description: string) => {
    setOpenMenuId(null);
    onAction?.(`${action}: ${description} (mock).`);
  };

  const typeOptions = [
    { value: "", label: "Tipo" },
    { value: "entrada", label: "Entrada" },
    { value: "saída", label: "Saída" },
  ];

  const categoryOptions = [
    { value: "", label: "Categoria" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const paymentOptions = [
    { value: "", label: "Pagamento" },
    ...paymentMethods.map((method) => ({ value: method, label: method })),
  ];

  return (
    <FinancialChartCard
      title="Extrato de movimentações"
      subtitle={`${periodLabel} — lançamentos confirmados de caixa`}
    >
      <div className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Buscar descrição..."
            className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-9 text-[14px]`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar movimentação"
          />
        </label>
        <SettingsDropdown
          aria-label="Filtrar por tipo"
          options={typeOptions}
          value={typeFilter}
          onSelect={(value) => setTypeFilter(value as MovementType | "")}
        />
        <SettingsDropdown
          aria-label="Filtrar por categoria"
          options={categoryOptions}
          value={categoryFilter}
          onSelect={setCategoryFilter}
        />
        <SettingsDropdown
          aria-label="Filtrar por forma de pagamento"
          options={paymentOptions}
          value={paymentFilter}
          onSelect={setPaymentFilter}
        />
      </div>

      <div className="hidden lg:block">
        <table className={`${inventoryTableClass} w-full table-fixed`}>
          <thead>
            <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
              <th className={`${inventoryThFirstClass} w-[100px]`}>Data</th>
              <th className={inventoryThClass}>Descrição</th>
              <th className={`${inventoryThClass} w-[120px]`}>Categoria</th>
              <th className={`${inventoryThClass} w-[90px]`}>Tipo</th>
              <th className={`${inventoryThClass} w-[110px]`}>Pagamento</th>
              <th className={`${inventoryThClass} w-[110px] text-right`}>Valor</th>
              <th className={`${inventoryThClass} w-[110px] text-right`}>Saldo</th>
              <th className={`${inventoryThClass} w-12`} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const value = formatMovementValue(row);
              return (
                <tr
                  key={row.id}
                  className="border-b border-[rgba(17,17,17,0.05)] last:border-0 hover:bg-[#fafbfc]/80"
                >
                  <td className={`${inventoryTdClass} whitespace-nowrap tabular-nums`}>
                    {row.date}
                  </td>
                  <td className={`${inventoryTdDescClass} break-words`}>{row.description}</td>
                  <td className={`${inventoryTdClass} break-words`}>{row.category}</td>
                  <td className={inventoryTdClass}>
                    <span
                      className={`text-[11px] font-bold uppercase ${
                        row.type === "entrada" ? "text-emerald-700" : "text-red-700"
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className={`${inventoryTdClass} break-words`}>{row.paymentMethod}</td>
                  <td
                    className={`${inventoryTdClass} text-right font-semibold tabular-nums ${value.className}`}
                  >
                    {value.label}
                  </td>
                  <td
                    className={`${inventoryTdClass} text-right font-semibold tabular-nums text-[#0d1f3c]`}
                  >
                    {row.balance}
                  </td>
                  <td className={`${inventoryTdClass} relative`}>
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100"
                      aria-label="Ações"
                      onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                    >
                      <HiEllipsisHorizontal className="h-4 w-4" />
                    </button>
                    {openMenuId === row.id ? (
                      <div className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-xl border border-[rgba(17,17,17,0.1)] bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-[12px] hover:bg-[#fafbfc]"
                          onClick={() => handleRowAction("Detalhes", row.description)}
                        >
                          Ver detalhes
                        </button>
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-[12px] hover:bg-[#fafbfc]"
                          onClick={() => handleRowAction("Edição", row.description)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-[12px] text-red-700 hover:bg-red-50"
                          onClick={() => handleRowAction("Exclusão", row.description)}
                        >
                          Excluir
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 lg:hidden">
        {filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] px-4 py-8 text-center text-sm text-neutral-500">
            Nenhuma movimentação encontrada.
          </p>
        ) : (
          filtered.map((row) => {
            const value = formatMovementValue(row);
            return (
              <article
                key={row.id}
                className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-white p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold tabular-nums text-neutral-500">
                      {row.date}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-[#0d1f3c] break-words">
                      {row.description}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-600">
                      {row.category} · {row.paymentMethod}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-bold uppercase ${
                      row.type === "entrada" ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {row.type}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <p className="text-neutral-500">Valor</p>
                    <p className={`font-bold tabular-nums ${value.className}`}>{value.label}</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Saldo</p>
                    <p className="font-bold tabular-nums text-[#0d1f3c]">{row.balance}</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    className="btn-outline-sm flex-1 py-1.5 text-[11px]"
                    onClick={() => handleRowAction("Detalhes", row.description)}
                  >
                    Detalhes
                  </button>
                  <button
                    type="button"
                    className="btn-outline-sm flex-1 py-1.5 text-[11px]"
                    onClick={() => handleRowAction("Edição", row.description)}
                  >
                    Editar
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </FinancialChartCard>
  );
}
