-- CreateTable
CREATE TABLE "specific_date_schedules" (
    "id" UUID NOT NULL,
    "schedule_date" DATE NOT NULL,

    CONSTRAINT "specific_date_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "specific_date_schedule_slots" (
    "id" UUID NOT NULL,
    "schedule_id" UUID NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "category_id" UUID,
    "level_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "specific_date_schedule_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule_exceptions" (
    "id" UUID NOT NULL,
    "exception_date" DATE NOT NULL,
    "slot_ids" TEXT[],
    "reason" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "schedule_exceptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specific_date_schedules_schedule_date_key" ON "specific_date_schedules"("schedule_date");

-- CreateIndex
CREATE INDEX "specific_date_schedule_slots_schedule_id_idx" ON "specific_date_schedule_slots"("schedule_id");

-- CreateIndex
CREATE INDEX "schedule_exceptions_exception_date_idx" ON "schedule_exceptions"("exception_date");

-- AddForeignKey
ALTER TABLE "specific_date_schedule_slots" ADD CONSTRAINT "specific_date_schedule_slots_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "specific_date_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
