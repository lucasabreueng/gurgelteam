"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { FieldError } from "@/components/cadastro/field-error";
import { PasswordRulesTooltip } from "@/components/cadastro/password-rules-tooltip";
import { AuthServiceMock } from "@/services/auth/authServiceMock";
import { PasswordChangedDialog } from "./password-changed-dialog";

const inputClassName =
  "mt-2 w-full rounded-xl border border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-3.5 text-[15px] text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15";

const labelClassName =
  "text-[11px] font-bold uppercase tracking-wider text-neutral-600";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const passwordValid = AuthServiceMock.isPasswordValid(password);
  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const passwordErrors = useMemo(() => {
    if (!password) return submitted || touched.password ? ["Informe a nova senha."] : [];
    if (!passwordValid) return AuthServiceMock.getFailedPasswordRuleLabels(password);
    return [];
  }, [password, passwordValid, submitted, touched.password]);

  const confirmError = useMemo(() => {
    if (!submitted && !touched.confirmPassword) return undefined;
    if (!confirmPassword) return "Confirme a nova senha.";
    if (!passwordsMatch) return "As senhas não coincidem.";
    return undefined;
  }, [confirmPassword, passwordsMatch, submitted, touched.confirmPassword]);

  const showPasswordErrors =
    (submitted || touched.password) && passwordErrors.length > 0;

  const handlePasswordChange = (value: string) => {
    setPassword(value.replace(/\s/g, ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!passwordValid || !passwordsMatch) return;

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      AuthServiceMock.clearRecoveryVerified();
      setShowSuccess(true);
    }, 500);
  };

  const handleSuccessContinue = () => {
    setShowSuccess(false);
    router.push("/login");
  };

  return (
    <>
      <div className="w-full">
        <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-[#0d1f3c]">
            Redefinir senha
          </h2>
          <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
            Crie uma nova senha para acessar sua conta
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={labelClassName}>Nova senha</span>
                <PasswordRulesTooltip />
              </div>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, password: true }))
                  }
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
              {showPasswordErrors ? (
                <FieldError messages={passwordErrors} />
              ) : null}
            </div>

            <div>
              <span className={labelClassName}>Confirmar nova senha</span>
              <div className="relative mt-2">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value.replace(/\s/g, ""))
                  }
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, confirmPassword: true }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  placeholder="Repita a nova senha"
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
              {confirmError ? <FieldError message={confirmError} /> : null}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
            >
              {loading ? "Salvando…" : "Redefinir senha"}
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

      <PasswordChangedDialog
        open={showSuccess}
        onContinue={handleSuccessContinue}
      />
    </>
  );
}
