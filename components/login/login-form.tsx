"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { SettingsCheckbox } from "@/components/admin/settings/settings-checkbox";
import { FieldError } from "@/components/cadastro/field-error";
import { apiFetch } from "@/lib/api/http-client";
import { resolvePostLoginPath } from "@/lib/auth/resolve-post-login-path";
import type { LoginResponse } from "@/lib/contracts/api/v1/auth.api.schemas";
import { queryKeys } from "@/lib/query/keys";
import { AuthRepositoryHttp } from "@/repositories/auth/AuthRepositoryHttp";
import { AuthServiceMock } from "@/services/auth/authServiceMock";

export function LoginForm() {
  const loginConfig = AuthServiceMock.getLoginConfig();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [identifierError, setIdentifierError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loginErrors = AuthServiceMock.validateLoginForm({
      identifier,
      password,
      remember,
    });

    setIdentifierError(loginErrors.identifier);
    setPasswordError(loginErrors.password);
    setFormError(undefined);

    if (loginErrors.identifier || loginErrors.password) {
      return;
    }

    setLoading(true);

    const result = await apiFetch<LoginResponse>("/api/v1/auth/login", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ identifier, password, remember }),
    });

    setLoading(false);

    if (result.success && result.data) {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
      await queryClient.prefetchQuery({
        queryKey: queryKeys.auth.session(),
        queryFn: () => AuthRepositoryHttp.getSession(),
      });

      const nextPath = searchParams.get("next");
      const session = queryClient.getQueryData<Awaited<
        ReturnType<typeof AuthRepositoryHttp.getSession>
      >>(queryKeys.auth.session());
      const destination = resolvePostLoginPath(
        result.data.user,
        nextPath,
        session?.modulePermissions,
      );
      router.push(destination);
      return;
    }

    setFormError(
      result.error?.message ??
        result.message ??
        "E-mail/usuário ou senha incorretos.",
    );
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
                if (formError) setFormError(undefined);
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
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(undefined);
                  if (formError) setFormError(undefined);
                }}
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
            {passwordError ? <FieldError message={passwordError} /> : null}
          </label>

          {formError ? <FieldError message={formError} /> : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <SettingsCheckbox
                checked={remember}
                onChange={setRemember}
                aria-label="Lembrar de mim"
              />
              <button
                type="button"
                onClick={() => setRemember((v) => !v)}
                className="text-[13px] font-medium text-neutral-700"
              >
                Lembrar de mim
              </button>
            </div>
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
