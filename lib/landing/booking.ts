/** Destino após login para fluxo de agendamento na landing. */
export const BOOKING_AFTER_LOGIN_PATH = "/piloto/reservar";

export const BOOKING_LOGIN_PATH = `/login?next=${encodeURIComponent(BOOKING_AFTER_LOGIN_PATH)}`;
