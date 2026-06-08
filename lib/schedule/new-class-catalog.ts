import type { NewClassStudentOption } from "@/lib/admin-new-class-mocks";
import { NewClassRepositoryMock } from "@/repositories/schedule/NewClassRepositoryMock";
import { ClientsRepositoryHttp } from "@/repositories/clients/ClientsRepositoryHttp";
import { KartsRepositoryHttp } from "@/repositories/karts/KartsRepositoryHttp";

export type NewClassRentalKart = {
  id: string;
  number: number;
  category: string;
};

export type NewClassThirdPartyKart = {
  id: string;
  number: number;
  category: string;
  ownerName: string;
};

export type NewClassFormCatalog = {
  students: NewClassStudentOption[];
  rentalKarts: NewClassRentalKart[];
  thirdPartyKarts: NewClassThirdPartyKart[];
};

export const EMPTY_NEW_CLASS_FORM_CATALOG: NewClassFormCatalog = {
  students: [],
  rentalKarts: [],
  thirdPartyKarts: [],
};

export function loadNewClassFormCatalogMock(): NewClassFormCatalog {
  return {
    students: NewClassRepositoryMock.getStudents(),
    rentalKarts: [...NewClassRepositoryMock.getRentalKarts()],
    thirdPartyKarts: [...NewClassRepositoryMock.getThirdPartyKarts()],
  };
}

export async function loadNewClassFormCatalogHttp(): Promise<NewClassFormCatalog> {
  const [clients, fleet] = await Promise.all([
    ClientsRepositoryHttp.getList(),
    KartsRepositoryHttp.getFleet(),
  ]);

  const clientById = new Map(clients.map((c) => [c.id, c]));
  const clientKarts = fleet.filter((k) => k.ownership === "client");
  const rentalKarts = fleet
    .filter((k) => k.ownership === "rental")
    .map((k) => ({
      id: k.id,
      number: k.number,
      category: k.categoryName,
    }));

  const thirdPartyKarts = clientKarts.map((k) => ({
    id: k.id,
    number: k.number,
    category: k.categoryName,
    ownerName:
      (k.clientId ? clientById.get(k.clientId)?.name : undefined) ??
      k.ownerName ??
      "Cliente",
  }));

  const students: NewClassStudentOption[] = clients.map((client) => {
    const ownKart = clientKarts.find((k) => k.clientId === client.id);
    return {
      id: client.id,
      name: client.name,
      hasOwnKart: Boolean(ownKart),
      ownKartNumber: ownKart?.number,
      ownKartCategory: ownKart?.categoryName,
      ownKartId: ownKart?.id,
      allowedCategoryIds:
        client.categoryIds.length > 0 ? client.categoryIds : ["f400"],
      levelId: client.levelId,
    };
  });

  return { students, rentalKarts, thirdPartyKarts };
}
