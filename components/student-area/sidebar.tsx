"use client";

import { StudentAreaServiceMock } from "@/services/student/studentAreaServiceMock";
import type { NavItemKey } from "@/lib/contracts/student-area";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { IconType } from "react-icons/lib";
import {
  HiCalendarDays,
  HiChartBarSquare,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
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
import { ShellSidebarTabletProfile } from "@/components/shell/shell-sidebar-tablet-profile";
import { CollapsedRailNavItem } from "@/components/shell/collapsed-rail-nav-item";
import { useCollapsedNavArm } from "@/lib/hooks/use-collapsed-nav-arm";

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
  collapsed?: boolean;
  collapsedTwoStepNav?: boolean;
  showTabletSidebarControls?: boolean;
  onExpandSidebar?: () => void;
  onCollapseSidebar?: () => void;
};

export function Sidebar({
  activeNav: activeNavProp,
  onNav,
  onCloseMobile,
  mobileOpen,
  onToggleMobile,
  collapsed = false,
  collapsedTwoStepNav = false,
  showTabletSidebarControls = false,
  onExpandSidebar,
  onCollapseSidebar,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const activeNav = activeNavProp ?? resolveActiveNav(pathname);
  const { arm, clearArm, isArmed } = useCollapsedNavArm();

  const navItemClass = (active: boolean) =>
    `flex w-full items-center rounded-xl text-left text-[14px] font-medium transition lg:rounded-2xl ${
      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
    } ${
      active
        ? "bg-white text-[#0d1f3c] shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
        : "text-white hover:bg-white/10"
    }`;

  const iconClass = (active: boolean) =>
    `h-[22px] w-[22px] shrink-0 ${active ? "text-[#0d1f3c]" : "text-white"}`;

  const handleCollapsedActivate = (key: string, href: string) => {
    if (!isArmed(key)) {
      arm(key);
      return;
    }
    clearArm();
    router.push(href);
    onNav?.(key as NavItemKey);
    onCloseMobile?.();
  };

  const sidebarInner = (
    <>
      {showTabletSidebarControls && !collapsed ? (
        <div className="-mx-6 shrink-0 border-b border-[rgba(255,255,255,0.12)] px-6 pb-5 pt-1">
          <div className="flex items-center justify-between gap-2">
            <Link href="/piloto" className="inline-block min-w-0">
              <Image
                src="/images/logo-light.svg"
                alt="Gurgel Team"
                width={160}
                height={44}
                className="h-9 w-auto max-w-[calc(100%-2.75rem)]"
              />
            </Link>
            <button
              type="button"
              onClick={onCollapseSidebar}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
              aria-label="Menu compacto"
              title="Menu compacto"
            >
              <HiChevronDoubleLeft className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      {showTabletSidebarControls && collapsed ? (
        <button
          type="button"
          onClick={onExpandSidebar}
          className="mb-3 flex w-full shrink-0 flex-col items-center justify-center rounded-xl border border-white/15 bg-white/10 p-2.5 text-white transition hover:bg-white/15"
          aria-label="Expandir menu"
          title="Expandir menu"
        >
          <HiChevronDoubleRight className="h-5 w-5 shrink-0" aria-hidden />
        </button>
      ) : null}

      {!showTabletSidebarControls ? (
        <div
          className={`-mx-6 border-b border-[rgba(255,255,255,0.12)] ${collapsed ? "hidden" : ""}`}
        >
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
      ) : null}

      <nav
        className={`flex min-h-0 flex-1 flex-col gap-1.5 pb-2 ${
          collapsed ? "mt-0 items-center gap-2 overflow-visible" : "overflow-y-auto"
        } ${
          collapsed
            ? ""
            : showTabletSidebarControls
              ? "mt-0 pb-6"
              : "mt-5 pb-6"
        }`}
      >
        {StudentAreaServiceMock.getStudentNav().map((item) => {
          const Icon = ICON_MAP[item.key];
          const href = StudentAreaServiceMock.getStudentNavHref()[item.key];
          const active = activeNav === item.key;
          const className = navItemClass(active);
          const iconClassName = iconClass(active);

          if (collapsed && collapsedTwoStepNav) {
            return (
              <CollapsedRailNavItem
                key={item.key}
                navKey={item.key}
                label={item.label}
                active={active}
                Icon={Icon}
                armed={isArmed(item.key)}
                className={className}
                iconClassName={iconClassName}
                onActivate={() => handleCollapsedActivate(item.key, href)}
              />
            );
          }

          return (
            <Link
              key={item.key}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              className={className}
              onClick={() => {
                onNav?.(item.key);
                onCloseMobile?.();
              }}
            >
              <Icon className={iconClassName} aria-hidden />
              <span className={collapsed ? "sr-only" : undefined}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {!collapsed && !showTabletSidebarControls ? (
        <>
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
      ) : null}

      {showTabletSidebarControls ? (
        <ShellSidebarTabletProfile
          profileHref="/piloto/perfil"
          avatarSrc={StudentAreaServiceMock.getStudentProfile().avatarFallback}
          collapsed={collapsed}
          onNavigate={onCloseMobile}
        />
      ) : null}
    </>
  );

  return (
    <>
      <aside
        className={`${
          collapsed
            ? "fixed inset-y-0 left-0 z-50 flex h-[calc(var(--app-vh,1vh)*100)] max-h-[calc(var(--app-vh,1vh)*100)] w-[72px] min-h-0 flex-col overflow-visible border-r border-white/10 bg-accent-gradient-soft p-2"
            : "hidden w-[288px] shrink-0 bg-accent-gradient-soft p-6 lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-white/10"
        } ${showTabletSidebarControls && !collapsed ? "!flex !h-[calc(var(--app-vh,1vh)*100)] !max-h-[calc(var(--app-vh,1vh)*100)] !min-h-0" : ""}`}
      >
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
