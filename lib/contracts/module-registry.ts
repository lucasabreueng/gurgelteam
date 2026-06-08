import {
  ADMIN_MODULE_KEYS,
  MODULE_KEYS,
  MODULE_GROUP_KEYS,
  type ModuleGroupKey,
  type ModuleKey,
} from "@/lib/contracts/enums";

/** Módulos da área piloto (`piloto*` em `MODULE_KEYS`). */
export const PILOT_MODULE_KEYS = MODULE_KEYS.filter((key): key is ModuleKey =>
  key.startsWith("piloto"),
);

/** Labels exibidos na matriz de permissões (Configurações → Usuários). */
export const MODULE_LABELS: Record<ModuleKey, string> = {
  dashboard: "Dashboard",
  agenda: "Agenda",
  registroAulas: "Registro de aulas",
  alunos: "Clientes",
  equipe: "Equipe",
  karts: "Karts",
  manutencao: "Manutenção",
  estoque: "Estoque",
  telemetria: "Telemetria",
  financeiro: "Financeiro",
  relatorios: "Relatórios",
  configuracoes: "Configurações",
  pilotoDashboard: "Dashboard",
  pilotoAgenda: "Agenda",
  pilotoEvolucao: "Evolução",
  pilotoFeedbacks: "Feedbacks",
  pilotoPlano: "Plano de treino",
  pilotoTelemetria: "Telemetria",
  pilotoResultados: "Resultados",
  pilotoMateriais: "Materiais",
  pilotoConquistas: "Conquistas",
  pilotoRanking: "Ranking interno",
};

/** Grupos Admin / Piloto — derivados de `MODULE_KEYS` (não duplicar listas manualmente). */
export const MODULE_GROUPS: {
  key: ModuleGroupKey;
  label: string;
  moduleKeys: readonly ModuleKey[];
}[] = [
  {
    key: "admin",
    label: "Admin",
    moduleKeys: ADMIN_MODULE_KEYS,
  },
  {
    key: "piloto",
    label: "Piloto",
    moduleKeys: PILOT_MODULE_KEYS,
  },
];

function assertRegistryCoversAllModules(): void {
  const covered = new Set<ModuleKey>([
    ...ADMIN_MODULE_KEYS,
    ...PILOT_MODULE_KEYS,
  ]);
  for (const key of MODULE_KEYS) {
    if (!covered.has(key)) {
      throw new Error(
        `[module-registry] ModuleKey "${key}" não está em ADMIN_MODULE_KEYS nem PILOT_MODULE_KEYS`,
      );
    }
    if (!(key in MODULE_LABELS)) {
      throw new Error(`[module-registry] MODULE_LABELS sem entrada para "${key}"`);
    }
  }
  if (covered.size !== MODULE_KEYS.length) {
    throw new Error(
      "[module-registry] ADMIN_MODULE_KEYS e PILOT_MODULE_KEYS devem ser disjuntos e cobrir MODULE_KEYS",
    );
  }
}

assertRegistryCoversAllModules();

export { MODULE_GROUP_KEYS };
