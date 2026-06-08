"use client";

import { useEffect, useState } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { SettingsDatePicker } from "@/components/admin/settings/settings-date-picker";
import { SettingsCheckbox } from "@/components/admin/settings/settings-checkbox";
import { ScheduleDrawerShell } from "./schedule-drawer-shell";
import { DrawerFooterActions } from "@/components/ui/drawer-footer";
import {
  adminDrawerCancelBtnClass,
  adminDrawerPrimaryBtnClass,
  adminDrawerSectionClass,
  adminLabelClass,
  adminTextareaClass,
} from "@/lib/design";
import { getAppServices } from "@/lib/data-source/app-services";
import { useClientsReference } from "@/lib/query/hooks/use-clients";
import { useScheduleMeta } from "@/lib/query/hooks/use-schedule";
import type { ScheduleBlockEntry } from "@/services/schedule/scheduleBlocksService";
import { formatScheduleCategoryLabels } from "@/lib/schedule/schedule-slot-selection";
import type { ScheduleTimeSlot } from "@/lib/contracts/settings";

type Props = {
  open: boolean;
  initialDate?: string;
  onClose: () => void;
  onSaved?: (message: string) => void;
  onError?: (message: string) => void;
};

function formatSlotLabel(
  slot: ScheduleTimeSlot,
  kartCategories: { id: string; name: string }[],
): string {
  const categoryName = formatScheduleCategoryLabels(
    slot.categoryIds,
    kartCategories,
  );
  return `${slot.start} – ${slot.end} · ${categoryName}`;
}

export function BlockScheduleDrawer({
  open,
  initialDate,
  onClose,
  onSaved,
  onError,
}: Props) {
  const { schedule, scheduleBlocks } = getAppServices();
  const { data: reference } = useClientsReference();
  const { data: meta } = useScheduleMeta();
  const defaultDate = meta?.today ?? "2026-05-21";
  const [date, setDate] = useState(() => initialDate ?? defaultDate);
  const [mode, setMode] = useState<"full" | "slots">("slots");
  const [selectedSlotIds, setSelectedSlotIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [reason, setReason] = useState("");
  const [existingBlocks, setExistingBlocks] = useState<ScheduleBlockEntry[]>([]);
  const [slots, setSlots] = useState<ScheduleTimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  useDrawerBodyLock(open);

  useEffect(() => {
    if (!open) return;
    setDate(initialDate ?? defaultDate);
    setMode("slots");
    setSelectedSlotIds(new Set());
    setReason("");

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
    let cancelled = false;
    setLoading(true);

    void Promise.all([
      scheduleBlocks.getAllScheduleSlotsForDate(date),
      scheduleBlocks.getBlocksForDate(date),
    ])
      .then(([nextSlots, blocks]) => {
        if (cancelled) return;
        setSlots(nextSlots);
        setExistingBlocks(blocks);
        setSelectedSlotIds(new Set());
      })
      .catch(() => {
        if (!cancelled) onError?.("Não foi possível carregar os horários.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date, open, scheduleBlocks, onError]);

  const toggleSlot = (slotId: string) => {
    setSelectedSlotIds((prev) => {
      const next = new Set(prev);
      if (next.has(slotId)) next.delete(slotId);
      else next.add(slotId);
      return next;
    });
  };

  const handleSave = async () => {
    if (slots.length === 0 || saving) return;

    const slotIds =
      mode === "full" ? slots.map((s) => s.id) : [...selectedSlotIds];

    if (slotIds.length === 0) return;

    setSaving(true);
    try {
      await scheduleBlocks.saveScheduleBlock({
        date,
        slotIds,
        fullDay: mode === "full",
        reason,
      });

      const blocks = await scheduleBlocks.getBlocksForDate(date);
      setExistingBlocks(blocks);
      onSaved?.(
        mode === "full"
          ? `Dia ${schedule.formatDateLower(date)} bloqueado por completo.`
          : `${slotIds.length} horário(s) bloqueado(s) em ${schedule.formatDateLower(date)}.`,
      );
      onClose();
    } catch {
      onError?.("Não foi possível salvar o bloqueio.");
    } finally {
      setSaving(false);
    }
  };

  const canSave =
    !loading &&
    !saving &&
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
            disabled={saving}
            className={adminDrawerCancelBtnClass}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => void handleSave()}
            className={adminDrawerPrimaryBtnClass}
          >
            {saving ? "Salvando…" : "Salvar bloqueio"}
          </button>
        </DrawerFooterActions>
      }
    >
      <div className="space-y-5 p-4 md:p-5">
            <div className={adminDrawerSectionClass}>
              <label className={adminLabelClass}>
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

            <div className={adminDrawerSectionClass}>
              <p className={adminLabelClass}>
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
                        : "border-[var(--ds-border-field)] hover:border-accent/25"
                    }`}
                  >
                    <input
                      type="radio"
                      name="block-mode"
                      checked={mode === key}
                      onChange={() => setMode(key)}
                      className="accent-accent"
                    />
                    <span className="text-sm font-semibold text-[var(--ds-text-primary)]">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {mode === "slots" ? (
              <div className={adminDrawerSectionClass}>
                <p className={adminLabelClass}>
                  Horários da grade
                </p>
                {loading ? (
                  <p className="mt-3 text-sm text-[var(--ds-text-muted)]">
                    Carregando horários…
                  </p>
                ) : slots.length === 0 ? (
                  <p className="mt-3 text-sm text-[var(--ds-text-muted)]">
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
                                ? "border-accent/30 bg-accent/[0.06]"
                                : "border-[var(--ds-border-field)] bg-[var(--ds-bg-muted)] hover:border-accent/25"
                            }`}
                          >
                            <SettingsCheckbox
                              checked={checked}
                              onChange={() => toggleSlot(slot.id)}
                              aria-label={formatSlotLabel(slot, reference?.categories ?? [])}
                            />
                            <button
                              type="button"
                              onClick={() => toggleSlot(slot.id)}
                              className="min-w-0 flex-1 text-left text-sm font-medium text-[var(--ds-text-primary)]"
                            >
                              {formatSlotLabel(slot, reference?.categories ?? [])}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--ds-warning-border)] bg-[var(--ds-warning-bg)] px-4 py-3 text-sm text-[var(--ds-warning-text)]">
                {loading
                  ? "Carregando horários…"
                  : slots.length === 0
                  ? "Não há horários cadastrados para bloquear neste dia."
                  : `Todos os ${slots.length} horário(s) de ${schedule.formatDateLower(date)} ficarão indisponíveis para agendamento.`}
              </div>
            )}

            <div className={adminDrawerSectionClass}>
              <label htmlFor="block-reason" className={adminLabelClass}>
                Motivo (opcional)
              </label>
              <textarea
                id="block-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Ex.: Manutenção na pista, evento corporativo…"
                className={`${adminTextareaClass} mt-2 min-h-0`}
              />
            </div>

            {existingBlocks.length > 0 ? (
              <div className={adminDrawerSectionClass}>
                <p className={adminLabelClass}>
                  Bloqueios nesta data
                </p>
                <ul className="mt-2 space-y-2">
                  {existingBlocks.map((block) => (
                    <li
                      key={block.id}
                      className="rounded-lg bg-[var(--ds-bg-muted)] px-3 py-2 text-xs text-[var(--ds-text-secondary)]"
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
