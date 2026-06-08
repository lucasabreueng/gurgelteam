import { ClientsRepositoryHttp } from "@/repositories/clients/ClientsRepositoryHttp";
import { KartsRepositoryHttp } from "@/repositories/karts/KartsRepositoryHttp";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export async function resolveClientId(
  studentId: string,
  studentName: string,
): Promise<string> {
  if (isUuid(studentId)) return studentId;

  const clients = await ClientsRepositoryHttp.getList();
  const match = clients.find(
    (c) => c.name.trim().toLowerCase() === studentName.trim().toLowerCase(),
  );
  if (!match) {
    throw new Error(
      "Aluno não encontrado no cadastro. Verifique o cliente em Clientes.",
    );
  }
  return match.id;
}

export async function resolveKartIdByNumber(
  kartNumber: number,
): Promise<string | undefined> {
  const fleet = await KartsRepositoryHttp.getFleet();
  return fleet.find((k) => k.number === kartNumber)?.id;
}

export async function resolveKartId(
  kartIdOrMock: string,
  kartNumber: number,
): Promise<string | undefined> {
  if (isUuid(kartIdOrMock)) return kartIdOrMock;
  return resolveKartIdByNumber(kartNumber);
}
