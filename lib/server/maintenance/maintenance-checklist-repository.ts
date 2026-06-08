import { prisma } from "@/lib/server/prisma";
import {
  CHECKLIST_TYPES,
  DIAGRAM_ZONES,
  INSPECTION_SECTIONS,
  KART_DIAGRAM_VIEWS,
  OVERALL_STATUS_LABELS,
} from "@/lib/admin-checklist-mocks";

export const maintenanceChecklistRepository = {
  getTemplate() {
    return {
      types: CHECKLIST_TYPES,
      sections: INSPECTION_SECTIONS,
      diagramViews: KART_DIAGRAM_VIEWS,
      diagramZones: DIAGRAM_ZONES,
      overallStatusLabels: OVERALL_STATUS_LABELS,
    };
  },

  async getOrderChecklist(orderId: string) {
    const order = await prisma.maintenanceOrder.findUnique({
      where: { id: orderId },
      include: { kart: { include: { category: true } } },
    });
    if (!order) return null;
    return {
      orderId: order.id,
      kartId: order.kartId,
      kartNumber: order.kart.number,
      checklistData: order.checklistData,
    };
  },

  async saveOrderChecklist(orderId: string, checklistData: unknown) {
    const order = await prisma.maintenanceOrder.update({
      where: { id: orderId },
      data: { checklistData: checklistData as object },
    });
    return { orderId: order.id, checklistData: order.checklistData };
  },
};
