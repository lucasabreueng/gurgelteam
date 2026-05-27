"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import type { KartOwnershipMode } from "@/lib/contracts/schedule";
import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";
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
  onSuccess?: (message: string) => void;
};

type LevelConfirmState = {
  time: string;
  slotLevelName: string;
};

function resolveKartLabel(
  studentId: string,
  kartId: string,
  kartMode: KartOwnershipMode
): string {
  const student = NewClassServiceMock.getStudents().find((s) => s.id === studentId);
  if (kartMode === "own" && student?.ownKartNumber) {
    return `Kart ${student.ownKartNumber} (próprio)`;
  }
  if (kartMode === "third_party") {
    const third = NewClassServiceMock.getThirdPartyKarts().find((k) => k.id === kartId);
    return third
      ? `Kart ${third.number} (terceiro — ${third.ownerName})`
      : "";
  }
  const rental = NewClassServiceMock.getRentalKarts().find((k) => k.id === kartId);
  return rental ? `Kart ${rental.number} (frota)` : "";
}

export function NewClassModal({
  open,
  onClose,
  initialDate = NewClassServiceMock.getDefaultClassDate(),
  initialTime,
  onSuccess,
}: Props) {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(
    typeof initialTime === "string" ? initialTime : NewClassServiceMock.getDefaultClassTime()
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

  const timelineOptions = useMemo(
    () => ({
      categoryId: categoryId || undefined,
      studentLevelId: studentId
        ? NewClassServiceMock.getStudents().find((s) => s.id === studentId)?.levelId
        : undefined,
    }),
    [categoryId, studentId]
  );

  const reset = useCallback(() => {
    setDate(initialDate);
    const resolvedInitialTime =
      typeof initialTime === "string" ? initialTime : undefined;
    setTime(
      resolvedInitialTime ??
        NewClassServiceMock.getDefaultSlotForDate(initialDate, { categoryId: undefined })?.time ??
        NewClassServiceMock.getDefaultClassTime()
    );
    setStudentId("");
    setCategoryId("");
    setKartId("");
    setKartMode("rental");
    setLevelOverrideTimes(new Set());
    setLevelConfirm(null);
  }, [initialDate, initialTime]);

  useEffect(() => {
    if (!open) return;
    reset();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, reset]);

  useEffect(() => {
    if (!open || !categoryId) return;
    const slots = NewClassServiceMock.buildGurgelTimeline(date, timelineOptions);
    const stillValid = slots.some(
      (s) =>
        s.time === time &&
        s.status !== "busy" &&
        s.status !== "break"
    );
    if (!stillValid) {
      const preferred =
        typeof initialTime === "string" &&
        initialTime &&
        slots.find(
          (s) =>
            s.time === initialTime &&
            s.status !== "busy" &&
            s.status !== "break"
        );
      const next =
        preferred ??
        slots.find(
          (s) => s.status === "available" || s.status === "level_mismatch"
        ) ??
        slots[0];
      if (next) setTime(next.time);
    }
  }, [date, open, time, initialTime, categoryId, timelineOptions]);

  useEffect(() => {
    if (!open) return;
    setLevelOverrideTimes(new Set());
  }, [categoryId, studentId, date, open]);

  const selectedSlot = useMemo(
    () => NewClassServiceMock.getSlotStatusForTime(date, time, timelineOptions),
    [date, time, timelineOptions]
  );

  const student = NewClassServiceMock.getStudents().find((s) => s.id === studentId);

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
  const dateLabel = NewClassServiceMock.formatClassDateTime(date, time).split(",")[0];
  const timeRange = selectedSlot
    ? `${selectedSlot.time} – ${selectedSlot.end}`
    : typeof time === "string"
      ? time
      : NewClassServiceMock.getDefaultClassTime();
  const kartLabel = studentId ? resolveKartLabel(studentId, kartId, kartMode) : "";

  const handleSelectTime = (slotTime: string) => {
    const slot = NewClassServiceMock.getSlotStatusForTime(date, slotTime, timelineOptions);
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
    if (!canConfirm || !student) return;
    onSuccess?.(
      `Aula agendada — ${student.name}, ${dateLabel} ${timeRange}, ${kartLabel}, ${durationLabel} (mock).`
    );
    onClose();
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
                studentLevelId={student?.levelId}
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

          <NewClassFooter onConfirm={confirm} confirmDisabled={!canConfirm} />
        </aside>
      </div>

      <ConfirmDialog
        open={levelConfirm !== null}
        title="Liberar horário"
        message={
          levelConfirm && student
            ? `Este horário é destinado ao nível ${levelConfirm.slotLevelName}. O aluno ${student.name} está no nível ${NewClassServiceMock.getLevelLabel(student.levelId)}. Deseja liberar o agendamento neste horário?`
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
