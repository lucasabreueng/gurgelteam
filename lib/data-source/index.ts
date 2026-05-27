/**
 * Ponto único para escolher origem de dados (mock local vs HTTP futuro).
 */

export type { DataSourceMode } from "./mode";
export { getDataSourceMode, assertMockDataSource } from "./mode";
export { getAppServices, type AppServices } from "./app-services";

export { apiFetch, unwrapApiResponse } from "@/lib/api/http-client";
