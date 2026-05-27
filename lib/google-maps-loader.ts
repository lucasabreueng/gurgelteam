const SCRIPT_ID = "gurgel-google-maps-script";
const CALLBACK_NAME = "__gurgelGoogleMapsInit";

let loadPromise: Promise<typeof google.maps> | null = null;

export function getGoogleMapsApiKey(): string | undefined {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || undefined;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(getGoogleMapsApiKey());
}

function isMapsReady(): boolean {
  return Boolean(
    typeof window !== "undefined" &&
      window.google?.maps?.Map &&
      window.google?.maps?.LatLngBounds,
  );
}

function createLoadPromise(): Promise<typeof google.maps> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps só está disponível no browser."));
  }

  if (isMapsReady()) {
    return Promise.resolve(window.google!.maps);
  }

  const key = getGoogleMapsApiKey();
  if (!key) {
    return Promise.reject(
      new Error(
        "Configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no .env.local e reinicie o servidor (npm run dev).",
      ),
    );
  }

  const existing = document.getElementById(SCRIPT_ID);
  if (existing && isMapsReady()) {
    return Promise.resolve(window.google!.maps);
  }

  return new Promise((resolve, reject) => {
    const win = window as unknown as Record<string, unknown>;

    win[CALLBACK_NAME] = () => {
      delete win[CALLBACK_NAME];
      if (isMapsReady()) {
        resolve(window.google!.maps);
      } else {
        reject(new Error("Google Maps carregou mas a API não ficou disponível."));
      }
    };

    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=${CALLBACK_NAME}&v=weekly`;
    script.onerror = () => {
      delete win[CALLBACK_NAME];
      reject(
        new Error(
          "Falha ao carregar Google Maps. Verifique a chave e se a Maps JavaScript API está ativa.",
        ),
      );
    };
    document.head.appendChild(script);
  });
}

/** Carrega a API completa via callback (evita MapTypeId undefined com loading=async). */
export function loadGoogleMaps(): Promise<typeof google.maps> {
  if (isMapsReady()) {
    return Promise.resolve(window.google!.maps);
  }

  if (!loadPromise) {
    loadPromise = createLoadPromise().catch((err) => {
      loadPromise = null;
      throw err;
    });
  }

  return loadPromise;
}

export const MAP_TYPE = {
  satellite: "satellite",
  roadmap: "roadmap",
} as const;

export const MARKER_CIRCLE_PATH = 0;
