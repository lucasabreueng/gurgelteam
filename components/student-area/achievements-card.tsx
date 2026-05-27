"use client";

import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";
import type { Achievement } from "@/lib/contracts/student-area";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons/lib";
import { FiAward, FiCheckCircle, FiFlag, FiLayers, FiZap } from "react-icons/fi";
import { HiLockClosed } from "react-icons/hi2";


type BadgeStyle = {
  Icon: IconType;
  ring: string;
  iconBg: string;
  label: string;
  rarity: "lendário" | "épico" | "raro" | "comum";
};

const BADGE_BY_ID: Record<string, BadgeStyle> = {
  primeira_aula: {
    Icon: FiLayers,
    ring: "from-amber-400 via-yellow-500 to-amber-600",
    iconBg: "bg-gradient-to-br from-amber-500/90 to-orange-700/95",
    label: "Primeira aula",
    rarity: "comum",
  },
  sub55: {
    Icon: FiZap,
    ring: "from-sky-400 via-blue-600 to-indigo-700",
    iconBg: "bg-gradient-to-br from-sky-500/90 to-indigo-800/95",
    label: "Sub 55s",
    rarity: "raro",
  },
  aulas5: {
    Icon: FiCheckCircle,
    ring: "from-orange-500 via-red-500 to-rose-600",
    iconBg: "bg-gradient-to-br from-orange-500/90 to-red-700/95",
    label: "5 aulas",
    rarity: "épico",
  },
  podio: {
    Icon: FiAward,
    ring: "from-fuchsia-500 via-purple-600 to-violet-800",
    iconBg: "bg-gradient-to-br from-amber-400/90 via-yellow-500/85 to-amber-700/95",
    label: "Pódio",
    rarity: "lendário",
  },
  consistencia: {
    Icon: FiFlag,
    ring: "from-emerald-400 via-teal-500 to-cyan-700",
    iconBg: "bg-gradient-to-br from-emerald-500/90 to-teal-800/95",
    label: "Consistência",
    rarity: "raro",
  },
};

function rarityBadgeClass(rarity: BadgeStyle["rarity"]) {
  switch (rarity) {
    case "lendário":
      return "border-amber-400/80 bg-gradient-to-r from-amber-100/90 to-orange-50 text-amber-950";
    case "épico":
      return "border-fuchsia-300/70 bg-gradient-to-r from-fuchsia-50 to-purple-50 text-purple-950";
    case "raro":
      return "border-sky-300/70 bg-sky-50 text-sky-950";
    default:
      return "border-neutral-200 bg-neutral-100 text-neutral-800";
  }
}

