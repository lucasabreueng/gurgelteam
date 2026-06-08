import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { DiagramZoneKey } from "@/lib/contracts/maintenance";

export type InspectionTemplateDTO = {
  typeOptions: unknown[];
  modules: unknown[];
  diagramZones: Record<DiagramZoneKey, string[]>;
  generalConditionMeta: unknown;
  signatureStaff: unknown;
  technicalTimeline: unknown[];
  mockDiagnosis: unknown;
};

export const InspectionRepositoryHttp = {
  async getTemplate(): Promise<InspectionTemplateDTO> {
    const res = await apiFetch<InspectionTemplateDTO>(
      v1ApiPaths.maintenance.inspectionTemplate,
    );
    return unwrapApiResponse(res);
  },

  async list(params?: { kartId?: string }) {
    const qs = params?.kartId ? `?kartId=${encodeURIComponent(params.kartId)}` : "";
    const res = await apiFetch<unknown[]>(
      `${v1ApiPaths.maintenance.inspections}${qs}`,
    );
    return unwrapApiResponse(res);
  },

  async uploadMedia(file: File, label?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (label) formData.append("label", label);
    const res = await apiFetch<{
      id: string;
      label: string;
      type: "foto" | "video";
      url: string;
    }>(v1ApiPaths.maintenance.inspectionMedia, {
      method: "POST",
      body: formData,
    });
    return unwrapApiResponse(res);
  },

  async create(payload: {
    kartId: string;
    maintenanceOrderId?: string;
    checklistType?: string;
    payload: unknown;
    overallStatus?: string;
    signedBy?: string;
  }) {
    const res = await apiFetch<unknown>(v1ApiPaths.maintenance.inspections, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return unwrapApiResponse(res);
  },
};
