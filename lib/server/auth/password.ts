import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const hash = scryptSync(password, salt, KEY_LENGTH);
  return `scrypt:${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [prefix, saltHex, hashHex] = storedHash.split(":");
  if (prefix !== "scrypt" || !saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, salt, KEY_LENGTH);

  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}
