"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { SettingsDatePicker } from "@/components/admin/settings/settings-date-picker";
import {
  AuthServiceMock,
  type CadastroFieldErrors,
} from "@/services/auth/authServiceMock";
import { FieldError } from "./field-error";
import { PasswordRulesTooltip } from "./password-rules-tooltip";

const inputClassName =
  "mt-2 w-full rounded-xl border border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-3.5 text-[15px] text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15";

const labelClassName =
  "text-[11px] font-bold uppercase tracking-wider text-neutral-600";

type FieldKey = keyof CadastroFieldErrors;

function touchField(
  setter: React.Dispatch<React.SetStateAction<Partial<Record<FieldKey, boolean>>>>,
  key: FieldKey
) {
  setter((prev) => ({ ...prev, [key]: true }));
}

export function CadastroForm() {
  const cadastroConfig = AuthServiceMock.getCadastroConfig();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

  const formValues = useMemo(
    () => ({
      firstName,
      lastName,
      birthDate,
      cpf,
      email,
      password,
    }),
    [firstName, lastName, birthDate, cpf, email, password]
  );

  const errors = useMemo(
    () => AuthServiceMock.validateCadastroForm(formValues),
    [formValues]
  );

  const suggestedUsername = useMemo(
    () => AuthServiceMock.generateAvailableUsername(firstName, lastName),
    [firstName, lastName]
  );

  const isMinor = birthDate ? AuthServiceMock.isUnder14(birthDate) : false;

  const showError = (key: FieldKey) =>
    Boolean(submitted || touched[key]) &&
    (key === "password"
      ? errors.password?.length
      : errors[key]);

  const handlePasswordChange = (value: string) => {
    setPassword(value.replace(/\s/g, ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (isMinor) return;
    if (AuthServiceMock.hasCadastroFieldErrors(errors)) return;

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      router.push("/piloto");
    }, 600);
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#0d1f3c]">
          Crie sua conta
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
          Preencha seus dados para acessar a área do aluno
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="block">
              <span className={labelClassName}>Nome</span>
              <input
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => touchField(setTouched, "firstName")}
                placeholder="Seu nome"
                className={inputClassName}
              />
              {showError("firstName") ? (
                <FieldError message={errors.firstName} />
              ) : null}
            </div>

            <div className="block">
              <span className={labelClassName}>Sobrenome</span>
              <input
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => touchField(setTouched, "lastName")}
                placeholder="Seu sobrenome"
                className={inputClassName}
              />
              {showError("lastName") ? (
                <FieldError message={errors.lastName} />
              ) : null}
            </div>
          </div>

          <div className="block">
            <span className={labelClassName}>Usuário</span>
            <input
              type="text"
              readOnly
              value={suggestedUsername}
              placeholder="nome.sobrenome"
              aria-describedby="cadastro-username-hint"
              className={`${inputClassName} cursor-default bg-neutral-50 text-neutral-700`}
            />
          </div>

          <div className="block">
            <span className={labelClassName}>Data de nascimento</span>
            <div
              className="mt-2"
              onBlurCapture={() => touchField(setTouched, "birthDate")}
            >
              <SettingsDatePicker
                aria-label="Data de nascimento"
                value={birthDate}
                onChange={(value) => {
                  setBirthDate(value);
                  touchField(setTouched, "birthDate");
                }}
                fromYear={1940}
                toYear={new Date().getFullYear()}
                disableFuture
                lowercaseLabel
                placeholder="selecionar data"
              />
            </div>
            {showError("birthDate") ? (
              <FieldError message={errors.birthDate} />
            ) : null}
            {isMinor ? (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-[14px] leading-relaxed text-amber-950"
              >
                <p className="font-semibold">Cadastro não disponível</p>
                <p className="mt-1">{cadastroConfig.minorNotice}</p>
              </div>
            ) : null}
          </div>

          <div className="block">
            <span className={labelClassName}>CPF</span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={cpf}
              onChange={(e) => setCpf(AuthServiceMock.formatCpf(e.target.value))}
              onBlur={() => touchField(setTouched, "cpf")}
              placeholder="000.000.000-00"
              maxLength={14}
              className={inputClassName}
            />
            {showError("cpf") ? <FieldError message={errors.cpf} /> : null}
          </div>

          <div className="block">
            <span className={labelClassName}>E-mail</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => touchField(setTouched, "email")}
              placeholder="seu@email.com"
              className={inputClassName}
            />
            {showError("email") ? <FieldError message={errors.email} /> : null}
          </div>

          <div className="block">
            <div className="flex items-center gap-1.5">
              <span className={labelClassName}>Senha</span>
              <PasswordRulesTooltip />
            </div>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                onBlur={() => touchField(setTouched, "password")}
                onKeyDown={(e) => {
                  if (e.key === " ") e.preventDefault();
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  handlePasswordChange(e.clipboardData.getData("text"));
                }}
                placeholder="Crie uma senha segura"
                className="w-full rounded-xl border border-[rgba(17,17,17,0.12)] bg-[#fafbfc] py-3.5 pl-4 pr-12 text-[15px] text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-[#0d1f3c]"
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
              <FieldError messages={errors.password} />
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading || isMinor}
            className="w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <p className="mt-8 text-center text-[14px] text-neutral-600">
          {cadastroConfig.loginPrompt}{" "}
          <Link
            href={cadastroConfig.loginHref}
            className="font-semibold text-[#c41e3a] transition hover:underline"
          >
            {cadastroConfig.loginCta}
          </Link>
        </p>
      </div>
    </div>
  );
}
