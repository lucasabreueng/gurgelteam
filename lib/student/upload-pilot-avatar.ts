export async function uploadPilotAvatar(
  file: File,
  clientId?: string,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  if (clientId) {
    formData.append("clientId", clientId);
  }

  const response = await fetch("/api/v1/pilot/profile/avatar", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  type UploadBody = {
    success?: boolean;
    data?: { url: string };
    error?: { message?: string };
    message?: string;
  };

  let body: UploadBody | null = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text) as UploadBody;
    } catch {
      throw new Error("Resposta inválida ao enviar foto.");
    }
  }

  if (!response.ok || !body?.success || !body.data?.url) {
    throw new Error(
      body?.error?.message ?? body?.message ?? "Falha ao enviar foto de perfil.",
    );
  }

  return body.data.url;
}
