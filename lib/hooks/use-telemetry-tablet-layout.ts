"use client";

import { useEffect, useState } from "react";
import {
  TELEMETRY_PHONE_MQ,
  TELEMETRY_PORTRAIT_MQ,
  TELEMETRY_TABLET_LANDSCAPE_MQ,
} from "@/lib/telemetry-tablet-layout";

type TelemetryTabletLayout = {
  /** Telefone (<768px) — UX mobile simplificada. */
  phone: boolean;
  /** Tablet em retrato — bloquear UI e pedir rotação. */
  portraitBlocked: boolean;
  /** Tablet em paisagem — sidebar recolhida + grid compacto. */
  tabletLandscape: boolean;
};

export function useTelemetryTabletLayout(): TelemetryTabletLayout {
  const [layout, setLayout] = useState<TelemetryTabletLayout>({
    phone: false,
    portraitBlocked: false,
    tabletLandscape: false,
  });

  useEffect(() => {
    const phoneMq = window.matchMedia(TELEMETRY_PHONE_MQ);
    const portraitMq = window.matchMedia(TELEMETRY_PORTRAIT_MQ);
    const landscapeMq = window.matchMedia(TELEMETRY_TABLET_LANDSCAPE_MQ);

    const sync = () => {
      setLayout({
        phone: phoneMq.matches,
        portraitBlocked: portraitMq.matches,
        tabletLandscape: landscapeMq.matches,
      });
    };

    sync();
    phoneMq.addEventListener("change", sync);
    portraitMq.addEventListener("change", sync);
    landscapeMq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      phoneMq.removeEventListener("change", sync);
      portraitMq.removeEventListener("change", sync);
      landscapeMq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return layout;
}
