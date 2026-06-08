import type { NewClientFormData } from "@/components/admin/clients/new-client-drawer";
import {
  CLIENTS_LIST,
  type ClientListItem,
} from "./admin-clients-mocks";
import type { NewClassStudentOption } from "./admin-new-class-mocks";

const addedClients: ClientListItem[] = [];
let nextClientSeq = 1;

export function getRuntimeClients(): ClientListItem[] {
  return [...addedClients];
}

export function getMergedClientsList(): ClientListItem[] {
  return [...CLIENTS_LIST, ...addedClients];
}

export function getRuntimeClientById(id: string): ClientListItem | undefined {
  return (
    addedClients.find((c) => c.id === id) ??
    CLIENTS_LIST.find((c) => c.id === id)
  );
}

export function createClientFromForm(data: NewClientFormData): ClientListItem {
  const id = `c-new-${nextClientSeq++}`;
  const name = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

  const client: ClientListItem = {
    id,
    name,
    avatar: "",
    categoryIds: [...data.categoryIds],
    levelId: data.levelId,
    status: "Ativo",
    lastSession: "—",
    nextSession: "—",
    bestLap: "—",
    consistency: 0,
    activePlan: "Avulso",
    isMinor: data.categoryIds.includes("mirim-cadete"),
  };

  addedClients.push(client);
  return client;
}

export function clientToNewClassStudent(
  client: ClientListItem,
): NewClassStudentOption {
  return {
    id: `s-${client.id}`,
    name: client.name,
    plan: client.activePlan,
    lessonsLeft: 0,
    hasOwnKart: false,
    allowedCategoryIds: [...client.categoryIds],
    levelId: client.levelId,
  };
}

export function getRuntimeNewClassStudents(): NewClassStudentOption[] {
  return addedClients.map(clientToNewClassStudent);
}

export function resolveStudentIdByName(name: string): string | undefined {
  const runtime = addedClients.find((c) => c.name === name);
  if (runtime) return runtime.id;
  const seeded = CLIENTS_LIST.find((c) => c.name === name);
  return seeded?.id;
}

export function findNewClassStudentByClientId(
  clientId: string,
): NewClassStudentOption | undefined {
  const client = getRuntimeClientById(clientId);
  if (!client) return undefined;
  return clientToNewClassStudent(client);
}

const removedClientIds = new Set<string>();

export function markClientRemoved(clientId: string): void {
  removedClientIds.add(clientId);
  const idx = addedClients.findIndex((c) => c.id === clientId);
  if (idx >= 0) addedClients.splice(idx, 1);
}

export function isClientRemoved(clientId: string): boolean {
  return removedClientIds.has(clientId);
}
