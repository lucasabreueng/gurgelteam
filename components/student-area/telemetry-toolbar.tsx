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



  const isLightPage = onSetoresPage || onComparePage;



  const btnBase =

    "rounded-lg px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition";

  const btnIdle = isLightPage

    ? "border border-[rgba(17,17,17,0.12)] bg-white text-neutral-700 hover:border-accent/30 hover:bg-neutral-50"

    : "bg-white/10 text-white/90 hover:bg-white/15";

  const btnActive = isLightPage

    ? "bg-[#0d1f3c] text-white shadow-sm"

    : "bg-white text-[#0d1f3c] shadow-sm";

  const iconBtnBase =

    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition";



  const { immersive, toggleImmersive, heatMapEnabled, toggleHeatMap } =
    useTelemetryWorkspace();



  return (

    <div

      className={

        isLightPage

          ? "relative shrink-0 border-b border-[rgba(17,17,17,0.08)] bg-white"

          : "relative shrink-0 border-b border-[rgba(255,255,255,0.08)] bg-[#0d1f3c]"

      }

    >

      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 md:px-4">

        {!phone ? (

          <>

            <button

              type="button"

              onClick={onOpenLoad}

              className={`${btnBase} ${btnIdle}`}

            >

              Carregar

            </button>

            <Link

              href={base}

              className={`${btnBase} ${onComparePage ? btnActive : btnIdle}`}

            >

              Telemetrias

            </Link>

          </>

        ) : null}

        <button

          type="button"

          onClick={onOpenSessions}

          className={`${btnBase} ${btnIdle}`}

        >

          Sessões

        </button>

        <Link

          href={setores}

          className={`${btnBase} ${onSetoresPage ? btnActive : btnIdle}`}

        >

          Setores

        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">

          <button

            type="button"

            onClick={toggleImmersive}

            className={`${iconBtnBase} ${immersive ? btnActive : btnIdle}`}

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
              className={`${iconBtnBase} ${heatMapEnabled ? btnActive : btnIdle}`}
              aria-label={heatMapEnabled ? "Desativar mapa de calor" : "Ativar mapa de calor"}
              title={heatMapEnabled ? "Desativar mapa de calor" : "Ativar mapa de calor"}
              aria-pressed={heatMapEnabled}
            >
              <HiOutlineFire className="h-[18px] w-[18px]" aria-hidden />
            </button>
          ) : null}

          <button

            type="button"

            onClick={onOpenTracks}

            className={`${iconBtnBase} ${btnIdle}`}

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

