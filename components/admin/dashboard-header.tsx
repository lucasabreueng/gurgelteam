"use client";

import Link from "next/link";
import { HiCalendarDays, HiPlus } from "react-icons/hi2";
import { useAdminPanelTabletLayout } from "@/lib/hooks/use-admin-panel-tablet-layout";
import { AdminPageHeader } from "./admin-page-header";

export function DashboardHeader() {
  const { tabletLandscape } = useAdminPanelTabletLayout();

  return (
    <AdminPageHeader
      title="Dashboard"
      subtitle="Gerencie alunos, treinos, performance e operação da equipe."
      actions={
        <>
          <Link href="/admin/agenda" className="btn-outline-sm">
            <HiCalendarDays className="h-4 w-4 shrink-0" aria-hidden />
            {tabletLandscape ? "Agenda" : "Abrir agenda"}
          </Link>
          <Link href="/admin/clientes" className="btn-primary-sm">
            <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
            {tabletLandscape ? "Aluno" : "Novo aluno"}
          </Link>
        </>
      }
      actionsClassName="admin-page-header-actions--tablet-compact"
    />
  );
}
