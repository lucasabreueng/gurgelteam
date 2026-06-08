import {
  FLEET_KARTS_SEED,
  KART_STATUS_LABELS,
  type FleetKartListItem,
  type KartStatus,
} from "./admin-karts-mocks";
import { enrichFleetKartListItem } from "./karts/enrich-fleet-kart";

const statusOverrides = new Map<string, KartStatus>();

const BLOCKED_STATUSES = new Set<KartStatus>([
  "manutencao",
  "aguardando_peca",
  "indisponivel",
]);

export function getMergedFleet(): FleetKartListItem[] {
  return FLEET_KARTS_SEED.map((seed) => {
    const status = statusOverrides.get(seed.id) ?? seed.status;
    return enrichFleetKartListItem({ ...seed, status });
  });
}

export function setKartStatusById(kartId: string, status: KartStatus): void {
  if (!FLEET_KARTS_SEED.some((k) => k.id === kartId)) return;
  statusOverrides.set(kartId, status);
}

export function setKartStatusByNumber(kartNumber: number, status: KartStatus): void {
  const kart = FLEET_KARTS_SEED.find((k) => k.number === kartNumber);
  if (kart) statusOverrides.set(kart.id, status);
}

export function getKartByNumber(kartNumber: number): FleetKartListItem | undefined {
  return getMergedFleet().find((k) => k.number === kartNumber);
}

export function getKartById(kartId: string): FleetKartListItem | undefined {
  return getMergedFleet().find((k) => k.id === kartId);
}

export function isKartBlockedForOperation(kartNumber: number): boolean {
  const kart = getKartByNumber(kartNumber);
  if (!kart) return false;
  return BLOCKED_STATUSES.has(kart.status);
}

export function getKartBlockReason(kartNumber: number): string | null {
  const kart = getKartByNumber(kartNumber);
  if (!kart || !isKartBlockedForOperation(kartNumber)) return null;
  return KART_STATUS_LABELS[kart.status] ?? kart.status;
}
