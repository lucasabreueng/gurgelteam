"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ScheduleEvent, ScheduleViewKey } from "@/lib/contracts/schedule";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";
import { getAppServices } from "@/lib/data-source/app-services";
import {
  collectBlockedSlotIds,
  findScheduleSlotByStart,
  indexScheduleSlotsByStart,
  isScheduleSlotBlocked,
} from "@/lib/schedule/schedule-block-slots";
import type { ScheduleBlockEntry } from "@/services/schedule/scheduleBlocksService";
import { HiLockClosed, HiPlus } from "react-icons/hi2";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import { TimelineSlotCard } from "./timeline-slot-card";
import { adminCardClass } from "@/lib/design";
import { FreeSlotCard } from "./free-slot-card";
import { ScheduleViewToggle } from "./schedule-tabs";

type Props = {
  selectedDate: string;
  events: ScheduleEvent[];
  dateLabel: string;
  onEventClick: (id: string) => void;
  onCreateClass?: (time?: string) => void;
  /** Feedback após bloqueio inline no slot (não abre o drawer). */
  onBlockConfirmed?: (message: string, isError?: boolean) => void;
  /** Abre o drawer de bloqueio (ex.: dia vazio). */
  onOpenBlockDrawer?: () => void;
  blocksRefreshToken?: number;
  view: ScheduleViewKey;
  onViewChange: (view: ScheduleViewKey) => void;
};

type BlockConfirmState = {
  time: string;
  category: string;
  level: string;
};

type UnblockConfirmState = {
  time: string;
  category: string;
  level: string;
};

