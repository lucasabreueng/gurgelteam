import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  API_ERROR_CODES,
  type ApiError,
} from "@/lib/contracts/api/api-error";

export function jsonSuccess<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function jsonError(error: ApiError): NextResponse {
  const status = error.httpStatus ?? 500;
  return NextResponse.json({ success: false, error }, { status });
}

export function validationError(error: ZodError): ApiError {
  return {
    code: API_ERROR_CODES.VALIDATION_ERROR,
    message: "Dados inválidos.",
    details: error.flatten(),
    httpStatus: 400,
  };
}

export function unauthorizedError(message = "Não autenticado."): ApiError {
  return {
    code: API_ERROR_CODES.UNAUTHORIZED,
    message,
    httpStatus: 401,
  };
}

export function forbiddenError(message = "Acesso negado."): ApiError {
  return {
    code: API_ERROR_CODES.FORBIDDEN,
    message,
    httpStatus: 403,
  };
}

export function internalError(message = "Erro interno do servidor."): ApiError {
  return {
    code: API_ERROR_CODES.INTERNAL_ERROR,
    message,
    httpStatus: 500,
  };
}

export function serviceUnavailableError(
  message = "Serviço temporariamente indisponível.",
): ApiError {
  return {
    code: API_ERROR_CODES.SERVICE_UNAVAILABLE,
    message,
    httpStatus: 503,
  };
}
