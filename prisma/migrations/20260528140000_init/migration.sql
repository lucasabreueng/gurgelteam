-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";
-- CreateEnum
CREATE TYPE "RoleKey" AS ENUM ('admin', 'recepcao', 'financeiro', 'mecanico');
-- CreateEnum
CREATE TYPE "ConsentType" AS ENUM ('terms', 'privacy', 'image');
-- CreateEnum
CREATE TYPE "ConsentStatus" AS ENUM ('ACCEPTED', 'REVOKED', 'PENDING');
-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('Ativo', 'Inativo');
-- CreateEnum
CREATE TYPE "ScheduleEventType" AS ENUM ('aula_individual', 'aula_grupo', 'treino_livre', 'treino_avancado', 'telemetria', 'manutencao', 'reserva_kart', 'bloqueio_pista');
-- CreateEnum
CREATE TYPE "ScheduleEventStatus" AS ENUM ('confirmado', 'pendente', 'em_andamento', 'finalizado', 'cancelado', 'reagendado', 'no_show', 'aguardando_pagamento');
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pago', 'pendente', 'vencido', 'pacote');
-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('aguardando', 'em_andamento', 'pendente_registro', 'concluida', 'cancelada');
-- CreateEnum
CREATE TYPE "KartOwnership" AS ENUM ('rental', 'client');
-- CreateEnum
CREATE TYPE "KartStatus" AS ENUM ('disponivel', 'em_treino', 'reservado', 'manutencao', 'aguardando_peca', 'indisponivel', 'preparacao', 'lavagem');
-- CreateEnum
CREATE TYPE "ReceivableStatus" AS ENUM ('pago', 'pendente', 'vencido', 'parcial');
-- CreateEnum
CREATE TYPE "PackageCreditStatus" AS ENUM ('ativo', 'expirando', 'esgotado');
-- CreateEnum
CREATE TYPE "SimpleMaintenanceStatus" AS ENUM ('pendente', 'em_andamento', 'concluida');
-- CreateEnum
CREATE TYPE "ChecklistFinalStatus" AS ENUM ('aprovado', 'aprovado_ressalvas', 'reprovado');
-- CreateEnum
CREATE TYPE "TelemetryStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'NORMALIZING', 'COMPLETED', 'FAILED');
-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('entrada', 'saida', 'ajuste', 'perda', 'devolucao');
-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('solicitado', 'aprovado', 'comprado', 'entregue');
-- CreateEnum
CREATE TYPE "ReportDomain" AS ENUM ('operacional', 'financeiro', 'auditoria');
-- CreateEnum
CREATE TYPE "ReportRunStatus" AS ENUM ('pending', 'processing', 'completed', 'failed');
-- CreateEnum
CREATE TYPE "ReportExportFormat" AS ENUM ('pdf', 'xlsx', 'csv');
-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "cpf" TEXT,
    "birth_date" DATE,
    "role_key" "RoleKey" NOT NULL,
    "client_id" UUID,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "remember_me" BOOLEAN NOT NULL DEFAULT false,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "password_resets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "code_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "consents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" "ConsentType" NOT NULL,
    "status" "ConsentStatus" NOT NULL,
    "version" TEXT NOT NULL,
    "accepted_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "avatar_url" TEXT,
    "skill_level_id" UUID NOT NULL,
    "status" "ClientStatus" NOT NULL DEFAULT 'Ativo',
    "is_minor" BOOLEAN NOT NULL DEFAULT false,
    "best_lap_ms" INTEGER,
    "consistency_pct" INTEGER,
    "total_sessions" INTEGER NOT NULL DEFAULT 0,
    "member_since" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "guardians" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "cpf" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "guardians_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "guardian_links" (
    "id" UUID NOT NULL,
    "guardian_id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "authorization_signed" BOOLEAN NOT NULL DEFAULT false,
    "documents_on_file" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "guardian_links_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "kart_categories" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price_per_lesson_cents" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "kart_categories_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "client_categories" (
    "client_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,
    CONSTRAINT "client_categories_pkey" PRIMARY KEY ("client_id","category_id")
);
-- CreateTable
CREATE TABLE "skill_levels" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "thresholds" JSONB NOT NULL DEFAULT '{}',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "skill_levels_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "schedule_events" (
    "id" UUID NOT NULL,
    "starts_at" TIMESTAMPTZ NOT NULL,
    "ends_at" TIMESTAMPTZ NOT NULL,
    "type" "ScheduleEventType" NOT NULL,
    "status" "ScheduleEventStatus" NOT NULL DEFAULT 'pendente',
    "client_id" UUID,
    "registered_by_id" UUID,
    "kart_id" UUID,
    "category_id" UUID,
    "payment_status" "PaymentStatus",
    "max_students" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "schedule_events_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "schedule_blocks" (
    "id" UUID NOT NULL,
    "block_date" DATE NOT NULL,
    "slot_ids" TEXT[],
    "reason" TEXT,
    "full_day" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "schedule_blocks_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "lesson_sessions" (
    "id" UUID NOT NULL,
    "schedule_event_id" UUID NOT NULL,
    "client_id" UUID,
    "status" "LessonStatus" NOT NULL DEFAULT 'aguardando',
    "category_label" TEXT NOT NULL,
    "type_label" TEXT NOT NULL,
    "registered_by_name" TEXT NOT NULL,
    "kart_number" INTEGER NOT NULL,
    "objective" TEXT,
    "previousNote" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "lesson_sessions_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "karts" (
    "id" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "category_id" UUID NOT NULL,
    "ownership" "KartOwnership" NOT NULL DEFAULT 'rental',
    "client_id" UUID,
    "status" "KartStatus" NOT NULL DEFAULT 'disponivel',
    "motor_ref" TEXT,
    "engine_hours" DECIMAL(8,2),
    "last_maintenance_at" DATE,
    "next_maintenance_hours" DECIMAL(8,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "karts_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "maintenance_orders" (
    "id" UUID NOT NULL,
    "kart_id" UUID NOT NULL,
    "status" "SimpleMaintenanceStatus" NOT NULL DEFAULT 'pendente',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "detected_at" TIMESTAMPTZ NOT NULL,
    "assigned_to" TEXT,
    "closed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "maintenance_orders_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "maintenance_part_uses" (
    "id" UUID NOT NULL,
    "maintenance_order_id" UUID NOT NULL,
    "inventory_part_id" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "notes" TEXT,
    CONSTRAINT "maintenance_part_uses_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "suppliers" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "avg_lead_days" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "inventory_parts" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "stock_qty" INTEGER NOT NULL DEFAULT 0,
    "min_stock_qty" INTEGER NOT NULL DEFAULT 0,
    "unit_cost_cents" INTEGER NOT NULL,
    "supplier_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "inventory_parts_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "stock_movements" (
    "id" UUID NOT NULL,
    "inventory_part_id" UUID NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "qty" INTEGER NOT NULL,
    "kart_id" UUID,
    "maintenance_id" UUID,
    "responsible_id" UUID,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'solicitado',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "purchase_order_lines" (
    "id" UUID NOT NULL,
    "purchase_order_id" UUID NOT NULL,
    "inventory_part_id" UUID NOT NULL,
    "qty" INTEGER NOT NULL,
    "unit_cost_cents" INTEGER NOT NULL,
    CONSTRAINT "purchase_order_lines_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "accounts_receivable" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "schedule_event_id" UUID,
    "amount_cents" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "ReceivableStatus" NOT NULL DEFAULT 'pendente',
    "payment_method" TEXT,
    "service_label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "accounts_receivable_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "accounts_payable" (
    "id" UUID NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "ReceivableStatus" NOT NULL DEFAULT 'pendente',
    "payment_method" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "accounts_payable_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "payments" (
    "id" UUID NOT NULL,
    "receivable_id" UUID NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "paid_at" TIMESTAMPTZ NOT NULL,
    "method" TEXT NOT NULL,
    "recorded_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "package_credits" (
    "id" UUID NOT NULL,
    "client_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "lessons_total" INTEGER NOT NULL,
    "lessons_used" INTEGER NOT NULL DEFAULT 0,
    "expires_at" DATE,
    "status" "PackageCreditStatus" NOT NULL DEFAULT 'ativo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "package_credits_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "telemetry_sessions" (
    "id" UUID NOT NULL,
    "client_id" UUID,
    "lesson_session_id" UUID,
    "status" "TelemetryStatus" NOT NULL DEFAULT 'UPLOADED',
    "source" TEXT NOT NULL,
    "track_id" TEXT,
    "raw_file_key" TEXT,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "telemetry_sessions_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "telemetry_laps" (
    "id" UUID NOT NULL,
    "telemetry_session_id" UUID NOT NULL,
    "lap_number" INTEGER NOT NULL,
    "lap_time_ms" INTEGER NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "sector_times_ms" JSONB,
    CONSTRAINT "telemetry_laps_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "organization_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "team_name" TEXT NOT NULL,
    "logo_url" TEXT,
    "cnpj" TEXT,
    "email" TEXT,
    "whatsapp" TEXT,
    "address" TEXT,
    "institutional_text" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "organization_settings_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "week_schedule_slots" (
    "id" UUID NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "category_id" UUID,
    "level_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "week_schedule_slots_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "module_permissions" (
    "user_id" UUID NOT NULL,
    "module_key" TEXT NOT NULL,
    "can_view" BOOLEAN NOT NULL DEFAULT false,
    "can_edit" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "module_permissions_pkey" PRIMARY KEY ("user_id","module_key")
);
-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" TEXT NOT NULL,
    "module_key" TEXT,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "report_runs" (
    "id" UUID NOT NULL,
    "definition_id" TEXT NOT NULL,
    "domain" "ReportDomain" NOT NULL,
    "period_from" DATE NOT NULL,
    "period_to" DATE NOT NULL,
    "export_format" "ReportExportFormat" NOT NULL,
    "status" "ReportRunStatus" NOT NULL DEFAULT 'pending',
    "file_key" TEXT,
    "error_message" TEXT,
    "generated_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    CONSTRAINT "report_runs_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
-- CreateIndex
CREATE UNIQUE INDEX "users_client_id_key" ON "users"("client_id");
-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");
-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");
-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");
-- CreateIndex
CREATE INDEX "password_resets_user_id_idx" ON "password_resets"("user_id");
-- CreateIndex
CREATE UNIQUE INDEX "consents_user_id_type_version_key" ON "consents"("user_id", "type", "version");
-- CreateIndex
CREATE INDEX "clients_status_idx" ON "clients"("status");
-- CreateIndex
CREATE INDEX "clients_skill_level_id_idx" ON "clients"("skill_level_id");
-- CreateIndex
CREATE UNIQUE INDEX "guardians_cpf_key" ON "guardians"("cpf");
-- CreateIndex
CREATE UNIQUE INDEX "guardian_links_guardian_id_client_id_key" ON "guardian_links"("guardian_id", "client_id");
-- CreateIndex
CREATE UNIQUE INDEX "kart_categories_slug_key" ON "kart_categories"("slug");
-- CreateIndex
CREATE UNIQUE INDEX "skill_levels_slug_key" ON "skill_levels"("slug");
-- CreateIndex
CREATE INDEX "schedule_events_starts_at_idx" ON "schedule_events"("starts_at");
-- CreateIndex
CREATE INDEX "schedule_events_status_idx" ON "schedule_events"("status");
-- CreateIndex
CREATE INDEX "schedule_events_client_id_idx" ON "schedule_events"("client_id");
-- CreateIndex
CREATE INDEX "schedule_events_kart_id_idx" ON "schedule_events"("kart_id");
-- CreateIndex
CREATE INDEX "schedule_blocks_block_date_idx" ON "schedule_blocks"("block_date");
-- CreateIndex
CREATE UNIQUE INDEX "lesson_sessions_schedule_event_id_key" ON "lesson_sessions"("schedule_event_id");
-- CreateIndex
CREATE INDEX "lesson_sessions_status_idx" ON "lesson_sessions"("status");
-- CreateIndex
CREATE INDEX "lesson_sessions_client_id_idx" ON "lesson_sessions"("client_id");
-- CreateIndex
CREATE UNIQUE INDEX "karts_number_key" ON "karts"("number");
-- CreateIndex
CREATE INDEX "karts_status_idx" ON "karts"("status");
-- CreateIndex
CREATE INDEX "karts_category_id_idx" ON "karts"("category_id");
-- CreateIndex
CREATE INDEX "maintenance_orders_kart_id_idx" ON "maintenance_orders"("kart_id");
-- CreateIndex
CREATE INDEX "maintenance_orders_status_idx" ON "maintenance_orders"("status");
-- CreateIndex
CREATE UNIQUE INDEX "suppliers_code_key" ON "suppliers"("code");
-- CreateIndex
CREATE UNIQUE INDEX "inventory_parts_code_key" ON "inventory_parts"("code");
-- CreateIndex
CREATE INDEX "inventory_parts_supplier_id_idx" ON "inventory_parts"("supplier_id");
-- CreateIndex
CREATE INDEX "stock_movements_inventory_part_id_idx" ON "stock_movements"("inventory_part_id");
-- CreateIndex
CREATE INDEX "stock_movements_created_at_idx" ON "stock_movements"("created_at");
-- CreateIndex
CREATE INDEX "purchase_orders_supplier_id_idx" ON "purchase_orders"("supplier_id");
-- CreateIndex
CREATE INDEX "accounts_receivable_client_id_idx" ON "accounts_receivable"("client_id");
-- CreateIndex
CREATE INDEX "accounts_receivable_status_idx" ON "accounts_receivable"("status");
-- CreateIndex
CREATE INDEX "accounts_receivable_due_date_idx" ON "accounts_receivable"("due_date");
-- CreateIndex
CREATE INDEX "accounts_payable_status_idx" ON "accounts_payable"("status");
-- CreateIndex
CREATE INDEX "accounts_payable_due_date_idx" ON "accounts_payable"("due_date");
-- CreateIndex
CREATE INDEX "payments_receivable_id_idx" ON "payments"("receivable_id");
-- CreateIndex
CREATE INDEX "payments_paid_at_idx" ON "payments"("paid_at");
-- CreateIndex
CREATE INDEX "package_credits_client_id_idx" ON "package_credits"("client_id");
-- CreateIndex
CREATE INDEX "package_credits_status_idx" ON "package_credits"("status");
-- CreateIndex
CREATE UNIQUE INDEX "telemetry_sessions_lesson_session_id_key" ON "telemetry_sessions"("lesson_session_id");
-- CreateIndex
CREATE INDEX "telemetry_sessions_client_id_idx" ON "telemetry_sessions"("client_id");
-- CreateIndex
CREATE INDEX "telemetry_sessions_status_idx" ON "telemetry_sessions"("status");
-- CreateIndex
CREATE UNIQUE INDEX "telemetry_laps_telemetry_session_id_lap_number_key" ON "telemetry_laps"("telemetry_session_id", "lap_number");
-- CreateIndex
CREATE INDEX "week_schedule_slots_day_of_week_idx" ON "week_schedule_slots"("day_of_week");
-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");
-- CreateIndex
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs"("actor_id");
-- CreateIndex
CREATE INDEX "report_runs_status_idx" ON "report_runs"("status");
-- CreateIndex
CREATE INDEX "report_runs_generated_by_id_idx" ON "report_runs"("generated_by_id");
-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "password_resets" ADD CONSTRAINT "password_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_skill_level_id_fkey" FOREIGN KEY ("skill_level_id") REFERENCES "skill_levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "guardian_links" ADD CONSTRAINT "guardian_links_guardian_id_fkey" FOREIGN KEY ("guardian_id") REFERENCES "guardians"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "guardian_links" ADD CONSTRAINT "guardian_links_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "client_categories" ADD CONSTRAINT "client_categories_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "client_categories" ADD CONSTRAINT "client_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "kart_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "schedule_events" ADD CONSTRAINT "schedule_events_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "schedule_events" ADD CONSTRAINT "schedule_events_registered_by_id_fkey" FOREIGN KEY ("registered_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "schedule_events" ADD CONSTRAINT "schedule_events_kart_id_fkey" FOREIGN KEY ("kart_id") REFERENCES "karts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "lesson_sessions" ADD CONSTRAINT "lesson_sessions_schedule_event_id_fkey" FOREIGN KEY ("schedule_event_id") REFERENCES "schedule_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "lesson_sessions" ADD CONSTRAINT "lesson_sessions_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "karts" ADD CONSTRAINT "karts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "kart_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "karts" ADD CONSTRAINT "karts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "maintenance_orders" ADD CONSTRAINT "maintenance_orders_kart_id_fkey" FOREIGN KEY ("kart_id") REFERENCES "karts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "maintenance_part_uses" ADD CONSTRAINT "maintenance_part_uses_maintenance_order_id_fkey" FOREIGN KEY ("maintenance_order_id") REFERENCES "maintenance_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "maintenance_part_uses" ADD CONSTRAINT "maintenance_part_uses_inventory_part_id_fkey" FOREIGN KEY ("inventory_part_id") REFERENCES "inventory_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "inventory_parts" ADD CONSTRAINT "inventory_parts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_inventory_part_id_fkey" FOREIGN KEY ("inventory_part_id") REFERENCES "inventory_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "purchase_order_lines" ADD CONSTRAINT "purchase_order_lines_inventory_part_id_fkey" FOREIGN KEY ("inventory_part_id") REFERENCES "inventory_parts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "accounts_receivable" ADD CONSTRAINT "accounts_receivable_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "accounts_receivable" ADD CONSTRAINT "accounts_receivable_schedule_event_id_fkey" FOREIGN KEY ("schedule_event_id") REFERENCES "schedule_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_receivable_id_fkey" FOREIGN KEY ("receivable_id") REFERENCES "accounts_receivable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "package_credits" ADD CONSTRAINT "package_credits_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "telemetry_sessions" ADD CONSTRAINT "telemetry_sessions_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "telemetry_sessions" ADD CONSTRAINT "telemetry_sessions_lesson_session_id_fkey" FOREIGN KEY ("lesson_session_id") REFERENCES "lesson_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "telemetry_laps" ADD CONSTRAINT "telemetry_laps_telemetry_session_id_fkey" FOREIGN KEY ("telemetry_session_id") REFERENCES "telemetry_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "module_permissions" ADD CONSTRAINT "module_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "report_runs" ADD CONSTRAINT "report_runs_generated_by_id_fkey" FOREIGN KEY ("generated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
