-- Preferências de UI (integrações e aparência) em organization_settings
ALTER TABLE "organization_settings"
ADD COLUMN IF NOT EXISTS "integrations" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS "appearance" JSONB NOT NULL DEFAULT '{}';
