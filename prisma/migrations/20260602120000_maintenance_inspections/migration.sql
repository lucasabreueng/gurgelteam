ALTER TABLE "maintenance_orders" ADD COLUMN IF NOT EXISTS "checklist_data" JSONB;

CREATE TABLE IF NOT EXISTS "maintenance_inspections" (
    "id" UUID NOT NULL,
    "kart_id" UUID NOT NULL,
    "maintenance_order_id" UUID,
    "checklist_type" TEXT NOT NULL DEFAULT 'pre',
    "payload" JSONB NOT NULL,
    "overall_status" TEXT,
    "signed_by" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "maintenance_inspections_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "maintenance_inspections_kart_id_idx" ON "maintenance_inspections"("kart_id");
CREATE INDEX IF NOT EXISTS "maintenance_inspections_maintenance_order_id_idx" ON "maintenance_inspections"("maintenance_order_id");

ALTER TABLE "maintenance_inspections" ADD CONSTRAINT "maintenance_inspections_kart_id_fkey" FOREIGN KEY ("kart_id") REFERENCES "karts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "maintenance_inspections" ADD CONSTRAINT "maintenance_inspections_maintenance_order_id_fkey" FOREIGN KEY ("maintenance_order_id") REFERENCES "maintenance_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
