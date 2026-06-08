import { NextRequest } from "next/server";



import { registerRequestSchema } from "@/lib/contracts/api/v1/auth.api.schemas";

import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";

import { registerService } from "@/lib/server/auth/register-service";

import { isApiError } from "@/lib/server/clients/clients-repository";

import {

  internalError,

  jsonError,

  jsonSuccess,

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



  const parsed = registerRequestSchema.safeParse(body);

  if (!parsed.success) {

    return jsonError(validationError(parsed.error));

  }



  try {

    const result = await registerService.register(parsed.data);

    return jsonSuccess(result, 201);

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



    console.error("[auth/register]", error);

    return jsonError(internalError());

  }

}

