import type { SessionDeviceKind } from "@/lib/student-profile-mocks";

export type ParsedUserAgent = {
  deviceKind: SessionDeviceKind;
  device: string;
  browser: string;
};

export function parseSessionUserAgent(
  userAgent: string | null | undefined,
): ParsedUserAgent {
  const ua = (userAgent ?? "").toLowerCase();

  if (/ipad|tablet/.test(ua)) {
    const browser = /crios/.test(ua)
      ? "Chrome"
      : /fxios/.test(ua)
        ? "Firefox"
        : /safari/.test(ua)
          ? "Safari"
          : "Navegador";
    return { deviceKind: "tablet", device: "iPad", browser };
  }

  if (/iphone|android|mobile/.test(ua)) {
    const device = /iphone/.test(ua)
      ? "iPhone"
      : /android/.test(ua)
        ? "Android"
        : "Celular";
    const browser = /crios/.test(ua)
      ? "Chrome"
      : /fxios/.test(ua)
        ? "Firefox"
        : /safari/.test(ua) && !/chrome/.test(ua)
          ? "Safari"
          : /chrome/.test(ua)
            ? "Chrome"
            : "Navegador";
    return { deviceKind: "mobile", device, browser };
  }

  let browser = "Navegador";
  if (/edg\//.test(ua)) browser = "Edge";
  else if (/chrome\//.test(ua) && !/edg\//.test(ua)) browser = "Chrome";
  else if (/firefox\//.test(ua)) browser = "Firefox";
  else if (/safari\//.test(ua)) browser = "Safari";

  let device = "Desktop";
  if (/windows/.test(ua)) device = "Windows";
  else if (/mac os|macintosh/.test(ua)) device = "Mac";
  else if (/linux/.test(ua)) device = "Linux";

  return { deviceKind: "desktop", device, browser };
}
