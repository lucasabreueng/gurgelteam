import type { ApiError } from "@/lib/contracts/api/api-error";
import type { ApiResponse } from "@/lib/contracts/api/api-response";

function getApiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  return base;
}

function toApiError(
  partial: Partial<ApiError> & { message: string },
): ApiError {
  return {
    code: partial.code ?? "UNKNOWN",
    message: partial.message,
    details: partial.details,
    httpStatus: partial.httpStatus,
  };
}

/**
 * Cliente HTTP mínimo para repositories futuros.
 * Retorna sempre `ApiResponse<T>` — nunca lança em erro HTTP/rede.
 */
function resolveRequestUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();
  if (base) return `${base}${normalized}`;
  return normalized;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const url = resolveRequestUrl(path);

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    let body: unknown = null;
    const text = await response.text();
    if (text) {
      try {
        body = JSON.parse(text) as unknown;
      } catch {
        body = { message: text };
      }
    }

    if (!response.ok) {
      const err =
        body &&
        typeof body === "object" &&
        "error" in body &&
        (body as { error?: ApiError }).error
          ? (body as { error: ApiError }).error
          : toApiError({
              code: "HTTP_ERROR",
              message: response.statusText || `HTTP ${response.status}`,
              httpStatus: response.status,
              details: body,
            });
      return { success: false, error: err };
    }

    const data =
      body && typeof body === "object" && "data" in body
        ? (body as { data: T }).data
        : (body as T);

    return { success: true, data };
  } catch (cause) {
    return {
      success: false,
      error: toApiError({
        code: "NETWORK",
        message:
          cause instanceof Error ? cause.message : "Falha de rede ao chamar API",
        details: cause,
      }),
    };
  }
}

/** Desembrulha `ApiResponse` ou lança com mensagem legível (útil em services). */
export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (response.success && response.data !== undefined) {
    return response.data;
  }
  const msg = response.error?.message ?? response.message ?? "Erro desconhecido";
  throw new Error(msg);
}
