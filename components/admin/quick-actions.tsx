import type { IconType } from "react-icons/lib";
import {
  HiBolt,
  HiCalendarDays,
  HiChatBubbleLeftRight,
  HiFlag,
  HiUserPlus,
} from "react-icons/hi2";
import { FaFlagCheckered } from "react-icons/fa6";
import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";

const ICON_MAP: Record<string, IconType> = {
  aluno: HiUserPlus,
  agenda: HiCalendarDays,
  treino: HiFlag,
  camp: FaFlagCheckered,
  feedback: HiChatBubbleLeftRight,
  tel: HiBolt,
};

export function QuickActions() {
  const quickActions = DashboardServiceMock.getQuickActions();
  const base =
    "flex min-h-[110px] w-full flex-col gap-3 rounded-2xl border border-[rgba(17,17,17,0.09)] bg-white p-5 text-left shadow-[0_2px_10px_rgba(13,31,60,0.04)] transition hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[0_8px_24px_rgba(13,31,60,0.09)]";

  return (
    <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7">
      <h3 className="text-xl font-bold text-[#0d1f3c]">Ações rápidas</h3>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {quickActions.map((item) => {
          const Icon = ICON_MAP[item.key];
          return (
            <li key={item.key}>
              <button type="button" className={base}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(13,31,60,0.07)] text-lg text-accent">
                  {Icon ? <Icon aria-hidden /> : null}
                </div>
                <span className="text-[14px] font-semibold text-[#111]">{item.label}</span>
                <span className="text-[12px] text-neutral-500">{item.subtitle}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
