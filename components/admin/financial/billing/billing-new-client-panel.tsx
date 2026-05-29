"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AuthServiceMock } from "@/services/auth/authServiceMock";
import {
  formatBrazilDateInput,
  isCompleteBrazilDate,
} from "@/lib/brazil-date-input";
import type { KartCategory, SkillLevel } from "@/lib/contracts/clients";
import { SettingsCheckbox } from "../../settings/settings-checkbox";
import { SettingsDropdown } from "../../settings/settings-dropdown";
import {
  SettingsField,
  settingsInputClass,
  settingsOutlineButtonClass,
} from "../../settings/settings-section";
import { BillingFormCard } from "./billing-summary-panel";

const MIRIM_CADETE_ID = "mirim-cadete";
const ADULT_CATEGORY_IDS = new Set(["f400", "125cc"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthDate: string;
  categoryIds: string[];
  levelId: string;
};

const EMPTY: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  birthDate: "",
  categoryIds: [],
  levelId: "",
};

type Props = {
  categories: KartCategory[];
  skillLevels: SkillLevel[];
  onBack: () => void;
  onSuccess: (clientId: string, clientName: string) => void;
};

function stripDigits(value: string): string {
  return value.replace(/\D/g, "");
}

function formatBrazilMobilePhone(digits: string): string {
  const d = digits.slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function isValidPhone(phone: string): boolean {
  return stripDigits(phone).length === 11;
}

function isMirimCadeteSelected(categoryIds: string[]): boolean {
  return categoryIds.includes(MIRIM_CADETE_ID);
}

function isAdultCategorySelected(categoryIds: string[]): boolean {
  return categoryIds.some((id) => ADULT_CATEGORY_IDS.has(id));
}

function isCategoryDisabled(categoryId: string, categoryIds: string[]): boolean {
  if (categoryId === MIRIM_CADETE_ID) return isAdultCategorySelected(categoryIds);
  if (ADULT_CATEGORY_IDS.has(categoryId)) return isMirimCadeteSelected(categoryIds);
  return false;
}

export function BillingNewClientPanel({ categories, skillLevels, onBack, onSuccess }: Props) {
  const [form, setForm] = useState(EMPTY);
  const wasMounted = useRef(false);

  useEffect(() => {
    if (!wasMounted.current) {
      wasMounted.current = true;
      return;
    }
    setForm(EMPTY);
  }, []);

  const suggestedUsername = useMemo(
    () => AuthServiceMock.generateAvailableUsername(form.firstName, form.lastName),
    [form.firstName, form.lastName],
  );

  const canSubmit =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    suggestedUsername.length > 0 &&
    isValidPhone(form.phone) &&
    EMAIL_PATTERN.test(form.email) &&
    isCompleteBrazilDate(form.birthDate) &&
    form.categoryIds.length > 0 &&
    form.levelId.length > 0;

  const toggleCategory = (categoryId: string) => {
    if (isCategoryDisabled(categoryId, form.categoryIds)) return;
    setForm((prev) => {
      const selected = prev.categoryIds.includes(categoryId);
      if (selected) {
        return { ...prev, categoryIds: prev.categoryIds.filter((id) => id !== categoryId) };
      }
      if (categoryId === MIRIM_CADETE_ID) {
        return {
          ...prev,
          categoryIds: [...prev.categoryIds.filter((id) => !ADULT_CATEGORY_IDS.has(id)), MIRIM_CADETE_ID],
        };
      }
      if (ADULT_CATEGORY_IDS.has(categoryId)) {
        return {
          ...prev,
          categoryIds: [...prev.categoryIds.filter((id) => id !== MIRIM_CADETE_ID), categoryId],
        };
      }
      return { ...prev, categoryIds: [...prev.categoryIds, categoryId] };
    });
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const name = `${form.firstName.trim()} ${form.lastName.trim()}`;
    onSuccess(`new-${Date.now()}`, name);
  };

  const levelOptions = [
    { value: "", label: "Selecione o nível…" },
    ...skillLevels.map((level) => ({ value: level.id, label: level.name })),
  ];

  return (
    <BillingFormCard>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-[#0d1f3c]">Novo cliente</p>
          <p className="text-[12px] text-neutral-600">Cadastre o piloto sem sair desta janela.</p>
        </div>
        <button type="button" onClick={onBack} className={settingsOutlineButtonClass}>
          Voltar
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SettingsField label="Nome">
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
            placeholder="Ex.: Lucas"
            className={settingsInputClass}
          />
        </SettingsField>
        <SettingsField label="Sobrenome">
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
            placeholder="Ex.: Mendes"
            className={settingsInputClass}
          />
        </SettingsField>
      </div>

      <SettingsField label="Usuário">
        <input
          type="text"
          readOnly
          value={suggestedUsername}
          className={`${settingsInputClass} cursor-default bg-neutral-50 text-neutral-700`}
        />
      </SettingsField>

      <SettingsField label="Telefone">
        <input
          type="tel"
          inputMode="numeric"
          value={form.phone}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              phone: formatBrazilMobilePhone(stripDigits(e.target.value).slice(0, 11)),
            }))
          }
          placeholder="(61) 99999-9999"
          maxLength={15}
          className={settingsInputClass}
        />
      </SettingsField>

      <SettingsField label="E-mail">
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value.replace(/\s/g, "").toLowerCase() }))}
          placeholder="piloto@email.com"
          className={settingsInputClass}
        />
      </SettingsField>

      <SettingsField label="Data de nascimento">
        <input
          type="text"
          inputMode="numeric"
          value={form.birthDate}
          onChange={(e) => setForm((p) => ({ ...p, birthDate: formatBrazilDateInput(e.target.value) }))}
          placeholder="dd/mm/aaaa"
          maxLength={10}
          className={settingsInputClass}
        />
      </SettingsField>

      <SettingsField label="Categoria">
        <ul className="space-y-2">
          {categories.map((category) => {
            const checked = form.categoryIds.includes(category.id);
            const disabled = isCategoryDisabled(category.id, form.categoryIds);
            return (
              <li key={category.id}>
                <div
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                    disabled
                      ? "cursor-not-allowed border-[rgba(17,17,17,0.06)] bg-neutral-50 opacity-50"
                      : checked
                        ? "border-accent/30 bg-[rgba(13,31,60,0.04)]"
                        : "border-[rgba(17,17,17,0.1)] bg-[#fafbfc]"
                  }`}
                >
                  <SettingsCheckbox
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggleCategory(category.id)}
                    aria-label={category.name}
                  />
                  <span className="text-[14px] font-medium text-[#111]">{category.name}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </SettingsField>

      <SettingsField label="Nível">
        <SettingsDropdown
          aria-label="Nível do piloto"
          options={levelOptions}
          value={form.levelId}
          onSelect={(levelId) => setForm((p) => ({ ...p, levelId }))}
        />
      </SettingsField>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="btn-primary-sm w-full sm:w-auto"
      >
        Salvar cliente
      </button>
    </BillingFormCard>
  );
}
