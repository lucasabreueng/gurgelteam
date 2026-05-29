import type { ReactNode } from "react";
import { TelemetryAreaLayout } from "@/components/telemetry/telemetry-area-layout";

export default function AdminTelemetriaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <TelemetryAreaLayout area="admin">{children}</TelemetryAreaLayout>;
}
