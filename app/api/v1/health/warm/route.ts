import { NextResponse } from "next/server";

import { prisma } from "@/lib/server/prisma";
import { loadDashboardPageData } from "@/lib/server/pages/load-dashboard-page";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/health/warm
 * Mantém funções serverless aquecidas (cron externo a cada 5 min).
 * Opcional: proteger com CRON_SECRET via header Authorization: Bearer ...
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const [dbPing] = await Promise.all([
      prisma.$queryRaw`SELECT 1 as ok`,
      loadDashboardPageData().catch(() => null),
    ]);

    return NextResponse.json({
      ok: true,
      warmedAt: new Date().toISOString(),
      db: Boolean(dbPing),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Warm-up failed";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
