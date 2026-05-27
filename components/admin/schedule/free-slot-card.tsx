"use client";

import { HiLockClosed, HiLockOpen, HiPlus } from "react-icons/hi2";
import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";

type Props = {
  time: string;
  category: string;
  blocked?: boolean;
  onCreateClass?: (time?: string) => void;
  onRequestBlock?: () => void;
  onRequestUnblock?: () => void;
};

export function FreeSlotCard({
  time,
  category,
  blocked = false,
  onCreateClass,
  onRequestBlock,
  onRequestUnblock,
}: Props) {
  const categoryLabel = ScheduleServiceMock.formatEventCategory(category);

  if (blocked) {
    return (
      <div className="rounded-xl border border-dashed border-amber-400/70 bg-gradient-to-r from-amber-50/80 to-white px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
              Horário bloqueado
            </p>
            <p className="mt-1 text-xs text-neutral-600">
              Categoria:{" "}
              <span className="font-bold text-[#0d1f3c]">{categoryLabel}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onRequestUnblock}
            className="inline-flex items-center gap-1 rounded-lg border border-[#0d1f3c]/20 bg-white px-3 py-2 text-[10px] font-bold uppercase text-[#0d1f3c] hover:border-accent/40"
          >
            <HiLockOpen className="h-3.5 w-3.5" aria-hidden />
            Desbloquear
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-emerald-300/70 bg-gradient-to-r from-emerald-50/80 to-white px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
            Horário livre
          </p>
          <p className="mt-1 text-xs text-neutral-600">
            Categoria:{" "}
            <span className="font-bold text-[#0d1f3c]">{categoryLabel}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCreateClass?.(time)}
            className="inline-flex items-center gap-1 rounded-lg bg-[#0d1f3c] px-3 py-2 text-[10px] font-bold uppercase text-white transition hover:brightness-110"
          >
            <HiPlus className="h-3.5 w-3.5" aria-hidden />
            Criar aula
          </button>
          <button
            type="button"
            onClick={onRequestBlock}
            className="inline-flex items-center gap-1 rounded-lg border border-[#0d1f3c]/20 bg-white px-3 py-2 text-[10px] font-bold uppercase text-[#0d1f3c] hover:border-accent/40"
          >
            <HiLockClosed className="h-3.5 w-3.5" aria-hidden />
            Bloquear horário
          </button>
        </div>
      </div>
    </div>
  );
}
