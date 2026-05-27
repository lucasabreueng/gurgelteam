import type { ReactNode } from "react";
import { StudentTelemetryLayout } from "@/components/student-area/student-telemetry-layout";

export default function PilotoTelemetriaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <StudentTelemetryLayout>{children}</StudentTelemetryLayout>;
}
