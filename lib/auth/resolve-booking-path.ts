import type { AuthUserDTO } from "@/lib/contracts/api/v1/auth.api.schemas";
import { BOOKING_AFTER_LOGIN_PATH } from "@/lib/landing/booking";

export function resolveBookingPath(
  user: Pick<AuthUserDTO, "clientId">,
): string {
  return user.clientId ? BOOKING_AFTER_LOGIN_PATH : "/admin";
}
