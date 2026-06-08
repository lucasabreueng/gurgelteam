import type { OrganizationSettings } from "@prisma/client";

import type { OrganizationSettingsApiDTO } from "@/lib/contracts/api/v1/settings.api.schemas";
import { prisma } from "@/lib/server/prisma";

export function mapOrganizationSettingsToApi(
  row: OrganizationSettings,
): OrganizationSettingsApiDTO {
    return {
      teamName: row.teamName,
      logoUrl: row.logoUrl,
      cnpj: row.cnpj,
      email: row.email,
      whatsapp: row.whatsapp,
      address: row.address,
      instagram: row.instagram,
      tiktok: row.tiktok,
      facebook: row.facebook,
      institutionalText: row.institutionalText,
    };
}

export const settingsRepository = {
  async getOrganization(): Promise<OrganizationSettingsApiDTO> {
    const row = await prisma.organizationSettings.findUnique({
      where: { id: "default" },
    });
    if (!row) {
      return {
        teamName: "Gurgel Team",
        logoUrl: null,
        cnpj: null,
        email: null,
        whatsapp: null,
        address: null,
        institutionalText: null,
      };
    }
    return mapOrganizationSettingsToApi(row);
  },

  async updateOrganization(
    data: Partial<OrganizationSettingsApiDTO>,
  ): Promise<OrganizationSettingsApiDTO> {
    const row = await prisma.organizationSettings.upsert({
      where: { id: "default" },
      update: {
        ...(data.teamName !== undefined ? { teamName: data.teamName } : {}),
        ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
        ...(data.cnpj !== undefined ? { cnpj: data.cnpj } : {}),
        ...(data.email !== undefined ? { email: data.email } : {}),
        ...(data.whatsapp !== undefined ? { whatsapp: data.whatsapp } : {}),
        ...(data.address !== undefined ? { address: data.address } : {}),
        ...(data.institutionalText !== undefined
          ? { institutionalText: data.institutionalText }
          : {}),
        ...(data.instagram !== undefined ? { instagram: data.instagram } : {}),
        ...(data.tiktok !== undefined ? { tiktok: data.tiktok } : {}),
        ...(data.facebook !== undefined ? { facebook: data.facebook } : {}),
      },
      create: {
        id: "default",
        teamName: data.teamName ?? "Gurgel Team",
        logoUrl: data.logoUrl ?? null,
        cnpj: data.cnpj ?? null,
        email: data.email ?? null,
        whatsapp: data.whatsapp ?? null,
        address: data.address ?? null,
        instagram: data.instagram ?? null,
        tiktok: data.tiktok ?? null,
        facebook: data.facebook ?? null,
        institutionalText: data.institutionalText ?? null,
      },
    });
    return mapOrganizationSettingsToApi(row);
  },
};
