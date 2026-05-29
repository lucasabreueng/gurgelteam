"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons/lib";
import {
  HiBanknotes,
  HiCalendarDays,
  HiChartBar,
  HiUserGroup,
} from "react-icons/hi2";
import type { AdminNavKey } from "@/lib/contracts/dashboard";
import { useDashboardKpis } from "@/lib/query/hooks/use-dashboard";
import { AdminShell } from "./admin-shell";
import { DashboardHeader } from "./dashboard-header";
import { AdminResponsiveKpis } from "./admin-responsive-kpis";
import { OperationalAgenda } from "./operational-agenda";
import { StudentsOverview } from "./students-overview";
import { KartStatusGrid } from "./kart-status-grid";

const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {
  dashboard: "/admin",
  agenda: "/admin/agenda",
  alunos: "/admin/clientes",
  karts: "/admin/karts",
  manutencao: "/admin/manutencao",
  configuracoes: "/admin/configuracoes",
};

const NAV_TO_SECTION: Partial<Record<AdminNavKey, string>> = {
  dashboard: "section-dashboard",
  agenda: "section-agenda",
  alunos: "section-alunos",
  karts: "section-karts",
};

const KPI_ICONS: Record<string, IconType> = {
  aulas: HiCalendarDays,
  alunos: HiUserGroup,
  ocupacao: HiChartBar,
  receita: HiBanknotes,
};

export function AdminDashboardPage() {
  const { data: dashboardKpis = [] } = useDashboardKpis();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<AdminNavKey>("dashboard");

  const onNav = useCallback(
    (key: AdminNavKey) => {
      const href = ADMIN_NAV_HREF[key];
      if (href && key !== "dashboard") {
        router.push(href);
        return;
      }
      setActiveNav(key);
      const id = NAV_TO_SECTION[key];
      if (id) {
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
    },
    [router]
  );

  return (
    <AdminShell
      activeNav={activeNav}
      onNav={onNav}
      mobileTitle="Dashboard"
      pageHeader={<DashboardHeader />}
    >
      <section id="section-dashboard" className="scroll-mt-28 min-w-0">
        <AdminResponsiveKpis
          kpis={dashboardKpis}
          icons={KPI_ICONS}
          defaultIcon={HiChartBar}
          desktopClassName="admin-page-grid grid grid-cols-2 lg:grid-cols-4"
        />
      </section>

      <section
        id="section-agenda"
        className="admin-page-grid scroll-mt-28 grid items-stretch lg:grid-cols-2"
      >
        <OperationalAgenda />
        <div id="section-alunos" className="flex min-h-0 scroll-mt-28">
          <StudentsOverview className="flex-1" />
        </div>
      </section>

      <section id="section-karts" className="scroll-mt-28">
        <KartStatusGrid />
      </section>
    </AdminShell>
  );
}
