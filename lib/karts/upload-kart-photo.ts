import { v1ApiPaths } from "@/lib/api/v1-api-paths";

type UploadResponse = {
  success: boolean;
  data?: { url: string };
  error?: { message?: string };
  message?: string;
};

export async function uploadKartPhoto(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(v1ApiPaths.karts.photo, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  let body: UploadResponse | null = null;
  const text = await response.text();
  if (text) {
    try {
      body = JSON.parse(text) as UploadResponse;
    } catch {
      throw new Error("Resposta inválida ao enviar imagem.");
    }
  }

  if (!response.ok || !body?.success || !body.data?.url) {
    throw new Error(
      body?.error?.message ?? body?.message ?? "Falha ao enviar imagem do kart.",
    );
  }

  return body.data.url;
}
