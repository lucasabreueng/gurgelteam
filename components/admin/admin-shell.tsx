"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import { MobileHeaderBar } from "@/components/shell/mobile-header-bar";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export const ADMIN_SIDEBAR_WIDTH = 288;

const HEADER_HEIGHT_FALLBACK = 76;

type Props = {
  activeNav: AdminNavKey;
  onNav?: (key: AdminNavKey) => void;
  children: ReactNode;
  /** Título exibido no header mobile (barra superior). */
  mobileTitle?: string;
  pageHeader?: ReactNode;
  /** Faixa fixa colada abaixo do título (ex.: abas do financeiro). */
  fixedSubHeader?: ReactNode;
  mainClassName?: string;
  /** Classes extras no container interno (admin-page-stack). */
  stackClassName?: string;
};

/** Layout fixo: sidebar + header + cabeçalho de página + conteúdo */
export function AdminShell({
  activeNav,
  onNav,
  children,
  mobileTitle = "Dashboard",
  pageHeader,
  fixedSubHeader,
  mainClassName = "",
  stackClassName = "",
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const subHeaderRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT_FALLBACK);
  const [pageHeaderHeight, setPageHeaderHeight] = useState(0);
  const [subHeaderHeight, setSubHeaderHeight] = useState(0);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const update = () => setHeaderHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = pageHeaderRef.current;
    if (!el) {
      setPageHeaderHeight(0);
      return;
    }

    const update = () => setPageHeaderHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageHeader, headerHeight]);

  useEffect(() => {
    const el = subHeaderRef.current;
    if (!el) {
      setSubHeaderHeight(0);
      return;
    }

    const update = () => setSubHeaderHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [fixedSubHeader, pageHeaderHeight]);

  const shellStyle = {
    "--admin-header-h": `${headerHeight}px`,
    "--admin-page-header-h": pageHeader ? `${pageHeaderHeight}px` : "0px",
    "--admin-subheader-h": fixedSubHeader ? `${subHeaderHeight}px` : "0px",
  } as CSSProperties;

  const mainPaddingTop = pageHeader
    ? "pt-[calc(var(--admin-page-header-h)+var(--admin-subheader-h)+var(--admin-gap))]"
    : "pt-[calc(var(--admin-header-h)+var(--admin-gap))]";

  return (
    <div
      className="admin-area-page min-h-screen bg-[#f3f5f9] text-[#111]"
      style={shellStyle}
    >
      <Sidebar
        activeNav={activeNav}
        onNav={onNav}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((o) => !o)}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-40 border-b border-[rgba(17,17,17,0.08)] bg-white lg:left-[288px]"
      >
        <div className="admin-page-gutter py-3">
          <MobileHeaderBar
            title={mobileTitle}
            menuOpen={mobileOpen}
            onToggleMenu={() => setMobileOpen((o) => !o)}
          />
          <div className="hidden lg:block">
            <Header />
          </div>
        </div>
      </header>

      {pageHeader ? (
        <div
          ref={pageHeaderRef}
          className="fixed left-0 right-0 top-0 z-30 border-b border-[rgba(17,17,17,0.08)] bg-[#f3f5f9] lg:left-[288px]"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <div className="admin-page-gutter py-2.5 max-lg:py-0 max-lg:has-[.admin-page-header-actions]:py-2.5">
            {pageHeader}
          </div>
        </div>
      ) : null}

      {fixedSubHeader ? (
        <div
          ref={subHeaderRef}
          className="fixed left-0 right-0 z-[25] border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc] lg:left-[288px]"
          style={{ top: "var(--admin-page-header-h)" }}
        >
          {fixedSubHeader}
        </div>
      ) : null}

      <main
        className={`min-h-screen pb-10 ${mainPaddingTop} admin-page-gutter lg:ml-[288px] ${mainClassName}`}
      >
        <div className={`admin-page-stack ${stackClassName}`.trim()}>{children}</div>
      </main>
    </div>
  );
}