function AchievementBadgeItem({
  ach,
  compact,
}: {
  ach: Achievement;
  compact?: boolean;
}) {
  const style = BADGE_BY_ID[ach.id] ?? {
    Icon: FiAward,
    ring: "from-neutral-400 to-neutral-600",
    iconBg: "bg-neutral-600",
    label: ach.label,
    rarity: "comum" as const,
  };
  const { Icon, ring, iconBg, rarity } = style;
  const locked = !ach.unlocked;

  return (
    <div
      className={`flex flex-col items-center text-center ${compact ? "min-w-0" : "h-full min-h-0 min-w-0"}`}
    >
      <div
        className={`flex w-full items-center justify-center ${compact ? "" : "min-h-0 flex-1"} ${locked ? "opacity-85" : ""}`}
        title={locked ? "Bloqueada — continue treinando!" : style.label}
      >
        <div
          className={`aspect-square w-full max-h-full min-w-0 overflow-hidden rounded-2xl border-[2.5px] shadow-md ${
            compact ? "max-w-[88px]" : ""
          } ${
            locked
              ? "border-neutral-400/70 bg-neutral-400/40"
              : `border-white/30 bg-gradient-to-br ${ring} shadow-[0_8px_28px_rgba(13,31,60,0.18)]`
          }`}
        >
          <div
            className={`relative flex h-full w-full items-center justify-center rounded-[11px] ${
              locked ? "bg-neutral-500/85" : iconBg
            }`}
          >
            <Icon
              className={`h-[48%] w-[48%] min-h-5 min-w-5 sm:min-h-6 sm:min-w-6 ${
                locked ? "text-neutral-200" : "text-white drop-shadow-sm"
              }`}
              strokeWidth={1.6}
              aria-hidden
            />
            {locked ? (
              <span className="absolute inset-0 flex items-center justify-center rounded-[11px] bg-black/30 backdrop-blur-[1px]">
                <HiLockClosed className="h-[32%] w-[32%] min-h-4 min-w-4 text-white drop-shadow" />
              </span>
            ) : (
              <span
                aria-hidden
                className="pointer-events-none absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-[9px] font-black text-white shadow"
              >
                ✓
              </span>
            )}
          </div>
        </div>
      </div>

      <span
        className={`mt-2 inline-flex max-w-full rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase leading-tight tracking-wider sm:text-[9px] ${rarityBadgeClass(rarity)}`}
      >
        {rarity}
      </span>

      <p
        className={`mt-1 line-clamp-2 w-full font-bold leading-snug text-[#111] ${
          compact ? "text-[11px] sm:text-[12px]" : "text-[10px] sm:text-[11px] md:text-[12px]"
        }`}
      >
        {ach.label}
      </p>

      {!locked ? (
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 sm:text-[11px]">
          Desbloqueada
        </p>
      ) : (
        <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500 sm:text-[11px]">
          Em progresso
        </p>
      )}
    </div>
  );
}

type AchievementsCardProps = {
  className?: string;
};

export function AchievementsCard({ className = "" }: AchievementsCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!modalOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [modalOpen]);

  return (
    <>
      <div
        className={`flex h-full min-h-0 flex-col rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-5 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-6 ${className}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[#0d1f3c]">Conquistas</h3>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <span className="rounded-full bg-[rgba(13,31,60,0.06)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
              XP de piloto
            </span>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[rgba(17,17,17,0.12)] bg-white px-4 py-2 text-[12px] font-semibold text-accent shadow-sm transition hover:border-accent/30 hover:bg-neutral-50"
            >
              Ver todas as conquistas
            </button>
          </div>
        </div>

        <ul className="mt-6 grid min-h-0 flex-1 auto-rows-[minmax(0,1fr)] grid-cols-5 gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-4 lg:gap-x-4">
          {StudentAreaServiceMock.getAchievements().map((ach) => (
            <li
              key={ach.id}
              className="flex h-full min-h-0 min-w-0 flex-col items-center text-center"
            >
              <AchievementBadgeItem ach={ach} />
            </li>
          ))}
        </ul>
      </div>

      {modalOpen ? (
        <div
          role="presentation"
          className="fixed inset-0 z-[210] flex items-center justify-center bg-black/55 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="conquistas-modal-title"
            className="flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-5 py-4 md:px-6">
              <div>
                <h2
                  id="conquistas-modal-title"
                  className="text-lg font-bold text-[#0d1f3c]"
                >
                  Todas as conquistas
                </h2>
                <p className="mt-1 text-sm text-neutral-600">
                  {StudentAreaServiceMock.getAchievements().filter((a) => a.unlocked).length} de{" "}
                  {StudentAreaServiceMock.getAchievements().length} desbloqueadas
                </p>
              </div>
              <button
                type="button"
                className="rounded-xl bg-[#0d1f3c] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
                onClick={() => setModalOpen(false)}
              >
                Fechar
              </button>
            </div>

            <ul className="grid grid-cols-2 gap-6 overflow-y-auto px-5 py-6 sm:grid-cols-3 md:gap-8 md:px-6">
              {StudentAreaServiceMock.getAchievements().map((ach) => (
                <li key={ach.id}>
                  <AchievementBadgeItem ach={ach} compact />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
