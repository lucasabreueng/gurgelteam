"use client";

import { useEffect, useState } from "react";
import { ADMIN_PANEL_TABLET_LANDSCAPE_MQ } from "@/lib/admin-panel-tablet-layout";

export function useAdminPanelTabletLayout() {
  const [tabletLandscape, setTabletLandscape] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(ADMIN_PANEL_TABLET_LANDSCAPE_MQ);

    const sync = () => setTabletLandscape(mq.matches);
    sync();

    mq.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      mq.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);

  return { tabletLandscape };
}
