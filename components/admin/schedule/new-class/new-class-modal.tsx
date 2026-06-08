"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import type { KartOwnershipMode } from "@/lib/contracts/schedule";
import { getAppServices } from "@/lib/data-source/app-services";
import type { NewClassFormCatalog } from "@/lib/schedule/new-class-catalog";
import {
  EMPTY_NEW_CLASS_FORM_CATALOG,
} from "@/lib/schedule/new-class-catalog";
import type { GurgelTimelineSlot } from "@/lib/schedule/gurgel-timeline";
import { findGurgelTimelineSlot } from "@/lib/schedule/gurgel-timeline";
import { SCHEDULE_DRAWER_PANEL_CLASS } from "../schedule-drawer-shell";
import { NewClassHeader } from "./new-class-header";
import { NewClassFooter } from "./new-class-footer";
import { GurgelAvailabilityStatus } from "./gurgel-availability-status";
import { ClassFormSection } from "./class-form-section";
import { ClassSummaryCard } from "./class-summary-card";

type Props = {
  open: boolean;
  onClose: () => void;
  initialDate?: string;
  initialTime?: string;
  initialStudentId?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  onScheduled?: () => void;
};

type LevelConfirmState = {
  time: string;
  slotLevelName: string;
};

function resolveKartLabel(
  catalog: NewClassFormCatalog,
  studentId: string,
  kartId: string,
  kartMode: KartOwnershipMode,
): string {
  const student = catalog.students.find((s) => s.id === studentId);
  if (kartMode === "own" && student?.ownKartNumber) {
    return `Kart ${student.ownKartNumber} (próprio)`;
  }
  if (kartMode === "third_party") {
    const third = catalog.thirdPartyKarts.find((k) => k.id === kartId);
    return third
      ? `Kart ${third.number} (terceiro — ${third.ownerName})`
      : "";
  }
  const rental = catalog.rentalKarts.find((k) => k.id === kartId);
  return rental ? `Kart ${rental.number} (frota)` : "";
}

