"use client";

import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";
import type { StudentUserProfile, AccountRole, ProfileNavSection } from "@/lib/contracts/student/profile";

import Link from "next/link";
import { HiArrowRightOnRectangle } from "react-icons/hi2";

import { ProfileAvatarPicker } from "./profile-avatar-picker";

type Props = {
  profile: StudentUserProfile;
  navSections: ProfileNavSection[];
  activeSectionId: string;
  onSectionSelect: (sectionId: string) => void;
  onAvatarChange: (url: string) => void;
  onLogout?: () => void;
};

const ROLE_STYLES: Record<AccountRole, string> = {
  piloto: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  responsavel: "bg-sky-50 text-sky-900 ring-sky-200/80",
};

export function ProfileSidebar({
  profile,
  navSections,
  activeSectionId,
  onSectionSelect,
  onAvatarChange,
  onLogout,
}: Props) {
  const showPilotStats = StudentProfileServiceMock.shouldShowPilotData(profile);
  const categoryLabel = showPilotStats
    ? StudentProfileServiceMock.getDisplayPilotCategory(profile)
    : "—";
  const levelLabel = showPilotStats
    ? StudentProfileServiceMock.getLevelLabel(profile.experienceLevel)
    : "—";

  return (
    <aside className="w-full shrink-0 lg:w-[240px]">
      <div className="sticky top-[calc(var(--admin-header-h,76px)+1.5rem)] rounded-2xl border border-[rgba(17,17,17,0.06)] bg-white p-6 shadow-[0_2px_16px_rgba(13,31,60,0.04)]">
        <div className="flex flex-col items-center text-center">
          <ProfileAvatarPicker
            avatarUrl={profile.avatarUrl}
            name={StudentProfileServiceMock.formatProfileName(profile)}
            onChange={onAvatarChange}
            size={96}
          />
          <h2 className="mt-4 text-lg font-bold text-[#0d1f3c]">
            {StudentProfileServiceMock.formatProfileName(profile)}
          </h2>
          <p className="mt-1 text-[13px] text-neutral-600">{profile.email}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ${ROLE_STYLES[profile.role]}`}
            >
              {profile.role === "responsavel" ? "Responsável" : "Piloto"}
            </span>
            {profile.role === "responsavel" && profile.alsoPilot ? (
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ${ROLE_STYLES.piloto}`}
              >
                Piloto
              </span>
            ) : null}
          </div>
          {showPilotStats ? (
            <dl className="mt-4 w-full space-y-2 text-left">
              <div className="rounded-xl bg-[#fafbfc] px-3 py-2.5">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Categoria
                </dt>
                <dd className="mt-0.5 text-[13px] font-semibold text-[#0d1f3c]">
                  {categoryLabel}
                </dd>
              </div>
              <div className="rounded-xl bg-[#fafbfc] px-3 py-2.5">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Nível
                </dt>
                <dd className="mt-0.5 text-[13px] font-semibold text-[#0d1f3c]">
                  {levelLabel}
                </dd>
              </div>
            </dl>
          ) : null}
        </div>

        {navSections.length > 0 ? (
          <nav
            className="mt-6 border-t border-[rgba(17,17,17,0.06)] pt-5"
            aria-label="Seções do perfil"
          >
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Navegação
            </p>
            <ul className="space-y-0.5">
              {navSections.map((section) => {
                const active = section.id === activeSectionId;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => onSectionSelect(section.id)}
                      aria-current={active ? "page" : undefined}
                      className={`w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium transition ${
                        active
                          ? "bg-accent/10 font-semibold text-[#0d1f3c]"
                          : "text-neutral-600 hover:bg-[#fafbfc] hover:text-[#0d1f3c]"
                      }`}
                    >
                      {section.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}

        <Link
          href="/"
          onClick={onLogout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[rgba(17,17,17,0.1)] bg-[#fafbfc] px-4 py-3 text-[13px] font-semibold text-[#0d1f3c] transition hover:border-accent/25 hover:bg-white"
        >
          <HiArrowRightOnRectangle className="h-5 w-5 text-neutral-500" aria-hidden />
          Sair
        </Link>
      </div>
    </aside>
  );
}
