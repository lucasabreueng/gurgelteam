import { NextRequest } from "next/server";



import { registerVerifySchema } from "@/lib/contracts/api/v1/auth.api.schemas";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";

import { getClientIp } from "@/lib/server/auth/auth-utils";

import { registerVerificationService } from "@/lib/server/auth/register-verification-service";

import { isApiError } from "@/lib/server/clients/clients-repository";

import {

  internalError,

  jsonError,

  serviceUnavailableError,

  validationError,

} from "@/lib/server/api/responses";



export const dynamic = "force-dynamic";



export async function POST(request: NextRequest) {

  let body: unknown;

  try {

    body = await request.json();

  } catch {

    return jsonError({

      code: API_ERROR_CODES.VALIDATION_ERROR,

      message: "Corpo da requisição inválido.",

      httpStatus: 400,

    });

  }



  const parsed = registerVerifySchema.safeParse(body);

  if (!parsed.success) {

    return jsonError(validationError(parsed.error));

  }



  try {

    return await registerVerificationService.verifyAndActivate(

      parsed.data.email,

      parsed.data.code,

      {

        userAgent: request.headers.get("user-agent"),

        ipAddress: getClientIp(request),

      },

    );

  } catch (error) {

    if (isApiError(error)) return jsonError(error);



    if (

      error instanceof Error &&

      (error.name === "PrismaClientInitializationError" ||

        error.message.includes("Can't reach database"))

    ) {

      return jsonError(

        serviceUnavailableError(

          "Não foi possível conectar ao banco de dados. Verifique DATABASE_URL.",

        ),

      );

    }



    console.error("[auth/register/verify]", error);

    return jsonError(internalError());

  }

}

