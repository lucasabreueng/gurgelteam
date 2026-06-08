"use client";

import { usePilotAchievements } from "@/lib/query/hooks/use-pilot-achievements";
import type { Achievement, AchievementCategory } from "@/lib/contracts/student-area";
import { ACHIEVEMENT_CATEGORY_META } from "@/lib/student-area-mocks";

import { useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons/lib";
import {
  FiActivity,
  FiAward,
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiFlag,
  FiLayers,
  FiShield,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { HiLockClosed } from "react-icons/hi2";

import { StudentCardActionButton } from "./student-card-action-button";
import { StudentCardEmptyState } from "./student-card-empty-state";
import { useAchievementPreviewGrid } from "./use-achievement-preview-grid";

type BadgeStyle = {
  Icon: IconType;
  ring: string;
  iconBg: string;
  rarity: "lendário" | "épico" | "raro" | "comum";
};

const BADGE_BY_ID: Record<string, BadgeStyle> = {
  primeira_bandeirada: {
    Icon: FiFlag,
    ring: "from-amber-400 via-yellow-500 to-amber-600",
    iconBg: "bg-gradient-to-br from-amber-500/90 to-orange-700/95",
    rarity: "comum",
  },
  piloto_frequente: {
    Icon: FiUsers,
    ring: "from-sky-400 via-blue-500 to-indigo-600",
    iconBg: "bg-gradient-to-br from-sky-500/90 to-indigo-700/95",
    rarity: "comum",
  },
  veterano_pista: {
    Icon: FiLayers,
    ring: "from-orange-500 via-red-500 to-rose-600",
    iconBg: "bg-gradient-to-br from-orange-500/90 to-red-700/95",
    rarity: "raro",
  },
  sempre_presente: {
    Icon: FiCalendar,
    ring: "from-emerald-400 via-teal-500 to-cyan-700",
    iconBg: "bg-gradient-to-br from-emerald-500/90 to-teal-800/95",
    rarity: "épico",
  },
  em_evolucao: {
    Icon: FiTrendingUp,
    ring: "from-violet-400 via-purple-500 to-fuchsia-700",
    iconBg: "bg-gradient-to-br from-violet-500/90 to-fuchsia-800/95",
    rarity: "comum",
  },
  ajuste_fino: {
    Icon: FiActivity,
    ring: "from-sky-400 via-blue-600 to-indigo-700",
    iconBg: "bg-gradient-to-br from-sky-500/90 to-indigo-800/95",
    rarity: "raro",
  },
  aluno_aplicado: {
    Icon: FiBookOpen,
    ring: "from-fuchsia-500 via-purple-600 to-violet-800",
    iconBg: "bg-gradient-to-br from-fuchsia-500/90 to-violet-800/95",
    rarity: "épico",
  },
  telemetria_na_veia: {
    Icon: FiBarChart2,
    ring: "from-cyan-400 via-teal-500 to-emerald-700",
    iconBg: "bg-gradient-to-br from-cyan-500/90 to-emerald-800/95",
    rarity: "raro",
  },
  volta_rapida: {
    Icon: FiZap,
    ring: "from-yellow-400 via-amber-500 to-orange-600",
    iconBg: "bg-gradient-to-br from-yellow-500/90 to-orange-700/95",
    rarity: "comum",
  },
  top_3: {
    Icon: FiAward,
    ring: "from-amber-400 via-yellow-500 to-amber-700",
    iconBg: "bg-gradient-to-br from-amber-400/90 via-yellow-500/85 to-amber-700/95",
    rarity: "raro",
  },
  vitoria_pista: {
    Icon: FiStar,
    ring: "from-fuchsia-500 via-rose-500 to-red-600",
    iconBg: "bg-gradient-to-br from-fuchsia-500/90 to-red-700/95",
    rarity: "lendário",
  },
  mestre_consistencia: {
    Icon: FiTarget,
    ring: "from-emerald-400 via-green-500 to-teal-700",
    iconBg: "bg-gradient-to-br from-emerald-500/90 to-teal-800/95",
    rarity: "lendário",
  },
  ritmo_competidor: {
    Icon: FiShield,
    ring: "from-blue-400 via-indigo-500 to-violet-700",
    iconBg: "bg-gradient-to-br from-blue-500/90 to-violet-800/95",
    rarity: "raro",
  },
  foco_total: {
    Icon: FiClock,
    ring: "from-neutral-400 via-slate-500 to-zinc-700",
    iconBg: "bg-gradient-to-br from-slate-500/90 to-zinc-800/95",
    rarity: "épico",
  },
};

const CATEGORY_ORDER: AchievementCategory[] = [
  "participacao",
  "evolucao",
  "desempenho",
  "consistencia",
];

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

function getBadgeStyle(ach: Achievement): BadgeStyle {
  return (
    BADGE_BY_ID[ach.id] ?? {
      Icon: FiAward,
      ring: "from-neutral-400 to-neutral-600",
      iconBg: "bg-neutral-600",
      rarity: "comum",
    }
  );
}

function AchievementBadgeItem({
  ach,
  variant = "card",
}: {
  ach: Achievement;
  variant?: "card" | "modal";
}) {
  const { Icon, ring, iconBg, rarity } = getBadgeStyle(ach);
  const locked = !ach.unlocked;
  const tooltip = locked
    ? `${ach.description} — continue treinando!`
    : ach.description;

  if (variant === "modal") {
    return (
      <div className="flex flex-col items-center gap-2 text-center">
        <div
          className={`relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 shadow-md ${
            locked
              ? "border-neutral-400/70 bg-neutral-400/40"
              : `border-white/30 bg-gradient-to-br ${ring}`
          }`}
          title={tooltip}
        >
          <div
            className={`flex h-full w-full items-center justify-center rounded-[9px] ${
              locked ? "bg-neutral-500/85" : iconBg
            }`}
          >
            <Icon
              className={`h-6 w-6 ${locked ? "text-neutral-200" : "text-white drop-shadow-sm"}`}
              strokeWidth={1.6}
              aria-hidden
            />
            {locked ? (
              <span className="absolute inset-0 flex items-center justify-center rounded-[9px] bg-black/30">
                <HiLockClosed className="h-4 w-4 text-white drop-shadow" />
              </span>
            ) : (
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-emerald-500 text-[8px] font-black text-white"
              >
                ✓
              </span>
            )}
          </div>
        </div>
        <span
          className={`inline-flex rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${rarityBadgeClass(rarity)}`}
        >
          {rarity}
        </span>
        <p className="w-full text-[11px] font-bold leading-snug text-[#111]">
          {ach.label}
        </p>
        <p className="w-full text-[10px] leading-snug text-neutral-600">
          {ach.description}
        </p>
        <p
          className={`text-[10px] font-semibold uppercase tracking-wide ${
            locked ? "text-neutral-500" : "text-emerald-600"
          }`}
        >
          {locked ? "Em progresso" : "Desbloqueada"}
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex min-w-0 flex-col items-center gap-2 text-center"
      title={tooltip}
    >
      <div
        className={`relative mx-auto flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 shadow-md ${
          locked
            ? "border-neutral-400/70 bg-neutral-400/40"
            : `border-white/30 bg-gradient-to-br ${ring}`
        } ${locked ? "opacity-85" : ""}`}
      >
        <div
          className={`flex h-full w-full items-center justify-center rounded-[9px] ${
            locked ? "bg-neutral-500/85" : iconBg
          }`}
        >
          <Icon
            className={`h-7 w-7 ${locked ? "text-neutral-200" : "text-white drop-shadow-sm"}`}
            strokeWidth={1.6}
            aria-hidden
          />
          {locked ? (
            <span className="absolute inset-0 flex items-center justify-center rounded-[9px] bg-black/25">
              <HiLockClosed className="h-4 w-4 text-white drop-shadow" />
            </span>
          ) : (
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-emerald-500 text-[8px] font-black text-white"
            >
              ✓
            </span>
          )}
        </div>
      </div>
      <span
        className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${rarityBadgeClass(rarity)}`}
      >
        {rarity}
      </span>
      <p className="line-clamp-2 w-full text-xs font-bold leading-snug text-[#111]">
        {ach.label}
      </p>
      <p
        className={`text-[10px] font-semibold uppercase tracking-wide ${
          locked ? "text-neutral-500" : "text-emerald-600"
        }`}
      >
        {locked ? "Em progresso" : "Desbloqueada"}
      </p>
    </div>
  );
}

type AchievementsCardProps = {
  className?: string;
};

export function AchievementsCard({ className = "" }: AchievementsCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: achievements = [], isLoading } = usePilotAchievements();
  const { gridRef, columns, previewCount } = useAchievementPreviewGrid(
    achievements.length
  );

  const groupedAchievements = useMemo(
    () =>
      CATEGORY_ORDER.map((category) => ({
        category,
        meta: ACHIEVEMENT_CATEGORY_META[category],
        items: achievements.filter((ach) => ach.category === category),
      })).filter((group) => group.items.length > 0),
    [achievements]
  );
  const hasAchievements = achievements.length > 0;

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-[#0d1f3c]">Conquistas</h3>
          <StudentCardActionButton
            onClick={() => setModalOpen(true)}
            disabled={!hasAchievements}
            aria-disabled={!hasAchievements}
            className={!hasAchievements ? "pointer-events-none opacity-50" : ""}
          >
            Ver todas
          </StudentCardActionButton>
        </div>

        {isLoading ? (
          <p className="mt-4 text-sm text-neutral-500 sm:mt-5">Carregando conquistas…</p>
        ) : hasAchievements ? (
          <ul
            ref={gridRef}
            className="mt-4 grid gap-4 sm:mt-5 sm:gap-5"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {achievements.slice(0, previewCount).map((ach) => (
              <li key={ach.id} className="min-w-0">
                <AchievementBadgeItem ach={ach} />
              </li>
            ))}
          </ul>
        ) : (
          <StudentCardEmptyState
            className="mt-4 sm:mt-5"
            title="Nenhuma conquista ainda"
            description="Complete aulas, evolua seus tempos e participe de baterias para desbloquear conquistas."
          />
        )}
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
            className="flex max-h-[min(90vh,720px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[rgba(17,17,17,0.1)] bg-white shadow-2xl"
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
                  {achievements.filter((a) => a.unlocked).length} de{" "}
                  {achievements.length} desbloqueadas
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

            <div className="overflow-y-auto px-5 py-6 md:px-6">
              <div className="flex flex-col gap-8">
                {groupedAchievements.map(({ category, meta, items }) => (
                  <section key={category} aria-labelledby={`cat-${category}`}>
                    <h3
                      id={`cat-${category}`}
                      className="text-sm font-bold text-[#0d1f3c]"
                    >
                      <span aria-hidden>{meta.emoji}</span> {meta.label}
                    </h3>
                    <ul className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-8">
                      {items.map((ach) => (
                        <li key={ach.id}>
                          <AchievementBadgeItem ach={ach} variant="modal" />
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
