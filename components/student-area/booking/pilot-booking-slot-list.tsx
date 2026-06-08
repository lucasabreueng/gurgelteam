"use client";

import type { PilotBookingSlotsApiDTO } from "@/lib/contracts/api/v1/pilot.api.schemas";
import { adminCardInnerClass } from "@/lib/design";

type Slot = PilotBookingSlotsApiDTO["slots"][number];

type Props = {
  dateLabel: string;
  slots: readonly Slot[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  selectedSlotId: string | null;
  onSelectSlot?: (slotId: string) => void;
  className?: string;
};

export function PilotBookingSlotList({
  dateLabel,
  slots,
  loading,
  error,
  onRetry,
  selectedSlotId,
  onSelectSlot,
  className,
}: Props) {
  return (
    <section
      className={`flex min-h-[520px] flex-col ${adminCardInnerClass} ${className ?? ""}`}
    >
      <div className="shrink-0">
        <h2 className="text-lg font-bold text-[#0d1f3c]">Horários do dia</h2>
        <p className="mt-1 text-[13px] text-neutral-600">{dateLabel}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-neutral-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
          Elegível para você ou pilotos vinculados
        </span>
      </div>

      <div className="mt-4 min-h-0 flex-1 overflow-y-auto p-0.5">
        {loading ? (
          <ul
            className="flex flex-col gap-3"
            aria-busy="true"
            aria-label="Carregando horários"
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={i}
                className="h-[88px] animate-pulse rounded-xl bg-[#f3f5f9]"
              />
            ))}
          </ul>
        ) : error ? (
          <div className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[#0d1f3c]">
              Não foi possível carregar os horários
            </p>
            {onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 text-sm font-semibold text-accent underline-offset-2 hover:underline"
              >
                Tentar novamente
              </button>
            ) : null}
          </div>
        ) : slots.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[#0d1f3c]">
              Sem horários elegíveis neste dia
            </p>
            <p className="mt-2 text-[13px] text-neutral-600">
              Escolha outra data no calendário.
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {slots.map((slot) => {
              const selected = selectedSlotId === slot.slotId;
              const pilotCount = slot.eligiblePilots.length;

              return (
                <li key={slot.slotId}>
                  <button
                    type="button"
                    onClick={() => onSelectSlot?.(slot.slotId)}
                    aria-pressed={selected}
                    className={`flex h-full w-full flex-col rounded-xl border p-4 text-left transition cursor-pointer border-emerald-200/80 bg-emerald-50/60 hover:border-emerald-300/80 hover:shadow-sm ${
                      selected
                        ? "!border-accent/40 !bg-accent/[0.06] ring-1 ring-accent/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-base font-bold tabular-nums text-[#0d1f3c]">
                        {slot.time}
                        <span className="mx-1.5 font-normal text-neutral-400">
                          –
                        </span>
                        {slot.end}
                      </p>
                      <span className="shrink-0 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        Disponível
                      </span>
                    </div>

                    <dl className="mt-3 space-y-1.5 text-[12px]">
                      <div className="flex flex-wrap gap-x-1.5">
                        <dt className="font-semibold text-neutral-500">
                          Categoria
                        </dt>
                        <dd className="font-medium text-[#0d1f3c]">
                          {slot.categoryName || "—"}
                        </dd>
                      </div>
                      <div className="flex flex-wrap gap-x-1.5">
                        <dt className="font-semibold text-neutral-500">Nível</dt>
                        <dd className="font-medium text-[#0d1f3c]">
                          {slot.levelName || "—"}
                        </dd>
                      </div>
                    </dl>

                    <p className="mt-2 text-[11px] font-medium text-emerald-800">
                      {pilotCount === 1
                        ? `Elegível para ${slot.eligiblePilots[0]!.fullName}`
                        : `Elegível para ${pilotCount} pilotos`}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
