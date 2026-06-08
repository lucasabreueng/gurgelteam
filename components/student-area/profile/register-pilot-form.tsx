"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { FieldError } from "@/components/cadastro/field-error";
import { PasswordRulesTooltip } from "@/components/cadastro/password-rules-tooltip";
import { SettingsDropdown } from "@/components/admin/settings/settings-dropdown";
import {
  brazilDateToIso,
  formatBrazilDateInput,
} from "@/lib/brazil-date-input";
import type { RegisterPilotFieldErrors } from "@/lib/contracts/student/profile";
import { getAppServices } from "@/lib/data-source/app-services";
import { useSuggestedUsername } from "@/lib/hooks/use-suggested-username";
import { AuthServiceMock } from "@/services/auth/authServiceMock";
import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";
import { ProfileAvatarPicker } from "./profile-avatar-picker";
import { profileInputClass } from "./profile-section";

const labelClassName =
  "text-[11px] font-bold uppercase tracking-wider text-neutral-500";

type FieldKey = keyof RegisterPilotFieldErrors;

function touchField(
  setter: React.Dispatch<
    React.SetStateAction<Partial<Record<FieldKey, boolean>>>
  >,
  key: FieldKey
) {
  setter((prev) => ({ ...prev, [key]: true }));
}

type Props = {
  embedded?: boolean;
  hideActions?: boolean;
  formRef?: RefObject<HTMLFormElement | null>;
  resetWhen?: boolean;
  guardianProfileId?: string;
  demoParam?: string | null;
  onSubmitStateChange?: (state: {
    loading: boolean;
    usernameLoading: boolean;
  }) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
};

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  relationship: "",
  birthDate: "",
  cpf: "",
  city: "",
  state: "DF",
  phone: "",
  password: "",
  confirmPassword: "",
  avatarUrl: "",
};

