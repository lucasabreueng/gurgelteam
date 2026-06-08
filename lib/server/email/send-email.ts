import { getEmailConfig } from "@/lib/server/email/email-config";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

async function sendViaResend(
  input: SendEmailInput,
  apiKey: string,
  from: string,
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Falha ao enviar e-mail (Resend ${response.status}): ${body || response.statusText}`,
    );
  }
}

function sendViaConsole(input: SendEmailInput): void {
  console.info(
    [
      "[email/console] E-mail não enviado (configure RESEND_API_KEY para envio real)",
      `  Para: ${input.to}`,
      `  Assunto: ${input.subject}`,
      "  ---",
      input.text,
    ].join("\n"),
  );
}

/**
 * Envia e-mail transacional. Com `RESEND_API_KEY`, usa Resend; caso contrário loga no console (dev).
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const to = input.to.trim().toLowerCase();
  if (!to) {
    throw new Error("Destinatário de e-mail inválido.");
  }

  const config = getEmailConfig();

  if (config.provider === "resend" && config.resendApiKey) {
    try {
      await sendViaResend(input, config.resendApiKey, config.from);
      return;
    } catch (error) {
      if (process.env.NODE_ENV === "production") {
        throw error;
      }
      console.warn(
        "[email] Resend falhou em dev — fallback para console:",
        error instanceof Error ? error.message : error,
      );
      sendViaConsole({ ...input, to });
      return;
    }
  }

  sendViaConsole({ ...input, to });
}
