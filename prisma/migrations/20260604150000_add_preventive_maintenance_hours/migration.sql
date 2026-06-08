-- Horas da última manutenção preventiva por tipo (óleo, corrente, etc.)
ALTER TABLE "karts" ADD COLUMN IF NOT EXISTS "preventive_maintenance_hours" JSONB;
