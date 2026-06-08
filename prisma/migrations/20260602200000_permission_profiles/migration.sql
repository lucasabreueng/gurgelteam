-- Perfis de permissão (Configurações) e vínculo na equipe staff
ALTER TABLE "users" ADD COLUMN "permission_profile_id" TEXT;

ALTER TABLE "organization_settings" ADD COLUMN "permission_profiles" JSONB NOT NULL DEFAULT '{}';
