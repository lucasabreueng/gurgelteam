function uuidV4Fallback(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function cryptoRandomUUIDBroken(cryptoObj: Crypto): boolean {
  if (typeof cryptoObj.randomUUID !== "function") return true;
  try {
    cryptoObj.randomUUID();
    return false;
  } catch {
    return true;
  }
}

let polyfillApplied = false;

/** Garante `crypto.randomUUID` em Safari/iPad e contextos HTTP locais. */
export function ensureCryptoRandomUUIDPolyfill(): void {
  if (polyfillApplied || typeof globalThis === "undefined") return;

  const cryptoObj = globalThis.crypto;
  if (!cryptoObj) return;

  if (!cryptoRandomUUIDBroken(cryptoObj)) {
    polyfillApplied = true;
    return;
  }

  const patch = uuidV4Fallback as Crypto["randomUUID"];

  try {
    Object.defineProperty(cryptoObj, "randomUUID", {
      configurable: true,
      writable: true,
      value: patch,
    });
  } catch {
    (cryptoObj as { randomUUID: Crypto["randomUUID"] }).randomUUID = patch;
  }

  polyfillApplied = true;
}

/** UUID v4 — usa `crypto.randomUUID` quando disponível, com fallback seguro. */
export function randomUUID(): string {
  ensureCryptoRandomUUIDPolyfill();

  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    try {
      return cryptoObj.randomUUID();
    } catch {
      return uuidV4Fallback();
    }
  }

  return uuidV4Fallback();
}

/** Identificador curto opcionalmente prefixado (ex.: `job-a1b2c3d4`). */
export function randomId(prefix?: string): string {
  const id = randomUUID().replace(/-/g, "").slice(0, 8);
  return prefix ? `${prefix}-${id}` : id;
}

ensureCryptoRandomUUIDPolyfill();
