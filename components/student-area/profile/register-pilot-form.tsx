"use client";

import { useMemo, useState } from "react";
import { FieldError } from "@/components/cadastro/field-error";
import { SettingsDatePicker } from "@/components/admin/settings/settings-date-picker";
import { SettingsDropdown } from "@/components/admin/settings/settings-dropdown";
import type { RegisterPilotFieldErrors } from "@/lib/contracts/student/profile";
import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";
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
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function RegisterPilotForm({
  embedded = false,
  onSuccess,
  onCancel,
}: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

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
    ]
  );

  const errors = useMemo(
    () => StudentProfileServiceMock.getRegisterPilotFieldErrors(formValues),
    [formValues]
  );

  const suggestedUsername = useMemo(
    () => StudentProfileServiceMock.buildRegisterPilotUsername(firstName, lastName),
    [firstName, lastName]
  );

  const autoCategory = useMemo(
    () => StudentProfileServiceMock.getAutoPilotCategory(birthDate),
    [birthDate]
  );

  const showError = (key: FieldKey) =>
    Boolean(submitted || touched[key]) && errors[key];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (StudentProfileServiceMock.hasRegisterPilotErrors(errors)) return;

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onSuccess?.();
    }, 700);
  };

  const form = (
        <form className={embedded ? "space-y-5" : "mt-8 space-y-5"} onSubmit={handleSubmit} noValidate>
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
              className={`mt-2 ${profileInputClass} cursor-default bg-neutral-50 text-neutral-700`}
            />
            <p className="mt-2 text-[12px] text-neutral-500">
              Gerado automaticamente a partir do nome e sobrenome.
            </p>
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
            <div className="mt-2">
              <SettingsDatePicker
                aria-label="Data de nascimento do piloto"
                value={birthDate}
                onChange={(value) => {
                  setBirthDate(value);
                  touchField(setTouched, "birthDate");
                }}
                fromYear={new Date().getFullYear() - 20}
                toYear={new Date().getFullYear()}
                disableFuture
                lowercaseLabel
                placeholder="selecionar data"
              />
            </div>
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
                  : birthDate
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

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
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
        </form>
  );

  if (embedded) {
    return (
      <div className="w-full">
        <p className="mb-6 text-[14px] leading-relaxed text-neutral-600">
          Cadastre um piloto vinculado à sua conta de responsável. A categoria é
          definida automaticamente pela data de nascimento.
        </p>
        <div className="rounded-2xl border border-[rgba(17,17,17,0.06)] bg-white p-5 md:p-6">
          {form}
        </div>
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
