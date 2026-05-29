"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { NavItemKey } from "@/lib/contracts/student-area";
import { useAdminPanelDocument } from "@/lib/hooks/use-admin-panel-document";
import { useAdminPanelPageScrollReset } from "@/lib/hooks/use-admin-panel-page-scroll-reset";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { MobileHeaderBar } from "@/components/shell/mobile-header-bar";
import { Sidebar } from "./sidebar";
import { StudentHeader } from "./student-header";

export const STUDENT_SIDEBAR_WIDTH = 288;

const HEADER_HEIGHT_FALLBACK = 76;
const CHROME_HEIGHT_FALLBACK = 76;

type Props = {
  activeNav: NavItemKey;
  onNav?: (key: NavItemKey | null) => void;
  children: ReactNode;
  mobileTitle?: string;
  pageHeader?: ReactNode;
  fixedSubHeader?: ReactNode;
  mainClassName?: string;
  stackClassName?: string;
  shellContentClassName?: string;
  disableTabletShell?: boolean;
};

export function StudentShell({
  activeNav,
  onNav,
  children,
  mobileTitle = "Área do piloto",
  pageHeader,
  fixedSubHeader,
  mainClassName = "",
  stackClassName = "",
  shellContentClassName = "",
  disableTabletShell = false,
}: Props) {
  useAdminPanelDocument();
  const mainRef = useAdminPanelPageScrollReset(activeNav);
  const { tabletLandscape } = useAdminPanelTabletLayout();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const tabletShell = tabletLandscape && !disableTabletShell;
  const sidebarCollapsed = tabletShell && !sidebarExpanded;

  useEffect(() => {
    if (!tabletLandscape) setSidebarExpanded(false);
  }, [tabletLandscape]);

  useEffect(() => {
    if (!tabletShell) return;
    const t = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 150);
    return () => window.clearTimeout(t);
  }, [sidebarExpanded, tabletShell]);
  const chromeRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pageHeaderRef = useRef<HTMLDivElement>(null);
  const [chromeHeight, setChromeHeight] = useState(CHROME_HEIGHT_FALLBACK);
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT_FALLBACK);
  const [pageHeaderHeight, setPageHeaderHeight] = useState(0);

  useEffect(() => {
    const el = chromeRef.current;
    if (!el) return;
    const update = () => setChromeHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [pageHeader, fixedSubHeader]);

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
  }, [pageHeader]);

  const shellStyle = {
    "--admin-chrome-h": `${chromeHeight}px`,
    "--admin-header-h": `${headerHeight}px`,
    "--admin-page-header-h": pageHeader ? `${pageHeaderHeight}px` : "0px",
    "--admin-subheader-h": "0px",
  } as CSSProperties;

  const shellGridClass = tabletShell
    ? sidebarCollapsed
      ? "admin-panel-tablet-landscape-shell grid min-h-[calc(var(--app-vh,1vh)*100)] grid-cols-[72px_minmax(0,1fr)]"
      : "admin-panel-tablet-landscape-shell grid min-h-[calc(var(--app-vh,1vh)*100)] grid-cols-[288px_minmax(0,1fr)]"
    : "lg:grid lg:min-h-screen lg:grid-cols-[288px_minmax(0,1fr)]";

  return (
    <div
      className={`admin-area-page student-area-page bg-[#f3f5f9] text-[#111] ${shellGridClass}`.trim()}
      style={shellStyle}
    >
      <div className="admin-shell-sidebar-slot lg:col-start-1 lg:min-w-0">
        <Sidebar
          activeNav={activeNav}
          onNav={onNav}
          mobileOpen={mobileOpen}
          onToggleMobile={() => setMobileOpen((o) => !o)}
          onCloseMobile={() => setMobileOpen(false)}
          collapsed={sidebarCollapsed}
          collapsedTwoStepNav={sidebarCollapsed}
          showTabletSidebarControls={tabletShell}
          onExpandSidebar={() => setSidebarExpanded(true)}
          onCollapseSidebar={() => setSidebarExpanded(false)}
        />
      </div>

      <div
        className={`admin-shell-content flex min-w-0 max-w-full flex-col overflow-x-clip max-lg:min-h-0 max-lg:flex-1 max-lg:overflow-hidden ${
          tabletShell || sidebarCollapsed
            ? "col-start-2 min-h-0"
            : "lg:col-start-2 lg:min-h-screen"
        } ${shellContentClassName}`.trim()}
      >
        <div
          className={`admin-shell-chrome-spacer shrink-0 ${tabletShell || sidebarCollapsed ? "hidden" : "lg:hidden"}`}
          style={{ height: chromeHeight }}
          aria-hidden
        />

        <div ref={chromeRef} className="admin-shell-chrome shrink-0">
          {!tabletShell ? (
            <header
              ref={headerRef}
              className="border-b border-[rgba(17,17,17,0.08)] bg-white"
            >
              <div className="admin-page-gutter py-3 max-lg:py-2.5">
                {!sidebarCollapsed ? (
                  <MobileHeaderBar
                    title={mobileTitle}
                    menuOpen={mobileOpen}
                    onToggleMenu={() => setMobileOpen((o) => !o)}
                  />
                ) : null}
                <div className={sidebarCollapsed ? "block" : "hidden lg:block"}>
                  <StudentHeader />
                </div>
              </div>
            </header>
          ) : null}

          {pageHeader ? (
            <div
              ref={pageHeaderRef}
              className="border-b border-[rgba(17,17,17,0.08)] bg-[#f3f5f9]"
            >
              <div className="admin-page-gutter admin-page-header-chrome">
                {pageHeader}
              </div>
            </div>
          ) : null}

          {fixedSubHeader ? (
            <div className="border-b border-[rgba(17,17,17,0.08)] bg-[#fafbfc]">
              {fixedSubHeader}
            </div>
          ) : null}
        </div>

        <main
          ref={mainRef}
          className={`box-border w-full min-w-0 max-w-full overflow-x-clip pb-10 admin-page-gutter pt-[var(--admin-chrome-after-border-gap)] ${
            tabletShell
              ? "min-h-0 flex-[1_1_0%] flex-1 overflow-y-auto overscroll-y-contain"
              : "max-lg:min-h-0 max-lg:flex-[1_1_0%] max-lg:flex-1 max-lg:overflow-y-auto max-lg:overscroll-y-contain lg:flex-none lg:overflow-visible"
          } ${mainClassName}`}
        >
          <div className={`admin-page-stack ${stackClassName}`.trim()}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
