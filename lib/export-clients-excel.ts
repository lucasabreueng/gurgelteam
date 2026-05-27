import { format } from "date-fns";
import * as XLSX from "xlsx";
import type { ClientListItem } from "@/lib/contracts/clients";
import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";
import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";

export function exportClientsToExcel(
  clients: ClientListItem[],
  kartCategories: KartCategory[],
  skillLevels: SkillLevel[],
): void {
  const rows = clients.map((client) => ({
    Piloto: client.name,
    Categoria: ClientsServiceMock.resolveCategoryNames(
      client.categoryIds,
      kartCategories,
    ).join(", "),
    Nível: ClientsServiceMock.resolveLevelName(client.levelId, skillLevels),
    Status: client.status,
    "Última aula": client.lastSession,
    Próxima: client.nextSession,
    "Melhor volta (s)": client.bestLap,
    "Consistência (%)": client.consistency,
    Plano: client.activePlan,
    "Em risco": client.atRisk ? "Sim" : "Não",
    Menor: client.isMinor ? "Sim" : "Não",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pilotos");

  const date = format(new Date(), "yyyy-MM-dd");
  XLSX.writeFile(workbook, `pilotos-gurgel-${date}.xlsx`);
}
