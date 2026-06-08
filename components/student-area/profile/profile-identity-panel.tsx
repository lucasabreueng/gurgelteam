"use client";

import { HiBolt, HiFire } from "react-icons/hi2";

import { usePilotAchievements } from "@/lib/query/hooks/use-pilot-achievements";
import { usePilotHome } from "@/lib/query/hooks/use-pilot-home";
import type { LinkedPilotCard, StudentUserProfile } from "@/lib/contracts/student/profile";
import { ACHIEVEMENT_CATEGORY_META } from "@/lib/student-area-mocks";
import { StudentProfileServiceMock } from "@/services/student/studentProfileServiceMock";

import {
  PROFILE_COLUMN_WIDTH_CLASS,
  PROFILE_PANEL_CLASS,
  PROFILE_PANEL_SCROLL_CLASS,
} from "./profile-layout-classes";
import { ProfileAvatarPicker } from "./profile-avatar-picker";

type Props = {
  profile: StudentUserProfile;
  profileClientId: string;
  onAvatarChange: (url: string) => void;
  onOpenProfileSwitcher?: () => void;
  showProfileSwitcher?: boolean;
  isManagingLinked?: boolean;
  linkedPilot?: LinkedPilotCard | null;
};

const statBadgeClass =
  "inline-flex rounded-full bg-[#0d1f3c]/[0.07] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] ring-1 ring-[#0d1f3c]/10";

function parseTotalSessions(
  value: string | undefined,
  fallbackCount: number,
): number {
  const match = value?.match(/\d+/);
  if (match) return Number.parseInt(match[0], 10);
  return fallbackCount;
}

function estimateClassStreak(totalSessions: number): number {
  if (totalSessions <= 0) return 0;
  return Math.min(8, Math.max(1, totalSessions % 9));
}

export function ProfileIdentityPanel({
  profile,
  profileClientId,
  onAvatarChange,
  onOpenProfileSwitcher,
  showProfileSwitcher = false,
  isManagingLinked = false,
  linkedPilot = null,
}: Props) {
  const showPilotStats = StudentProfileServiceMock.shouldShowPilotData(profile);
  const useOwnHomeData = !isManagingLinked;
  const { data: home, isLoading: homeLoading } = usePilotHome({
    enabled: useOwnHomeData,
  });
  const { data: achievements = [], isLoading: achievementsLoading } =
    usePilotAchievements({ enabled: useOwnHomeData });

  const categoryLabel = isManagingLinked && linkedPilot
    ? linkedPilot.category
    : showPilotStats
      ? StudentProfileServiceMock.getDisplayPilotCategory(profile)
      : "—";

  const levelLabel = isManagingLinked && linkedPilot
    ? linkedPilot.level
    : showPilotStats
      ? StudentProfileServiceMock.getLevelLabel(profile.experienceLevel)
      : "—";

  const bestTime = isManagingLinked && linkedPilot
    ? linkedPilot.bestTime
    : home?.kpiMetrics.find((kpi) => kpi.id === "best")?.value ?? "—";

  const classStreak = estimateClassStreak(
    parseTotalSessions(
      home?.kpiMetrics.find((kpi) => kpi.id === "evolution")?.value,
      home?.results.length ?? 0,
    ),
  );

  const recentAchievements = achievements
    .filter((item) => item.unlocked)
    .slice(-3)
    .reverse();

  const statsLoading = useOwnHomeData && homeLoading;

  return (
    <aside className={`w-full shrink-0 ${PROFILE_COLUMN_WIDTH_CLASS} min-h-0`}>
      <div className={PROFILE_PANEL_CLASS}>
        <div className={`${PROFILE_PANEL_SCROLL_CLASS} p-5`}>
          <div className="flex flex-col items-center text-center">
            <ProfileAvatarPicker
              avatarUrl={profile.avatarUrl}
              name={StudentProfileServiceMock.formatProfileName(profile)}
              onChange={onAvatarChange}
              clientId={profileClientId}
              size={96}
            />
            <h2 className="mt-4 text-lg font-bold text-[#0d1f3c]">
              {StudentProfileServiceMock.formatProfileName(profile)}
            </h2>
            <p className="mt-1 text-[13px] text-neutral-600">
              {profile.email || "—"}
            </p>
          </div>

          {showProfileSwitcher && onOpenProfileSwitcher ? (
            <button
              type="button"
              onClick={onOpenProfileSwitcher}
              className="mt-5 w-full rounded-xl border border-[rgba(17,17,17,0.1)] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0d1f3c] transition hover:border-accent/30 hover:text-accent"
            >
              Mudar perfil
            </button>
          ) : null}

          {showPilotStats ? (
            <>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Categoria
                  </p>
                  <span className={`mt-2 ${statBadgeClass}`}>{categoryLabel}</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Nível
                  </p>
                  <span className={`mt-2 ${statBadgeClass}`}>{levelLabel}</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-[#fafbfc] px-3 py-3">
                  <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    <HiBolt className="h-3.5 w-3.5 text-accent" aria-hidden />
                    Melhor tempo
                  </div>
                  <p className="mt-1 text-center font-mono text-[15px] font-bold tabular-nums text-[#0d1f3c]">
                    {statsLoading ? "…" : bestTime}
                  </p>
                </div>

                {!isManagingLinked ? (
                  <div className="rounded-xl bg-[#fafbfc] px-3 py-3">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      <HiFire className="h-3.5 w-3.5 text-orange-500" aria-hidden />
                      Sequência
                    </div>
                    <p className="mt-1 text-center text-[15px] font-bold text-[#0d1f3c]">
                      {statsLoading ? "…" : `${classStreak} aulas`}
                    </p>
                  </div>
                ) : linkedPilot ? (
                  <div className="rounded-xl bg-[#fafbfc] px-3 py-3">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                      Próxima aula
                    </div>
                    <p className="mt-1 text-center text-[13px] font-semibold text-[#0d1f3c]">
                      {linkedPilot.nextTraining}
                    </p>
                  </div>
                ) : null}
              </div>

              {!isManagingLinked ? (
                <div className="mt-5 border-t border-[rgba(17,17,17,0.06)] pt-4">
                  <p className="text-center text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                    Conquistas recentes
                  </p>
                  {achievementsLoading ? (
                    <p className="mt-3 text-center text-[13px] text-neutral-500">
                      Carregando…
                    </p>
                  ) : recentAchievements.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {recentAchievements.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start gap-2 rounded-xl bg-[#fafbfc] px-3 py-2.5"
                        >
                          <span className="text-base" aria-hidden>
                            {ACHIEVEMENT_CATEGORY_META[item.category].emoji}
                          </span>
                          <div className="min-w-0 text-left">
                            <p className="text-[13px] font-semibold text-[#0d1f3c]">
                              {item.label}
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-neutral-600">
                              {item.description}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-center text-[13px] text-neutral-500">
                      Nenhuma conquista desbloqueada ainda.
                    </p>
                  )}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
