import type { ConsentStatus } from "../enums";

export type ConsentDTO = {
  id: string;
  userId: string;
  type: "TERMS" | "PRIVACY" | "MEDIA";
  status: ConsentStatus;
  acceptedAt?: string;
  revokedAt?: string;
  ipAddress?: string;
};

