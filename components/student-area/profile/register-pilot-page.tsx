"use client";

import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StudentShell } from "../student-shell";
import { RegisterPilotForm } from "./register-pilot-form";

export function RegisterPilotPage() {
  return (
    <StudentShell
      activeNav="dashboard"
      mobileTitle="Cadastrar piloto"
      pageHeader={
        <AdminPageHeader
          title="Cadastrar piloto"
          subtitle="Vincule um novo piloto à sua conta"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/piloto/perfil" className="btn-outline-md">
                Voltar ao perfil
              </Link>
              <Link href="/piloto" className="btn-outline-md">
                Voltar ao painel
              </Link>
            </div>
          }
        />
      }
      stackClassName="!gap-8"
    >
      <RegisterPilotForm />
    </StudentShell>
  );
}
