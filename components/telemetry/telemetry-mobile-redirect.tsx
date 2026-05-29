"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTelemetryTabletLayout } from "@/lib/hooks/use-telemetry-tablet-layout";
import { getTelemetryRoutes } from "@/lib/telemetry-routes";

/** No mobile, abre sempre em Setores (não em Telemetrias). */
export function TelemetryMobileRedirect({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { phone } = useTelemetryTabletLayout();

  useEffect(() => {
    if (!phone) return;
    const { base, setores } = getTelemetryRoutes(pathname);
    const onComparePage = pathname === base || pathname === `${base}/`;
    if (onComparePage) router.replace(setores);
  }, [phone, pathname, router]);

  return children;
}
