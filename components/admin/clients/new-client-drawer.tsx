"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDrawerBodyLock } from "@/lib/hooks/use-drawer-body-lock";
import { HiXMark } from "react-icons/hi2";
import { ConfirmDialog } from "@/components/admin/settings/confirm-dialog";
import {
  DRAWER_FOOTER_INNER_CLASS,
  DRAWER_FOOTER_SHELL_CLASS,
  DrawerFooterActions,
} from "@/components/ui/drawer-footer";
import { AuthServiceMock } from "@/services/auth/authServiceMock";
import {
  formatBrazilDateInput,
  isCompleteBrazilDate,
} from "@/lib/brazil-date-input";
import type { KartCategory, SkillLevel } from "@/lib/contracts/clients";
import { SettingsDropdown } from "../settings/settings-dropdown";
import { SettingsCheckbox } from "../settings/settings-checkbox";
import {
  adminCardInnerClass,
  adminChoiceTileClass,
  adminDrawerHeaderSimpleClass,
  adminDrawerOverlayLightClass,
  adminDrawerPanelFormClass,
  adminDrawerTitleClass,
  adminInputClass,
  adminInputReadonlyClass,
} from "@/lib/design";
import {
  SettingsField,
} from "../settings/settings-section";

export type NewClientFormData = {
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  email: string;
  birthDate: string;
  categoryIds: string[];
  levelId: string;
};

const EMPTY_FORM: NewClientFormData = {
  firstName: "",
  lastName: "",
  username: "",
  phone: "",
  email: "",
  birthDate: "",
  categoryIds: [],
  levelId: "",
};

const MIRIM_CADETE_ID = "mirim-cadete";
const ADULT_CATEGORY_IDS = new Set(["f400", "125cc"]);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function stripDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Formato (XX) XXXXX-XXXX — até 11 dígitos */
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

function sanitizeEmail(value: string): string {
  return value.replace(/\s/g, "").toLowerCase();
}

function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

function isMirimCadeteSelected(categoryIds: string[]): boolean {
  return categoryIds.includes(MIRIM_CADETE_ID);
}

function isAdultCategorySelected(categoryIds: string[]): boolean {
  return categoryIds.some((id) => ADULT_CATEGORY_IDS.has(id));
}

function isCategoryDisabled(
  categoryId: string,
  categoryIds: string[],
): boolean {
  if (categoryId === MIRIM_CADETE_ID) {
    return isAdultCategorySelected(categoryIds);
  }
  if (ADULT_CATEGORY_IDS.has(categoryId)) {
    return isMirimCadeteSelected(categoryIds);
  }
  return false;
}

type Props = {
  open: boolean;
  onClose: () => void;
  categories: KartCategory[];
  skillLevels: SkillLevel[];
  onSuccess?: (data: NewClientFormData) => void;
  onGenerateCharge?: () => void;
};

