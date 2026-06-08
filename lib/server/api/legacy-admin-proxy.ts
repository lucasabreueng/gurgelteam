import { NextResponse } from "next/server";

/** Cabeçalhos RFC 8594 — rotas `/api/admin/*` delegam para `/api/v1/*`. */
export const LEGACY_ADMIN_SUNSET = "Sun, 01 Sep 2026 00:00:00 GMT";

export function applyLegacyAdminHeaders(
  response: NextResponse,
  successorPath: string,
): NextResponse {
  response.headers.set("Deprecation", "true");
  response.headers.set("Sunset", LEGACY_ADMIN_SUNSET);
  response.headers.set("Link", `<${successorPath}>; rel="successor-version"`);
  return response;
}

export function legacyAdminJsonSuccess<T>(
  data: T,
  successorPath: string,
  status = 200,
): NextResponse {
  return applyLegacyAdminHeaders(
    NextResponse.json({ success: true, data }, { status }),
    successorPath,
  );
}

export function legacyAdminJsonError(
  error: { code: string; message: string; httpStatus?: number },
  successorPath: string,
): NextResponse {
  const status = error.httpStatus ?? 500;
  return applyLegacyAdminHeaders(
    NextResponse.json({ success: false, error }, { status }),
    successorPath,
  );
}
