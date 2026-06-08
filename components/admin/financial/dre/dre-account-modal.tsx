"use client";

import type { DrePeriodFilter } from "@/lib/admin-dre-mocks";
import type { DreStructuredRow } from "@/lib/admin-dre-mocks";
import { formatBrl } from "@/lib/admin-dre-mocks";
import { useDreAccountEntries } from "@/lib/query/hooks/use-dre-account-entries";

import { ScheduleActionModal } from "@/components/admin/schedule/schedule-action-modal";

type Props = {
  open: boolean;
  row: DreStructuredRow | null;
  filter: DrePeriodFilter;
  onClose: () => void;
};

export function DreAccountModal({ open, row, filter, onClose }: Props) {
  const { data: entries = [], isPending } = useDreAccountEntries(
    row?.id,
    filter,
    open,
  );

  if (!row) return null;

  return (
    <ScheduleActionModal
      open={open}
      onClose={onClose}
      title={row.label}
      titleId="dre-account-modal-title"
      description={`Total no período: ${formatBrl(row.currentValue)}`}
      maxWidthClass="max-w-3xl"
    >
      {isPending ? (
        <p className="text-sm text-neutral-500">Carregando lançamentos…</p>
      ) : entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center text-sm text-neutral-500">
          Nenhum lançamento encontrado para este período.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                    {entry.date}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0d1f3c] break-words">
                    {entry.description}
                  </p>
                  {entry.reference ? (
                    <p className="mt-1 text-[12px] text-neutral-500 break-words">
                      {entry.reference}
                    </p>
                  ) : null}
                </div>
                <p
                  className={`shrink-0 text-base font-bold tabular-nums sm:text-right ${
                    entry.amount >= 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {formatBrl(entry.amount)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </ScheduleActionModal>
  );
}
