"use client";



import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { HiEye, HiEyeSlash } from "react-icons/hi2";

import { apiFetch } from "@/lib/api/http-client";

import { v1ApiPaths } from "@/lib/api/v1-api-paths";

import {

  brazilDateToIso,

  formatBrazilDateInput,

} from "@/lib/brazil-date-input";

import type {

  RegisterResponse,

  SuggestUsernameResponse,

} from "@/lib/contracts/api/v1/auth.api.schemas";

import type { RegistrationLegalDocument } from "@/lib/legal/registration-legal";

import {

  AuthServiceMock,

  type CadastroFieldErrors,

} from "@/services/auth/authServiceMock";

import { CadastroLegalConsents } from "./cadastro-legal-consents";

import { FieldError } from "./field-error";

import { PasswordRulesTooltip } from "./password-rules-tooltip";



type RegisterLegalDocumentsResponse = {

  documents: RegistrationLegalDocument[];

};



const inputClassName =

  "mt-2 w-full rounded-xl border border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-3.5 text-[15px] text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15";



const labelClassName =

  "text-[11px] font-bold uppercase tracking-wider text-neutral-600";



type FieldKey = keyof CadastroFieldErrors | "confirmPassword";



type CadastroStep = 1 | 2;



function touchField(

  setter: React.Dispatch<React.SetStateAction<Partial<Record<FieldKey, boolean>>>>,

  key: FieldKey,

) {

  setter((prev) => ({ ...prev, [key]: true }));

}



function hasPersonalFieldErrors(errors: CadastroFieldErrors): boolean {

  return Boolean(

    errors.firstName ||

      errors.lastName ||

      errors.birthDate ||

      errors.cpf,

  );

}



function hasLoginFieldErrors(

  errors: CadastroFieldErrors,

  confirmPasswordError?: string,

): boolean {

  return Boolean(

    errors.email ||

      errors.password?.length ||

      confirmPasswordError ||

      errors.acceptedPrivacy ||

      errors.acceptedTerms,

  );

}



