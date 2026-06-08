"use client";

import { resolveClientAvatarUrl } from "@/lib/client-avatar";
import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";
import type { StudentUserProfile, GuardianInfo, LinkedPilotCard } from "@/lib/contracts/student/profile";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { HiArrowTopRightOnSquare, HiComputerDesktop, HiLockClosed, HiMoon, HiSun } from "react-icons/hi2";
import { SettingsToggle } from "@/components/admin/settings/settings-toggle";
import { useTheme } from "@/components/theme-provider";

import {
  finalizeWeightKg,
  formatHeightCmInput,
  formatWeightKgInput,
  getHeightCmError,
  getWeightKgError,
} from "@/lib/profile-field-formatters";
import type { ProfileLegalDocuments } from "@/lib/student-profile-mocks";
import type { ProfileTermKey } from "@/lib/profile-terms-content";
import { PROFILE_TERM_DOCUMENTS } from "@/lib/profile-terms-content";
import {
  ProfileField,
  ProfileSection,
  profileInputClass,
  profileReadonlyClass,
} from "./profile-section";
import { FieldError } from "@/components/cadastro/field-error";
import { ProfileTermModal } from "./profile-term-modal";
import { ProfileChangePasswordModal } from "./profile-change-password-modal";
import {
  getSessionDeviceIcon,
  resolveSessionBrowser,
  resolveSessionDeviceKind,
  resolveSessionDeviceLabel,
} from "@/lib/student/session-display";

type ProfileUpdater = (patch: Partial<StudentUserProfile>) => void;

type SectionHeaderProps = {
  headerActions?: ReactNode;
};

const PROFILE_READONLY_SECTIONS = new Set([
  "profile-linked",
  "profile-guardian",
]);

const PROFILE_SAVEABLE_SECTIONS = new Set([
  "profile-personal",
  "profile-preferences",
  "profile-emergency",
  "profile-pilot",
]);

export function isProfileSectionReadonly(sectionId: string): boolean {
  return PROFILE_READONLY_SECTIONS.has(sectionId);
}

export function isProfileSectionSaveable(sectionId: string): boolean {
  return PROFILE_SAVEABLE_SECTIONS.has(sectionId);
}

export function ProfilePersonalSection({
  profile,
  onChange,
  headerActions,
}: {
  profile: StudentUserProfile;
  onChange: ProfileUpdater;
} & SectionHeaderProps) {
  const [weightError, setWeightError] = useState<string | undefined>();
  const [heightError, setHeightError] = useState<string | undefined>();
  const stateValue = profile.state?.trim() || "DF";
  const stateOptions = StudentProfileServiceMock.getBrazilStates();

  return (
    <ProfileSection
      id="profile-personal"
      title="Informações pessoais"
      description="Dados usados para contato, identificação e comunicações da Gurgel Team."
      headerActions={headerActions}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <ProfileField label="Nome">
          <p className={profileReadonlyClass}>{profile.firstName}</p>
        </ProfileField>
        <ProfileField label="Sobrenome">
          <p className={profileReadonlyClass}>{profile.lastName}</p>
        </ProfileField>
        <ProfileField label="E-mail">
          <p className={profileReadonlyClass}>{profile.email}</p>
        </ProfileField>
        <ProfileField label="Telefone">
          <input
            type="tel"
            className={profileInputClass}
            value={profile.phone}
            onChange={(e) => onChange({ phone: StudentProfileServiceMock.formatPhoneBr(e.target.value) })}
            placeholder="(61) 99999-9999"
          />
        </ProfileField>
        <ProfileField label="Data de nascimento">
          <p className={profileReadonlyClass}>
            {profile.birthDate
              ? StudentProfileServiceMock.formatBirthDateBrazil(profile.birthDate)
              : "—"}
          </p>
        </ProfileField>
        <ProfileField label="CPF">
          <p className={profileReadonlyClass}>
            {profile.cpf
              ? StudentProfileServiceMock.formatCpf(profile.cpf)
              : "—"}
          </p>
        </ProfileField>
        <ProfileField label="Peso (kg)">
          <input
            type="text"
            inputMode="numeric"
            className={profileInputClass}
            value={profile.weightKg}
            onChange={(e) => {
              onChange({ weightKg: formatWeightKgInput(e.target.value) });
              if (weightError) setWeightError(undefined);
            }}
            onBlur={() => {
              const finalized = finalizeWeightKg(profile.weightKg);
              if (finalized !== profile.weightKg) {
                onChange({ weightKg: finalized });
              }
              setWeightError(getWeightKgError(finalized || profile.weightKg));
            }}
            placeholder="Ex.: 72,50"
          />
          {weightError ? <FieldError message={weightError} /> : null}
        </ProfileField>
        <ProfileField label="Altura (cm)">
          <input
            type="text"
            inputMode="numeric"
            className={profileInputClass}
            value={profile.heightCm}
            onChange={(e) => {
              onChange({ heightCm: formatHeightCmInput(e.target.value) });
              if (heightError) setHeightError(undefined);
            }}
            onBlur={() =>
              setHeightError(getHeightCmError(profile.heightCm))
            }
            placeholder="Ex.: 175"
          />
          {heightError ? <FieldError message={heightError} /> : null}
        </ProfileField>
        <div className="grid gap-5 sm:col-span-2 sm:grid-cols-2">
          <ProfileField label="Cidade">
            <input
              className={profileInputClass}
              value={profile.city}
              onChange={(e) => onChange({ city: e.target.value })}
            />
          </ProfileField>
          <ProfileField label="Estado">
            <select
              aria-label="Estado"
              className={profileInputClass}
              value={stateValue}
              onChange={(e) => onChange({ state: e.target.value })}
            >
              {stateOptions.map((uf) => (
                <option key={uf.value} value={uf.value}>
                  {uf.label}
                </option>
              ))}
            </select>
          </ProfileField>
        </div>
      </div>
    </ProfileSection>
  );
}

