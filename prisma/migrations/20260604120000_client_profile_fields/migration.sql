-- Campos de perfil do piloto (peso, altura, cidade, estado)
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "weight_kg" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "height_cm" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "clients" ADD COLUMN IF NOT EXISTS "state" TEXT;