export function OperationalTimeline({
  selectedDate,
  events,
  dateLabel,
  onEventClick,
  onCreateClass,
  onBlockConfirmed,
  onOpenBlockDrawer,
  blocksRefreshToken = 0,
  view,
  onViewChange,
}: Props) {
  const { schedule, scheduleBlocks } = getAppServices();

  const [scheduleSlots, setScheduleSlots] = useState<ScheduleTimeSlot[]>([]);
  const [configBlockedSlotIds, setConfigBlockedSlotIds] = useState<Set<string>>(
    new Set(),
  );
  const [dayBlocks, setDayBlocks] = useState<ScheduleBlockEntry[]>([]);
  const [blocksLoading, setBlocksLoading] = useState(false);
  const [blockSaving, setBlockSaving] = useState(false);
  const [blockConfirm, setBlockConfirm] = useState<BlockConfirmState | null>(
    null,
  );
  const [unblockConfirm, setUnblockConfirm] =
    useState<UnblockConfirmState | null>(null);

  const [slotsLoaded, setSlotsLoaded] = useState(false);

  const rows = useMemo(() => {
    if (!slotsLoaded) return [];
    return schedule.buildDayTimelineFromSlots(
      selectedDate,
      events,
      scheduleSlots,
    );
  }, [schedule, selectedDate, events, scheduleSlots, slotsLoaded]);

  const isEmpty = rows.length === 0 && slotsLoaded;

  const slotByStart = useMemo(
    () => indexScheduleSlotsByStart(scheduleSlots),
    [scheduleSlots],
  );

  const blockedSlotIds = useMemo(
    () => collectBlockedSlotIds(dayBlocks),
    [dayBlocks],
  );

  const reloadDayBlocks = useCallback(async () => {
    if (!selectedDate) return;
    const [daySchedule, blocks] = await Promise.all([
      scheduleBlocks.getDayScheduleForDate(selectedDate),
      scheduleBlocks.getBlocksForDate(selectedDate),
    ]);
    setScheduleSlots(daySchedule.slots);
    setConfigBlockedSlotIds(new Set(daySchedule.configBlockedSlotIds));
    setDayBlocks(blocks);
  }, [scheduleBlocks, selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;
    let cancelled = false;
    setBlocksLoading(true);
    setSlotsLoaded(false);

    void reloadDayBlocks()
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) {
          setBlocksLoading(false);
          setSlotsLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, blocksRefreshToken, reloadDayBlocks]);

  const isConfigBlocked = useCallback(
    (time: string) => {
      const slot = slotByStart.get(time);
      return Boolean(slot && configBlockedSlotIds.has(slot.id));
    },
    [slotByStart, configBlockedSlotIds],
  );

  const isBlocked = useCallback(
    (time: string) => {
      if (isConfigBlocked(time)) return true;
      const slot = slotByStart.get(time);
      return isScheduleSlotBlocked(slot, blockedSlotIds, dayBlocks);
    },
    [isConfigBlocked, slotByStart, blockedSlotIds, dayBlocks],
  );

  const canUnblock = useCallback(
    (time: string) => isBlocked(time) && !isConfigBlocked(time),
    [isBlocked, isConfigBlocked],
  );

  const slotDescriptor = useCallback(
    (category: string, level: string) => {
      const categoryLabel = schedule.formatEventCategory(category);
      const levelLabel = level && level !== "—" ? level : "";
      return levelLabel ? `${categoryLabel} · ${levelLabel}` : categoryLabel;
    },
    [schedule],
  );

  const confirmBlock = useCallback(() => {
    if (!blockConfirm || blockSaving) return;
    const { time, category } = blockConfirm;
    const slot =
      slotByStart.get(time) ?? findScheduleSlotByStart(scheduleSlots, time);

    if (!slot) {
      onBlockConfirmed?.(
        `Horário ${time} não encontrado na grade do dia.`,
        true,
      );
      setBlockConfirm(null);
      return;
    }

    setBlockSaving(true);
    void scheduleBlocks
      .blockSlotsForDate(selectedDate, [slot.id])
      .then(() => reloadDayBlocks())
      .then(() => {
        const categoryLabel = slotDescriptor(category, blockConfirm.level);
        onBlockConfirmed?.(
          `Horário ${time} (${categoryLabel}) bloqueado neste dia.`,
        );
        setBlockConfirm(null);
      })
      .catch(() => {
        onBlockConfirmed?.("Não foi possível bloquear o horário.", true);
      })
      .finally(() => setBlockSaving(false));
  }, [
    blockConfirm,
    blockSaving,
    slotByStart,
    scheduleSlots,
    scheduleBlocks,
    selectedDate,
    reloadDayBlocks,
    onBlockConfirmed,
    slotDescriptor,
  ]);

  const unblockSlot = useCallback(() => {
    if (!unblockConfirm || blockSaving) return;
    const { time } = unblockConfirm;
    const slot =
      slotByStart.get(time) ?? findScheduleSlotByStart(scheduleSlots, time);

    if (!slot) {
      onBlockConfirmed?.(
        `Horário ${time} não encontrado na grade do dia.`,
        true,
      );
      setUnblockConfirm(null);
      return;
    }

    setBlockSaving(true);
    void scheduleBlocks
      .unblockSlotForDate(selectedDate, slot.id)
      .then(() => reloadDayBlocks())
      .then(() => {
        onBlockConfirmed?.(`Horário ${time} desbloqueado neste dia.`);
        setUnblockConfirm(null);
      })
      .catch(() => {
        onBlockConfirmed?.("Não foi possível desbloquear o horário.", true);
      })
      .finally(() => setBlockSaving(false));
  }, [
    unblockConfirm,
    blockSaving,
    slotByStart,
    scheduleSlots,
    scheduleBlocks,
    selectedDate,
    reloadDayBlocks,
    onBlockConfirmed,
  ]);

  const blockConfirmMessage = useMemo(() => {
    if (!blockConfirm) return "";
    const label = slotDescriptor(blockConfirm.category, blockConfirm.level);
    return `Deseja bloquear o horário ${blockConfirm.time} (${label}) neste dia? Pilotos não poderão agendar neste intervalo.`;
  }, [blockConfirm, slotDescriptor]);

  const unblockConfirmMessage = useMemo(() => {
    if (!unblockConfirm) return "";
    const label = slotDescriptor(unblockConfirm.category, unblockConfirm.level);
    return `Deseja desbloquear o horário ${unblockConfirm.time} (${label}) neste dia? Pilotos voltarão a poder agendar neste intervalo.`;
  }, [unblockConfirm, slotDescriptor]);

  return (
    <>
      <section className={`schedule-day-operation ${adminCardClass} w-full min-w-0 max-w-full overflow-hidden`}>
        <div className="flex min-w-0 flex-wrap items-start justify-between gap-3 border-b border-[var(--ds-border-subtle)] px-4 py-4 md:px-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-[var(--ds-text-primary)]">
              Operação do dia
            </h2>
            <p className="mt-1 text-xs lowercase text-[var(--ds-text-muted)]">{dateLabel}</p>
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
              Nenhum horário cadastrado neste dia
            </p>
            <p className="mt-2 text-sm text-neutral-400">
              Configure a grade em Configurações → Horários ou cadastre aulas
              avulsas.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => onCreateClass?.()}
                aria-label="Criar aula"
                className="schedule-slot-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-[10px] font-bold uppercase text-white"
              >
                <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
                <span className="schedule-slot-action-label">Criar aula</span>
              </button>
              <button
                type="button"
                onClick={onOpenBlockDrawer}
                aria-label="Bloquear horário"
                className="schedule-slot-action-btn inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--ds-border-field)] px-5 py-3 text-[10px] font-bold uppercase text-[var(--ds-text-primary)]"
              >
                <HiLockClosed className="h-4 w-4 shrink-0" aria-hidden />
                <span className="schedule-slot-action-label">Bloquear horário</span>
              </button>
            </div>
          </div>
        ) : !slotsLoaded ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-neutral-500">
              Carregando grade do dia…
            </p>
          </div>
        ) : (
          <div className="min-w-0 max-w-full overflow-hidden px-4 py-5 md:px-6">
            {blocksLoading ? (
              <p className="mb-3 text-xs font-semibold text-neutral-500">
                Carregando bloqueios…
              </p>
            ) : null}
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
                      level={row.level}
                      blocked={isBlocked(row.time)}
                      configBlocked={isConfigBlocked(row.time)}
                      onCreateClass={onCreateClass}
                      onRequestBlock={
                        isBlocked(row.time)
                          ? undefined
                          : () =>
                              setBlockConfirm({
                                time: row.time,
                                category: row.category,
                                level: row.level,
                              })
                      }
                      onRequestUnblock={
                        canUnblock(row.time)
                          ? () =>
                              setUnblockConfirm({
                                time: row.time,
                                category: row.category,
                                level: row.level,
                              })
                          : undefined
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
        confirmLabel={blockSaving ? "Salvando…" : "Bloquear horário"}
        cancelLabel="Cancelar"
        onConfirm={confirmBlock}
        onCancel={() => setBlockConfirm(null)}
      />

      <ConfirmDialog
        open={unblockConfirm !== null}
        title="Confirmar desbloqueio"
        message={unblockConfirmMessage}
        confirmLabel={blockSaving ? "Salvando…" : "Desbloquear horário"}
        cancelLabel="Cancelar"
        onConfirm={unblockSlot}
        onCancel={() => setUnblockConfirm(null)}
      />
    </>
  );
}
