-- Preferências, emergência e número favorito do piloto
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "notify_whatsapp" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "notify_email" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "emergency_name" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "emergency_phone" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "emergency_relation" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "favorite_number" TEXT;
