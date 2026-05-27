export type DataSourceMode = "mock" | "http";

export function getDataSourceMode(): DataSourceMode {
  const mode = process.env.NEXT_PUBLIC_DATA_SOURCE;
  return mode === "http" ? "http" : "mock";
}

export function assertMockDataSource(feature: string): void {
  if (getDataSourceMode() === "http") {
    throw new Error(
      `[${feature}] Repositorio HTTP ainda nao implementado. Defina NEXT_PUBLIC_DATA_SOURCE=mock ou implemente o cliente.`,
    );
  }
}
