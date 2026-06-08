"use client";

import { HiLockClosed, HiLockOpen, HiPlus } from "react-icons/hi2";
import { getAppServices } from "@/lib/data-source/app-services";
import {
  scheduleBlockedSlotCardClass,
  scheduleFreeSlotActionOutlineClass,
  scheduleFreeSlotActionPrimaryClass,
  scheduleFreeSlotCardClass,
} from "@/lib/design";

type Props = {
  time: string;
  category: string;
  level: string;
  blocked?: boolean;
  /** Bloqueio via Configurações → Horários → Bloqueios (somente leitura na agenda). */
  configBlocked?: boolean;
  onCreateClass?: (time?: string) => void;
  onRequestBlock?: () => void;
  onRequestUnblock?: () => void;
};

function SlotInfo({
  time,
  title,
  titleClass,
  categoryLabel,
  levelLabel,
  hint,
}: {
  time: string;
  title: string;
  titleClass: string;
  categoryLabel: string;
  levelLabel: string;
  hint?: string;
}) {
  return (
    <div className="schedule-free-slot-card__info">
      <p className={`text-[10px] font-bold uppercase tracking-wider ${titleClass}`}>
        <span className="tabular-nums">{time}</span>
        <span className="mx-1.5 opacity-70">·</span>
        {title}
      </p>
      <p className="mt-1 text-xs text-[var(--ds-text-secondary)]">
        Categoria:{" "}
        <span className="font-bold text-[var(--ds-text-primary)]">{categoryLabel}</span>
      </p>
      {levelLabel && levelLabel !== "—" ? (
        <p className="mt-0.5 text-xs text-[var(--ds-text-secondary)]">
          Nível:{" "}
          <span className="font-bold text-[var(--ds-text-primary)]">{levelLabel}</span>
        </p>
      ) : null}
      {hint ? (
        <p className="mt-1 text-[11px] text-[var(--ds-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

export function FreeSlotCard({
  time,
  category,
  level,
  blocked = false,
  configBlocked = false,
  onCreateClass,
  onRequestBlock,
  onRequestUnblock,
}: Props) {
  const { schedule } = getAppServices();
  const categoryLabel = schedule.formatEventCategory(category);

  if (blocked) {
    return (
      <div className={scheduleBlockedSlotCardClass}>
        <div className="schedule-free-slot-card__body">
          <SlotInfo
            time={time}
            title="Horário bloqueado"
            titleClass="text-[var(--ds-warning-text)]"
            categoryLabel={categoryLabel}
            levelLabel={level}
            hint={
              configBlocked
                ? "Bloqueio de programação (Configurações → Horários)."
                : undefined
            }
          />
          {onRequestUnblock ? (
            <div className="schedule-free-slot-actions">
              <button
                type="button"
                onClick={onRequestUnblock}
                aria-label="Desbloquear horário"
                className={scheduleFreeSlotActionOutlineClass}
              >
                <HiLockOpen className="h-4 w-4 shrink-0" aria-hidden />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={scheduleFreeSlotCardClass}>
      <div className="schedule-free-slot-card__body">
        <SlotInfo
          time={time}
          title="Horário livre"
          titleClass="text-[var(--ds-success-text)]"
          categoryLabel={categoryLabel}
          levelLabel={level}
        />
        <div className="schedule-free-slot-actions">
          <button
            type="button"
            onClick={() => onCreateClass?.(time)}
            aria-label="Criar aula"
            className={scheduleFreeSlotActionPrimaryClass}
          >
            <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
          </button>
          {onRequestBlock ? (
            <button
              type="button"
              onClick={onRequestBlock}
              aria-label="Bloquear horário"
              className={scheduleFreeSlotActionOutlineClass}
            >
              <HiLockClosed className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
