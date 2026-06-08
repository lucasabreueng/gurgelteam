"use client";

import {
  HiArrowTrendingUp,
  HiBolt,
  HiFlag,
  HiStar,
  HiTrophy,
} from "react-icons/hi2";
import type { ClientAchievement } from "@/lib/contracts/clients";
import {
  adminAchievementCardClass,
  adminAchievementIconClass,
  adminSubsectionTitleClass,
  adminTextAccentBoldClass,
} from "@/lib/design";

type Props = {
  achievements: ClientAchievement[];
};

function achievementIcon(icon: ClientAchievement["icon"]) {
  switch (icon) {
    case "first":
      return HiStar;
    case "lap":
      return HiBolt;
    case "sessions":
      return HiFlag;
    case "podium":
      return HiTrophy;
    case "consistency":
      return HiArrowTrendingUp;
    default:
      return HiTrophy;
  }
}

export function AchievementsGrid({ achievements }: Props) {
  return (
    <section>
      <h3 className={adminSubsectionTitleClass}>Conquistas</h3>
      <p className="mt-1 text-sm text-neutral-600">Badges e marcos do piloto.</p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {achievements.map((a) => {
          const Icon = achievementIcon(a.icon);
          return (
            <li
              key={a.id}
              className={adminAchievementCardClass}
            >
              <span className={adminAchievementIconClass}>
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className={adminTextAccentBoldClass}>{a.label}</p>
                <p className="mt-0.5 text-[12px] text-neutral-600">
                  {a.description}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  {a.earnedAt}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
