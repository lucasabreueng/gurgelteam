"use client";

import dynamic from "next/dynamic";
import { AdminTabPanelSkeleton } from "@/components/admin/admin-page-skeletons";

const TelemetryComparison = dynamic(
  () =>
    import("@/components/student-area/telemetry-comparison").then((m) => ({
      default: m.TelemetryComparison,
    })),
  {
    ssr: false,
    loading: () => <AdminTabPanelSkeleton />,
  },
);

/** Conteúdo principal — comparação de voltas (piloto e admin). */
export function TelemetryPage() {
  return <TelemetryComparison />;
}
