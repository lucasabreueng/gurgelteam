import type {
  GeneralCondition,
  InspectionItemState,
  InspectionModuleDef,
  AutoRecommendation,
  FinalResultStatus,
} from "@/lib/contracts/maintenance";

export function buildInitialItemStates(
  modules: InspectionModuleDef[],
): Record<string, InspectionItemState> {
  const state: Record<string, InspectionItemState> = {};
  for (const mod of modules) {
    for (const item of mod.items) {
      if (item.id === "tr-corrente") {
        state[item.id] = { status: "warn", severity: "moderada", note: "" };
      } else if (item.id === "fr-desg") {
        state[item.id] = { status: "warn", severity: "leve", note: "" };
      } else {
        state[item.id] = { status: null, severity: null, note: "" };
      }
    }
  }
  return state;
}

export function computeInspectionResult(
  modules: InspectionModuleDef[],
  items: Record<string, InspectionItemState>,
  general: GeneralCondition,
): {
  ok: number;
  warn: number;
  fail: number;
  critical: number;
  final: FinalResultStatus;
  recommendation: AutoRecommendation;
  recommendationText: string;
  score: number;
} {
  let ok = 0;
  let warn = 0;
  let fail = 0;
  let critical = 0;

  for (const mod of modules) {
    for (const def of mod.items) {
      const s = items[def.id];
      if (!s?.status) continue;
      if (s.status === "ok") ok++;
      else if (s.status === "warn") warn++;
      else if (s.status === "fail") {
        fail++;
        if (s.severity === "critica" || def.critical) critical++;
      }
    }
  }

  let final: FinalResultStatus = "liberado";
  let recommendation: AutoRecommendation = "liberar";
  let recommendationText =
    "Recomendação: kart liberado para operação normal.";

  if (critical > 0 || general === "critica") {
    final = "bloqueado";
    recommendation = "bloquear";
    recommendationText =
      "Recomendação: bloquear kart — itens críticos detectados.";
  } else if (fail > 0 || warn > 0 || general === "atencao") {
    final = "restrito";
    recommendation = fail > 0 ? "manutencao" : "liberar_obs";
    recommendationText =
      "Recomendação: enviar para manutenção antes da próxima sessão.";
  }

  const total = ok + warn + fail || 1;
  const score = Math.round((ok / total) * 100);

  return {
    ok,
    warn,
    fail,
    critical,
    final,
    recommendation,
    recommendationText,
    score,
  };
}
