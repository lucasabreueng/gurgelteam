"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiArrowsPointingIn,
  HiArrowsPointingOut,
  HiOutlineCog6Tooth,
  HiOutlineFire,
} from "react-icons/hi2";
import { useTelemetryWorkspace } from "@/components/student-area/telemetry/telemetry-workspace-context";
import { useTelemetryTabletLayout } from "@/lib/hooks/use-telemetry-tablet-layout";
import { getTelemetryRoutes } from "@/lib/telemetry-routes";
import {
  telemetryBtnActiveClass,
  telemetryBtnBaseClass,
  telemetryBtnIdleClass,
  telemetryIconBtnClass,
  telemetryToolbarClass,
} from "@/lib/design";

type Props = {
  onOpenLoad?: () => void;
  onOpenSessions?: () => void;
  onOpenTracks?: () => void;
};

export function TelemetryToolbar({ onOpenLoad, onOpenSessions, onOpenTracks }: Props) {
  const pathname = usePathname();
  const { phone } = useTelemetryTabletLayout();
  const { base, setores } = getTelemetryRoutes(pathname);
  const onSetoresPage = pathname.startsWith(`${setores}`);
  const onComparePage = pathname === base || pathname === `${base}/`;

  const { immersive, toggleImmersive, heatMapEnabled, toggleHeatMap } =
    useTelemetryWorkspace();

  return (
    <div className={telemetryToolbarClass}>
      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 md:px-4">
        {!phone ? (
          <>
            <button
              type="button"
              onClick={onOpenLoad}
              className={`${telemetryBtnBaseClass} ${telemetryBtnIdleClass}`}
            >
              Carregar
            </button>
            <Link
              href={base}
              className={`${telemetryBtnBaseClass} ${
                onComparePage ? telemetryBtnActiveClass : telemetryBtnIdleClass
              }`}
            >
              Telemetrias
            </Link>
          </>
        ) : null}

        <button
          type="button"
          onClick={onOpenSessions}
          className={`${telemetryBtnBaseClass} ${telemetryBtnIdleClass}`}
        >
          Sessões
        </button>

        <Link
          href={setores}
          className={`${telemetryBtnBaseClass} ${
            onSetoresPage ? telemetryBtnActiveClass : telemetryBtnIdleClass
          }`}
        >
          Setores
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={toggleImmersive}
            className={`${telemetryIconBtnClass} ${
              immersive ? telemetryBtnActiveClass : telemetryBtnIdleClass
            }`}
            aria-label={immersive ? "Sair da tela cheia" : "Tela cheia"}
            title={immersive ? "Sair da tela cheia" : "Tela cheia"}
            aria-pressed={immersive}
          >
            {immersive ? (
              <HiArrowsPointingIn className="h-[18px] w-[18px]" aria-hidden />
            ) : (
              <HiArrowsPointingOut className="h-[18px] w-[18px]" aria-hidden />
            )}
          </button>

          {onComparePage ? (
            <button
              type="button"
              onClick={toggleHeatMap}
              className={`${telemetryIconBtnClass} ${
                heatMapEnabled ? telemetryBtnActiveClass : telemetryBtnIdleClass
              }`}
              aria-label={
                heatMapEnabled ? "Desativar mapa de calor" : "Ativar mapa de calor"
              }
              title={
                heatMapEnabled ? "Desativar mapa de calor" : "Ativar mapa de calor"
              }
              aria-pressed={heatMapEnabled}
            >
              <HiOutlineFire className="h-[18px] w-[18px]" aria-hidden />
            </button>
          ) : null}

          <button
            type="button"
            onClick={onOpenTracks}
            className={`${telemetryIconBtnClass} ${telemetryBtnIdleClass}`}
            aria-label="Configurar pistas"
            title="Configurar pistas"
          >
            <HiOutlineCog6Tooth className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
