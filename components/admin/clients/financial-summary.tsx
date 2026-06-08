"use client";

import { useMemo, useState } from "react";
import type { ClientProfileDetail } from "@/lib/contracts/clients";
import { adminTextAccentClass } from "@/lib/design";
import { ProfileSectionHeader } from "./profile-section-header";
import {
  clientsTableBodyRowClass,
  clientsTableHeadRowClass,
  clientsTableScrollClass,
  clientsTableWrapClass,
} from "./clients-table-shared";

const PREVIEW_ROWS = 4;

type Props = {
  financial: ClientProfileDetail["financial"];
};

export function FinancialSummary({ financial }: Props) {
  const [expanded, setExpanded] = useState(false);

  const visiblePayments = useMemo(
    () =>
      expanded
        ? financial.payments
        : financial.payments.slice(0, PREVIEW_ROWS),
    [expanded, financial.payments],
  );

  const canExpand = financial.payments.length > PREVIEW_ROWS;

  return (
    <section>
      <ProfileSectionHeader
        title="Financeiro"
        description="Histórico resumido dos pagamentos efetuados."
        showViewMore={canExpand && !expanded}
        onViewMore={() => setExpanded(true)}
      />

      <div className={clientsTableWrapClass}>
        <div className={clientsTableScrollClass}>
          <table className="w-full min-w-0 text-left text-sm">
            <thead>
              <tr className={clientsTableHeadRowClass}>
                <th className="rounded-tl-2xl px-4 py-3">Data</th>
                <th className="px-4 py-3">Valor</th>
                <th className="rounded-tr-2xl px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {visiblePayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-sm text-neutral-500"
                  >
                    Nenhum pagamento registrado.
                  </td>
                </tr>
              ) : (
                visiblePayments.map((p) => (
                  <tr key={p.id} className={clientsTableBodyRowClass}>
                    <td className="whitespace-nowrap px-4 py-3 text-neutral-600">
                      {p.date}
                    </td>
                    <td className={`px-4 py-3 tabular-nums ${adminTextAccentClass}`}>
                      {p.amount}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200/60">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
