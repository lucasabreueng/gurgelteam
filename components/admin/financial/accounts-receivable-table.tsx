"use client";

import { useMemo, useState } from "react";
import type { ReceivableStatus } from "@/lib/contracts/finance/finance.types";
import { useFinancialReceivables } from "@/lib/query/hooks/use-financial-receivables";
import { FinancialServiceMock } from "@/services/finance/financialServiceMock";
import type { IconType } from "react-icons/lib";
import {
  HiBanknotes,
  HiBellAlert,
  HiDocumentText,
  HiMagnifyingGlass,
  HiUser,
} from "react-icons/hi2";
import { FilterBox, filterFieldHeightClass, filtersActive } from "@/components/ui/filter-box";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { settingsInputClass } from "../settings/settings-section";
import { useInventoryTableState } from "../inventory/use-inventory-table-state";
import {
  InventoryTableShell,
  TableIconButton,
  inventoryTdClass,
  inventoryTdDescClass,
  inventoryTdFirstClass,
  inventoryThClass,
  inventoryThFirstClass,
} from "../inventory/inventory-table-shared";
import { FinancialTablePagination } from "./financial-table-pagination";
import { ReceivableStatusBadge } from "./receivable-status-badge";

type Props = {
  onAction?: (msg: string) => void;
};

export function AccountsReceivableTable({ onAction }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ReceivableStatus | "">("");
  const [method, setMethod] = useState("");
  const [service, setService] = useState("");

  const filters = useMemo(
    () => ({ query, status, method, service }),
    [query, status, method, service],
  );
  const { data: rows = [] } = useFinancialReceivables(filters);

  const {
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedItems,
    totalItems,
  } = useInventoryTableState(rows, [query, status, method, service]);

  const methodOptions = [
    { value: "", label: "Pagamento" },
    ...FinancialServiceMock.getReceivablePaymentMethods().map((m) => ({
      value: m,
      label: m,
    })),
    { value: "Boleto", label: "Boleto" },
  ];

  const serviceOptions = [
    { value: "", label: "Serviço" },
    ...FinancialServiceMock.getReceivableServices().map((s) => ({
      value: s,
      label: s,
    })),
  ];

  const filtersAreActive = filtersActive([query, status, method, service]);

  const clearFilters = () => {
    setQuery("");
    setStatus("");
    setMethod("");
    setService("");
  };

  return (
    <div className="admin-page-stack">
      <FilterBox active={filtersAreActive} onClear={clearFilters}>
        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-stretch">
          <div className="relative min-w-[200px] flex-[2] lg:min-w-[240px]">
            <HiMagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Buscar cliente, serviço…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`${settingsInputClass} ${filterFieldHeightClass} w-full pl-10`}
              aria-label="Buscar título"
            />
          </div>
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Status"
              options={FinancialServiceMock.getReceivableFilterOptions().map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              value={status}
              onSelect={(v) => setStatus(v as ReceivableStatus | "")}
            />
          </div>
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Forma de pagamento"
              options={methodOptions}
              value={method}
              onSelect={setMethod}
            />
          </div>
          <div className="w-full min-w-[11rem] lg:max-w-[12rem] lg:flex-1">
            <SettingsDropdown
              aria-label="Serviço"
              options={serviceOptions}
              value={service}
              onSelect={setService}
            />
          </div>
        </div>
      </FilterBox>

      <InventoryTableShell
        isEmpty={totalItems === 0}
        emptyMessage="Nenhum título encontrado com os filtros atuais."
        pagination={
          <FinancialTablePagination
            page={page}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        }
      >
        <thead>
          <tr className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
            <th className={inventoryThFirstClass}>Cliente</th>
            <th className={inventoryThClass}>Valor</th>
            <th className={inventoryThClass}>Vencimento</th>
            <th className={inventoryThClass}>Status</th>
            <th className={inventoryThClass}>Pagamento</th>
            <th className={inventoryThClass}>Serviço</th>
            <th className={`${inventoryThClass} text-right`}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((row) => (
            <tr
              key={row.id}
              className="border-b border-[rgba(17,17,17,0.04)] transition hover:bg-[#fafbfc]/80"
            >
              <td className={`${inventoryTdFirstClass} font-semibold text-[#0d1f3c]`}>
                {row.clientName}
              </td>
              <td className={`${inventoryTdClass} font-bold tabular-nums`}>
                {row.amount}
              </td>
              <td className={inventoryTdClass}>{row.dueDate}</td>
              <td className={inventoryTdClass}>
                <ReceivableStatusBadge status={row.status} />
              </td>
              <td className={inventoryTdClass}>{row.paymentMethod}</td>
              <td className={inventoryTdDescClass}>{row.service}</td>
              <td className={inventoryTdClass}>
                <ReceivableRowActions
                  clientName={row.clientName}
                  status={row.status}
                  onAction={onAction}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </InventoryTableShell>
    </div>
  );
}

function ReceivableRowActions({
  clientName,
  status,
  onAction,
}: {
  clientName: string;
  status: ReceivableStatus;
  onAction?: (msg: string) => void;
}) {
  const actions: { label: string; icon: IconType; show: boolean; msg: string }[] =
    [
      {
        label: "Cobrar",
        icon: HiBellAlert,
        show: status !== "pago",
        msg: `Cobrança enviada — ${clientName} (mock).`,
      },
      {
        label: "Registrar pagamento",
        icon: HiBanknotes,
        show: true,
        msg: `Pagamento registrado — ${clientName} (mock).`,
      },
      {
        label: "Gerar recibo",
        icon: HiDocumentText,
        show: true,
        msg: `Recibo — ${clientName} (mock).`,
      },
      {
        label: "Abrir cliente",
        icon: HiUser,
        show: true,
        msg: `Cliente ${clientName} (mock).`,
      },
    ];

  return (
    <div className="flex items-center justify-end gap-1">
      {actions
        .filter((a) => a.show)
        .map((a) => (
          <TableIconButton
            key={a.label}
            icon={a.icon}
            label={a.label}
            onClick={() => onAction?.(a.msg)}
          />
        ))}
    </div>
  );
}
