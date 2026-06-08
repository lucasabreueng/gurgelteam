import type { ReactNode } from "react";

import { AreaSessionProvider } from "@/components/auth/area-session-provider";
import { getDataSourceMode } from "@/lib/data-source/mode";
import { getServerAreaBootstrap } from "@/lib/server/auth/get-server-session";

export default async function PilotoLayout({
  children,
}: {
  children: ReactNode;
}) {
  const bootstrap =
    getDataSourceMode() === "http" ? await getServerAreaBootstrap() : null;

  return (
    <AreaSessionProvider bootstrap={bootstrap}>{children}</AreaSessionProvider>
  );
}