export function ProfilePilotSection({
  profile,
  onChange,
  headerActions,
}: {
  profile: StudentUserProfile;
  onChange: ProfileUpdater;
} & SectionHeaderProps) {
  if (!StudentProfileServiceMock.shouldShowPilotData(profile)) return null;

  const autoCategory = StudentProfileServiceMock.getAutoPilotCategory(profile.birthDate);
  const categoryDisplay =
    autoCategory?.label ?? StudentProfileServiceMock.getCategoryLabel(profile.mainCategory) ?? "—";

  return (
    <ProfileSection
      id="profile-pilot"
      title="Dados do piloto"
      description="Informações esportivas vinculadas às suas aulas e categorias na pista."
      headerActions={headerActions}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <ProfileField
          label="Categoria"
          hint="Definida automaticamente conforme a idade"
        >
          <p className={profileReadonlyClass}>{categoryDisplay}</p>
        </ProfileField>
        <ProfileField
          label="Nível de experiência"
          hint="Definido pelo sistema ou pelo gestor da aplicação"
        >
          <p className={profileReadonlyClass}>
            {StudentProfileServiceMock.getLevelLabel(profile.experienceLevel) || "—"}
          </p>
        </ProfileField>
        <ProfileField label="Número favorito">
          <input
            className={profileInputClass}
            value={profile.favoriteNumber}
            onChange={(e) => onChange({ favoriteNumber: e.target.value })}
            placeholder="Ex.: 07"
          />
        </ProfileField>
      </div>
    </ProfileSection>
  );
}

export function ProfileGuardianReadonlySection({
  guardian,
}: {
  guardian: GuardianInfo;
}) {
  return (
    <ProfileSection
      id="profile-guardian"
      title="Responsável"
      description="Dados do responsável legal cadastrado para este piloto."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <ProfileField label="Nome do responsável">
          <p className="rounded-xl border border-transparent bg-[#fafbfc] px-4 py-3 text-[14px] font-medium text-[#111]">
            {guardian.fullName}
          </p>
        </ProfileField>
        <ProfileField label="Telefone">
          <p className="rounded-xl border border-transparent bg-[#fafbfc] px-4 py-3 text-[14px] font-medium text-[#111]">
            {guardian.phone}
          </p>
        </ProfileField>
        <ProfileField label="E-mail">
          <p className="rounded-xl border border-transparent bg-[#fafbfc] px-4 py-3 text-[14px] font-medium text-[#111]">
            {guardian.email}
          </p>
        </ProfileField>
        <ProfileField label="Grau de parentesco">
          <p className="rounded-xl border border-transparent bg-[#fafbfc] px-4 py-3 text-[14px] font-medium text-[#111]">
            {guardian.relationship}
          </p>
        </ProfileField>
      </div>
    </ProfileSection>
  );
}

