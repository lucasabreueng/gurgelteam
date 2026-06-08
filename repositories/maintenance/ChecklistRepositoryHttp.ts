import { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
import { v1ApiPaths } from "@/lib/api/v1-api-paths";
import type { OverallInspectionStatus } from "@/lib/contracts/maintenance";
import type { InspectionSectionDef } from "@/lib/contracts/maintenance";

export type ChecklistTemplateDTO = {
  types: { key: string; label: string }[];
  sections: InspectionSectionDef[];
  diagramViews: { key: "frente" | "lateral" | "traseira"; label: string }[];
  diagramZones: Record<"frente" | "lateral" | "traseira", string[]>;
  overallStatusLabels: Record<OverallInspectionStatus, string>;
};

export const ChecklistRepositoryHttp = {
  async getTemplate(): Promise<ChecklistTemplateDTO> {
    const res = await apiFetch<ChecklistTemplateDTO>(
      v1ApiPaths.maintenance.checklistTemplate,
    );
    return unwrapApiResponse(res);
  },

  async getOrderChecklist(orderId: string) {
    const res = await apiFetch<{
      orderId: string;
      kartId: string;
      kartNumber: number;
      checklistData: unknown;
    }>(v1ApiPaths.maintenance.orderChecklist(orderId));
    return unwrapApiResponse(res);
  },

  async saveOrderChecklist(orderId: string, checklistData: unknown) {
    const res = await apiFetch<unknown>(
      v1ApiPaths.maintenance.orderChecklist(orderId),
      { method: "PUT", body: JSON.stringify({ checklistData }) },
    );
    return unwrapApiResponse(res);
  },

  async getContext() {
    const res = await apiFetch<{
      smartAlerts: { id: string; message: string; severity: string }[];
      history: {
        id: string;
        date: string;
        responsible: string;
        result: string;
        photos: number;
        notes: string;
      }[];
    }>(v1ApiPaths.maintenance.checklistContext);
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
    }>(v1ApiPaths.maintenance.checklistMedia, {
      method: "POST",
      body: formData,
    });
    return unwrapApiResponse(res);
  },
};
