import type { ConsentStatus, ConsentType } from "../enums";

export type { ConsentStatus, ConsentType } from "../enums";

export type ConsentDTO = {
  id: string;
  userId: string;
  type: ConsentType;
  status: ConsentStatus;
  version: string;
  acceptedAt?: string;
  revokedAt?: string;
  ipAddress?: string;
};
