"use client";

import type { KartCategory, SkillLevel, WeekDaySchedule, SpecificDateSchedule, ScheduleException, ScheduleTimeSlot } from "@/lib/contracts/settings";

import { SettingsServiceMock } from "@/services/settings/settingsServiceMock";

import { useCallback, useEffect, useState } from "react";
import { HiCheck, HiChevronDown, HiPlus, HiTrash } from "react-icons/hi2";

import { ConfirmDialog } from "./confirm-dialog";
import { SettingsDatePicker } from "./settings-date-picker";
import { SettingsDropdown } from "./settings-dropdown";
import { SettingsTimeInput } from "./settings-time-input";
import {
  SettingsField,
  SettingsSection,
  settingsInputClass,
  settingsOutlineButtonClass,
} from "./settings-section";

type Props = {
  kartCategories: KartCategory[];
  skillLevels: SkillLevel[];
  onDirty: () => void;
};

type View = "grade" | "bloqueios" | "especifico";

type PendingDelete =
  | { type: "slot"; dayKey: string; slotId: string; label: string }
  | { type: "specificDate"; id: string; label: string }
  | { type: "specificDateSlot"; scheduleId: string; slotId: string; label: string }
  | { type: "exception"; id: string; label: string }
  | null;

function cloneSchedule(
  days: WeekDaySchedule[],
  specificDates: SpecificDateSchedule[],
  exceptions: ScheduleException[]
) {
  return {
    days: days.map((d) => ({
      ...d,
      slots: d.slots.map((s) => ({ ...s })),
    })),
    specificDates: specificDates.map((d) => ({
      ...d,
      slots: d.slots.map((s) => ({ ...s })),
    })),
    exceptions: exceptions.map((e) => ({ ...e, slotIds: [...e.slotIds] })),
  };
}

function syncSlotCategories(
  slots: ScheduleTimeSlot[],
  kartCategories: KartCategory[],
  skillLevels: SkillLevel[]
): ScheduleTimeSlot[] {
  const catFallback = kartCategories[0]?.id;
  const levelFallback = skillLevels[0]?.id;
  if (!catFallback || !levelFallback) return slots;
  return slots.map((s) => ({
    ...s,
    categoryId: kartCategories.some((c) => c.id === s.categoryId)
      ? s.categoryId
      : catFallback,
    levelId: skillLevels.some((l) => l.id === s.levelId)
      ? s.levelId
      : levelFallback,
  }));
}

