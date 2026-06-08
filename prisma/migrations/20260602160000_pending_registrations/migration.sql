-- Cadastros pendentes de confirmação por e-mail (sem User/Client até verificar código)
CREATE TABLE "pending_registrations" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "birth_date" DATE NOT NULL,
    "skill_level_id" UUID NOT NULL,
    "category_ids" JSONB NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pending_registrations_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "pending_registrations_email_key" ON "pending_registrations"("email");
CREATE UNIQUE INDEX "pending_registrations_cpf_key" ON "pending_registrations"("cpf");
CREATE INDEX "pending_registrations_expires_at_idx" ON "pending_registrations"("expires_at");
