import type { AutoRecommendation } from "@/lib/contracts/maintenance";
import { HiExclamationTriangle, HiShieldCheck } from "react-icons/hi2";

const LABELS: Record<AutoRecommendation, string> = {
  liberar: "Liberar",
  liberar_obs: "Liberar com observação",
  manutencao: "Enviar para manutenção",
  bloquear: "Bloquear kart",
};

type Props = {
  recommendation: AutoRecommendation;
  text: string;
  hasCritical: boolean;
};

export function AutoRecommendationCard({
  recommendation,
  text,
  hasCritical,
}: Props) {
  const warn = recommendation === "manutencao" || recommendation === "bloquear";

  return (
    <section
      className={`rounded-2xl border-2 p-5 ${
        hasCritical
          ? "border-red-300/60 bg-gradient-to-br from-red-50 to-white"
          : warn
            ? "border-amber-200/60 bg-gradient-to-br from-amber-50 to-white"
            : "border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {hasCritical ? (
          <HiExclamationTriangle
            className="h-6 w-6 shrink-0 text-red-600"
            aria-hidden
          />
        ) : (
          <HiShieldCheck
            className="h-6 w-6 shrink-0 text-emerald-600"
            aria-hidden
          />
        )}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            Recomendação automática
          </p>
          <p className="mt-1 text-lg font-bold text-[#0d1f3c]">
            {LABELS[recommendation]}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-700">
            {text}
          </p>
          {hasCritical ? (
            <p className="mt-3 rounded-lg bg-red-100 px-3 py-2 text-xs font-bold text-red-800">
              Itens críticos detectados — status final sugerido: Bloqueado
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
