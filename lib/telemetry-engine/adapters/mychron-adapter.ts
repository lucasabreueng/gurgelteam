import { buildColumnMapping, resolveHeaderAny } from "../csv/column-mapper";
import { createAdapter } from "./base-adapter";

const base = createAdapter(
  "mychron",
  "MyChron (AiM Race Studio)",
  [
    "gps speed",
    "gps latacc",
    "gps lonacc",
    "gps gyro",
    "distance on gps speed",
    "aim",
    "mychron",
  ],
  {
    speed: "GPS Speed",
    rpm: "RPM",
    lateralG: "GPS LatAcc",
    longitudinalG: "GPS LonAcc",
    gyro: "GPS Gyro",
    rawDistance: "Distance on GPS Speed",
  },
);

export const mychronAdapter = {
  ...base,
  getMapping(headers: string[], sampleRows?: import("../types").RawCsvRow[]) {
    return buildColumnMapping(
      headers,
      {
        speed: resolveHeaderAny(headers, [
          "GPS Speed",
          "GPS Speed [km/h]",
          "Velocidade GPS",
        ]),
        rpm: resolveHeaderAny(headers, ["RPM", "Engine RPM"]),
        latitude: resolveHeaderAny(headers, [
          "GPS Latitude",
          "GPS Latitudine",
          "GPS N/S",
          "GPS Lat",
          "Latitude",
          "Latitudine",
          "Lat",
        ]),
        longitude: resolveHeaderAny(headers, [
          "GPS Longitude",
          "GPS Longitudine",
          "GPS E/W",
          "GPS Lon",
          "GPS Lng",
          "Longitude",
          "Longitudine",
          "Lon",
          "Lng",
        ]),
        lateralG: resolveHeaderAny(headers, ["GPS LatAcc", "GPS Lat Acc"]),
        longitudinalG: resolveHeaderAny(headers, ["GPS LonAcc", "GPS Lon Acc"]),
        gyro: resolveHeaderAny(headers, ["GPS Gyro"]),
        rawDistance: resolveHeaderAny(headers, [
          "Distance on GPS Speed",
          "GPS Distance",
          "Distance",
        ]),
        sessionTime: resolveHeaderAny(headers, [
          "Time",
          "Tempo",
          "Elapsed Time",
          "Session Time",
        ]),
      },
      sampleRows,
    );
  },
};