function StepIndicator({ step }: { step: CadastroStep }) {

  const steps = [

    { n: 1 as const, label: "Dados pessoais" },

    { n: 2 as const, label: "Dados de login" },

  ];



  return (

    <div className="mt-6 flex items-center gap-3">

      {steps.map((item, index) => {

        const isActive = step === item.n;

        const isDone = step > item.n;



        return (

          <div key={item.n} className="flex min-w-0 flex-1 items-center gap-3">

            <div className="flex min-w-0 items-center gap-2">

              <span

                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${

                  isActive || isDone

                    ? "bg-[#0d1f3c] text-white"

                    : "bg-neutral-100 text-neutral-500"

                }`}

                aria-hidden

              >

                {item.n}

              </span>

              <span

                className={`truncate text-[12px] font-semibold ${

                  isActive ? "text-[#0d1f3c]" : "text-neutral-500"

                }`}

              >

                {item.label}

              </span>

            </div>

            {index < steps.length - 1 ? (

              <div

                className={`h-px flex-1 ${isDone ? "bg-[#0d1f3c]/30" : "bg-neutral-200"}`}

                aria-hidden

              />

            ) : null}

          </div>

        );

      })}

    </div>

  );

}



export function CadastroForm() {

  const cadastroConfig = AuthServiceMock.getCadastroConfig();

  const router = useRouter();

  const [step, setStep] = useState<CadastroStep>(1);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [birthDate, setBirthDate] = useState("");

  const [cpf, setCpf] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [step1Submitted, setStep1Submitted] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

  const [suggestedUsername, setSuggestedUsername] = useState("");

  const [usernameLoading, setUsernameLoading] = useState(false);

  const [legalDocuments, setLegalDocuments] = useState<

    RegistrationLegalDocument[]

  >([]);

  const [legalDocumentsLoading, setLegalDocumentsLoading] = useState(true);

  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [acceptedImageUsage, setAcceptedImageUsage] = useState(false);



  const birthDateIso = useMemo(() => brazilDateToIso(birthDate), [birthDate]);



  const formValues = useMemo(

    () => ({

      firstName,

      lastName,

      birthDate,

      cpf,

      email,

      password,

      acceptedPrivacy,

      acceptedTerms,

      acceptedImageUsage,

    }),

    [

      firstName,

      lastName,

      birthDate,

      cpf,

      email,

      password,

      acceptedPrivacy,

      acceptedTerms,

      acceptedImageUsage,

    ],

  );



  useEffect(() => {

    let cancelled = false;

    void apiFetch<RegisterLegalDocumentsResponse>(

      v1ApiPaths.auth.registerLegalDocuments,

    ).then((result) => {

      if (cancelled) return;

      setLegalDocumentsLoading(false);

      if (result.success && result.data?.documents) {

        setLegalDocuments(result.data.documents);

      }

    });

    return () => {

      cancelled = true;

    };

  }, []);



  const errors = useMemo(

    () => AuthServiceMock.validateCadastroForm(formValues),

    [formValues],

  );



  const confirmPasswordError = useMemo(() => {

    if (!submitted && !touched.confirmPassword) return undefined;

    if (!confirmPassword) return "Confirme a senha.";

    if (password !== confirmPassword) return "As senhas não coincidem.";

    return undefined;

  }, [confirmPassword, password, submitted, touched.confirmPassword]);



  const personalErrors = useMemo(

    () => ({

      firstName: errors.firstName,

      lastName: errors.lastName,

      birthDate: errors.birthDate,

      cpf: errors.cpf,

    }),

    [errors],

  );



  const localUsernameFallback = useMemo(

    () => AuthServiceMock.generateAvailableUsername(firstName, lastName),

    [firstName, lastName],

  );



  useEffect(() => {

    const trimmedFirst = firstName.trim();

    const trimmedLast = lastName.trim();

    if (!trimmedFirst || !trimmedLast) {

      setSuggestedUsername("");

      setUsernameLoading(false);

      return;

    }



    setSuggestedUsername(localUsernameFallback);

    setUsernameLoading(true);



    const params = new URLSearchParams({

      firstName: trimmedFirst,

      lastName: trimmedLast,

    });

    let cancelled = false;

    const timer = window.setTimeout(() => {

      void apiFetch<SuggestUsernameResponse>(

        `${v1ApiPaths.auth.registerSuggestUsername}?${params.toString()}`,

      ).then((result) => {

        if (cancelled) return;

        setUsernameLoading(false);

        if (result.success && result.data) {

          setSuggestedUsername(result.data.username);

          return;

        }

        setSuggestedUsername(localUsernameFallback);

      });

    }, 300);



    return () => {

      cancelled = true;

      window.clearTimeout(timer);

    };

  }, [firstName, lastName, localUsernameFallback]);



  const isMinor = birthDateIso ? AuthServiceMock.isUnder14(birthDateIso) : false;



  const showPersonalError = (key: keyof typeof personalErrors) =>

    Boolean(step1Submitted || touched[key]) && personalErrors[key];



  const showLoginError = (key: keyof CadastroFieldErrors) =>

    Boolean(submitted || touched[key]) &&

    (key === "password" ? errors.password?.length : errors[key]);



  const handlePasswordChange = (value: string) => {

    setPassword(value.replace(/\s/g, ""));

  };



  const handleConfirmPasswordChange = (value: string) => {

    setConfirmPassword(value.replace(/\s/g, ""));

  };



  const handleContinue = () => {

    setStep1Submitted(true);

    if (isMinor || hasPersonalFieldErrors(errors) || usernameLoading || !suggestedUsername) {

      return;

    }

    setFormError(null);

    setStep(2);

  };



  const handleBack = () => {

    setStep(1);

    setFormError(null);

  };



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setSubmitted(true);

    if (hasLoginFieldErrors(errors, confirmPasswordError)) return;



    setLoading(true);

    setFormError(null);



    const result = await apiFetch<RegisterResponse>(v1ApiPaths.auth.register, {

      method: "POST",

      body: JSON.stringify({

        firstName,

        lastName,

        birthDate: birthDateIso,

        cpf: cpf.replace(/\D/g, ""),

        email,

        password,

        acceptedPrivacy,

        acceptedTerms,

        acceptedImageUsage,

      }),

    });



    setLoading(false);



    if (result.success && result.data?.verificationSent) {

      router.push(

        `/cadastro/confirmar-email?email=${encodeURIComponent(result.data.email)}`,

      );

      return;

    }



    setFormError(

      result.error?.message ??

        result.message ??

        "Não foi possível concluir o cadastro.",

    );

  };



  return (

    <div className="w-full">

      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-8">

        <h2 className="text-2xl font-bold tracking-tight text-[#0d1f3c]">

          Crie sua conta

        </h2>

        <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">

          {step === 1

            ? "Informe seus dados pessoais para começar"

            : "Defina seu acesso e aceite os termos"}

        </p>



        <StepIndicator step={step} />



        {step === 1 ? (

          <div className="mt-8 space-y-5">

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

                {showPersonalError("firstName") ? (

                  <FieldError message={personalErrors.firstName} />

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

                {showPersonalError("lastName") ? (

                  <FieldError message={personalErrors.lastName} />

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

                aria-busy={usernameLoading}

                className={`${inputClassName} cursor-default bg-neutral-50 text-neutral-700`}

              />

              {!firstName.trim() || !lastName.trim() || usernameLoading ? (

                <p

                  id="cadastro-username-hint"

                  className="mt-1.5 text-[12px] text-neutral-500"

                >

                  {!firstName.trim() || !lastName.trim()

                    ? "Preencha nome e sobrenome para gerar o usuário."

                    : "Verificando disponibilidade…"}

                </p>

              ) : null}

            </div>



            <div className="block">

              <span className={labelClassName}>Data de nascimento</span>

              <input

                type="text"

                inputMode="numeric"

                autoComplete="bday"

                value={birthDate}

                onChange={(e) =>

                  setBirthDate(formatBrazilDateInput(e.target.value))

                }

                onBlur={() => touchField(setTouched, "birthDate")}

                placeholder="dd/mm/aaaa"

                maxLength={10}

                className={inputClassName}

              />

              {showPersonalError("birthDate") ? (

                <FieldError message={personalErrors.birthDate} />

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

                onChange={(e) =>

                  setCpf(AuthServiceMock.formatCpf(e.target.value))

                }

                onBlur={() => touchField(setTouched, "cpf")}

                placeholder="000.000.000-00"

                maxLength={14}

                className={inputClassName}

              />

              {showPersonalError("cpf") ? (

                <FieldError message={personalErrors.cpf} />

              ) : null}

            </div>



            <button

              type="button"

              disabled={isMinor || usernameLoading}

              onClick={handleContinue}

              className="w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"

            >

              Continuar

            </button>

          </div>

        ) : (

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>

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

              {showLoginError("email") ? (

                <FieldError message={errors.email} />

              ) : null}

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

              {showLoginError("password") ? (

                <FieldError messages={errors.password} />

              ) : null}

            </div>



            <div className="block">

              <span className={labelClassName}>Confirmar senha</span>

              <div className="relative mt-2">

                <input

                  type={showConfirmPassword ? "text" : "password"}

                  autoComplete="new-password"

                  value={confirmPassword}

                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}

                  onBlur={() => touchField(setTouched, "confirmPassword")}

                  onKeyDown={(e) => {

                    if (e.key === " ") e.preventDefault();

                  }}

                  onPaste={(e) => {

                    e.preventDefault();

                    handleConfirmPasswordChange(e.clipboardData.getData("text"));

                  }}

                  placeholder="Repita a senha"

                  className="w-full rounded-xl border border-[rgba(17,17,17,0.12)] bg-[#fafbfc] py-3.5 pl-4 pr-12 text-[15px] text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15"

                />

                <button

                  type="button"

                  onClick={() => setShowConfirmPassword((v) => !v)}

                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-neutral-500 transition hover:bg-neutral-100 hover:text-[#0d1f3c]"

                  aria-label={

                    showConfirmPassword ? "Ocultar senha" : "Mostrar senha"

                  }

                >

                  {showConfirmPassword ? (

                    <HiEyeSlash className="h-5 w-5" aria-hidden />

                  ) : (

                    <HiEye className="h-5 w-5" aria-hidden />

                  )}

                </button>

              </div>

              {confirmPasswordError ? (

                <FieldError message={confirmPasswordError} />

              ) : null}

            </div>



            <CadastroLegalConsents

              documents={legalDocuments}

              loading={legalDocumentsLoading}

              value={{

                acceptedPrivacy,

                acceptedTerms,

                acceptedImageUsage,

              }}

              onChange={(patch) => {

                if (patch.acceptedPrivacy !== undefined) {

                  setAcceptedPrivacy(patch.acceptedPrivacy);

                }

                if (patch.acceptedTerms !== undefined) {

                  setAcceptedTerms(patch.acceptedTerms);

                }

                if (patch.acceptedImageUsage !== undefined) {

                  setAcceptedImageUsage(patch.acceptedImageUsage);

                }

              }}

              errors={{

                acceptedPrivacy: errors.acceptedPrivacy,

                acceptedTerms: errors.acceptedTerms,

              }}

              showErrors={submitted}

            />



            {formError ? (

              <p

                role="alert"

                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"

              >

                {formError}

              </p>

            ) : null}



            <div className="flex flex-col gap-3 sm:flex-row">

              <button

                type="button"

                onClick={handleBack}

                className="w-full rounded-xl border border-[rgba(13,31,60,0.2)] bg-white px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:bg-[#fafbfc] sm:flex-1"

              >

                Voltar

              </button>

              <button

                type="submit"

                disabled={loading}

                className="w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 sm:flex-1"

              >

                {loading ? "Criando conta…" : "Criar conta"}

              </button>

            </div>

          </form>

        )}



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


