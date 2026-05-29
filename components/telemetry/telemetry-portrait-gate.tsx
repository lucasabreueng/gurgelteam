"use client";

import type { ReactNode } from "react";
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { useTelemetryTabletLayout } from "@/lib/hooks/use-telemetry-tablet-layout";

type Props = {
  children: ReactNode;
};

/** Bloqueia telemetria em tablet retrato — exige rotação para paisagem. */
export function TelemetryPortraitGate({ children }: Props) {
  const { portraitBlocked } = useTelemetryTabletLayout();

  if (portraitBlocked) {
    return (
      <div
        className="flex h-full min-h-[calc(var(--app-vh,1vh)*100)] flex-col items-center justify-center bg-[#0d1f3c] px-8 text-center text-white"
        role="status"
        aria-live="polite"
      >
        <div
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10"
          aria-hidden
        >
          <HiDevicePhoneMobile className="h-10 w-10 rotate-90 text-white/90" />
        </div>
        <h2 className="text-lg font-bold tracking-tight">
          Gire o dispositivo para a horizontal
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
          A telemetria foi otimizada para tablet em modo paisagem. Rotacione o
          aparelho para continuar.
        </p>
      </div>
    );
  }

  return children;
}
