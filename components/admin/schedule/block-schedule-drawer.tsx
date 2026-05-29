"use client";

import { useEffect, useMemo, useState } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { SettingsDatePicker } from "@/components/admin/settings/settings-date-picker";
import { SettingsCheckbox } from "@/components/admin/settings/settings-checkbox";
import { ScheduleDrawerShell } from "./schedule-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import {
  ScheduleBlocksServiceMock,
  type ScheduleBlockEntry,
} from "@/services/schedule/scheduleBlocksServiceMock";
import { getAppServices } from "@/lib/data-source/app-services";
import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";
import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

type Props = {
  open: boolean;
  initialDate?: string;
  onClose: () => void;
  onSaved?: (message: string) => void;
};

function categoryName(categoryId: string): string {
  return (
    SettingsServiceMock.getKartCategories().find((c) => c.id === categoryId)
      ?.name ?? categoryId
  );
}

function slotLabel(slot: ScheduleTimeSlot): string {
  return `${slot.start} – ${slot.end} · ${categoryName(slot.categoryId)}`;
}

export function BlockScheduleDrawer({
  open,
  initialDate,
  onClose,
  onSaved,
}: Props) {
  const schedule = getAppServices().schedule;
  const { data: meta } = useScheduleMeta();
  const defaultDate = meta?.today ?? "2026-05-21";
  const [date, setDate] = useState(() => initialDate ?? defaultDate);
  const [mode, setMode] = useState<"full" | "slots">("slots");
  const [selectedSlotIds, setSelectedSlotIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [reason, setReason] = useState("");
  const [existingBlocks, setExistingBlocks] = useState<ScheduleBlockEntry[]>([]);
  useDrawerBodyLock(open);


  const slots = useMemo(
    () => ScheduleBlocksServiceMock.getAllScheduleSlotsForDate(date),
    [date],
  );

  useEffect(() => {
    if (!open) return;
    setDate(initialDate ?? defaultDate);
    setMode("slots");
    setSelectedSlotIds(new Set());
    setReason("");
    setExistingBlocks(
      ScheduleBlocksServiceMock.getBlocksForDate(
        initialDate ?? defaultDate,
      ),
    );

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      };
  }, [open, initialDate, onClose, defaultDate]);

  useEffect(() => {
    if (!open) return;
    setExistingBlocks(ScheduleBlocksServiceMock.getBlocksForDate(date));
    setSelectedSlotIds(new Set());
  }, [date, open]);

  const toggleSlot = (slotId: string) => {
    setSelectedSlotIds((prev) => {
      const next = new Set(prev);
      if (next.has(slotId)) next.delete(slotId);
      else next.add(slotId);
      return next;
    });
  };

  const handleSave = () => {
    if (slots.length === 0) return;

    const slotIds =
      mode === "full" ? slots.map((s) => s.id) : [...selectedSlotIds];

    if (slotIds.length === 0) return;

    ScheduleBlocksServiceMock.saveScheduleBlock({
      date,
      slotIds,
      fullDay: mode === "full",
      reason,
    });

    setExistingBlocks(ScheduleBlocksServiceMock.getBlocksForDate(date));
    onSaved?.(
      mode === "full"
        ? `Dia ${schedule.formatDateLower(date)} bloqueado por completo.`
        : `${slotIds.length} horário(s) bloqueado(s) em ${schedule.formatDateLower(date)}.`,
    );
    onClose();
  };

  const canSave =
    slots.length > 0 &&
    (mode === "full" || selectedSlotIds.size > 0);

  return (
    <ScheduleDrawerShell
      open={open}
      onClose={onClose}
      title="Bloquear horário"
      titleId="block-schedule-drawer-title"
      description="Indisponibilize um dia inteiro ou horários específicos."
      footer={
        <DrawerFooterActions columns={2}>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[rgba(13,31,60,0.2)] py-3 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="rounded-xl bg-[#0d1f3c] py-3 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Salvar bloqueio
          </button>
        </DrawerFooterActions>
      }
    >
      <div className="space-y-5 p-4 md:p-5">
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Data
              </label>
              <div className="mt-2">
                <SettingsDatePicker
                  value={date}
                  onChange={setDate}
                  aria-label="Data do bloqueio"
                />
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Tipo de bloqueio
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(
                  [
                    ["full", "Dia inteiro"],
                    ["slots", "Horários específicos"],
                  ] as const
                ).map(([key, label]) => (
                  <label
                    key={key}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 transition ${
                      mode === key
                        ? "border-accent/40 bg-accent/5 ring-1 ring-accent/30"
                        : "border-[rgba(17,17,17,0.1)] hover:border-[rgba(17,17,17,0.18)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="block-mode"
                      checked={mode === key}
                      onChange={() => setMode(key)}
                      className="accent-accent"
                    />
                    <span className="text-sm font-semibold text-[#0d1f3c]">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {mode === "slots" ? (
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Horários da grade
                </p>
                {slots.length === 0 ? (
                  <p className="mt-3 text-sm text-neutral-500">
                    Não há horários cadastrados para este dia da semana.
                  </p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {slots.map((slot) => {
                      const checked = selectedSlotIds.has(slot.id);
                      return (
                        <li key={slot.id}>
                          <div
                            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                              checked
                                ? "border-accent/30 bg-[rgba(13,31,60,0.04)]"
                                : "border-[rgba(17,17,17,0.1)] bg-[#fafbfc] hover:border-accent/25"
                            }`}
                          >
                            <SettingsCheckbox
                              checked={checked}
                              onChange={() => toggleSlot(slot.id)}
                              aria-label={slotLabel(slot)}
                            />
                            <button
                              type="button"
                              onClick={() => toggleSlot(slot.id)}
                              className="min-w-0 flex-1 text-left text-sm font-medium text-[#0d1f3c]"
                            >
                              {slotLabel(slot)}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 px-4 py-3 text-sm text-amber-950">
                {slots.length === 0
                  ? "Não há horários cadastrados para bloquear neste dia."
                  : `Todos os ${slots.length} horário(s) de ${schedule.formatDateLower(date)} ficarão indisponíveis para agendamento.`}
              </div>
            )}

            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
              <label
                htmlFor="block-reason"
                className="text-[10px] font-bold uppercase tracking-wider text-neutral-500"
              >
                Motivo (opcional)
              </label>
              <textarea
                id="block-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Ex.: Manutenção na pista, evento corporativo…"
                className="mt-2 w-full resize-none rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-3 py-2.5 text-sm text-[#0d1f3c] outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {existingBlocks.length > 0 ? (
              <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-[rgba(17,17,17,0.06)]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Bloqueios nesta data
                </p>
                <ul className="mt-2 space-y-2">
                  {existingBlocks.map((block) => (
                    <li
                      key={block.id}
                      className="rounded-lg bg-neutral-50 px-3 py-2 text-xs text-neutral-700"
                    >
                      {block.fullDay
                        ? "Dia inteiro"
                        : `${block.slotIds.length} horário(s)`}
                      {block.reason ? ` · ${block.reason}` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
      </div>
    </ScheduleDrawerShell>
  );
}
