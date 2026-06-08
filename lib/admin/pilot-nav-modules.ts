import type { NavItemKey } from "@/lib/contracts/student-area";
import type { ModuleKey } from "@/lib/contracts/enums";
import { PILOT_MODULE_KEYS } from "@/lib/contracts/module-registry";

/** Mapeamento item do menu piloto → chave de permissão. */
export const PILOT_NAV_TO_MODULE: Record<NavItemKey, ModuleKey> = {
  dashboard: "pilotoDashboard",
  agenda: "pilotoAgenda",
  evolucao: "pilotoEvolucao",
  feedbacks: "pilotoFeedbacks",
  telemetria: "pilotoTelemetria",
  resultados: "pilotoResultados",
  materiais: "pilotoMateriais",
  conquistas: "pilotoConquistas",
  ranking: "pilotoRanking",
};

const PATH_PREFIX_TO_PILOT_MODULE: { prefix: string; module: ModuleKey }[] = [
  { prefix: "/piloto/reservar", module: "pilotoAgenda" },
  { prefix: "/piloto/telemetria", module: "pilotoTelemetria" },
  { prefix: "/piloto/perfil", module: "pilotoDashboard" },
];

export function resolvePilotModuleFromPath(pathname: string): ModuleKey {
  const path = pathname.split("?")[0]?.replace(/\/$/, "") || "/piloto";
  if (path === "/piloto") return "pilotoDashboard";
  for (const { prefix, module } of PATH_PREFIX_TO_PILOT_MODULE) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return module;
  }
  return "pilotoDashboard";
}

export { PILOT_MODULE_KEYS };
