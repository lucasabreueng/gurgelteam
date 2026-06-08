import { NextRequest } from "next/server";

import { z } from "zod";



import { API_ERROR_CODES } from "@/lib/contracts/api/api-error";

import { registerVerificationService } from "@/lib/server/auth/register-verification-service";

import { isApiError } from "@/lib/server/clients/clients-repository";

import {

  internalError,

  jsonError,

  jsonSuccess,

  serviceUnavailableError,

  validationError,

} from "@/lib/server/api/responses";



const bodySchema = z.object({

  email: z.string().email(),

});



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



  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {

    return jsonError(validationError(parsed.error));

  }



  try {

    const result = await registerVerificationService.resendCode(parsed.data.email);

    return jsonSuccess(result);

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



    console.error("[auth/register/resend]", error);

    return jsonError(internalError());

  }

}

