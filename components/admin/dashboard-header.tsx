import Link from "next/link";
import { HiCalendarDays, HiPlus } from "react-icons/hi2";
import { AdminPageHeader } from "./admin-page-header";

export function DashboardHeader() {
  return (
    <AdminPageHeader
      title="Dashboard"
      subtitle="Gerencie alunos, treinos, performance e operação da equipe."
      actions={
        <>
          <Link href="/admin/agenda" className="btn-outline-md">
            <HiCalendarDays className="h-4 w-4 shrink-0" aria-hidden />
            Abrir agenda
          </Link>
          <Link href="/admin/clientes" className="btn-primary-md">
            <HiPlus className="h-4 w-4 shrink-0" aria-hidden />
            Novo aluno
          </Link>
        </>
      }
    />
  );
}
