"use client";

import { useEffect, useMemo } from "react";
import type { KartOwnershipMode } from "@/lib/contracts/schedule";
import type { NewClassStudentOption } from "@/lib/admin-new-class-mocks";
import type { NewClassFormCatalog } from "@/lib/schedule/new-class-catalog";
import { getAppServices } from "@/lib/data-source/app-services";
import { SettingsDatePicker } from "../../settings/settings-date-picker";
import { SettingsDropdown } from "../../settings/settings-dropdown";
import { SettingsField } from "../../settings/settings-section";
import { adminBadgeWarningClass, adminCardClass, adminInputReadonlyClass } from "@/lib/design";

const choiceTileActiveClass =
  "rounded-xl border-2 border-accent bg-accent px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-white transition";
const choiceTileInactiveClass =
  "rounded-xl border-2 border-[var(--ds-border-field)] bg-[var(--ds-bg-muted)] px-3 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[var(--ds-text-primary)] transition hover:border-accent/30";
const readonlyFieldClass = `${adminInputReadonlyClass} font-semibold ring-1 ring-[var(--ds-border-subtle)]`;

const KART_MODE_OPTIONS: { key: KartOwnershipMode; label: string }[] = [
  { key: "rental", label: "Frota" },
  { key: "own", label: "Próprio" },
  { key: "third_party", label: "Terceiro" },
];

type Props = {
  catalog: NewClassFormCatalog;
  catalogLoading?: boolean;
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

function resolveOwnKartValue(student: NewClassStudentOption | undefined): string {
  if (!student?.hasOwnKart) return "";
  if (student.ownKartId) return student.ownKartId;
  if (student.ownKartNumber) return `own-${student.ownKartNumber}`;
  return "";
}

export function ClassFormSection({
  catalog,
  catalogLoading = false,
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
  const { newClass } = getAppServices();
  const student = catalog.students.find((s) => s.id === studentId);

  const studentOptions = useMemo(
    () => [
      {
        value: "",
        label: catalogLoading ? "Carregando alunos…" : "Selecione o aluno…",
      },
      ...catalog.students.map((s) => ({
        value: s.id,
        label: s.name,
      })),
    ],
    [catalog.students, catalogLoading],
  );

  const fleetKartOptions = useMemo(
    () => [
      {
        value: "",
        label: catalogLoading
          ? "Carregando karts…"
          : "Selecione o kart da frota…",
      },
      ...catalog.rentalKarts.map((k) => ({
        value: k.id,
        label: `Kart ${k.number} — ${k.category}`,
      })),
    ],
    [catalog.rentalKarts, catalogLoading],
  );

  const thirdPartyKartOptions = useMemo(
    () => [
      {
        value: "",
        label: catalogLoading
          ? "Carregando karts…"
          : "Selecione o kart de terceiro…",
      },
      ...catalog.thirdPartyKarts.map((k) => ({
        value: k.id,
        label: `Kart ${k.number} — ${k.ownerName}`,
      })),
    ],
    [catalog.thirdPartyKarts, catalogLoading],
  );

  const ownKartValue = resolveOwnKartValue(student);

  const categoryOptions = useMemo(() => {
    if (!student) return [];
    return student.allowedCategoryIds.map((id) => ({
      id,
      label: newClass.getCategoryLabel(id),
    }));
  }, [student, newClass]);

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
    if (student.hasOwnKart && ownKartValue) {
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
    const next = catalog.students.find((s) => s.id === id);
    if (next?.allowedCategoryIds.length === 1) {
      onCategoryChange(next.allowedCategoryIds[0]);
    }
  };

  const handleKartMode = (mode: KartOwnershipMode) => {
    onKartModeChange(mode);
    if (mode === "own" && student?.ownKartNumber && ownKartValue) {
      onKartChange(ownKartValue);
    } else {
      onKartChange("");
    }
  };

  return (
    <section className={`${adminCardClass} space-y-4 p-4 md:p-5`}>
      <h2 className="text-sm font-bold text-[var(--ds-text-primary)]">Dados da aula</h2>

      <SettingsField label="Aluno">
        <SettingsDropdown
          aria-label="Aluno"
          options={studentOptions}
          value={studentId}
          onSelect={handleStudentChange}
          disabled={catalogLoading}
        />
      </SettingsField>

      {student ? (
        <>
          {categoryOptions.length === 1 ? (
            <SettingsField label="Categoria">
              <p className={readonlyFieldClass}>
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
                    className={
                      categoryId === cat.id
                        ? choiceTileActiveClass
                        : choiceTileInactiveClass
                    }
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </SettingsField>
          )}

          <SettingsField label="Nível">
            <p className={readonlyFieldClass}>
              {newClass.getLevelLabel(student.levelId)}
            </p>
          </SettingsField>
        </>
      ) : null}

      <SettingsField label="Data">
        <SettingsDatePicker
          aria-label="Data da aula"
          value={date}
          onChange={onDateChange}
          lowercaseLabel
          disablePast
        />
      </SettingsField>

      <div className="min-w-0 space-y-2">
        <span className="text-[12px] font-bold uppercase tracking-wider text-[var(--ds-text-muted)]">
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
                  className={`${
                    kartMode === opt.key
                      ? choiceTileActiveClass
                      : choiceTileInactiveClass
                  } px-2 py-2.5 text-[10px] sm:text-[11px]`}
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
                  <p className={`${readonlyFieldClass} px-3 py-2.5`}>
                    Kart {student.ownKartNumber}
                    {student.ownKartCategory
                      ? ` — ${student.ownKartCategory}`
                      : ""}{" "}
                    (próprio)
                  </p>
                </SettingsField>
              ) : (
                <p className={`rounded-xl px-3 py-2.5 text-xs font-medium ring-1 ${adminBadgeWarningClass}`}>
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
          <p className="text-xs text-[var(--ds-text-muted)]">
            Selecione um aluno para escolher o kart.
          </p>
        )}
      </div>
    </section>
  );
}
