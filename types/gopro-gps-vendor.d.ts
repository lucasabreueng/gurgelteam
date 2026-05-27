export type GoproGpsVendorApi = {
  gpmfExtract: (
    file: File,
    options?: {
      browserMode?: boolean;
      useWorker?: boolean;
      progress?: (percent: number) => void;
    },
  ) => Promise<{ rawData: Uint8Array; timing: unknown }>;
  goproTelemetry: (
    input: { rawData: Uint8Array; timing?: unknown },
    options?: Record<string, unknown>,
  ) => Promise<unknown>;
};

declare global {
  interface Window {
    GoproGpsVendor?: GoproGpsVendorApi;
  }
}

export {};
