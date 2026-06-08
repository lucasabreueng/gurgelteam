import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type {
  PilotAccountApiDTO,
  PilotDashboardApiDTO,
  PilotProfileApiDTO,
  RegisterLinkedPilotRequest,
} from "@/lib/contracts/api/v1/pilot.api.schemas";
import type { UpsertConsentRequest } from "@/lib/contracts/api/v1/consents.api.schemas";
import { ConsentStatus } from "@/lib/contracts/enums";

export const StudentDashboardRepositoryHttp = {
  async getDashboard(): Promise<PilotDashboardApiDTO> {
    const res = await apiFetch<PilotDashboardApiDTO>(v1ApiPaths.pilot.dashboard);
    return unwrapApiResponse(res);
  },
};

export const StudentProfileRepositoryHttp = {
  async getAccount(): Promise<PilotAccountApiDTO> {
    const res = await apiFetch<PilotAccountApiDTO>(v1ApiPaths.pilot.account);
    return unwrapApiResponse(res);
  },

  async getProfile(): Promise<PilotProfileApiDTO> {
    const res = await apiFetch<PilotProfileApiDTO>(v1ApiPaths.pilot.profile);
    return unwrapApiResponse(res);
  },

  async registerLinkedPilot(
    data: RegisterLinkedPilotRequest,
  ): Promise<PilotAccountApiDTO> {
    const res = await apiFetch<PilotAccountApiDTO>(v1ApiPaths.pilot.linkedPilots, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return unwrapApiResponse(res);
  },

  async updateProfile(
    data: Partial<
      Pick<
        PilotProfileApiDTO,
        | "name"
        | "email"
        | "phone"
        | "avatarUrl"
        | "weightKg"
        | "heightCm"
        | "city"
        | "state"
      >
    >,
  ): Promise<PilotProfileApiDTO> {
    const res = await apiFetch<PilotProfileApiDTO>(v1ApiPaths.pilot.profile, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return unwrapApiResponse(res);
  },

  async updateLinkedProfile(
    clientId: string,
    data: Partial<
      Pick<
        PilotProfileApiDTO,
        | "name"
        | "email"
        | "phone"
        | "avatarUrl"
        | "weightKg"
        | "heightCm"
        | "city"
        | "state"
      >
    >,
  ): Promise<PilotProfileApiDTO> {
    const res = await apiFetch<PilotProfileApiDTO>(
      v1ApiPaths.pilot.linkedPilotProfile(clientId),
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
    return unwrapApiResponse(res);
  },

  async updateMediaConsent(accepted: boolean): Promise<PilotAccountApiDTO> {
    const body: UpsertConsentRequest = {
      type: "image",
      status: accepted ? ConsentStatus.ACCEPTED : ConsentStatus.REVOKED,
      version: "1",
    };
    const res = await apiFetch<PilotAccountApiDTO>(v1ApiPaths.pilot.consents, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return unwrapApiResponse(res);
  },

  async revokeSession(sessionId: string): Promise<void> {
    const res = await apiFetch<{ ok: boolean }>(
      v1ApiPaths.pilot.sessionById(sessionId),
      { method: "DELETE" },
    );
    unwrapApiResponse(res);
  },

  async setLinkedPilotPassword(
    clientId: string,
    data: { newPassword: string; confirmPassword: string },
  ): Promise<void> {
    const res = await apiFetch<{ ok: boolean }>(
      v1ApiPaths.pilot.linkedPilotPassword(clientId),
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
    unwrapApiResponse(res);
  },
};
