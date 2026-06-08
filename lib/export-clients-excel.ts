import { format } from "date-fns";
import ExcelJS from "exceljs";
import type { ClientListItem } from "@/lib/contracts/clients";
import type { KartCategory, SkillLevel } from "@/lib/contracts/settings";
import { ClientsServiceMock } from "@/services/clients/clientsServiceMock";

type ClientExportRow = {
  Piloto: string;
  Categoria: string;
  Nível: string;
  Status: string;
  "Última aula": string;
  Próxima: string;
  "Melhor volta (s)": number | string;
  "Consistência (%)": number | string;
  Plano: string;
  "Em risco": string;
  Menor: string;
};

const EXPORT_COLUMNS: { header: keyof ClientExportRow; width: number }[] = [
  { header: "Piloto", width: 28 },
  { header: "Categoria", width: 24 },
  { header: "Nível", width: 16 },
  { header: "Status", width: 14 },
  { header: "Última aula", width: 14 },
  { header: "Próxima", width: 14 },
  { header: "Melhor volta (s)", width: 18 },
  { header: "Consistência (%)", width: 18 },
  { header: "Plano", width: 20 },
  { header: "Em risco", width: 12 },
  { header: "Menor", width: 10 },
];

function buildExportRows(
  clients: ClientListItem[],
  kartCategories: KartCategory[],
  skillLevels: SkillLevel[],
): ClientExportRow[] {
  return clients.map((client) => ({
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
}

function downloadWorkbook(buffer: BlobPart, filename: string): void {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function exportClientsToExcel(
  clients: ClientListItem[],
  kartCategories: KartCategory[],
  skillLevels: SkillLevel[],
): Promise<void> {
  const rows = buildExportRows(clients, kartCategories, skillLevels);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Pilotos");

  worksheet.columns = EXPORT_COLUMNS.map(({ header, width }) => ({
    header,
    key: header,
    width,
  }));

  if (rows.length > 0) {
    worksheet.addRows(rows);
  }

  worksheet.getRow(1).font = { bold: true };

  const date = format(new Date(), "yyyy-MM-dd");
  const buffer = await workbook.xlsx.writeBuffer();
  downloadWorkbook(buffer, `pilotos-gurgel-${date}.xlsx`);
}
