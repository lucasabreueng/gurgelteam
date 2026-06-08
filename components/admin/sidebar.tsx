"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { IconType } from "react-icons/lib";
import {
  HiArchiveBox,
  HiBanknotes,
  HiCalendarDays,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiClipboardDocumentList,
  HiCog6Tooth,
  HiSquares2X2,
  HiTruck,
  HiUsers,
  HiUserGroup,
  HiBolt,
  HiWrench,
} from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import { useAdminHeaderProfile } from "@/lib/query/hooks/use-admin-header-profile";
import { useAdminPermissions } from "@/lib/query/hooks/use-admin-permissions";
import { DashboardServiceMock } from "@/services/dashboard/dashboardServiceMock";
import { ShellMobileAccountLinks } from "@/components/shell/mobile-account-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShellSidebarTabletProfile } from "@/components/shell/shell-sidebar-tablet-profile";
import { CollapsedRailNavItem } from "@/components/shell/collapsed-rail-nav-item";
import { shellSidebarClass } from "@/lib/design";
import { useCollapsedNavArm } from "@/lib/hooks/use-collapsed-nav-arm";

const NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  registroAulas: "/admin/registro-aulas",
  alunos: "/admin/clientes",
  equipe: "/admin/equipe",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  estoque: "/admin/estoque",
  financeiro: "/admin/financeiro",
  telemetria: "/admin/telemetria",
  configuracoes: "/admin/configuracoes",
};

const ICON_MAP: Record<AdminNavKey, IconType> = {
  dashboard: HiSquares2X2,
  agenda: HiCalendarDays,
  registroAulas: HiClipboardDocumentList,
  alunos: HiUsers,
  equipe: HiUserGroup,
  karts: HiTruck,
  manutencao: HiWrench,
  estoque: HiArchiveBox,
  telemetria: HiBolt,
  financeiro: HiBanknotes,
  configuracoes: HiCog6Tooth,
};

type Props = {
  activeNav: AdminNavKey;
  onNav?: (key: AdminNavKey) => void;
  mobileOpen?: boolean;
  onToggleMobile?: () => void;
  onCloseMobile?: () => void;
  collapsed?: boolean;
  collapsedTwoStepNav?: boolean;
  showTabletSidebarControls?: boolean;
  onExpandSidebar?: () => void;
  onCollapseSidebar?: () => void;
};

export function Sidebar({
  activeNav,
  onNav,
  mobileOpen,
  onToggleMobile,
  onCloseMobile,
  collapsed = false,
  collapsedTwoStepNav = false,
  showTabletSidebarControls = false,
  onExpandSidebar,
  onCollapseSidebar,
}: Props) {
  const router = useRouter();
  const { arm, clearArm, isArmed } = useCollapsedNavArm();
  const { profile } = useAdminHeaderProfile();
  const { canViewNav } = useAdminPermissions();

  const navItems = DashboardServiceMock.getNav().filter((item) =>
    canViewNav(item.key),
  );
  const profileHref = canViewNav("configuracoes") ? "/admin/configuracoes" : "/admin";

  useEffect(() => {
    for (const href of Object.values(NAV_HREF)) {
      if (href) router.prefetch(href);
    }
  }, [router]);

  const navItemClass = (active: boolean) =>
    `flex w-full items-center rounded-xl text-left text-[14px] font-medium transition lg:rounded-2xl ${
      collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
    } ${
      active
        ? "bg-white text-[#0d1f3c] shadow-[0_2px_12px_rgba(0,0,0,0.18)]"
        : "text-white hover:bg-white/10"
    }`;

  const iconClass = (active: boolean) =>
    `h-[20px] w-[20px] shrink-0 ${active ? "text-[#0d1f3c]" : "text-white"}`;

  const handleCollapsedActivate = (
    key: string,
    navigate: () => void,
  ) => {
    if (!isArmed(key)) {
      arm(key);
      return;
    }
    clearArm();
    navigate();
    onCloseMobile?.();
  };

  const inner = (
    <>
      {showTabletSidebarControls && !collapsed ? (
        <div className="-mx-6 shrink-0 border-b border-[rgba(255,255,255,0.12)] px-6 pb-5 pt-1">
          <div className="flex items-center justify-between gap-2">
            <Image
              src="/images/logo-light.svg"
              alt="Gurgel Team"
              width={160}
              height={44}
              className="h-9 w-auto max-w-[calc(100%-2.75rem)]"
            />
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
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.key];
          const active = activeNav === item.key;
          const href = NAV_HREF[item.key];
          const className = navItemClass(active);
          const iconClassName = iconClass(active);

          if (collapsed && collapsedTwoStepNav) {
            const navigate = () => {
              if (href) router.push(href);
              else onNav?.(item.key);
            };
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
                onActivate={() => handleCollapsedActivate(item.key, navigate)}
              />
            );
          }

          if (href) {
            return (
              <Link
                key={item.key}
                href={href}
                prefetch
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
                className={className}
                onClick={() => onCloseMobile?.()}
              >
                <Icon className={iconClassName} aria-hidden />
                <span className={collapsed ? "sr-only" : undefined}>{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.key}
              type="button"
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
            </button>
          );
        })}
      </nav>

      {!collapsed && !showTabletSidebarControls ? (
        <>
          <div className="mt-2 px-2 lg:hidden">
            <ThemeToggle variant="menu" onDarkSurface />
          </div>
          <ShellMobileAccountLinks
            profileHref={profileHref}
            logoutHref="/"
            onNavigate={onCloseMobile}
          />
        </>
      ) : null}

      {showTabletSidebarControls ? (
        <ShellSidebarTabletProfile
          profileHref={profileHref}
          avatarSrc={profile.avatar}
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
            ? `fixed inset-y-0 left-0 z-50 flex h-[calc(var(--app-vh,1vh)*100)] max-h-[calc(var(--app-vh,1vh)*100)] w-[72px] min-h-0 flex-col overflow-visible border-r border-white/10 p-2 ${shellSidebarClass}`
            : `hidden w-[288px] shrink-0 p-6 lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:flex lg:h-screen lg:flex-col lg:border-r lg:border-white/10 ${shellSidebarClass}`
        } ${showTabletSidebarControls && !collapsed ? "!flex !h-[calc(var(--app-vh,1vh)*100)] !max-h-[calc(var(--app-vh,1vh)*100)] !min-h-0" : ""}`}
      >
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
            className={`fixed inset-y-0 right-0 z-[80] flex w-[min(90vw,300px)] flex-col p-6 shadow-2xl lg:hidden ${shellSidebarClass}`}
          >
            {inner}
          </aside>
        </>
      ) : null}
    </>
  );
}