export function NewClientDrawer({
  open,
  onClose,
  categories,
  skillLevels,
  onSuccess,
  onGenerateCharge,
}: Props) {
  const [form, setForm] = useState<NewClientFormData>(EMPTY_FORM);
  const [successOpen, setSuccessOpen] = useState(false);
  const [savedSummary, setSavedSummary] = useState<{
    name: string;
    email: string;
  } | null>(null);
  const wasOpenRef = useRef(false);
  useDrawerBodyLock(open);


  const suggestedUsername = useMemo(
    () => AuthServiceMock.generateAvailableUsername(form.firstName, form.lastName),
    [form.firstName, form.lastName],
  );

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      setForm(EMPTY_FORM);
      setSuccessOpen(false);
      setSavedSummary(null);
    }
    if (!open) {
      setSuccessOpen(false);
      setSavedSummary(null);
      } else {
      }
    wasOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open || successOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, successOpen]);

  const toggleCategory = (categoryId: string) => {
    if (isCategoryDisabled(categoryId, form.categoryIds)) return;

    setForm((prev) => {
      const selected = prev.categoryIds.includes(categoryId);
      if (selected) {
        return {
          ...prev,
          categoryIds: prev.categoryIds.filter((id) => id !== categoryId),
        };
      }

      if (categoryId === MIRIM_CADETE_ID) {
        return {
          ...prev,
          categoryIds: [
            ...prev.categoryIds.filter((id) => !ADULT_CATEGORY_IDS.has(id)),
            MIRIM_CADETE_ID,
          ],
        };
      }

      if (ADULT_CATEGORY_IDS.has(categoryId)) {
        return {
          ...prev,
          categoryIds: [
            ...prev.categoryIds.filter((id) => id !== MIRIM_CADETE_ID),
            categoryId,
          ],
        };
      }

      return {
        ...prev,
        categoryIds: [...prev.categoryIds, categoryId],
      };
    });
  };

  const canSubmit =
    form.firstName.trim().length > 0 &&
    form.lastName.trim().length > 0 &&
    suggestedUsername.length > 0 &&
    isValidPhone(form.phone) &&
    isValidEmail(form.email) &&
    isCompleteBrazilDate(form.birthDate) &&
    form.categoryIds.length > 0 &&
    form.levelId.length > 0;

  const handlePhoneChange = (raw: string) => {
    const digits = stripDigits(raw).slice(0, 11);
    setForm((prev) => ({ ...prev, phone: formatBrazilMobilePhone(digits) }));
  };

  const handleEmailChange = (raw: string) => {
    setForm((prev) => ({ ...prev, email: sanitizeEmail(raw) }));
  };

  const handleBirthDateChange = (raw: string) => {
    setForm((prev) => ({
      ...prev,
      birthDate: formatBrazilDateInput(raw),
    }));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload: NewClientFormData = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      username: suggestedUsername,
      phone: form.phone.trim(),
      email: sanitizeEmail(form.email),
    };
    setSavedSummary({
      name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email,
    });
    setSuccessOpen(true);
    onSuccess?.(payload);
  };

  const finishSuccess = () => {
    setSuccessOpen(false);
    setSavedSummary(null);
    onClose();
  };

  if (!open) return null;

  const levelOptions = [
    { value: "", label: "Selecione o nível…" },
    ...skillLevels.map((level) => ({ value: level.id, label: level.name })),
  ];

  const usernameReadonlyClass = adminInputReadonlyClass;

  return (
    <>
      <div className="fixed inset-0 z-[228] flex justify-end">
        <button
          type="button"
          className={adminDrawerOverlayLightClass}
          aria-label="Fechar"
          onClick={onClose}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-client-drawer-title"
          className={adminDrawerPanelFormClass}
        >
          <header className={adminDrawerHeaderSimpleClass}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1
                  id="new-client-drawer-title"
                  className={adminDrawerTitleClass}
                >
                  Novo cliente
                </h1>
                <p className="mt-1 text-sm text-neutral-600">
                  Cadastre um piloto com categorias e nível do sistema.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-neutral-500 hover:bg-neutral-100"
                aria-label="Fechar"
              >
                <HiXMark className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className={`${adminCardInnerClass} space-y-4`}>
              <div className="grid gap-4 sm:grid-cols-2">
                <SettingsField label="Nome">
                  <input
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    placeholder="Ex.: Lucas"
                    className={adminInputClass}
                  />
                </SettingsField>

                <SettingsField label="Sobrenome">
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    placeholder="Ex.: Mendes"
                    className={adminInputClass}
                  />
                </SettingsField>
              </div>

              <SettingsField label="Usuário">
                <input
                  type="text"
                  readOnly
                  value={suggestedUsername}
                  placeholder="nome.sobrenome"
                  className={usernameReadonlyClass}
                  aria-describedby="new-client-username-hint"
                />
              </SettingsField>

              <SettingsField label="Telefone">
                <input
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                    handlePhoneChange(e.clipboardData.getData("text"));
                  }}
                  placeholder="(61) 99999-9999"
                  maxLength={15}
                  className={adminInputClass}
                />
              </SettingsField>

              <SettingsField label="E-mail">
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={form.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    handleEmailChange(e.clipboardData.getData("text"));
                  }}
                  placeholder="piloto@email.com"
                  className={adminInputClass}
                />
              </SettingsField>

              <SettingsField label="Data de nascimento">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday"
                  value={form.birthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault();
                    handleBirthDateChange(e.clipboardData.getData("text"));
                  }}
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
                  className={adminInputClass}
                  aria-label="Data de nascimento"
                />
              </SettingsField>

              <SettingsField label="Categoria">
                <ul className="space-y-2">
                  {categories.map((category) => {
                    const checked = form.categoryIds.includes(category.id);
                    const disabled = isCategoryDisabled(
                      category.id,
                      form.categoryIds,
                    );
                    return (
                      <li key={category.id}>
                        <div
                          className={adminChoiceTileClass({
                            checked,
                            disabled,
                          })}
                        >
                          <SettingsCheckbox
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleCategory(category.id)}
                            aria-label={category.name}
                          />
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => toggleCategory(category.id)}
                            className="min-w-0 flex-1 text-left text-[14px] font-medium text-[#111] disabled:cursor-not-allowed"
                          >
                            {category.name}
                          </button>
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
                  onSelect={(levelId) =>
                    setForm((prev) => ({ ...prev, levelId }))
                  }
                />
              </SettingsField>
            </div>
          </div>

          <footer className={DRAWER_FOOTER_SHELL_CLASS}>
            <div className={DRAWER_FOOTER_INNER_CLASS}>
              <DrawerFooterActions columns={2}>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline-md bg-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="btn-primary-md disabled:opacity-50"
                >
                  Salvar cliente
                </button>
              </DrawerFooterActions>
            </div>
          </footer>
        </aside>
      </div>

      <ConfirmDialog
        open={successOpen}
        title="Cadastro realizado"
        message={
          savedSummary
            ? `O cadastro de ${savedSummary.name} foi concluído com sucesso. Enviamos um link para ${savedSummary.email} para que o piloto configure a senha de acesso.`
            : "Cadastro concluído com sucesso."
        }
        confirmLabel="Entendi"
        secondaryConfirmLabel={onGenerateCharge ? "Gerar cobrança" : undefined}
        hideCancel
        onConfirm={finishSuccess}
        onCancel={finishSuccess}
        onSecondaryConfirm={() => {
          finishSuccess();
          onGenerateCharge?.();
        }}
      />
    </>
  );
}
