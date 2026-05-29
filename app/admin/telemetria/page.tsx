import type { Metadata } from "next";
import { TelemetryPage } from "@/components/telemetry/telemetry-page";

export const metadata: Metadata = {
  title: "Telemetria — Admin | Gurgel Team",
  description:
    "Compare voltas, métricas e traçado da sessão cronometrada na Gurgel Team.",
};

export default function AdminTelemetriaPage() {
  return <TelemetryPage />;
}
