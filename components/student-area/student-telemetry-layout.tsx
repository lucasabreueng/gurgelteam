"use client";

import type { ReactNode } from "react";
import { TelemetryAreaLayout } from "@/components/telemetry/telemetry-area-layout";

type Props = {
  children: ReactNode;
};

export function StudentTelemetryLayout({ children }: Props) {
  return <TelemetryAreaLayout area="piloto">{children}</TelemetryAreaLayout>;
}
