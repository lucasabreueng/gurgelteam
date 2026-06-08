"use client";



import { useCallback, type ReactNode } from "react";

import { useRouter } from "next/navigation";

import type { AdminNavKey } from "@/lib/contracts/dashboard";

import { AdminShell } from "@/components/admin/admin-shell";

import { StudentShell } from "@/components/student-area/student-shell";

import { TelemetryWorkspace } from "@/components/student-area/telemetry/telemetry-workspace";

import {

  TelemetryWorkspaceProvider,

  useTelemetryWorkspace,

} from "@/components/student-area/telemetry/telemetry-workspace-context";

import { TelemetryPortraitGate } from "@/components/telemetry/telemetry-portrait-gate";
import { TelemetryMobileRedirect } from "@/components/telemetry/telemetry-mobile-redirect";

import type { TelemetryArea } from "@/lib/telemetry-routes";



const TELEMETRY_SHELL_CLASS =

  "overflow-hidden max-lg:h-[calc(var(--app-vh,1vh)*100)] max-lg:max-h-[calc(var(--app-vh,1vh)*100)] lg:h-screen lg:max-h-screen";



const TELEMETRY_MAIN_CLASS =

  "!flex !min-h-0 !flex-1 !flex-col !overflow-hidden !p-0 !pb-0";



const TELEMETRY_STACK_CLASS =

  "!gap-0 !min-h-0 !p-0 h-full max-h-full overflow-hidden";



const ADMIN_NAV_HREF: Partial<Record<AdminNavKey, string>> = {

  dashboard: "/admin",

  agenda: "/admin/agenda",

  registroAulas: "/admin/registro-aulas",

  alunos: "/admin/clientes",

  karts: "/admin/karts",

  manutencao: "/admin/manutencao",

  estoque: "/admin/estoque",

  telemetria: "/admin/telemetria",

  financeiro: "/admin/financeiro",

  configuracoes: "/admin/configuracoes",

};



type Props = {

  area: TelemetryArea;

  children: ReactNode;

};



function TelemetryWorkspaceFrame({ children }: { children: ReactNode }) {

  const { immersive, immersiveRootRef } = useTelemetryWorkspace();



  const workspace = (

    <TelemetryPortraitGate>
      <TelemetryMobileRedirect>
        <TelemetryWorkspace>{children}</TelemetryWorkspace>
      </TelemetryMobileRedirect>
    </TelemetryPortraitGate>

  );



  if (immersive) {

    return (

      <div

        ref={immersiveRootRef}

        className="telemetry-immersive-root fixed inset-0 z-[200] flex min-h-0 flex-col overflow-hidden bg-[var(--ds-bg-page)]"

      >

        {workspace}

      </div>

    );

  }



  return (

    <div className="h-full min-h-0 max-h-full overflow-hidden">

      {workspace}

    </div>

  );

}



function TelemetryAreaShell({

  area,

  children,

}: {

  area: TelemetryArea;

  children: ReactNode;

}) {

  const router = useRouter();

  const { immersive } = useTelemetryWorkspace();



  const onAdminNav = useCallback(

    (key: AdminNavKey) => {

      const href = ADMIN_NAV_HREF[key];

      if (href) router.push(href);

    },

    [router],

  );



  const frame = <TelemetryWorkspaceFrame>{children}</TelemetryWorkspaceFrame>;



  if (immersive) {

    return frame;

  }



  if (area === "piloto") {

    return (

      <StudentShell

        activeNav="telemetria"

        mobileTitle="Telemetria"

        shellContentClassName={TELEMETRY_SHELL_CLASS}

        mainClassName={TELEMETRY_MAIN_CLASS}

        stackClassName={TELEMETRY_STACK_CLASS}

      >

        {frame}

      </StudentShell>

    );

  }



  return (

    <AdminShell

      activeNav="telemetria"

      onNav={onAdminNav}

      mobileTitle="Telemetria"

      shellContentClassName={TELEMETRY_SHELL_CLASS}

      mainClassName={TELEMETRY_MAIN_CLASS}

      stackClassName={TELEMETRY_STACK_CLASS}

    >

      {frame}

    </AdminShell>

  );

}



/** Shell + workspace de telemetria (piloto e admin compartilham o mesmo UI). */

export function TelemetryAreaLayout({ area, children }: Props) {

  return (

    <TelemetryWorkspaceProvider>

      <TelemetryAreaShell area={area}>{children}</TelemetryAreaShell>

    </TelemetryWorkspaceProvider>

  );

}

