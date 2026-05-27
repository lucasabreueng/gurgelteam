/* eslint-disable @typescript-eslint/no-require-imports */
const goproTelemetry = require("gopro-telemetry");
const { gpmfExtractBrowser } = require("./gopro-gpmf-browser");

globalThis.GoproGpsVendor = {
  gpmfExtract: gpmfExtractBrowser,
  goproTelemetry,
};
