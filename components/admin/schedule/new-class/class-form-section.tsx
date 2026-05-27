"use client";

import { useEffect, useMemo } from "react";
import type { KartOwnershipMode } from "@/lib/contracts/schedule";
import { NewClassServiceMock } from "@/services/schedule/newClassServiceMock";
import { SettingsDatePicker } from "../../settings/settings-date-picker";
import { SettingsDropdown } from "../../settings/settings-dropdown";
import { SettingsField } from "../../settings/settings-section";

const KART_MODE_OPTIONS: { key: KartOwnershipMode; label: string }[] = [
  { key: "rental", label: "Frota" },
  { key: "own", label: "Próprio" },
  { key: "third_party", label: "Terceiro" },
];

type Props = {
  studentId: string;
  categoryId: string;
  kartId: string;
  kartMode: KartOwnershipMode;
  date: string;
  onStudentChange: (id: string) => void;
  onCategoryChange: (id: string) => void;
  onKartChange: (id: string) => void;
  onKartModeChange: (mode: KartOwnershipMode) => void;
  onDateChange: (v: string) => void;
};

export function ClassFormSection({
  studentId,
  categoryId,
  kartId,
  kartMode,
  date,
  onStudentChange,
  onCategoryChange,
  onKartChange,
  onKartModeChange,
  onDateChange,
}: Props) {
  const student = NewClassServiceMock.getStudents().find((s) => s.id === studentId);

  const studentOptions = useMemo(
    () => [
      { value: "", label: "Selecione o aluno…" },
      ...NewClassServiceMock.getStudents().map((s) => ({
        value: s.id,
        label: s.name,
      })),
    ],
    []
  );

  const fleetKartOptions = useMemo(
    () => [
      { value: "", label: "Selecione o kart da frota…" },
      ...NewClassServiceMock.getRentalKarts().map((k) => ({
        value: k.id,
        label: `Kart ${k.number} — ${k.category}`,
      })),
    ],
    []
  );

  const thirdPartyKartOptions = useMemo(
    () => [
      { value: "", label: "Selecione o kart de terceiro…" },
      ...NewClassServiceMock.getThirdPartyKarts().map((k) => ({
        value: k.id,
        label: `Kart ${k.number} — ${k.ownerName}`,
      })),
    ],
    []
  );

  const ownKartValue = student?.ownKartNumber
    ? `own-${student.ownKartNumber}`
    : "";

  const categoryOptions = useMemo(() => {
    if (!student) return [];
    return student.allowedCategoryIds.map((id) => ({
      id,
      label: NewClassServiceMock.getCategoryLabel(id),
    }));
  }, [student]);

  useEffect(() => {
    if (!student) return;
    if (student.allowedCategoryIds.length === 1) {
      onCategoryChange(student.allowedCategoryIds[0]);
    } else if (
      categoryId &&
      !student.allowedCategoryIds.includes(categoryId)
    ) {
      onCategoryChange("");
    }
  }, [student, categoryId, onCategoryChange]);

  useEffect(() => {
    if (!student || kartMode !== "own") return;
    if (student.hasOwnKart && student.ownKartNumber) {
      onKartChange(ownKartValue);
    } else {
      onKartChange("");
    }
  }, [student, kartMode, ownKartValue, onKartChange]);

  const handleStudentChange = (id: string) => {
    onStudentChange(id);
    onCategoryChange("");
    onKartChange("");
    onKartModeChange("rental");
    const next = NewClassServiceMock.getStudents().find((s) => s.id === id);
    if (next?.allowedCategoryIds.length === 1) {
      onCategoryChange(next.allowedCategoryIds[0]);
    }
  };

  const handleKartMode = (mode: KartOwnershipMode) => {
    onKartModeChange(mode);
    if (mode === "own" && student?.ownKartNumber) {
      onKartChange(ownKartValue);
    } else {
      onKartChange("");
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-4 shadow-sm md:p-5">
      <h2 className="text-sm font-bold text-[#0d1f3c]">Dados da aula</h2>

      <SettingsField label="Aluno">
        <SettingsDropdown
          aria-label="Aluno"
          options={studentOptions}
          value={studentId}
          onSelect={handleStudentChange}
        />
      </SettingsField>

      {student ? (
        <>
          {categoryOptions.length === 1 ? (
            <SettingsField label="Categoria">
              <p className="rounded-xl bg-[#fafbfc] px-4 py-3 text-sm font-semibold text-[#0d1f3c] ring-1 ring-[rgba(17,17,17,0.06)]">
                {categoryOptions[0].label}
              </p>
            </SettingsField>
          ) : (
            <SettingsField label="Categoria">
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onCategoryChange(cat.id)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide transition ${
                      categoryId === cat.id
                        ? "border-[#0d1f3c] bg-[#0d1f3c] text-white"
                        : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[#0d1f3c] hover:border-accent/30"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </SettingsField>
          )}

          <SettingsField label="Nível">
            <p className="rounded-xl bg-[#fafbfc] px-4 py-3 text-sm font-semibold text-[#0d1f3c] ring-1 ring-[rgba(17,17,17,0.06)]">
              {NewClassServiceMock.getLevelLabel(student.levelId)}
            </p>
          </SettingsField>
        </>
      ) : null}

      <SettingsField label="Data">
        <SettingsDatePicker
          aria-label="Data da aula"
          value={date}
          onChange={onDateChange}
        />
      </SettingsField>

      <div className="min-w-0 space-y-2">
        <span className="text-[12px] font-bold uppercase tracking-wider text-neutral-500">
          Kart
        </span>
        {student ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {KART_MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleKartMode(opt.key)}
                  className={`rounded-xl border-2 px-2 py-2.5 text-[10px] font-bold uppercase tracking-wide transition sm:text-[11px] ${
                    kartMode === opt.key
                      ? "border-[#0d1f3c] bg-[#0d1f3c] text-white"
                      : "border-[rgba(17,17,17,0.08)] bg-[#fafbfc] text-[#0d1f3c] hover:border-accent/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {kartMode === "rental" ? (
              <SettingsField label="Kart da frota">
                <SettingsDropdown
                  aria-label="Kart da frota"
                  options={fleetKartOptions}
                  value={kartId}
                  onSelect={onKartChange}
                />
              </SettingsField>
            ) : null}

            {kartMode === "own" ? (
              student.hasOwnKart && student.ownKartNumber ? (
                <SettingsField label="Kart próprio">
                  <p className="rounded-xl bg-[#fafbfc] px-3 py-2.5 text-sm font-semibold text-[#0d1f3c] ring-1 ring-[rgba(17,17,17,0.06)]">
                    Kart {student.ownKartNumber}
                    {student.ownKartCategory
                      ? ` — ${student.ownKartCategory}`
                      : ""}{" "}
                    (próprio)
                  </p>
                </SettingsField>
              ) : (
                <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs font-medium text-amber-900 ring-1 ring-amber-200/60">
                  Este aluno não possui kart próprio cadastrado.
                </p>
              )
            ) : null}

            {kartMode === "third_party" ? (
              <SettingsField label="Kart de terceiro">
                <SettingsDropdown
                  aria-label="Kart de terceiro"
                  options={thirdPartyKartOptions}
                  value={kartId}
                  onSelect={onKartChange}
                />
              </SettingsField>
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-neutral-500">
            Selecione um aluno para escolher o kart.
          </p>
        )}
      </div>
    </section>
  );
}
