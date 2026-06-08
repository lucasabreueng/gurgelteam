-- AlterTable: lesson registration payload (Fase 5)
ALTER TABLE "lesson_sessions" ADD COLUMN IF NOT EXISTS "registration_payload" JSONB;
