"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldError } from "@/components/cadastro/field-error";
import { OtpInput } from "@/components/password-recovery/otp-input";
import { useResendCooldown } from "@/components/password-recovery/use-resend-cooldown";
import { apiFetch } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { LoginResponse } from "@/lib/contracts/api/v1/auth.api.schemas";
import { maskEmailForDisplay } from "@/lib/auth-accounts-mocks";

type Props = {
  email: string;
};

export function CadastroEmailConfirmForm({ email }: Props) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState<string | undefined>();
  const { secondsLeft, canResend, startCooldown } = useResendCooldown();

  const maskedEmail = maskEmailForDisplay(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setCodeError("Informe o código de 6 dígitos.");
      return;
    }

    setCodeError(undefined);
    setLoading(true);

    const result = await apiFetch<LoginResponse>(v1ApiPaths.auth.registerVerify, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email, code }),
    });

    setLoading(false);

    if (result.success && result.data) {
      const path = result.data.user.clientId ? "/piloto" : "/admin";
      router.push(path);
      return;
    }

    setCodeError(
      result.error?.message ?? "Código inválido ou expirado. Tente novamente.",
    );
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCodeError(undefined);
    const result = await apiFetch<{ verificationSent: true }>(
      v1ApiPaths.auth.registerResend,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
    );
    if (result.success) {
      startCooldown();
      return;
    }
    setCodeError(
      result.error?.message ?? "Não foi possível reenviar o código.",
    );
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#0d1f3c]">
          Confirme seu e-mail
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
          Digite o código de 6 dígitos enviado para{" "}
          <span className="font-semibold text-[#0d1f3c]">{maskedEmail}</span>.
          Verifique também a caixa de spam.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              Código de verificação
            </span>
            <div className="mt-3">
              <OtpInput value={code} onChange={setCode} disabled={loading} />
            </div>
            {codeError ? <FieldError message={codeError} /> : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
          >
            {loading ? "Verificando…" : "Confirmar e entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-neutral-600">
          Não recebeu?{" "}
          <button
            type="button"
            disabled={!canResend}
            onClick={() => void handleResend()}
            className="font-semibold text-[#c41e3a] transition hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {canResend
              ? "Reenviar código"
              : `Reenviar em ${secondsLeft}s`}
          </button>
        </p>

        <p className="mt-6 text-center text-[14px] text-neutral-600">
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