export function ProfileLinkedPilotsSection({
  pilots,
  onManage,
}: {
  pilots: LinkedPilotCard[];
  onManage: (profileId: string) => void;
}) {
  return (
    <ProfileSection
      id="profile-linked"
      title="Pilotos vinculados"
      description="Gerencie os perfis de pilotos vinculados à sua conta."
    >
      {pilots.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-[rgba(17,17,17,0.08)]">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-[rgba(17,17,17,0.08)] bg-neutral-100/80 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                <th className="px-4 py-3.5">Piloto</th>
                <th className="px-3 py-3.5">Categoria</th>
                <th className="px-3 py-3.5">Nível</th>
                <th className="px-3 py-3.5">Próxima aula</th>
                <th className="px-3 py-3.5">Melhor tempo</th>
                <th className="px-4 py-3.5 text-right" aria-label="Ações" />
              </tr>
            </thead>
            <tbody>
              {pilots.map((p) => (
                <tr
                  key={p.profileId}
                  className="border-b border-dashed border-neutral-200 transition last:border-0 hover:bg-[#fafbfc]"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                        <Image
                          src={resolveClientAvatarUrl(p.avatarUrl)}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-[#0d1f3c]">
                        {p.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 font-medium text-neutral-700">
                    {p.category}
                  </td>
                  <td className="px-3 py-3.5 font-medium text-neutral-700">
                    {p.level || "—"}
                  </td>
                  <td className="px-3 py-3.5 text-neutral-600">
                    {p.nextTraining}
                  </td>
                  <td className="px-3 py-3.5 font-bold tabular-nums text-accent">
                    {p.bestTime || "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onManage(p.profileId)}
                      className="rounded-lg bg-accent px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
                    >
                      Gerenciar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-[rgba(17,17,17,0.12)] bg-[#fafbfc] px-4 py-8 text-center text-[14px] text-neutral-600">
          Nenhum piloto vinculado ainda. Use o botão &quot;Cadastrar piloto&quot; no
          topo da página para adicionar um perfil.
        </p>
      )}
    </ProfileSection>
  );
}

export function ProfileSecuritySection({
  profile,
  onRevokeSession,
  linkedClientId = null,
  headerActions,
}: {
  profile: StudentUserProfile;
  onRevokeSession?: (sessionId: string) => Promise<void>;
  linkedClientId?: string | null;
} & SectionHeaderProps) {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const handleRevokeSession = async (sessionId: string) => {
    if (!onRevokeSession || revokingSessionId) return;
    setSessionError(null);
    setRevokingSessionId(sessionId);
    try {
      await onRevokeSession(sessionId);
    } catch (error) {
      setSessionError(
        error instanceof Error
          ? error.message
          : "Não foi possível encerrar a sessão.",
      );
    } finally {
      setRevokingSessionId(null);
    }
  };

  return (
    <>
      <ProfileSection
        id="profile-security"
        title="Segurança da conta"
        description="Proteja seu acesso e acompanhe onde sua conta está conectada."
        headerActions={headerActions}
      >
        <ul className="divide-y divide-[rgba(17,17,17,0.06)]">
          <li className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0">
            <div className="flex gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(13,31,60,0.06)] text-accent">
                <HiLockClosed className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-[14px] font-semibold text-[#0d1f3c]">
                  Alterar senha
                </p>
                <p className="text-[13px] text-neutral-500">
                  {linkedClientId
                    ? "Defina a senha de acesso do piloto vinculado"
                    : "Informe a senha atual e defina uma nova senha"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPasswordModalOpen(true)}
              className="rounded-xl border border-[rgba(17,17,17,0.1)] px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30"
            >
              Redefinir
            </button>
          </li>
          {!linkedClientId ? (
            <li className="py-4">
              <p className="text-[14px] font-semibold text-[#0d1f3c]">
                Sessões ativas
              </p>
              {sessionError ? (
                <p className="mt-2 text-[12px] text-[#c41e3a]">{sessionError}</p>
              ) : null}
              <ul className="mt-3 space-y-2">
                {profile.sessions.map((s) => {
                  const deviceKind = resolveSessionDeviceKind(s);
                  const DeviceIcon = getSessionDeviceIcon(deviceKind);
                  const browser = resolveSessionBrowser(s);
                  const deviceLabel = resolveSessionDeviceLabel(s);

                  return (
                    <li
                      key={s.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(17,17,17,0.06)] bg-[#fafbfc] px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent ring-1 ring-[rgba(17,17,17,0.06)]">
                          <DeviceIcon className="h-5 w-5" aria-hidden />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#0d1f3c]">
                            {deviceLabel}
                          </p>
                          <p className="text-[12px] text-neutral-500">
                            {browser} · {s.lastActive}
                          </p>
                        </div>
                      </div>
                      {s.current ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          Atual
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void handleRevokeSession(s.id)}
                          disabled={!onRevokeSession || revokingSessionId === s.id}
                          className="rounded-xl border border-[rgba(196,30,58,0.35)] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c41e3a] transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                        >
                          {revokingSessionId === s.id ? "Encerrando…" : "Encerrar"}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </li>
          ) : null}
        </ul>
      </ProfileSection>

      <ProfileChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        linkedClientId={linkedClientId}
      />
    </>
  );
}

export function ProfilePreferencesSection({
  profile,
  onChange,
  headerActions,
}: {
  profile: StudentUserProfile;
  onChange: ProfileUpdater;
} & SectionHeaderProps) {
  const { preference, setPreference } = useTheme();

  return (
    <ProfileSection
      id="profile-preferences"
      title="Preferências"
      description="Como você prefere ser avisado e visualizar a plataforma."
      headerActions={headerActions}
    >
      <div className="space-y-1 divide-y divide-[rgba(17,17,17,0.06)]">
        <SettingsToggle
          label="Receber notificações por WhatsApp"
          checked={profile.notifyWhatsapp}
          onChange={(notifyWhatsapp) => onChange({ notifyWhatsapp })}
        />
        <SettingsToggle
          label="Receber notificações por e-mail"
          checked={profile.notifyEmail}
          onChange={(notifyEmail) => onChange({ notifyEmail })}
        />
        <div className="flex items-center justify-between gap-4 py-3">
          <span className="text-[14px] font-medium text-[var(--ds-text-secondary)]">
            Tema da interface
          </span>
          <div className="flex rounded-xl border border-[var(--ds-border-field)] bg-[var(--ds-bg-muted)] p-1">
            {(
              [
                { value: "light" as const, label: "Claro", Icon: HiSun },
                { value: "dark" as const, label: "Escuro", Icon: HiMoon },
                { value: "system" as const, label: "Sistema", Icon: HiComputerDesktop },
              ] as const
            ).map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setPreference(value)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition ${
                  preference === value
                    ? "bg-[var(--ds-bg-card)] text-[var(--ds-text-primary)] shadow-sm"
                    : "text-[var(--ds-text-muted)] hover:text-[var(--ds-text-primary)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ProfileSection>
  );
}

export function ProfileEmergencySection({
  profile,
  onChange,
  headerActions,
}: {
  profile: StudentUserProfile;
  onChange: ProfileUpdater;
} & SectionHeaderProps) {
  return (
    <ProfileSection
      id="profile-emergency"
      title="Contato de emergência"
      description="Pessoa a ser acionada em situações urgentes durante treinos e eventos."
      headerActions={headerActions}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <ProfileField label="Nome">
          <input
            className={profileInputClass}
            value={profile.emergencyName}
            onChange={(e) => onChange({ emergencyName: e.target.value })}
          />
        </ProfileField>
        <ProfileField label="Telefone">
          <input
            className={profileInputClass}
            value={profile.emergencyPhone}
            onChange={(e) =>
              onChange({ emergencyPhone: StudentProfileServiceMock.formatPhoneBr(e.target.value) })
            }
          />
        </ProfileField>
        <ProfileField label="Parentesco">
          <input
            className={profileInputClass}
            value={profile.emergencyRelation}
            onChange={(e) => onChange({ emergencyRelation: e.target.value })}
          />
        </ProfileField>
      </div>
    </ProfileSection>
  );
}

export function ProfileTermsSection({
  profile,
  mediaConsentProfile,
  legalDocuments,
  onChange,
  onMediaConsentChange,
  readOnlyMediaConsent = false,
  headerActions,
}: {
  profile: StudentUserProfile;
  mediaConsentProfile?: StudentUserProfile;
  legalDocuments?: ProfileLegalDocuments;
  onChange: ProfileUpdater;
  onMediaConsentChange?: (accepted: boolean) => Promise<void>;
  readOnlyMediaConsent?: boolean;
} & SectionHeaderProps) {
  const [openTerm, setOpenTerm] = useState<ProfileTermKey | null>(null);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const docItems: { key: ProfileTermKey; label: string; date: string }[] = [
    {
      key: "privacy",
      label: legalDocuments?.privacy?.title ?? "Política de privacidade",
      date: profile.privacyAcceptedAt || "—",
    },
    {
      key: "terms",
      label: legalDocuments?.terms?.title ?? "Termos de uso",
      date: profile.termsAcceptedAt || "—",
    },
  ];

  const activeDoc = openTerm
    ? legalDocuments?.[openTerm] ?? PROFILE_TERM_DOCUMENTS[openTerm]
    : null;

  const handleMediaConsent = (accepted: boolean) => {
    setMediaError(null);
    if (onMediaConsentChange) {
      setMediaLoading(true);
      void onMediaConsentChange(accepted)
        .catch((error) => {
          setMediaError(
            error instanceof Error
              ? error.message
              : "Não foi possível atualizar a autorização.",
          );
        })
        .finally(() => setMediaLoading(false));
      return;
    }

    onChange({
      mediaConsentAccepted: accepted,
      mediaAcceptedAt: accepted
        ? StudentProfileServiceMock.formatProfileConsentDateTime()
        : "",
      mediaRevokedAt: accepted
        ? ""
        : StudentProfileServiceMock.formatProfileConsentDateTime(),
    });
  };

  const mediaProfile = mediaConsentProfile ?? profile;

  const mediaStatusText = mediaProfile.mediaConsentAccepted && mediaProfile.mediaAcceptedAt
    ? `Aceito em ${mediaProfile.mediaAcceptedAt}`
    : mediaProfile.mediaRevokedAt
      ? `Revogado em ${mediaProfile.mediaRevokedAt}`
      : readOnlyMediaConsent
        ? "Pendente — o responsável deve aceitar no perfil dele"
        : null;

  return (
    <>
      <ProfileSection
        id="profile-terms"
        title="Termos e privacidade"
        description="Documentos aceitos no cadastro e autorizações vigentes."
        headerActions={headerActions}
      >
        <ul className="space-y-3">
          {docItems.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => setOpenTerm(item.key)}
                className="group flex w-full items-center justify-between gap-4 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] px-4 py-3.5 text-left transition hover:border-accent/25 hover:bg-white"
              >
                <div>
                  <p className="text-[14px] font-semibold text-[#0d1f3c] group-hover:text-accent">
                    {item.label}
                  </p>
                  <p className="text-[12px] text-neutral-500">
                    {item.date && item.date !== "—"
                      ? `Aceito em ${item.date}`
                      : "Data de aceite não registrada"}
                  </p>
                </div>
                <HiArrowTopRightOnSquare
                  className="h-4 w-4 shrink-0 text-neutral-400 transition group-hover:text-accent"
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-6 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setOpenTerm("media")}
                className="text-left text-[14px] font-semibold text-[#0d1f3c] transition hover:text-accent"
              >
                Autorização de uso de imagem
              </button>
              <p className="mt-1 text-[12px] text-neutral-500">
                {mediaStatusText}
              </p>
              {mediaError ? (
                <p className="mt-1 text-[12px] text-[#c41e3a]">{mediaError}</p>
              ) : null}
              {readOnlyMediaConsent ? (
                <p className="mt-1 text-[12px] text-neutral-500">
                  Gerenciado pelo perfil responsável vinculado a esta conta.
                </p>
              ) : null}
            </div>
            {!readOnlyMediaConsent ? (
            <div className="shrink-0">
              {mediaProfile.mediaConsentAccepted ? (
                <button
                  type="button"
                  onClick={() => handleMediaConsent(false)}
                  disabled={mediaLoading}
                  className="rounded-xl border border-[rgba(196,30,58,0.35)] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#c41e3a] transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                >
                  {mediaLoading ? "Salvando…" : "Revogar"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMediaConsent(true)}
                  disabled={mediaLoading}
                  className="rounded-xl bg-accent px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
                >
                  {mediaLoading ? "Salvando…" : "Aceitar"}
                </button>
              )}
            </div>
            ) : null}
          </div>
        </div>
      </ProfileSection>

      <ProfileTermModal
        open={openTerm !== null}
        title={activeDoc?.title ?? ""}
        body={activeDoc?.body ?? ""}
        onClose={() => setOpenTerm(null)}
      />
    </>
  );
}

export function shouldShowGuardianForProfile(profile: StudentUserProfile): boolean {
  return (
    profile.role === "piloto" &&
    StudentProfileServiceMock.isMinorProfile(profile) &&
    Boolean(profile.guardian)
  );
}
