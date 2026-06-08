import type { ActiveSession } from "@/lib/student-profile-mocks";
import {
  HiComputerDesktop,
  HiDevicePhoneMobile,
  HiDeviceTablet,
} from "react-icons/hi2";
import type { IconType } from "react-icons";

export type SessionDeviceKind = "desktop" | "mobile" | "tablet";

export function resolveSessionDeviceKind(
  session: ActiveSession,
): SessionDeviceKind {
  if (session.deviceKind) return session.deviceKind;
  const label = session.device.toLowerCase();
  if (
    label.includes("iphone") ||
    label.includes("android") ||
    label.includes("mobile")
  ) {
    return "mobile";
  }
  if (label.includes("ipad") || label.includes("tablet")) {
    return "tablet";
  }
  return "desktop";
}

export function resolveSessionBrowser(session: ActiveSession): string {
  if (session.browser?.trim()) return session.browser.trim();
  const parts = session.device.split("·").map((p) => p.trim());
  if (parts.length >= 2) return parts[0];
  if (/chrome|safari|firefox|edge/i.test(session.device)) {
    return session.device.match(/chrome|safari|firefox|edge/i)?.[0] ?? "Navegador";
  }
  return "Navegador";
}

export function resolveSessionDeviceLabel(session: ActiveSession): string {
  const kind = resolveSessionDeviceKind(session);
  if (kind === "mobile") {
    if (/iphone/i.test(session.device)) return "iPhone";
    if (/android/i.test(session.device)) return "Android";
    return "Celular";
  }
  if (kind === "tablet") return "iPad";
  const parts = session.device.split("·").map((p) => p.trim());
  if (parts.length >= 2) return parts[1];
  return session.device || "Dispositivo";
}

export function getSessionDeviceIcon(kind: SessionDeviceKind): IconType {
  if (kind === "mobile") return HiDevicePhoneMobile;
  if (kind === "tablet") return HiDeviceTablet;
  return HiComputerDesktop;
}
