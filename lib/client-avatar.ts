export const CLIENT_AVATAR_FALLBACK = "/images/team-4.png";

export function resolveClientAvatarUrl(url?: string | null): string {
  const trimmed = url?.trim();
  return trimmed ? trimmed : CLIENT_AVATAR_FALLBACK;
}
