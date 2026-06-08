-- Horários: categoria e nível passam a ser arrays (seleção múltipla).

ALTER TABLE "week_schedule_slots"
ADD COLUMN "category_ids" UUID[] NOT NULL DEFAULT '{}',
ADD COLUMN "level_ids" UUID[] NOT NULL DEFAULT '{}';

UPDATE "week_schedule_slots"
SET "category_ids" = ARRAY["category_id"]::UUID[]
WHERE "category_id" IS NOT NULL;

UPDATE "week_schedule_slots"
SET "level_ids" = ARRAY["level_id"]::UUID[]
WHERE "level_id" IS NOT NULL;

ALTER TABLE "week_schedule_slots"
DROP COLUMN "category_id",
DROP COLUMN "level_id";

ALTER TABLE "specific_date_schedule_slots"
ADD COLUMN "category_ids" UUID[] NOT NULL DEFAULT '{}',
ADD COLUMN "level_ids" UUID[] NOT NULL DEFAULT '{}';

UPDATE "specific_date_schedule_slots"
SET "category_ids" = ARRAY["category_id"]::UUID[]
WHERE "category_id" IS NOT NULL;

UPDATE "specific_date_schedule_slots"
SET "level_ids" = ARRAY["level_id"]::UUID[]
WHERE "level_id" IS NOT NULL;

ALTER TABLE "specific_date_schedule_slots"
DROP COLUMN "category_id",
DROP COLUMN "level_id";