export function NewClassModal({
  open,
  onClose,
  initialDate,
  initialTime,
  initialStudentId,
  onSuccess,
  onError,
  onScheduled,
}: Props) {
  const { newClass } = getAppServices();
  const defaultDate = initialDate ?? newClass.getDefaultClassDate();
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(
    typeof initialTime === "string" ? initialTime : newClass.getDefaultClassTime(),
  );
  const [studentId, setStudentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [kartId, setKartId] = useState("");
  const [kartMode, setKartMode] = useState<KartOwnershipMode>("rental");
  const [levelOverrideTimes, setLevelOverrideTimes] = useState<Set<string>>(
    () => new Set()
  );
  const [levelConfirm, setLevelConfirm] = useState<LevelConfirmState | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [timelineSlots, setTimelineSlots] = useState<GurgelTimelineSlot[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [catalog, setCatalog] = useState<NewClassFormCatalog>(
    () => EMPTY_NEW_CLASS_FORM_CATALOG,
  );
  const [catalogLoading, setCatalogLoading] = useState(false);

  const timelineOptions = useMemo(
    () => ({
      categoryId: categoryId || undefined,
      studentLevelId: studentId
        ? catalog.students.find((s) => s.id === studentId)?.levelId
        : undefined,
    }),
    [categoryId, studentId, catalog.students],
  );

  const reset = useCallback(() => {
    setDate(defaultDate);
    const resolvedInitialTime =
      typeof initialTime === "string" ? initialTime : undefined;
    setTime(
      resolvedInitialTime ?? newClass.getDefaultClassTime(),
    );
    setStudentId(initialStudentId ?? "");
    setCategoryId("");
    setKartId("");
    setKartMode("rental");
    setLevelOverrideTimes(new Set());
    setLevelConfirm(null);
  }, [defaultDate, initialTime, initialStudentId, newClass]);

  useEffect(() => {
    if (!open) return;
    reset();
    setCatalog(EMPTY_NEW_CLASS_FORM_CATALOG);
    let cancelled = false;
    setCatalogLoading(true);

    void newClass
      .loadFormCatalog()
      .then((next) => {
        if (!cancelled) setCatalog(next);
      })
      .catch(() => {
        if (!cancelled) setCatalog(EMPTY_NEW_CLASS_FORM_CATALOG);
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, reset, newClass]);

  useEffect(() => {
    if (!open || !categoryId) {
      setTimelineSlots([]);
      return;
    }

    let cancelled = false;
    setTimelineLoading(true);

    void newClass
      .buildGurgelTimeline(date, timelineOptions)
      .then((slots) => {
        if (!cancelled) setTimelineSlots(slots);
      })
      .catch(() => {
        if (!cancelled) setTimelineSlots([]);
      })
      .finally(() => {
        if (!cancelled) setTimelineLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [date, open, categoryId, timelineOptions, newClass]);

  useEffect(() => {
    if (!open || !categoryId || timelineLoading || timelineSlots.length === 0) {
      return;
    }

    const stillValid = timelineSlots.some(
      (s) =>
        s.time === time &&
        s.status !== "busy" &&
        s.status !== "break",
    );
    if (stillValid) return;

    const preferred =
      typeof initialTime === "string" &&
      initialTime &&
      timelineSlots.find(
        (s) =>
          s.time === initialTime &&
          s.status !== "busy" &&
          s.status !== "break",
      );
    const next =
      preferred ??
      timelineSlots.find(
        (s) => s.status === "available" || s.status === "level_mismatch",
      ) ??
      timelineSlots[0];
    if (next) setTime(next.time);
  }, [
    date,
    open,
    time,
    initialTime,
    categoryId,
    timelineSlots,
    timelineLoading,
  ]);

  useEffect(() => {
    if (!open) return;
    setLevelOverrideTimes(new Set());
  }, [categoryId, studentId, date, open]);

  const selectedSlot = useMemo(
    () => findGurgelTimelineSlot(timelineSlots, time),
    [timelineSlots, time],
  );

  const categoryLabel = categoryId
    ? newClass.getCategoryLabel(categoryId)
    : "";

  const student = catalog.students.find((s) => s.id === studentId);

  const hasKart = useMemo(() => {
    if (!studentId) return false;
    if (kartMode === "rental" || kartMode === "third_party") return Boolean(kartId);
    if (kartMode === "own") {
      return Boolean(student?.hasOwnKart && student.ownKartNumber);
    }
    return false;
  }, [studentId, kartMode, kartId, student]);

  const levelApproved =
    selectedSlot?.status !== "level_mismatch" ||
    levelOverrideTimes.has(time);

  const canConfirm =
    Boolean(studentId && categoryId && hasKart && selectedSlot && levelApproved) &&
    selectedSlot?.status !== "busy" &&
    selectedSlot?.status !== "break";

  const durationLabel = selectedSlot?.durationLabel ?? "—";
  const dateLabel = newClass.formatClassDateTime(date, time).split(",")[0];
  const timeRange = selectedSlot
    ? `${selectedSlot.time} – ${selectedSlot.end}`
    : typeof time === "string"
      ? time
      : newClass.getDefaultClassTime();
  const kartLabel = studentId
    ? resolveKartLabel(catalog, studentId, kartId, kartMode)
    : "";

  const handleSelectTime = (slotTime: string) => {
    const slot = findGurgelTimelineSlot(timelineSlots, slotTime);
    if (!slot || slot.status === "busy" || slot.status === "break") return;

    if (
      slot.status === "level_mismatch" &&
      !levelOverrideTimes.has(slotTime)
    ) {
      setLevelConfirm({ time: slotTime, slotLevelName: slot.levelName });
      return;
    }

    setTime(slotTime);
  };

  const confirmLevelRelease = () => {
    if (!levelConfirm) return;
    setLevelOverrideTimes((prev) => new Set(prev).add(levelConfirm.time));
    setTime(levelConfirm.time);
    setLevelConfirm(null);
  };

  const confirm = () => {
    if (!canConfirm || !student || !selectedSlot || submitting) return;
    setSubmitting(true);
    void newClass
      .scheduleNewClass({
        studentId,
        categoryId,
        kartId,
        kartMode,
        date,
        start: selectedSlot.time,
        end: selectedSlot.end,
      })
      .then((result) => {
        onScheduled?.();
        onSuccess?.(result.message);
        onClose();
      })
      .catch((err) => {
        onError?.(
          err instanceof Error ? err.message : "Não foi possível agendar a aula.",
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[228] flex justify-end">
        <button
          type="button"
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          aria-label="Fechar"
          onClick={onClose}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-class-drawer-title"
          className={SCHEDULE_DRAWER_PANEL_CLASS}
        >
          <NewClassHeader onClose={onClose} />

          <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
            <div className="space-y-5">
              <ClassFormSection
                catalog={catalog}
                catalogLoading={catalogLoading}
                studentId={studentId}
                categoryId={categoryId}
                kartId={kartId}
                kartMode={kartMode}
                date={date}
                onStudentChange={setStudentId}
                onCategoryChange={setCategoryId}
                onKartChange={setKartId}
                onKartModeChange={setKartMode}
                onDateChange={setDate}
              />
              <GurgelAvailabilityStatus
                date={date}
                categoryId={categoryId}
                categoryLabel={categoryLabel}
                slots={timelineSlots}
                loading={timelineLoading}
                selectedTime={time}
                levelOverrideTimes={levelOverrideTimes}
                onSelectTime={handleSelectTime}
              />
              <ClassSummaryCard
                studentName={student?.name ?? ""}
                timeRange={timeRange}
                dateLabel={dateLabel}
                kartLabel={kartLabel}
                durationLabel={durationLabel}
              />
            </div>
          </div>

          <NewClassFooter
            onConfirm={confirm}
            confirmDisabled={!canConfirm || submitting}
          />
        </aside>
      </div>

      <ConfirmDialog
        open={levelConfirm !== null}
        title="Liberar horário"
        message={
          levelConfirm && student
            ? `Este horário é destinado ao nível ${levelConfirm.slotLevelName}. O aluno ${student.name} está no nível ${newClass.getLevelLabel(student.levelId)}. Deseja liberar o agendamento neste horário?`
            : ""
        }
        confirmLabel="Liberar e agendar"
        cancelLabel="Cancelar"
        onConfirm={confirmLevelRelease}
        onCancel={() => setLevelConfirm(null)}
      />
    </>
  );
}
