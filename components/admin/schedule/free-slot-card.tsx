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

function SlotInfo({
  time,
  title,
  titleClass,
  categoryLabel,
}: {
  time: string;
  title: string;
  titleClass: string;
  categoryLabel: string;
}) {
  return (
    <div className="schedule-free-slot-card__info">
      <p className={`text-[10px] font-bold uppercase tracking-wider ${titleClass}`}>
        <span className="tabular-nums">{time}</span>
        <span className="mx-1.5 opacity-70">·</span>
        {title}
      </p>
      <p className="mt-1 truncate text-xs text-neutral-600">
        Categoria:{" "}
        <span className="font-bold text-[#0d1f3c]">{categoryLabel}</span>
      </p>
    </div>
  );
}

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
      <div className="schedule-free-slot-card border-dashed border-amber-400/70 bg-amber-50/90">
        <div className="schedule-free-slot-card__body">
          <SlotInfo
            time={time}
            title="Horário bloqueado"
            titleClass="text-amber-900"
            categoryLabel={categoryLabel}
          />
          <div className="schedule-free-slot-actions">
            <button
              type="button"
              onClick={onRequestUnblock}
              aria-label="Desbloquear horário"
              className="schedule-free-slot-action-btn border border-[#0d1f3c]/20 bg-white text-[#0d1f3c] hover:border-accent/40"
            >
              <HiLockOpen className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-free-slot-card border-dashed border-emerald-300/70 bg-emerald-50/90">
      <div className="schedule-free-slot-card__body">
        <SlotInfo
          time={time}
          title="Horário livre"
          titleClass="text-emerald-800"
          categoryLabel={categoryLabel}
        />
        <div className="schedule-free-slot-actions">
          <button
            type="button"
            onClick={() => onCreateClass?.(time)}
            aria-label="Criar aula"
            className="schedule-free-slot-action-btn bg-[#0d1f3c] text-white hover:brightness-110"
          >
            <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onRequestBlock}
            aria-label="Bloquear horário"
            className="schedule-free-slot-action-btn border border-[#0d1f3c]/20 bg-white text-[#0d1f3c] hover:border-accent/40"
          >
            <HiLockClosed className="h-4 w-4 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
