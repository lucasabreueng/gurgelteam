-- Reserva de username durante confirmação de cadastro
DELETE FROM "pending_registrations";

ALTER TABLE "pending_registrations"
ADD COLUMN "reserved_username" TEXT NOT NULL;

CREATE UNIQUE INDEX "pending_registrations_reserved_username_key"
ON "pending_registrations"("reserved_username");
