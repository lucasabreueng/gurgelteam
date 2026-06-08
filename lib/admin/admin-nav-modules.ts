import type { AdminNavKey } from "@/lib/contracts/dashboard";
import type { ModuleKey } from "@/lib/contracts/enums";

/** Mapeamento item do menu admin → chave de permissão. */
export const ADMIN_NAV_TO_MODULE: Record<AdminNavKey, ModuleKey> = {
  dashboard: "dashboard",
  agenda: "agenda",
  registroAulas: "registroAulas",
  alunos: "alunos",
  equipe: "equipe",
  karts: "karts",
  manutencao: "manutencao",
  estoque: "estoque",
  telemetria: "telemetria",
  financeiro: "financeiro",
  configuracoes: "configuracoes",
};

const PATH_PREFIX_TO_MODULE: { prefix: string; module: ModuleKey }[] = [
  { prefix: "/admin/configuracoes", module: "configuracoes" },
  { prefix: "/admin/equipe", module: "equipe" },
  { prefix: "/admin/registro-aulas", module: "registroAulas" },
  { prefix: "/admin/clientes", module: "alunos" },
  { prefix: "/admin/agenda", module: "agenda" },
  { prefix: "/admin/karts", module: "karts" },
  { prefix: "/admin/manutencao", module: "manutencao" },
  { prefix: "/admin/estoque", module: "estoque" },
  { prefix: "/admin/telemetria", module: "telemetria" },
  { prefix: "/admin/financeiro", module: "financeiro" },
];

export function resolveAdminModuleFromPath(pathname: string): ModuleKey | null {
  const path = pathname.split("?")[0]?.replace(/\/$/, "") || "/admin";
  if (path === "/admin") return "dashboard";
  for (const { prefix, module } of PATH_PREFIX_TO_MODULE) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return module;
  }
  return null;
}
