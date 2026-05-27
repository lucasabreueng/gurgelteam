import Link from "next/link";
import { HiCalendarDays, HiShoppingBag, HiUserGroup } from "react-icons/hi2";
import type { IconType } from "react-icons/lib";
import { FaFlagCheckered } from "react-icons/fa6";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import type { QuickAction as QuickActionT } from "@/lib/contracts/student-area";

const ICON_MAP: Record<string, IconType> = {
  agenda: HiCalendarDays,
  pacote: HiShoppingBag,
  coletivo: HiUserGroup,
  campeonato: FaFlagCheckered,
  equipa: IoChatbubbleEllipsesOutline,
};

export function QuickActions({ items }: { items: QuickActionT[] }) {
  const base =
    "flex min-h-[120px] flex-col gap-4 rounded-2xl border border-[rgba(17,17,17,0.09)] bg-white p-6 text-left shadow-[0_2px_10px_rgba(13,31,60,0.04)] transition hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[0_8px_24px_rgba(13,31,60,0.09)]";

  return (
    <div className="rounded-2xl border border-[rgba(17,17,17,0.08)] bg-white p-6 shadow-[0_2px_12px_rgba(13,31,60,0.04)] md:p-7">
      <h3 className="text-xl font-bold text-[#0d1f3c]">Ações rápidas</h3>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {items.map((item) => {
          const Icon = ICON_MAP[item.key];
          const body = (
            <>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(13,31,60,0.07)] text-lg text-accent">
                {Icon ? <Icon aria-hidden /> : null}
              </div>
              <span className="text-[15px] font-semibold leading-snug text-[#111]">
                {item.label}
              </span>
              <span className="mt-auto border-t border-dashed border-neutral-200 pt-3 text-[13px] text-neutral-600">
                {item.subtitle}
              </span>
            </>
          );
          if (item.href) {
            return (
              <li key={item.key}>
                <Link href={item.href} className={`${base} group`}>
                  {body}
                </Link>
              </li>
            );
          }
          return (
            <li key={item.key}>
              <button type="button" className={`${base} w-full cursor-pointer`}>
                {body}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
