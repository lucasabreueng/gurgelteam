-- CreateEnum
CREATE TYPE "CashFlowEntryType" AS ENUM ('entrada', 'saida');

-- CreateTable
CREATE TABLE "cash_flow_entries" (
    "id" UUID NOT NULL,
    "entry_date" DATE NOT NULL,
    "type" "CashFlowEntryType" NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "amount_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_flow_entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dre_entries" (
    "id" UUID NOT NULL,
    "account_code" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "group_key" TEXT NOT NULL,
    "row_kind" TEXT NOT NULL DEFAULT 'line',
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "amount_cents" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "dre_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "cash_flow_entries_entry_date_idx" ON "cash_flow_entries"("entry_date");
CREATE INDEX "dre_entries_year_month_idx" ON "dre_entries"("year", "month");
