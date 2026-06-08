"use client";

import { useMemo, useState } from "react";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import { FieldError } from "@/components/cadastro/field-error";
import { PasswordRulesTooltip } from "@/components/cadastro/password-rules-tooltip";
import { AppModal } from "@/components/ui/app-modal";
import { apiFetch } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { AuthServiceMock } from "@/services/auth/authServiceMock";
import { profileInputClass } from "./profile-section";

const labelClassName =
  "text-[11px] font-bold uppercase tracking-wider text-neutral-500";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Piloto vinculado — responsável define senha sem informar a atual. */
  linkedClientId?: string | null;
};

export function ProfileChangePasswordModal({
  open,
  onClose,
  linkedClientId = null,
}: Props) {
  const isLinkedPilot = Boolean(linkedClientId);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const passwordValid = AuthServiceMock.isPasswordValid(password);
  const passwordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordErrors = useMemo(() => {
    if (!password) {
      return submitted ? ["Informe a nova senha."] : [];
    }
    if (!passwordValid) {
      return AuthServiceMock.getFailedPasswordRuleLabels(password);
    }
    return [];
  }, [password, passwordValid, submitted]);

  const confirmError = useMemo(() => {
    if (!submitted) return undefined;
    if (!confirmPassword) return "Confirme a nova senha.";
    if (!passwordsMatch) return "As senhas não coincidem.";
    return undefined;
  }, [confirmPassword, passwordsMatch, submitted]);

  const resetForm = () => {
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setSubmitted(false);
    setFormError(null);
    setSuccess(false);
    setShowCurrent(false);
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormError(null);

    if (!isLinkedPilot && !currentPassword.trim()) {
      setFormError("Informe a senha atual.");
      return;
    }
    if (!passwordValid || !passwordsMatch) return;

    setLoading(true);

    if (getDataSourceMode() !== "http") {
      window.setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 400);
      return;
    }

    const result = isLinkedPilot
      ? await apiFetch<{ ok: true }>(
          v1ApiPaths.pilot.linkedPilotPassword(linkedClientId!),
          {
            method: "POST",
            body: JSON.stringify({
              newPassword: password,
              confirmPassword,
            }),
          },
        )
      : await apiFetch<{ ok: true }>(v1ApiPaths.auth.changePassword, {
          method: "POST",
          body: JSON.stringify({
            currentPassword,
            newPassword: password,
            confirmPassword,
          }),
        });

    setLoading(false);

    if (!result.success) {
      setFormError(result.error?.message ?? "Não foi possível alterar a senha.");
      return;
    }

    setSuccess(true);
  };

  return (
    <AppModal
      open={open}
      onClose={handleClose}
      title={success ? "Senha atualizada" : "Alterar senha"}
      description={
        success
          ? "A senha foi redefinida com sucesso."
          : isLinkedPilot
            ? "Defina a nova senha de acesso do piloto vinculado."
            : "Informe a senha atual e defina uma nova senha de acesso."
      }
      maxWidth="md"
      footer={
        success ? (
          <button
            type="button"
            onClick={handleClose}
            className="w-full rounded-xl bg-accent py-3 text-[12px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
          >
            Fechar
          </button>
        ) : (
          <div className="grid w-full grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="btn-outline-md bg-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="profile-change-password-form"
              disabled={loading}
              className="btn-primary-md disabled:opacity-50"
            >
              {loading ? "Salvando…" : "Salvar senha"}
            </button>
          </div>
        )
      }
    >
      {success ? (
        <p className="text-[14px] leading-relaxed text-neutral-600">
          {isLinkedPilot
            ? "O piloto poderá usar a nova senha no próximo acesso."
            : "Use a nova senha na próxima vez que entrar na plataforma."}
        </p>
      ) : (
        <form
          id="profile-change-password-form"
          className="space-y-4"
          onSubmit={handleSubmit}
          noValidate
        >
          {!isLinkedPilot ? (
            <div>
              <span className={labelClassName}>Senha atual</span>
              <div className="relative mt-2">
                <input
                  type={showCurrent ? "text" : "password"}
                  className={`${profileInputClass} pr-11`}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                  onClick={() => setShowCurrent((v) => !v)}
                  aria-label={showCurrent ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showCurrent ? (
                    <HiEyeSlash className="h-5 w-5" aria-hidden />
                  ) : (
                    <HiEye className="h-5 w-5" aria-hidden />
                  )}
                </button>
              </div>
            </div>
          ) : null}

          <div>
            <div className="flex items-center gap-2">
              <span className={labelClassName}>Nova senha</span>
              <PasswordRulesTooltip />
            </div>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                className={`${profileInputClass} pr-11`}
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
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
            {submitted && passwordErrors.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {passwordErrors.map((msg) => (
                  <li key={msg}>
                    <FieldError message={msg} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div>
            <span className={labelClassName}>Confirmar nova senha</span>
            <div className="relative mt-2">
              <input
                type={showConfirm ? "text" : "password"}
                className={`${profileInputClass} pr-11`}
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value.replace(/\s/g, ""))
                }
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Ocultar senha" : "Mostrar senha"}
              >
                {showConfirm ? (
                  <HiEyeSlash className="h-5 w-5" aria-hidden />
                ) : (
                  <HiEye className="h-5 w-5" aria-hidden />
                )}
              </button>
            </div>
            {confirmError ? <FieldError message={confirmError} /> : null}
          </div>

          {formError ? <FieldError message={formError} /> : null}
        </form>
      )}
    </AppModal>
  );
}
