import type { KartAlert, PaddockBox } from "@/lib/admin-karts-mocks";
import type { KartStatus } from "@/lib/contracts/enums";
import { prisma } from "@/lib/server/prisma";

const PADDOCK_SLOTS = ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4"] as const;

export async function buildKartsPaddock(): Promise<{
  alerts: KartAlert[];
  boxes: PaddockBox[];
}> {
  const [karts, openOrders] = await Promise.all([
    prisma.kart.findMany({
      orderBy: { number: "asc" },
      select: { id: true, number: true, status: true },
    }),
    prisma.maintenanceOrder.findMany({
      where: { status: { not: "concluida" } },
      include: { kart: { select: { number: true } } },
      orderBy: { detectedAt: "desc" },
      take: 10,
    }),
  ]);

  const alerts: KartAlert[] = [];

  for (const order of openOrders.slice(0, 4)) {
    const num = order.kart.number;
    alerts.push({
      id: `os-${order.id}`,
      message: `OS aberta: ${order.title}`,
      severity: order.status === "pendente" ? "urgent" : "warn",
      kartNumber: num,
    });
  }

  for (const kart of karts) {
    if (kart.status === "manutencao" || kart.status === "aguardando_peca") {
      alerts.push({
        id: `status-${kart.id}`,
        message:
          kart.status === "manutencao"
            ? `Kart ${kart.number} em manutenção`
            : `Kart ${kart.number} aguardando peça`,
        severity: "warn",
        kartNumber: kart.number,
      });
    }
    if (kart.status === "indisponivel") {
      alerts.push({
        id: `ind-${kart.id}`,
        message: `Kart ${kart.number} indisponível`,
        severity: "info",
        kartNumber: kart.number,
      });
    }
  }

  const boxes: PaddockBox[] = PADDOCK_SLOTS.map((slot, index) => {
    const kart = karts[index];
    if (!kart) {
      return { slot, status: "empty" as const };
    }
    return {
      slot,
      kartId: kart.id,
      status: kart.status as KartStatus,
    };
  });

  return {
    alerts: alerts.slice(0, 8),
    boxes,
  };
}
