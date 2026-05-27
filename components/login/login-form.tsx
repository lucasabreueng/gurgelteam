"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { FieldError } from "@/components/cadastro/field-error";
import { AuthServiceMock } from "@/services/auth/authServiceMock";
import { SocialLoginButton } from "./social-login-button";

export function LoginForm() {
  const loginConfig = AuthServiceMock.getLoginConfig();
  const router = useRouter();
  const [identifier, setIdentifier] = useState<string>(
    loginConfig.defaultIdentifier,
  );
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [identifierError, setIdentifierError] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loginErrors = AuthServiceMock.validateLoginForm({
      identifier,
      password,
      remember,
    });
    if (loginErrors.identifier || loginErrors.password) {
      setIdentifierError(loginErrors.identifier);
      return;
    }

    setIdentifierError(undefined);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      router.push("/piloto");
    }, 600);
  };

  const handleSocial = (provider: string) => {
    console.info(`[mock] Login social: ${provider}`);
    router.push("/piloto");
  };

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_8px_32px_rgba(13,31,60,0.06)] sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-[#0d1f3c]">
          Acesse sua conta
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
          Use seu e-mail ou usuário para entrar na área do aluno
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              E-mail ou usuário
            </span>
            <input
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (identifierError) setIdentifierError(undefined);
              }}
              placeholder="seu@email.com ou nome.sobrenome"
              className="mt-2 w-full rounded-xl border border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-3.5 text-[15px] text-[#111] outline-none transition placeholder:text-neutral-400 focus:border-accent focus:bg-white focus:ring-2 focus:ring-accent/15"
            />
            {identifierError ? <FieldError message={identifierError} /> : null}
          </div>

          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
              Senha
            </span>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-accent focus:ring-accent/30"
              />
              <span className="text-[13px] font-medium text-neutral-700">
                Lembrar de mim
              </span>
            </label>
            <Link
              href={loginConfig.recoveryHref}
              className="text-[13px] font-semibold text-[#c41e3a] transition hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent px-4 py-3.5 text-[14px] font-bold uppercase tracking-wider text-white shadow-[0_8px_24px_rgba(13,31,60,0.22)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-80"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-[rgba(17,17,17,0.08)]" />
          </div>
          <p className="relative mx-auto w-fit bg-white px-4 text-[12px] font-semibold uppercase tracking-wider text-neutral-500">
            ou continue com
          </p>
        </div>

        <div className="space-y-3">
          <SocialLoginButton
            provider="google"
            onClick={() => handleSocial("google")}
          />
        </div>

        <p className="mt-8 text-center text-[14px] text-neutral-600">
          {loginConfig.signupPrompt}{" "}
          <Link
            href={loginConfig.signupHref}
            className="font-semibold text-[#c41e3a] transition hover:underline"
          >
            {loginConfig.signupCta}
          </Link>
        </p>
      </div>
    </div>
  );
}
