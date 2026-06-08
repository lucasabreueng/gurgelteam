import { NextRequest } from "next/server";



import { saveClientAvatarFile } from "@/lib/server/clients/save-client-avatar";

import { assertGuardianManagesClient } from "@/lib/server/pilot/guardian-client-access";

import { getCurrentUser } from "@/lib/server/auth/session-service";

import { pilotRepository } from "@/lib/server/pilot/pilot-repository";

import { isApiError } from "@/lib/server/pilot/pilot-repository";

import {

  internalError,

  jsonError,

  jsonSuccess,

  unauthorizedError,

} from "@/lib/server/api/responses";



export const dynamic = "force-dynamic";



export async function POST(request: NextRequest) {

  try {

    const user = await getCurrentUser(request);

    if (!user?.clientId) {

      return jsonError(unauthorizedError());

    }



    const formData = await request.formData();

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {

      return jsonError({

        code: "VALIDATION_ERROR",

        message: "Nenhum arquivo enviado.",

        httpStatus: 400,

      });

    }



    const clientIdField = formData.get("clientId");

    const targetClientId =

      typeof clientIdField === "string" && clientIdField.trim()

        ? clientIdField.trim()

        : user.clientId;



    await assertGuardianManagesClient(user, targetClientId);



    const url = await saveClientAvatarFile(file);

    const profile = await pilotRepository.updateProfile(targetClientId, {

      avatarUrl: url,

    });



    return jsonSuccess({ url, profile }, 201);

  } catch (error) {

    if (isApiError(error)) return jsonError(error);

    const message =

      error instanceof Error ? error.message : "Falha ao enviar foto.";

    if (

      message.includes("Formato") ||

      message.includes("máximo") ||

      message.includes("vazio")

    ) {

      return jsonError({

        code: "VALIDATION_ERROR",

        message,

        httpStatus: 400,

      });

    }

    console.error("[pilot/profile/avatar POST]", error);

    return jsonError(internalError());

  }

}

