export async function requestElementFullscreen(element: HTMLElement): Promise<void> {
  const el = element as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void> | void;
  };

  if (el.requestFullscreen) {
    await el.requestFullscreen();
    return;
  }

  if (el.webkitRequestFullscreen) {
    await el.webkitRequestFullscreen();
  }
}

/** Equivalente programático ao F11 — fullscreen da janela inteira. */
export async function requestDocumentFullscreen(): Promise<void> {
  await requestElementFullscreen(document.documentElement);
}

export async function exitDocumentFullscreen(): Promise<void> {
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void> | void;
  };

  if (document.fullscreenElement) {
    await document.exitFullscreen();
    return;
  }

  if (doc.webkitExitFullscreen) {
    await doc.webkitExitFullscreen();
  }
}

export function getFullscreenElement(): Element | null {
  const doc = document as Document & { webkitFullscreenElement?: Element | null };
  return document.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

export function isElementFullscreen(element: HTMLElement | null): boolean {
  if (!element) return false;
  return getFullscreenElement() === element;
}
