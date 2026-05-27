"use client";

import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons/lib";
import {
  HiArchiveBox,
  HiBanknotes,
  HiCalendarDays,
  HiClipboardDocumentList,
  HiCog6Tooth,
  HiDocumentChartBar,
  HiSquares2X2,
  HiTrophy,
  HiTruck,
  HiUsers,
  HiAcademicCap,
  HiBolt,
  HiWrench,
} from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";
import { ShellMobileAccountLinks } from "@/components/shell/mobile-account-links";

const NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  registroAulas: "/admin/registro-aulas",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  estoque: "/admin/estoque",
  financeiro: "/admin/financeiro",
  configuracoes: "/admin/configuracoes",
};

const ICON_MAP: Record<AdminNavKey, IconType> = {
  dashboard: HiSquares2X2,
  agenda: HiCalendarDays,
  registroAulas: HiClipboardDocumentList,
  alunos: HiUsers,
  instrutores: HiAcademicCap,
  karts: HiTruck,
  manutencao: HiWrench,
  estoque: HiArchiveBox,
  telemetria: HiBolt,
  campeonatos: HiTrophy,
  financeiro: HiBanknotes,
  relatorios: HiDocumentChartBar,
  configuracoes: HiCog6Tooth,
};

type Props = {
  activeNav: AdminNavKey;
  onNav?: (key: AdminNavKey) => void;
  mobileOpen?: boolean;
  onToggleMobile?: () => void;
  onCloseMobile?: () => void;
};

export function Sidebar({
  activeNav,
  onNav,
  mobileOpen,
  onToggleMobile,
  onCloseMobile,
}: Props) {
  const inner = (
    <>
      <div className="-mx-6 border-b border-[rgba(255,255,255,0.12)]">
        <div className="relative px-6 pb-8">
          <div className="flex justify-center pr-14 lg:pr-0">
            <Image
              src="/images/logo-light.svg"
              alt="Gurgel Team"
              width={160}
              height={44}
              className="h-10 w-auto"
            />
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
        {DashboardServiceMock.getNav().map((item) => {
          const Icon = ICON_MAP[item.key];
          const active = activeNav === item.key;
          const href = NAV_HREF[item.key];
          const className = `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition lg:rounded-2xl ${
            active
              ? "bg-white text-[#0d1f3c] shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
              : "text-white hover:bg-white/10"
          }`;

          if (href) {
            return (
              <Link
                key={item.key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={className}
                onClick={() => onCloseMobile?.()}
              >
                <Icon
                  className={`h-[20px] w-[20px] shrink-0 ${
                    active ? "text-[#0d1f3c]" : "text-white"
                  }`}
                  aria-hidden
                />
                <span>{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
              aria-current={active ? "page" : undefined}
              className={className}
              onClick={() => {
                onNav?.(item.key);
                onCloseMobile?.();
              }}
            >
              <Icon
                className={`h-[20px] w-[20px] shrink-0 ${
                  active ? "text-[#0d1f3c]" : "text-white"
                }`}
                aria-hidden
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <ShellMobileAccountLinks
        profileHref="/admin/configuracoes"
        logoutHref="/"
        onNavigate={onCloseMobile}
      />

    </>
  );

  return (
    <>
      <aside className="hidden w-[288px] shrink-0 bg-accent-gradient-soft p-6 lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-white/10">
        {inner}
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
            className="fixed inset-y-0 right-0 z-[80] flex w-[min(90vw,300px)] flex-col bg-accent-gradient-soft p-6 text-white shadow-2xl lg:hidden"
          >
            {inner}
          </aside>
        </>
      ) : null}
    </>
  );
}
