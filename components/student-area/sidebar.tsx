"use client";

import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";
import type { NavItemKey } from "@/lib/contracts/student-area";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons/lib";
import {
  HiCalendarDays,
  HiChartBarSquare,
  HiClipboardDocumentList,
  HiCube,
  HiFlag,
  HiSquares2X2,
  HiTrophy,
  HiBolt,
  HiUsers,
  HiSpeakerWave,
} from "react-icons/hi2";

import { ShellMobileAccountLinks } from "@/components/shell/mobile-account-links";

const ICON_MAP: Record<NavItemKey, IconType> = {
  dashboard: HiSquares2X2,
  agenda: HiCalendarDays,
  evolucao: HiChartBarSquare,
  feedbacks: HiSpeakerWave,
  plano: HiClipboardDocumentList,
  telemetria: HiBolt,
  resultados: HiFlag,
  materiais: HiCube,
  conquistas: HiTrophy,
  ranking: HiUsers,
};

function resolveActiveNav(pathname: string): NavItemKey {
  if (pathname.startsWith("/piloto/telemetria")) return "telemetria";
  return "dashboard";
}

type Props = {
  activeNav?: NavItemKey | null;
  onNav?: (key: NavItemKey | null) => void;
  onCloseMobile?: () => void;
  mobileOpen?: boolean;
  onToggleMobile?: () => void;
};

export function Sidebar({
  activeNav: activeNavProp,
  onNav,
  onCloseMobile,
  mobileOpen,
  onToggleMobile,
}: Props) {
  const pathname = usePathname();
  const activeNav = activeNavProp ?? resolveActiveNav(pathname);

  const sidebarInner = (
    <>
      <div className="-mx-6 border-b border-[rgba(255,255,255,0.12)]">
        <div className="relative px-6 pb-8">
          <div className="flex justify-center pr-14 lg:pr-0">
            <Link href="/piloto" className="inline-block">
              <Image
                src="/images/logo-light.svg"
                alt="Gurgel Team"
                width={160}
                height={44}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <button
            type="button"
            className="absolute right-6 top-0 rounded-lg p-2 text-white lg:hidden"
            aria-label="Fechar menu"
            onClick={onToggleMobile}
          >
            ✕
          </button>
        </div>
      </div>

      <nav className="mt-5 flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pb-6">
        {StudentAreaServiceMock.getStudentNav().map((item) => {
          const Icon = ICON_MAP[item.key];
          const href = StudentAreaServiceMock.getStudentNavHref()[item.key];
          const active = activeNav === item.key;
          return (
            <Link
              key={item.key}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition lg:rounded-2xl ${
                active
                  ? "bg-white text-[#0d1f3c] shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => {
                onNav?.(item.key);
                onCloseMobile?.();
              }}
            >
              <Icon
                className={`h-[22px] w-[22px] shrink-0 ${
                  active ? "text-[#0d1f3c]" : "text-white"
                }`}
                aria-hidden
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <ShellMobileAccountLinks
        profileHref="/piloto/perfil"
        logoutHref="/"
        onNavigate={onCloseMobile}
      />

      <div className="-mx-6 mt-auto border-t border-[rgba(255,255,255,0.12)] px-6 pt-6">
        <div className="rounded-2xl border border-[rgba(255,255,255,0.15)] bg-white/8 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/85">
            Suporte rápido
          </p>
          <p className="mt-1 text-xs text-white/65">
            Atendimento via WhatsApp em horário comercial.
          </p>
          <a
            href="https://wa.me/5561999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-center text-sm font-semibold text-white transition hover:brightness-110"
          >
            Chamar no WhatsApp
          </a>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden w-[288px] shrink-0 bg-accent-gradient-soft p-6 lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-white/10">
        {sidebarInner}
      </aside>

      {mobileOpen ? (
        <>
          <div
            role="presentation"
            className="fixed inset-0 z-[70] bg-black/40 lg:hidden"
            onClick={onToggleMobile}
          />
          <aside
            id="shell-mobile-menu"
            className="fixed inset-y-0 right-0 z-[80] flex w-[min(90vw,300px)] max-w-[90vw] flex-col bg-accent-gradient-soft p-6 text-white shadow-2xl lg:hidden"
          >
            {sidebarInner}
          </aside>
        </>
      ) : null}
    </>
  );
}
