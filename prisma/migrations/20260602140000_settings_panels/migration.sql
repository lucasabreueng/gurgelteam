-- Configurações: preços (included_items), notificações, documentos, termos, redes sociais
ALTER TABLE "kart_categories" ADD COLUMN IF NOT EXISTS "included_items" TEXT;

ALTER TABLE "organization_settings" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
ALTER TABLE "organization_settings" ADD COLUMN IF NOT EXISTS "tiktok" TEXT;
ALTER TABLE "organization_settings" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
ALTER TABLE "organization_settings" ADD COLUMN IF NOT EXISTS "notification_events" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "organization_settings" ADD COLUMN IF NOT EXISTS "document_templates" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "organization_settings" ADD COLUMN IF NOT EXISTS "terms_registry" JSONB NOT NULL DEFAULT '{}';
