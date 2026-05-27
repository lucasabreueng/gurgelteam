"use client";

import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";
import type { StudentUserProfile, GuardianInfo, LinkedPilotCard } from "@/lib/contracts/student/profile";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiArrowTopRightOnSquare,
  HiDevicePhoneMobile,
  HiLockClosed,
} from "react-icons/hi2";
import { SettingsDropdown } from "@/components/admin/settings/settings-dropdown";
import { SettingsToggle } from "@/components/admin/settings/settings-toggle";
import { useTheme } from "@/components/theme-provider";

import {
  finalizeWeightKg,
  formatHeightCmInput,
  formatWeightKgInput,
  getHeightCmError,
  getWeightKgError,
} from "@/lib/profile-field-formatters";
import {
  PROFILE_TERM_DOCUMENTS,
  type ProfileTermKey,
} from "@/lib/profile-terms-content";
import {
  ProfileField,
  ProfileSection,
  profileInputClass,
  profileReadonlyClass,
} from "./profile-section";
import { FieldError } from "@/components/cadastro/field-error";
import { ProfileTermModal } from "./profile-term-modal";

type ProfileUpdater = (patch: Partial<StudentUserProfile>) => void;

type SectionHeaderProps = {
  headerActions?: ReactNode;
};

const PROFILE_READONLY_SECTIONS = new Set([
  "profile-linked",
  "profile-guardian",
]);

export function isProfileSectionReadonly(sectionId: string): boolean {
  return PROFILE_READONLY_SECTIONS.has(sectionId);
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
          <p className={`${profileReadonlyClass} capitalize`}>
            {StudentProfileServiceMock.formatBirthDateDisplay(profile.birthDate)}
          </p>
        </ProfileField>
        <ProfileField label="CPF">
          <p className={profileReadonlyClass}>{profile.cpf}</p>
        </ProfileField>
        <ProfileField label="Peso (kg)" hint="Opcional — use vírgula automática (ex.: 72,50)">
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
        <ProfileField label="Altura (cm)" hint="Opcional — 10 a 999 cm">
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
            <SettingsDropdown
              aria-label="Estado"
              options={StudentProfileServiceMock.getBrazilStates()}
              value={profile.state}
              onSelect={(state) => onChange({ state })}
            />
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
      description="Gerencie os perfis dos pilotos associados à sua conta de responsável."
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {pilots.map((p) => (
          <li
            key={p.profileId}
            className="flex flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[#fafbfc] p-5 transition hover:border-accent/20 hover:bg-white hover:shadow-[0_4px_20px_rgba(13,31,60,0.06)]"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
              <Image
                src={p.avatarUrl}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
              <div className="min-w-0">
                <p className="font-bold text-[#0d1f3c]">{p.fullName}</p>
                <p className="text-[12px] font-medium text-neutral-500">
                  {p.category}
                </p>
              </div>
            </div>
            <p className="mt-4 text-[13px] text-neutral-600">
              <span className="font-semibold text-[#0d1f3c]">Próximo treino:</span>{" "}
              {p.nextTraining}
            </p>
            <button
              type="button"
              onClick={() => onManage(p.profileId)}
              className="mt-4 w-full rounded-xl bg-accent py-2.5 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
            >
              Gerenciar perfil
            </button>
          </li>
        ))}
      </ul>
    </ProfileSection>
  );
}

export function ProfileSecuritySection({
  profile,
  onChange,
  headerActions,
}: {
  profile: StudentUserProfile;
  onChange: ProfileUpdater;
} & SectionHeaderProps) {
  return (
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
              <p className="text-[14px] font-semibold text-[#0d1f3c]">Alterar senha</p>
              <p className="text-[13px] text-neutral-500">
                Atualize sua senha periodicamente
              </p>
            </div>
          </div>
          <Link
            href="/recuperar-senha"
            className="rounded-xl border border-[rgba(17,17,17,0.1)] px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30"
          >
            Redefinir
          </Link>
        </li>
        <li className="flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(13,31,60,0.06)] text-accent">
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </span>
            <div>
              <p className="text-[14px] font-semibold text-[#0d1f3c]">Login Google</p>
              <p className="text-[13px] text-neutral-500">
                {profile.googleConnected
                  ? "Conta conectada"
                  : "Não conectado"}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl border border-[rgba(17,17,17,0.1)] px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30"
            onClick={() =>
              onChange({ googleConnected: !profile.googleConnected })
            }
          >
            {profile.googleConnected ? "Desconectar" : "Conectar"}
          </button>
        </li>
        <li className="py-4">
          <p className="text-[14px] font-semibold text-[#0d1f3c]">Sessões ativas</p>
          <ul className="mt-3 space-y-2">
            {profile.sessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[rgba(17,17,17,0.06)] bg-[#fafbfc] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <HiDevicePhoneMobile className="h-5 w-5 text-neutral-400" aria-hidden />
                  <div>
                    <p className="text-[13px] font-semibold text-[#0d1f3c]">{s.device}</p>
                    <p className="text-[12px] text-neutral-500">
                      {s.location} · {s.lastActive}
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
                    className="text-[12px] font-semibold text-[#c41e3a] hover:underline"
                  >
                    Encerrar
                  </button>
                )}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </ProfileSection>
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
  const { theme, setTheme } = useTheme();

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
          <span className="text-[14px] font-medium text-neutral-700">Tema da interface</span>
          <div className="flex rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] p-1">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-lg px-4 py-2 text-[12px] font-semibold transition ${
                theme === "light"
                  ? "bg-white text-[#0d1f3c] shadow-sm"
                  : "text-neutral-500 hover:text-[#0d1f3c]"
              }`}
            >
              Claro
            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-lg px-4 py-2 text-[12px] font-semibold transition ${
                theme === "dark"
                  ? "bg-white text-[#0d1f3c] shadow-sm"
                  : "text-neutral-500 hover:text-[#0d1f3c]"
              }`}
            >
              Escuro
            </button>
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
      <div className="grid gap-5 sm:grid-cols-2">
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
  onChange,
  headerActions,
}: {
  profile: StudentUserProfile;
  onChange: ProfileUpdater;
} & SectionHeaderProps) {
  const [openTerm, setOpenTerm] = useState<ProfileTermKey | null>(null);

  const docItems: { key: ProfileTermKey; label: string; date: string }[] = [
    {
      key: "privacy",
      label: "Política de privacidade",
      date: profile.privacyAcceptedAt,
    },
    {
      key: "terms",
      label: "Termos de uso",
      date: profile.termsAcceptedAt,
    },
  ];

  const activeDoc = openTerm ? PROFILE_TERM_DOCUMENTS[openTerm] : null;

  const handleMediaConsent = (accepted: boolean) => {
    onChange({
      mediaConsentAccepted: accepted,
      mediaAcceptedAt: accepted ? StudentProfileServiceMock.formatProfileAcceptedDate() : "",
    });
  };

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
                    Aceito em {item.date}
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
                {profile.mediaConsentAccepted && profile.mediaAcceptedAt
                  ? `Aceito em ${profile.mediaAcceptedAt}`
                  : "Não obrigatório no cadastro — pode ser aceito aqui"}
              </p>
            </div>
            <div className="shrink-0">
              {profile.mediaConsentAccepted ? (
                <button
                  type="button"
                  onClick={() => handleMediaConsent(false)}
                  className="rounded-xl border border-[rgba(196,30,58,0.35)] bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#c41e3a] transition hover:bg-red-50"
                >
                  Revogar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleMediaConsent(true)}
                  className="rounded-xl bg-accent px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:brightness-110"
                >
                  Aceitar
                </button>
              )}
            </div>
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
