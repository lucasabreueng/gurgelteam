import { createAdapter } from "./base-adapter";

export const genericGpsAdapter = createAdapter(
  "generic_gps",
  "GPS genérico (GoPro, exportações diversas)",
  ["latitude", "longitude", "lat", "lon", "speed", "gps"],
);
