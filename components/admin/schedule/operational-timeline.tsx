"use client";

import { useCallback, useMemo, useState } from "react";
import type { ScheduleEvent, ScheduleViewKey } from "@/lib/contracts/schedule";
import { ScheduleServiceMock } from "@/services/schedule/scheduleServiceMock";
import { HiLockClosed, HiPlus } from "react-icons/hi2";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import { TimelineSlotCard } from "./timeline-slot-card";
import { FreeSlotCard } from "./free-slot-card";
import { ScheduleViewToggle } from "./schedule-tabs";

type Props = {
  selectedDate: string;
  events: ScheduleEvent[];
  dateLabel: string;
  onEventClick: (id: string) => void;
  onCreateClass?: (time?: string) => void;
  /** Feedback após bloqueio inline no slot (não abre o drawer). */
  onBlockConfirmed?: (message: string) => void;
  /** Abre o drawer de bloqueio (ex.: dia vazio). */
  onOpenBlockDrawer?: () => void;
  view: ScheduleViewKey;
  onViewChange: (view: ScheduleViewKey) => void;
};

type BlockConfirmState = {
  time: string;
  category: string;
};

type UnblockConfirmState = {
  time: string;
  category: string;
};

function slotKey(date: string, time: string) {
  return `${date}:${time}`;
}

export function OperationalTimeline({
  selectedDate,
  events,
  dateLabel,
  onEventClick,
  onCreateClass,
  onBlockConfirmed,
  onOpenBlockDrawer,
  view,
  onViewChange,
}: Props) {
  const summary = ScheduleServiceMock.getDaySummary(selectedDate);
  const rows = ScheduleServiceMock.buildDayTimeline(selectedDate, events);
  const isEmpty = summary?.bookingCount === 0;

  const [blockedSlots, setBlockedSlots] = useState<Set<string>>(
    () => new Set([slotKey(selectedDate, "13:00")])
  );
  const [blockConfirm, setBlockConfirm] = useState<BlockConfirmState | null>(
    null
  );
  const [unblockConfirm, setUnblockConfirm] =
    useState<UnblockConfirmState | null>(null);

  const isBlocked = useCallback(
    (time: string) => blockedSlots.has(slotKey(selectedDate, time)),
    [blockedSlots, selectedDate]
  );

  const confirmBlock = useCallback(() => {
    if (!blockConfirm) return;
    const { time, category } = blockConfirm;
    setBlockedSlots((prev) => {
      const next = new Set(prev);
      next.add(slotKey(selectedDate, time));
      return next;
    });
    const categoryLabel = ScheduleServiceMock.formatEventCategory(category);
    onBlockConfirmed?.(
      `Horário ${time} (${categoryLabel}) bloqueado neste dia.`,
    );
    setBlockConfirm(null);
  }, [blockConfirm, onBlockConfirmed, selectedDate]);

  const unblockSlot = useCallback(() => {
    if (!unblockConfirm) return;
    const { time } = unblockConfirm;
    setBlockedSlots((prev) => {
      const next = new Set(prev);
      next.delete(slotKey(selectedDate, time));
      return next;
    });
    onBlockConfirmed?.(`Horário ${time} desbloqueado neste dia.`);
    setUnblockConfirm(null);
  }, [unblockConfirm, onBlockConfirmed, selectedDate]);

  const blockConfirmMessage = useMemo(() => {
    if (!blockConfirm) return "";
    const categoryLabel = ScheduleServiceMock.formatEventCategory(
      blockConfirm.category,
    );
    return `Deseja bloquear o horário ${blockConfirm.time} (${categoryLabel}) neste dia? Pilotos não poderão agendar neste intervalo.`;
  }, [blockConfirm]);

  const unblockConfirmMessage = useMemo(() => {
    if (!unblockConfirm) return "";
    const categoryLabel = ScheduleServiceMock.formatEventCategory(
      unblockConfirm.category,
    );
    return `Deseja desbloquear o horário ${unblockConfirm.time} (${categoryLabel}) neste dia? Pilotos voltarão a poder agendar neste intervalo.`;
  }, [unblockConfirm]);

  return (
    <>
      <section className="schedule-day-operation w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white shadow-sm">
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-[rgba(17,17,17,0.06)] px-4 py-4 md:px-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-[#0d1f3c]">
              Operação do dia
            </h2>
            <p className="mt-1 text-xs lowercase text-neutral-500">{dateLabel}</p>
          </div>
          <ScheduleViewToggle
            active={view}
            onChange={onViewChange}
            className="min-w-0 max-w-full"
          />
        </div>

        {isEmpty ? (
          <div className="px-6 py-16 text-center">
            <p className="text-lg font-bold text-neutral-500">
              Sem agendamentos neste dia
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              A operação costuma concentrar reservas entre 1 e 2 dias antes.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => onCreateClass?.()}
                aria-label="Criar aula"
                className="schedule-slot-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0d1f3c] px-5 py-3 text-[10px] font-bold uppercase text-white"
              >
                <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
                <span className="schedule-slot-action-label">Criar aula</span>
              </button>
              <button
                type="button"
                onClick={onOpenBlockDrawer}
                aria-label="Bloquear horário"
                className="schedule-slot-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl border border-[rgba(13,31,60,0.2)] px-5 py-3 text-[10px] font-bold uppercase text-[#0d1f3c]"
              >
                <HiLockClosed className="h-4 w-4 shrink-0" aria-hidden />
                <span className="schedule-slot-action-label">Bloquear horário</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="min-w-0 max-w-full overflow-hidden px-4 py-5 md:px-6">
            <ul className="schedule-day-operation__list min-w-0 max-w-full space-y-3">
              {rows.map((row, index) => (
                <li
                  key={`${row.kind}-${row.time}-${index}`}
                  className="min-w-0 max-w-full"
                >
                  {row.kind === "free" ? (
                    <FreeSlotCard
                      time={row.time}
                      category={row.category}
                      blocked={isBlocked(row.time)}
                      onCreateClass={onCreateClass}
                      onRequestBlock={() =>
                        setBlockConfirm({
                          time: row.time,
                          category: row.category,
                        })
                      }
                      onRequestUnblock={() =>
                        setUnblockConfirm({
                          time: row.time,
                          category: row.category,
                        })
                      }
                    />
                  ) : (
                    <TimelineSlotCard
                      time={row.time}
                      events={row.events}
                      onEventClick={onEventClick}
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={blockConfirm !== null}
        title="Confirmar bloqueio"
        message={blockConfirmMessage}
        confirmLabel="Bloquear horário"
        cancelLabel="Cancelar"
        onConfirm={confirmBlock}
        onCancel={() => setBlockConfirm(null)}
      />

      <ConfirmDialog
        open={unblockConfirm !== null}
        title="Confirmar desbloqueio"
        message={unblockConfirmMessage}
        confirmLabel="Desbloquear horário"
        cancelLabel="Cancelar"
        onConfirm={unblockSlot}
        onCancel={() => setUnblockConfirm(null)}
      />
    </>
  );
}
