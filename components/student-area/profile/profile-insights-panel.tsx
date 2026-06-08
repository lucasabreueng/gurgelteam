"use client";

import { HiCheckCircle, HiOutlineClock } from "react-icons/hi2";

import { usePilotHome } from "@/lib/query/hooks/use-pilot-home";
import type { StudentUserProfile } from "@/lib/contracts/student/profile";
import {
  getProfileCompletionItems,
  getProfileCompletionPercent,
} from "@/lib/student/profile-completion";

import {
  PROFILE_COLUMN_WIDTH_CLASS,
  PROFILE_PANEL_CLASS,
  PROFILE_PANEL_SCROLL_CLASS,
} from "./profile-layout-classes";

type Props = {
  profile: StudentUserProfile;
  isManagingLinked?: boolean;
};

export function ProfileInsightsPanel({
  profile,
  isManagingLinked = false,
}: Props) {
  const { data: home, isLoading: homeLoading } = usePilotHome({
    enabled: !isManagingLinked,
  });
  const completionItems = getProfileCompletionItems(profile);
  const completionPercent = getProfileCompletionPercent(completionItems);
  const recentSessions = home?.results.slice(0, 4) ?? [];

  return (
    <aside className={`w-full shrink-0 ${PROFILE_COLUMN_WIDTH_CLASS} min-h-0`}>
      <div className={PROFILE_PANEL_CLASS}>
        <div className={`${PROFILE_PANEL_SCROLL_CLASS} space-y-4 p-5`}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              Perfil do piloto
            </p>

            <div className="mt-4 flex items-center gap-4">
              <div
                className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#c41e3a ${completionPercent * 3.6}deg, #eef1f4 0deg)`,
                }}
                role="img"
                aria-label={`${completionPercent}% das informações concluídas`}
              >
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-[14px] font-bold text-[#0d1f3c]">
                  {completionPercent}%
                </div>
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#0d1f3c]">
                  Informações concluídas
                </p>
                <p className="mt-0.5 text-[12px] text-neutral-600">
                  {completionItems.filter((item) => item.done).length} de{" "}
                  {completionItems.length} itens
                </p>
              </div>
            </div>

            <ul className="mt-5 space-y-2.5">
              {completionItems.map((item) => (
                <li key={item.id} className="flex items-center gap-2.5">
                  <HiCheckCircle
                    className={`h-5 w-5 shrink-0 ${
                      item.done ? "text-emerald-500" : "text-neutral-300"
                    }`}
                    aria-hidden
                  />
                  <span
                    className={`text-[13px] ${
                      item.done
                        ? "font-medium text-[#0d1f3c]"
                        : "text-neutral-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {!isManagingLinked ? (
            <div className="border-t border-[rgba(17,17,17,0.06)] pt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Últimas sessões
              </p>

              {homeLoading ? (
                <p className="mt-4 text-[13px] text-neutral-500">Carregando…</p>
              ) : recentSessions.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {recentSessions.map((session) => (
                    <li
                      key={session.id}
                      className="rounded-xl border border-[rgba(17,17,17,0.06)] bg-[#fafbfc] px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-[#0d1f3c]">
                            {session.dateLabel}
                          </p>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-neutral-500">
                            <HiOutlineClock className="h-3.5 w-3.5" aria-hidden />
                            {session.totalTrackTime}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-[13px] font-bold tabular-nums text-accent">
                          {session.bestLap}s
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-[13px] leading-relaxed text-neutral-500">
                  Nenhuma sessão registrada ainda. Após sua próxima aula concluída,
                  ela aparecerá aqui.
                </p>
              )}
            </div>
          ) : (
            <p className="border-t border-[rgba(17,17,17,0.06)] pt-4 text-[13px] leading-relaxed text-neutral-500">
              Sessões e histórico na pista são exibidos no perfil principal do
              responsável.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