function formatExceptionDate(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function slotsForDate(
  days: WeekDaySchedule[],
  isoDate: string
): ScheduleTimeSlot[] {
  const dayKey = SettingsServiceMock.getWeekDayKeyFromDate(isoDate);
  if (!dayKey) return [];
  return days.find((d) => d.dayKey === dayKey)?.slots ?? [];
}

function ExceptionSlotPicker({
  days,
  date,
  selectedIds,
  kartCategories,
  skillLevels,
  onChange,
}: {
  days: WeekDaySchedule[];
  date: string;
  selectedIds: string[];
  kartCategories: KartCategory[];
  skillLevels: SkillLevel[];
  onChange: (slotIds: string[]) => void;
}) {
  const slots = slotsForDate(days, date);
  const categoryName = (id: string) =>
    kartCategories.find((c) => c.id === id)?.name ?? "—";
  const levelName = (id: string) =>
    skillLevels.find((l) => l.id === id)?.name ?? "—";

  if (!date) {
    return (
      <p className="text-sm text-neutral-500">
        Selecione uma data para ver os horários da grade.
      </p>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-amber-800">
        Não há horários na grade para este dia da semana.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {slots.map((slot) => {
        const checked = selectedIds.includes(slot.id);
        return (
          <li key={slot.id}>
            <button
              type="button"
              aria-pressed={checked}
              onClick={() =>
                onChange(
                  checked
                    ? selectedIds.filter((id) => id !== slot.id)
                    : [...selectedIds, slot.id]
                )
              }
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                checked
                  ? "border-accent bg-[rgba(13,31,60,0.08)]"
                  : "border-[rgba(17,17,17,0.1)] bg-[#fafbfc] hover:border-accent/30"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                  checked
                    ? "border-accent bg-accent text-white"
                    : "border-[rgba(17,17,17,0.1)] bg-white"
                }`}
                aria-hidden
              >
                {checked ? (
                  <HiCheck className="h-3.5 w-3.5" strokeWidth={3} />
                ) : null}
              </span>
              <span className="min-w-0 flex-1 text-sm">
                <span className="block text-[14px] font-semibold text-[#111]">
                  {slot.start} – {slot.end}
                </span>
                <span className="mt-0.5 block text-neutral-500">
                  {categoryName(slot.categoryId)} · {levelName(slot.levelId)}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

type DaySlotsListProps = {
  slots: ScheduleTimeSlot[];
  kartCategories: KartCategory[];
  skillLevels: SkillLevel[];
  canConfigure: boolean;
  onUpdateSlot: (slotId: string, patch: Partial<ScheduleTimeSlot>) => void;
  onAddSlot: () => void;
  onRequestRemoveSlot: (slot: ScheduleTimeSlot) => void;
};

function DaySlotsList({
  slots,
  kartCategories,
  skillLevels,
  canConfigure,
  onUpdateSlot,
  onAddSlot,
  onRequestRemoveSlot,
}: DaySlotsListProps) {
  if (slots.length === 0) {
    return (
      <p className="text-center text-sm text-neutral-500">
        Nenhum horário neste dia.{" "}
        <button
          type="button"
          className="font-semibold text-accent underline"
          disabled={!canConfigure}
          onClick={onAddSlot}
        >
          Adicionar horário
        </button>
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {slots.map((slot) => (
        <li
          key={slot.id}
          className="grid gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4 sm:grid-cols-[1fr_1fr_1.1fr_1.1fr_auto]"
        >
          <SettingsField label="Início">
            <SettingsTimeInput
              aria-label="Horário de início"
              value={slot.start}
              onChange={(start) => onUpdateSlot(slot.id, { start })}
            />
          </SettingsField>
          <SettingsField label="Fim">
            <SettingsTimeInput
              aria-label="Horário de fim"
              value={slot.end}
              onChange={(end) => onUpdateSlot(slot.id, { end })}
            />
          </SettingsField>
          <SettingsField label="Categoria">
            <SettingsDropdown
              aria-label="Categoria do horário"
              value={slot.categoryId}
              options={kartCategories.map((c) => ({
                value: c.id,
                label: c.name,
              }))}
              onSelect={(categoryId) => onUpdateSlot(slot.id, { categoryId })}
              disabled={kartCategories.length === 0}
            />
          </SettingsField>
          <SettingsField label="Nível">
            <SettingsDropdown
              aria-label="Nível do horário"
              value={slot.levelId}
              options={skillLevels.map((l) => ({
                value: l.id,
                label: l.name,
              }))}
              onSelect={(levelId) => onUpdateSlot(slot.id, { levelId })}
              disabled={skillLevels.length === 0}
            />
          </SettingsField>
          <div className="flex items-end justify-end pb-1">
            <button
              type="button"
              onClick={() => onRequestRemoveSlot(slot)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c41e3a]/20 text-[#c41e3a] transition hover:bg-red-50"
              aria-label="Remover horário"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ScheduleHoursPanel({
  kartCategories,
  skillLevels,
  onDirty,
}: Props) {
  const initial = cloneSchedule(
    SettingsServiceMock.getWeekSchedule(),
    SettingsServiceMock.getSpecificDateSchedules(),
    SettingsServiceMock.getScheduleExceptions()
  );
  const [days, setDays] = useState(initial.days);
  const [specificDateSchedules, setSpecificDateSchedules] = useState(
    initial.specificDates
  );
  const [exceptions, setExceptions] = useState(initial.exceptions);
  const [view, setView] = useState<View>("grade");
  const [expandedDay, setExpandedDay] = useState<string | null>(
    SettingsServiceMock.getWeekSchedule()[0]?.dayKey ?? null
  );
  const [expandedExceptionId, setExpandedExceptionId] = useState<string | null>(
    SettingsServiceMock.getScheduleExceptions()[0]?.id ?? null
  );
  const [expandedSpecificId, setExpandedSpecificId] = useState<string | null>(
    null
  );
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);

  const touch = () => onDirty();

  const defaultCategoryId = () => kartCategories[0]?.id ?? "";
  const defaultLevelId = () => skillLevels[0]?.id ?? "";

  useEffect(() => {
    if (!kartCategories.length || !skillLevels.length) return;

    setDays((prev) =>
      prev.map((d) => ({
        ...d,
        slots: syncSlotCategories(d.slots, kartCategories, skillLevels),
      }))
    );
    setSpecificDateSchedules((prev) =>
      prev.map((d) => ({
        ...d,
        slots: syncSlotCategories(d.slots, kartCategories, skillLevels),
      }))
    );
  }, [kartCategories, skillLevels]);

  const toggleDay = useCallback((dayKey: string) => {
    setExpandedDay((prev) => (prev === dayKey ? null : dayKey));
  }, []);

  const updateException = (id: string, patch: Partial<ScheduleException>) => {
    setExceptions((prev) =>
      prev
        .map((e) => (e.id === id ? { ...e, ...patch } : e))
        .sort((a, b) => a.date.localeCompare(b.date))
    );
    touch();
  };

  const removeException = (id: string) => {
    setExceptions((prev) => {
      const next = prev.filter((e) => e.id !== id);
      setExpandedExceptionId((open) => {
        if (open !== id) return open;
        return next[0]?.id ?? null;
      });
      return next;
    });
    touch();
  };

  const addException = () => {
    const created = SettingsServiceMock.createScheduleException();
    setExceptions((prev) =>
      [...prev, created].sort((a, b) => a.date.localeCompare(b.date))
    );
    setExpandedExceptionId(created.id);
    touch();
  };

  const toggleException = useCallback((exceptionId: string) => {
    setExpandedExceptionId((prev) =>
      prev === exceptionId ? null : exceptionId
    );
  }, []);

  const updateSpecificDate = (
    id: string,
    patch: Partial<SpecificDateSchedule>
  ) => {
    setSpecificDateSchedules((prev) =>
      prev
        .map((d) => (d.id === id ? { ...d, ...patch } : d))
        .sort((a, b) => a.date.localeCompare(b.date))
    );
    touch();
  };

  const removeSpecificDate = (id: string) => {
    setSpecificDateSchedules((prev) => {
      const next = prev.filter((d) => d.id !== id);
      setExpandedSpecificId((open) => {
        if (open !== id) return open;
        return next[0]?.id ?? null;
      });
      return next;
    });
    touch();
  };

  const addSpecificDate = () => {
    const created = SettingsServiceMock.createSpecificDateSchedule();
    setSpecificDateSchedules((prev) =>
      [...prev, created].sort((a, b) => a.date.localeCompare(b.date))
    );
    setExpandedSpecificId(created.id);
    touch();
  };

  const toggleSpecificDate = useCallback((scheduleId: string) => {
    setExpandedSpecificId((prev) =>
      prev === scheduleId ? null : scheduleId
    );
  }, []);

  const updateSpecificDateSlot = (
    scheduleId: string,
    slotId: string,
    patch: Partial<ScheduleTimeSlot>
  ) => {
    setSpecificDateSchedules((prev) =>
      prev.map((d) =>
        d.id === scheduleId
          ? {
              ...d,
              slots: d.slots.map((s) =>
                s.id === slotId ? { ...s, ...patch } : s
              ),
            }
          : d
      )
    );
    touch();
  };

  const addSpecificDateSlot = (scheduleId: string) => {
    const catId = defaultCategoryId();
    const levelId = defaultLevelId();
    if (!catId || !levelId) return;
    setSpecificDateSchedules((prev) =>
      prev.map((d) =>
        d.id === scheduleId
          ? {
              ...d,
              slots: [
                ...d.slots,
                SettingsServiceMock.createSpecificDateTimeSlot(scheduleId, catId, levelId),
              ],
            }
          : d
      )
    );
    touch();
  };

  const removeSpecificDateSlot = (scheduleId: string, slotId: string) => {
    setSpecificDateSchedules((prev) =>
      prev.map((d) =>
        d.id === scheduleId
          ? { ...d, slots: d.slots.filter((s) => s.id !== slotId) }
          : d
      )
    );
    touch();
  };

  const addSlot = (dayKey: string) => {
    const catId = defaultCategoryId();
    const levelId = defaultLevelId();
    if (!catId || !levelId) return;
    setDays((prev) =>
      prev.map((d) =>
        d.dayKey === dayKey
          ? { ...d, slots: [...d.slots, SettingsServiceMock.createTimeSlot(catId, levelId)] }
          : d
      )
    );
    setExpandedDay(dayKey);
    touch();
  };

  const updateSlot = (
    dayKey: string,
    slotId: string,
    patch: Partial<ScheduleTimeSlot>
  ) => {
    setDays((prev) =>
      prev.map((d) =>
        d.dayKey === dayKey
          ? {
              ...d,
              slots: d.slots.map((s) =>
                s.id === slotId ? { ...s, ...patch } : s
              ),
            }
          : d
      )
    );
    touch();
  };

  const removeSlot = (dayKey: string, slotId: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.dayKey === dayKey
          ? { ...d, slots: d.slots.filter((s) => s.id !== slotId) }
          : d
      )
    );
    setExceptions((prev) =>
      prev.map((ex) => ({
        ...ex,
        slotIds: ex.slotIds.filter((id) => id !== slotId),
      }))
    );
    touch();
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.type === "slot") {
      removeSlot(pendingDelete.dayKey, pendingDelete.slotId);
    } else if (pendingDelete.type === "specificDate") {
      removeSpecificDate(pendingDelete.id);
    } else if (pendingDelete.type === "specificDateSlot") {
      removeSpecificDateSlot(
        pendingDelete.scheduleId,
        pendingDelete.slotId
      );
    } else {
      removeException(pendingDelete.id);
    }
    setPendingDelete(null);
  };

  const sortedExceptions = [...exceptions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const sortedSpecificDates = [...specificDateSchedules].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  const categoryName = (id: string) =>
    kartCategories.find((c) => c.id === id)?.name ?? "—";

  const levelName = (id: string) =>
    skillLevels.find((l) => l.id === id)?.name ?? "—";

  const canConfigure =
    kartCategories.length > 0 && skillLevels.length > 0;

  const viewToggle = (
    <div className="inline-flex flex-wrap rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] p-1">
      {(
        [
          ["grade", "Grade"],
          ["especifico", "Específico"],
          ["bloqueios", "Bloqueios"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setView(key)}
          className={`rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
            view === key
              ? "bg-[#0d1f3c] text-white shadow-sm"
              : "text-neutral-600 hover:text-[#0d1f3c]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  return (
    <SettingsSection
      title="Horários"
      description="Grade semanal, horários por data específica e bloqueios."
      headerAction={viewToggle}
    >
      {!canConfigure ? (
        <p className="mb-6 rounded-xl border border-dashed border-amber-200/80 bg-amber-50/50 px-4 py-3 text-sm text-amber-900">
          Cadastre categorias e níveis em{" "}
          <strong>Categorias e níveis</strong> para configurar horários.
        </p>
      ) : null}

      {view === "bloqueios" ? (
        <div>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
                Bloqueios de programação
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Marque horários indisponíveis em datas específicas.
              </p>
            </div>
            <button
              type="button"
              disabled={!canConfigure}
              onClick={addException}
              className={settingsOutlineButtonClass}
            >
              <HiPlus className="h-3.5 w-3.5" aria-hidden />
              Novo bloqueio
            </button>
          </div>

          {sortedExceptions.length > 0 ? (
            <ul className="space-y-3" role="list">
              {sortedExceptions.map((ex) => {
                const isOpen = expandedExceptionId === ex.id;
                const panelId = `exception-panel-${ex.id}`;
                const triggerId = `exception-trigger-${ex.id}`;
                const slotCount = ex.slotIds.length;

                return (
                  <li
                    key={ex.id}
                    className={`rounded-2xl border transition ${
                      isOpen
                        ? "overflow-visible border-accent/25 bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)]"
                        : "overflow-hidden border-[rgba(17,17,17,0.08)] bg-[#fafbfc]"
                    }`}
                  >
                    <div className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4">
                      <button
                        id={triggerId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleException(ex.id)}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                          isOpen
                            ? "bg-accent text-white"
                            : "bg-[rgba(13,31,60,0.07)] text-accent"
                        }`}
                        aria-label={
                          isOpen ? "Recolher bloqueio" : "Expandir bloqueio"
                        }
                      >
                        <HiChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        />
                      </button>

                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => toggleException(ex.id)}
                      >
                        <span className="block text-base font-bold capitalize text-[#0d1f3c] md:text-lg">
                          {ex.date
                            ? formatExceptionDate(ex.date)
                            : "Novo bloqueio"}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-neutral-500">
                          {slotCount}{" "}
                          {slotCount === 1
                            ? "horário indisponível"
                            : "horários indisponíveis"}
                          {ex.reason ? ` · ${ex.reason}` : ""}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDelete({
                            type: "exception",
                            id: ex.id,
                            label: ex.date
                              ? formatExceptionDate(ex.date)
                              : "bloqueio",
                          });
                        }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c41e3a]/20 text-[#c41e3a] transition hover:bg-red-50"
                        aria-label="Remover bloqueio"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </div>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      hidden={!isOpen}
                      className={isOpen ? "block" : "hidden"}
                    >
                      <div className="space-y-4 border-t border-[rgba(17,17,17,0.08)] px-4 pb-5 pt-4 md:px-5 md:pb-6 md:pt-5">
                        <SettingsField label="Data">
                          <SettingsDatePicker
                            aria-label="Data do bloqueio"
                            value={ex.date}
                            onChange={(date) => {
                              const validIds = slotsForDate(days, date).map(
                                (s) => s.id
                              );
                              updateException(ex.id, {
                                date,
                                slotIds: ex.slotIds.filter((id) =>
                                  validIds.includes(id)
                                ),
                              });
                            }}
                          />
                        </SettingsField>
                        <SettingsField label="Horários indisponíveis">
                          <ExceptionSlotPicker
                            days={days}
                            date={ex.date}
                            selectedIds={ex.slotIds}
                            kartCategories={kartCategories}
                            skillLevels={skillLevels}
                            onChange={(slotIds) =>
                              updateException(ex.id, { slotIds })
                            }
                          />
                        </SettingsField>
                        <SettingsField label="Motivo">
                          <input
                            className={settingsInputClass}
                            value={ex.reason}
                            placeholder="Ex.: Evento reservado na pista"
                            onChange={(e) =>
                              updateException(ex.id, {
                                reason: e.target.value,
                              })
                            }
                          />
                        </SettingsField>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center text-sm text-neutral-600">
              Nenhum bloqueio cadastrado. Use{" "}
              <strong className="text-[#0d1f3c]">Novo bloqueio</strong> para
              adicionar.
            </p>
          )}
        </div>
      ) : view === "especifico" ? (
        <div>
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
                Horários por data específica
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Adicione datas com programação própria, diferente da grade
                semanal.
              </p>
            </div>
            <button
              type="button"
              disabled={!canConfigure}
              onClick={addSpecificDate}
              className={settingsOutlineButtonClass}
            >
              <HiPlus className="h-3.5 w-3.5" aria-hidden />
              Nova data
            </button>
          </div>

          {sortedSpecificDates.length > 0 ? (
            <ul className="space-y-3" role="list">
              {sortedSpecificDates.map((entry) => {
                const isOpen = expandedSpecificId === entry.id;
                const panelId = `specific-panel-${entry.id}`;
                const triggerId = `specific-trigger-${entry.id}`;
                const slotCount = entry.slots.length;

                return (
                  <li
                    key={entry.id}
                    className={`rounded-2xl border transition ${
                      isOpen
                        ? "overflow-visible border-accent/25 bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)]"
                        : "overflow-hidden border-[rgba(17,17,17,0.08)] bg-[#fafbfc]"
                    }`}
                  >
                    <div className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4">
                      <button
                        id={triggerId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => toggleSpecificDate(entry.id)}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                          isOpen
                            ? "bg-accent text-white"
                            : "bg-[rgba(13,31,60,0.07)] text-accent"
                        }`}
                        aria-label={
                          isOpen ? "Recolher data" : "Expandir data"
                        }
                      >
                        <HiChevronDown
                          className={`h-5 w-5 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        />
                      </button>

                      <button
                        type="button"
                        className="min-w-0 flex-1 text-left"
                        onClick={() => toggleSpecificDate(entry.id)}
                      >
                        <span className="block text-base font-bold capitalize text-[#0d1f3c] md:text-lg">
                          {entry.date
                            ? formatExceptionDate(entry.date)
                            : "Nova data"}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-neutral-500">
                          {slotCount}{" "}
                          {slotCount === 1
                            ? "horário configurado"
                            : "horários configurados"}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPendingDelete({
                            type: "specificDate",
                            id: entry.id,
                            label: entry.date
                              ? formatExceptionDate(entry.date)
                              : "esta data",
                          });
                        }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c41e3a]/20 text-[#c41e3a] transition hover:bg-red-50"
                        aria-label="Remover data"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </div>

                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={triggerId}
                      hidden={!isOpen}
                      className={isOpen ? "block" : "hidden"}
                    >
                      <div className="space-y-4 border-t border-[rgba(17,17,17,0.08)] px-4 pb-5 pt-4 md:px-5 md:pb-6 md:pt-5">
                        <SettingsField label="Data">
                          <SettingsDatePicker
                            aria-label="Data da programação específica"
                            value={entry.date}
                            onChange={(date) =>
                              updateSpecificDate(entry.id, { date })
                            }
                          />
                        </SettingsField>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
                            Horários do dia
                          </p>
                          <button
                            type="button"
                            disabled={!canConfigure}
                            onClick={() => addSpecificDateSlot(entry.id)}
                            className={settingsOutlineButtonClass}
                          >
                            <HiPlus className="h-3.5 w-3.5" aria-hidden />
                            Novo horário
                          </button>
                        </div>

                        <DaySlotsList
                          slots={entry.slots}
                          kartCategories={kartCategories}
                          skillLevels={skillLevels}
                          canConfigure={canConfigure}
                          onUpdateSlot={(slotId, patch) =>
                            updateSpecificDateSlot(entry.id, slotId, patch)
                          }
                          onAddSlot={() => addSpecificDateSlot(entry.id)}
                          onRequestRemoveSlot={(slot) =>
                            setPendingDelete({
                              type: "specificDateSlot",
                              scheduleId: entry.id,
                              slotId: slot.id,
                              label: `${entry.date ? formatExceptionDate(entry.date) : "Data"} · ${slot.start} – ${slot.end} · ${categoryName(slot.categoryId)} · ${levelName(slot.levelId)}`,
                            })
                          }
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center text-sm text-neutral-600">
              Nenhuma data com horários específicos. Use{" "}
              <strong className="text-[#0d1f3c]">Nova data</strong> para
              adicionar.
            </p>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-3 text-[12px] font-bold uppercase tracking-wider text-neutral-500">
            Grade semanal
          </p>

          <ul className="space-y-3" role="list">
        {days.map((day) => {
          const isOpen = expandedDay === day.dayKey;
          const panelId = `hours-panel-${day.dayKey}`;
          const triggerId = `hours-trigger-${day.dayKey}`;

          return (
            <li
              key={day.dayKey}
              className={`rounded-2xl border transition ${
                isOpen
                  ? "overflow-visible border-accent/25 bg-white shadow-[0_4px_20px_rgba(13,31,60,0.08)]"
                  : "overflow-hidden border-[rgba(17,17,17,0.08)] bg-[#fafbfc]"
              }`}
            >
              <div className="flex items-center gap-2 px-3 py-3 md:px-4 md:py-4">
                <button
                  id={triggerId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleDay(day.dayKey)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
                    isOpen
                      ? "bg-accent text-white"
                      : "bg-[rgba(13,31,60,0.07)] text-accent"
                  }`}
                  aria-label={isOpen ? "Recolher dia" : "Expandir dia"}
                >
                  <HiChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden
                  />
                </button>

                <div className="min-w-0 flex-1">
                  <span className="block text-base font-bold text-[#0d1f3c] md:text-lg">
                    {day.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-neutral-500">
                    {day.slots.length}{" "}
                    {day.slots.length === 1
                      ? "horário configurado"
                      : "horários configurados"}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!canConfigure}
                  onClick={(e) => {
                    e.stopPropagation();
                    addSlot(day.dayKey);
                  }}
                  className={settingsOutlineButtonClass}
                >
                  <HiPlus className="h-3.5 w-3.5" aria-hidden />
                  Novo horário
                </button>
              </div>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!isOpen}
                className={isOpen ? "block" : "hidden"}
              >
                <div className="border-t border-[rgba(17,17,17,0.08)] px-4 pb-5 pt-4 md:px-5 md:pb-6 md:pt-5">
                  <DaySlotsList
                    slots={day.slots}
                    kartCategories={kartCategories}
                    skillLevels={skillLevels}
                    canConfigure={canConfigure}
                    onUpdateSlot={(slotId, patch) =>
                      updateSlot(day.dayKey, slotId, patch)
                    }
                    onAddSlot={() => addSlot(day.dayKey)}
                    onRequestRemoveSlot={(slot) =>
                      setPendingDelete({
                        type: "slot",
                        dayKey: day.dayKey,
                        slotId: slot.id,
                        label: `${slot.start} – ${slot.end} · ${categoryName(slot.categoryId)} · ${levelName(slot.levelId)}`,
                      })
                    }
                  />
                </div>
              </div>
            </li>
          );
        })}
          </ul>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title={
          pendingDelete?.type === "exception"
            ? "Remover bloqueio?"
            : pendingDelete?.type === "specificDate"
              ? "Remover data?"
              : "Remover horário?"
        }
        message={
          pendingDelete?.type === "exception"
            ? `Remover o bloqueio de ${pendingDelete.label}? O horário voltará a seguir a grade semanal nessa data.`
            : pendingDelete?.type === "specificDate"
              ? `Remover a programação específica de ${pendingDelete.label}? Todos os horários desta data serão excluídos.`
              : `Excluir o horário ${pendingDelete?.label}?`
        }
        confirmLabel="Excluir"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </SettingsSection>
  );
}
