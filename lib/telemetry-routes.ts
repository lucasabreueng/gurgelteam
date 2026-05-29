export type TelemetryArea = "piloto" | "admin";

export const TELEMETRY_ROUTES = {
  piloto: {
    base: "/piloto/telemetria",
    setores: "/piloto/telemetria/setores",
  },
  admin: {
    base: "/admin/telemetria",
    setores: "/admin/telemetria/setores",
  },
} as const satisfies Record<TelemetryArea, { base: string; setores: string }>;

export function getTelemetryAreaFromPathname(
  pathname: string,
): TelemetryArea | null {
  if (pathname.startsWith(TELEMETRY_ROUTES.admin.base)) return "admin";
  if (pathname.startsWith(TELEMETRY_ROUTES.piloto.base)) return "piloto";
  return null;
}

export function getTelemetryRoutes(pathname: string) {
  const area = getTelemetryAreaFromPathname(pathname);
  return area ? TELEMETRY_ROUTES[area] : TELEMETRY_ROUTES.piloto;
}

export function isTelemetryLightPage(pathname: string): boolean {
  return getTelemetryAreaFromPathname(pathname) !== null;
}
