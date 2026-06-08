"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldError } from "@/components/cadastro/field-error";
import { apiFetch } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import { AuthServiceMock } from "@/services/auth/authServiceMock";
import { OtpInput } from "./otp-input";
import { useResendCooldown } from "./use-resend-cooldown";

const inputClassName =
  "mt-2 w-full rounded-xl border border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-3.5 text-[15px] text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15";

const labelClassName =
  "text-[11px] font-bold uppercase tracking-wider text-neutral-600";

type Step = "identifier" | "code";

export function PasswordRecoveryForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("identifier");
  const [identifier, setIdentifier] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [identifierError, setIdentifierError] = useState<string | undefined>();
  const [codeError, setCodeError] = useState<string | undefined>();
  const { secondsLeft, canResend, startCooldown } = useResendCooldown();

  const account = recoveryEmail
    ? AuthServiceMock.resolveRecoveryAccount(recoveryEmail) ??
      AuthServiceMock.resolveRecoveryAccount(identifier)
    : AuthServiceMock.resolveRecoveryAccount(identifier);

  const maskedTarget =
    account != null
      ? AuthServiceMock.maskRecoveryTarget(account)
      : identifier.trim()
        ? identifier.trim()
        : "";

  const sendRecoveryEmail = (email: string) => {
    setRecoveryEmail(email);
    startCooldown();
    setStep("code");
    setCode("");
    setCodeError(undefined);
  };

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    const error = AuthServiceMock.validateRecoveryIdentifierForm({
      identifier: trimmed,
    });
    if (error) {
      setIdentifierError(error);
      return;
    }

    setIdentifierError(undefined);
    setLoading(true);

    const result = await apiFetch<{ sent: true }>(
      v1ApiPaths.auth.passwordRecovery,
      {
        method: "POST",
        body: JSON.stringify({ identifier: trimmed }),
      },
    );

    setLoading(false);

    if (result.success) {
      const resolved =
        AuthServiceMock.resolveRecoveryAccount(trimmed) ??
        ({ email: trimmed.includes("@") ? trimmed : "" } as { email: string });
      sendRecoveryEmail(resolved.email || trimmed);
      return;
    }

    if (result.error?.httpStatus === 503) {
      const resolved = AuthServiceMock.resolveRecoveryAccount(trimmed);
      if (!resolved) {
        setIdentifierError("E-mail ou usuário não encontrado em nossa base.");
        return;
      }
      sendRecoveryEmail(resolved.email);
      return;
    }

    setIdentifierError(
      result.error?.message ?? "Não foi possível enviar o código.",
    );
  };

  const handleResend = async () => {
    if (!canResend || !recoveryEmail) return;
    setLoading(true);
    const result = await apiFetch<{ sent: true }>(
      v1ApiPaths.auth.passwordRecovery,
      {
        method: "POST",
        body: JSON.stringify({ identifier: recoveryEmail }),
      },
    );
    setLoading(false);
    if (result.success || result.error?.httpStatus === 503) {
      sendRecoveryEmail(recoveryEmail);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeValidationError = AuthServiceMock.validateRecoveryCodeForm({
      code,
    });
    if (codeValidationError) {
      setCodeError(codeValidationError);
      return;
    }

    setCodeError(undefined);
    setLoading(true);

    const result = await apiFetch<{ token: string }>(
      v1ApiPaths.auth.passwordRecoveryVerify,
      {
        method: "POST",
        body: JSON.stringify({ code }),
      },
    );

    setLoading(false);

    if (result.success && result.data?.token) {
      AuthServiceMock.setRecoveryVerified(recoveryEmail);
      AuthServiceMock.setRecoveryToken(result.data.token);
      router.push(AuthServiceMock.getRecoveryResetPath());
      return;
    }

    if (result.error?.httpStatus === 503) {
      if (AuthServiceMock.isValidRecoveryCode(code)) {
        AuthServiceMock.setRecoveryVerified(recoveryEmail);
        router.push(AuthServiceMock.getRecoveryResetPath());
      } else {
        setCodeError("Código inválido ou expirado.");
      }
      return;
    }

    setCodeError(result.error?.message ?? "Código inválido ou expirado.");
  };

  if (step === "code") {
    return (
      <div className="w-full">
        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-[#0d1f3c]">
            Verifique seu e-mail
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
            Digite o código de 6 dígitos enviado para{" "}
            <span className="font-semibold text-[#0d1f3c]">{maskedTarget}</span>
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleCodeSubmit} noValidate>
            <div>
              <span className={labelClassName}>Código de verificação</span>
              <div className="mt-3">
                <OtpInput
                  value={code}
                  onChange={(value) => {
                    setCode(value);
                    if (codeError) setCodeError(undefined);
                  }}
                  disabled={loading}
                />
              </div>
              {codeError ? <FieldError message={codeError} /> : null}
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Verificando…" : "Confirmar código"}
            </button>

            <div className="text-center">
              <button
                type="button"
                disabled={!canResend || loading}
                onClick={handleResend}
                className="text-[13px] font-semibold text-[#c41e3a] transition hover:underline disabled:cursor-not-allowed disabled:text-neutral-400 disabled:no-underline"
              >
                {canResend
                  ? "Reenviar e-mail de redefinição"
                  : `Reenviar em ${AuthServiceMock.formatRecoveryCooldown(secondsLeft)}`}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-[14px] text-neutral-600">
            Lembrou a senha?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#c41e3a] transition hover:underline"
            >
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#0d1f3c]">
          Recuperar senha
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
          Informe o e-mail ou usuário da sua conta para receber o código de
          redefinição
        </p>

        <form
          className="mt-8 space-y-5"
          onSubmit={handleIdentifierSubmit}
          noValidate
        >
          <div>
            <span className={labelClassName}>E-mail ou usuário</span>
            <input
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (identifierError) setIdentifierError(undefined);
              }}
              placeholder="seu@email.com ou nome.sobrenome"
              className={inputClassName}
            />
            {identifierError ? (
              <FieldError message={identifierError} />
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
          >
            {loading ? "Enviando…" : "Enviar código"}
          </button>
        </form>

        <p className="mt-8 text-center text-[14px] text-neutral-600">
          Lembrou a senha?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#c41e3a] transition hover:underline"
          >
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
}