export function RegisterPilotForm({
  embedded = false,
  hideActions = false,
  formRef,
  resetWhen,
  guardianProfileId = "",
  demoParam = null,
  onSubmitStateChange,
  onSuccess,
  onCancel,
}: Props) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState(INITIAL_FORM.firstName);
  const [lastName, setLastName] = useState(INITIAL_FORM.lastName);
  const [relationship, setRelationship] = useState(INITIAL_FORM.relationship);
  const [birthDate, setBirthDate] = useState(INITIAL_FORM.birthDate);
  const [cpf, setCpf] = useState(INITIAL_FORM.cpf);
  const [city, setCity] = useState(INITIAL_FORM.city);
  const [state, setState] = useState(INITIAL_FORM.state);
  const [phone, setPhone] = useState(INITIAL_FORM.phone);
  const [password, setPassword] = useState(INITIAL_FORM.password);
  const [confirmPassword, setConfirmPassword] = useState(INITIAL_FORM.confirmPassword);
  const [avatarUrl, setAvatarUrl] = useState(INITIAL_FORM.avatarUrl);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

  useEffect(() => {
    if (resetWhen === false) return;
    setFirstName(INITIAL_FORM.firstName);
    setLastName(INITIAL_FORM.lastName);
    setRelationship(INITIAL_FORM.relationship);
    setBirthDate(INITIAL_FORM.birthDate);
    setCpf(INITIAL_FORM.cpf);
    setCity(INITIAL_FORM.city);
    setState(INITIAL_FORM.state);
    setPhone(INITIAL_FORM.phone);
    setPassword(INITIAL_FORM.password);
    setConfirmPassword(INITIAL_FORM.confirmPassword);
    setAvatarUrl(INITIAL_FORM.avatarUrl);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoading(false);
    setSubmitted(false);
    setTouched({});
  }, [resetWhen]);

  const formValues = useMemo(
    () => ({
      firstName,
      lastName,
      relationship,
      birthDate,
      cpf,
      city,
      state,
      phone,
      password,
      confirmPassword,
      avatarUrl,
    }),
    [
      firstName,
      lastName,
      relationship,
      birthDate,
      cpf,
      city,
      state,
      phone,
      password,
      confirmPassword,
      avatarUrl,
    ]
  );

  const errors = useMemo(
    () => StudentProfileServiceMock.getRegisterPilotFieldErrors(formValues),
    [formValues]
  );

  const namesComplete =
    firstName.trim().length > 0 && lastName.trim().length > 0;

  const { username: suggestedUsername, loading: usernameLoading } =
    useSuggestedUsername(firstName, lastName, namesComplete);

  const birthDateIso = useMemo(() => brazilDateToIso(birthDate), [birthDate]);

  const autoCategory = useMemo(
    () =>
      birthDateIso
        ? StudentProfileServiceMock.getAutoPilotCategory(birthDateIso)
        : null,
    [birthDateIso]
  );

  const showError = (key: FieldKey) =>
    Boolean(submitted || touched[key]) && errors[key];

  useEffect(() => {
    onSubmitStateChange?.({ loading, usernameLoading });
  }, [loading, usernameLoading, onSubmitStateChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSubmitError(null);
    if (usernameLoading || !suggestedUsername) return;
    if (StudentProfileServiceMock.hasRegisterPilotErrors(errors)) return;
    if (!AuthServiceMock.isPasswordValid(password)) return;

    setLoading(true);
    void getAppServices()
      .studentProfile.registerLinkedPilot(
        demoParam,
        guardianProfileId,
        formValues,
        suggestedUsername,
      )
      .then(() => {
        onSuccess?.();
      })
      .catch((err) => {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Não foi possível cadastrar o piloto.",
        );
      })
      .finally(() => setLoading(false));
  };

  const form = (
        <form
          ref={formRef}
          id={hideActions ? "register-pilot-form" : undefined}
          className={embedded ? "space-y-5" : "mt-8 space-y-5"}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex flex-col items-center">
            <ProfileAvatarPicker
              avatarUrl={avatarUrl}
              name={[firstName, lastName].filter(Boolean).join(" ") || "Novo piloto"}
              onChange={setAvatarUrl}
              localOnly
              size={88}
            />
            <p className="mt-2 text-[12px] text-neutral-500">Foto do piloto</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className={labelClassName}>Nome</span>
              <input
                className={`mt-2 ${profileInputClass}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => touchField(setTouched, "firstName")}
              />
              {showError("firstName") ? (
                <FieldError message={errors.firstName} />
              ) : null}
            </div>
            <div>
              <span className={labelClassName}>Sobrenome</span>
              <input
                className={`mt-2 ${profileInputClass}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => touchField(setTouched, "lastName")}
              />
              {showError("lastName") ? (
                <FieldError message={errors.lastName} />
              ) : null}
            </div>
          </div>

          <div>
            <span className={labelClassName}>Usuário</span>
            <input
              type="text"
              readOnly
              value={suggestedUsername}
              placeholder="nome.sobrenome"
              aria-describedby="register-pilot-username-hint"
              aria-busy={usernameLoading}
              className={`mt-2 ${profileInputClass} cursor-default bg-neutral-50 text-neutral-700`}
            />
            {!namesComplete || usernameLoading ? (
              <p
                id="register-pilot-username-hint"
                className="mt-2 text-[12px] text-neutral-500"
              >
                {!namesComplete
                  ? "Preencha nome e sobrenome para gerar o usuário."
                  : "Verificando disponibilidade…"}
              </p>
            ) : null}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={labelClassName}>Senha de acesso</span>
              <PasswordRulesTooltip />
            </div>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                className={`${profileInputClass} pr-11`}
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
                onBlur={() => touchField(setTouched, "password")}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <HiEyeSlash className="h-5 w-5" aria-hidden />
                ) : (
                  <HiEye className="h-5 w-5" aria-hidden />
                )}
              </button>
            </div>
            {showError("password") ? (
              <FieldError message={errors.password} />
            ) : submitted && password && !AuthServiceMock.isPasswordValid(password) ? (
              <ul className="mt-2 space-y-1">
                {AuthServiceMock.getFailedPasswordRuleLabels(password).map((msg) => (
                  <li key={msg}>
                    <FieldError message={msg} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <span className={labelClassName}>Confirmar senha</span>
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`${profileInputClass} pr-11`}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value.replace(/\s/g, ""))
                }
                onBlur={() => touchField(setTouched, "confirmPassword")}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirmPassword ? (
                  <HiEyeSlash className="h-5 w-5" aria-hidden />
                ) : (
                  <HiEye className="h-5 w-5" aria-hidden />
                )}
              </button>
            </div>
            {showError("confirmPassword") ? (
              <FieldError message={errors.confirmPassword} />
            ) : null}
          </div>

          <div>
            <span className={labelClassName}>Grau de parentesco</span>
            <div className="mt-2">
              <SettingsDropdown
                aria-label="Grau de parentesco"
                options={[...StudentProfileServiceMock.getRelationshipDegreeOptions()]}
                value={relationship}
                onSelect={(value) => {
                  setRelationship(value);
                  touchField(setTouched, "relationship");
                }}
              />
            </div>
            {showError("relationship") ? (
              <FieldError message={errors.relationship} />
            ) : null}
          </div>

          <div>
            <span className={labelClassName}>Data de nascimento</span>
            <input
              type="text"
              inputMode="numeric"
              className={`mt-2 ${profileInputClass}`}
              value={birthDate}
              onChange={(e) =>
                setBirthDate(formatBrazilDateInput(e.target.value))
              }
              onBlur={() => touchField(setTouched, "birthDate")}
              placeholder="dd/mm/aaaa"
              maxLength={10}
            />
            {showError("birthDate") ? (
              <FieldError message={errors.birthDate} />
            ) : null}
          </div>

          <div>
            <span className={labelClassName}>Categoria (automática)</span>
            <input
              type="text"
              readOnly
              value={
                autoCategory
                  ? StudentProfileServiceMock.getCategoryLabel(autoCategory.value)
                  : birthDateIso
                    ? "—"
                    : ""
              }
              placeholder="Informe a data de nascimento"
              className={`mt-2 ${profileInputClass} cursor-default bg-neutral-50 text-neutral-700`}
            />
            {autoCategory ? (
              <p className="mt-2 text-[12px] text-neutral-500">
                Definida pelo sistema: de 7 a 8 anos (Mirim), de 9 a 11 anos
                (Cadete) e acima de 11 anos (F400).
              </p>
            ) : null}
            {showError("category") ? (
              <FieldError message={errors.category} />
            ) : null}
          </div>

          <div>
            <span className={labelClassName}>CPF</span>
            <input
              className={`mt-2 ${profileInputClass}`}
              value={cpf}
              onChange={(e) =>
                setCpf(StudentProfileServiceMock.formatCpf(e.target.value))
              }
              onBlur={() => touchField(setTouched, "cpf")}
              placeholder="000.000.000-00"
              maxLength={14}
            />
            {showError("cpf") ? <FieldError message={errors.cpf} /> : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className={labelClassName}>Cidade</span>
              <input
                className={`mt-2 ${profileInputClass}`}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={() => touchField(setTouched, "city")}
              />
              {showError("city") ? <FieldError message={errors.city} /> : null}
            </div>
            <div>
              <span className={labelClassName}>Estado</span>
              <div className="mt-2">
                <SettingsDropdown
                  aria-label="Estado"
                  options={StudentProfileServiceMock.getBrazilStates()}
                  value={state}
                  onSelect={(value) => {
                    setState(value);
                    touchField(setTouched, "state");
                  }}
                />
              </div>
              {showError("state") ? <FieldError message={errors.state} /> : null}
            </div>
          </div>

          <div>
            <span className={labelClassName}>Telefone</span>
            <input
              type="tel"
              className={`mt-2 ${profileInputClass}`}
              value={phone}
              onChange={(e) => setPhone(StudentProfileServiceMock.formatPhoneBr(e.target.value))}
              onBlur={() => touchField(setTouched, "phone")}
              placeholder="(61) 99999-9999 (opcional)"
            />
            {showError("phone") ? <FieldError message={errors.phone} /> : null}
          </div>

          {submitError ? <FieldError message={submitError} /> : null}

          {!hideActions ? (
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={loading || usernameLoading}
                className="rounded-xl bg-accent px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
              >
                {loading ? "Cadastrando…" : "Cadastrar piloto"}
              </button>
              {onCancel ? (
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex items-center justify-center rounded-xl border border-[rgba(17,17,17,0.1)] px-5 py-3.5 text-[12px] font-semibold text-[#0d1f3c] transition hover:border-accent/25"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          ) : null}
        </form>
  );

  if (embedded) {
    return (
      <div className="w-full">
        <p className="mb-6 text-[14px] leading-relaxed text-neutral-600">
          Cadastre um piloto vinculado à sua conta. A categoria é definida
          automaticamente pela data de nascimento (até 18 anos).
        </p>
        {form}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="rounded-2xl border border-[rgba(17,17,17,0.06)] bg-white p-6 shadow-[0_2px_16px_rgba(13,31,60,0.04)] md:p-8">
        <h2 className="text-xl font-bold text-[#0d1f3c]">Novo piloto</h2>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
          Cadastre um piloto vinculado à sua conta de responsável. A categoria é
          definida automaticamente pela data de nascimento.
        </p>
        {form}
      </div>
    </div>
  );
}
