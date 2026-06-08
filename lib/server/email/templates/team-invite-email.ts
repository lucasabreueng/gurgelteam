type Params = {
  firstName: string;
  resetLink: string;
  expiresHours: number;
};

export function buildTeamInviteEmail(params: Params): {
  subject: string;
  text: string;
  html: string;
} {
  const greetingName = params.firstName.trim();
  const subject = "Defina sua senha — Gurgel Team";
  const intro = greetingName
    ? `Olá, ${greetingName}! Sua conta na equipe Gurgel Team foi criada.`
    : "Olá! Sua conta na equipe Gurgel Team foi criada.";

  const text = [
    intro,
    "",
    "Clique no link abaixo para definir sua senha e acessar o sistema:",
    params.resetLink,
    "",
    `Este link expira em ${params.expiresHours} horas.`,
    "Se você não esperava este e-mail, ignore esta mensagem.",
    "",
    "— Gurgel Team",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background:#f4f6f8;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid rgba(17,17,17,0.08);overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 8px;">
                <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#c41e3a;">Gurgel Team</p>
                <h1 style="margin:12px 0 0;font-size:22px;line-height:1.3;color:#0d1f3c;">Bem-vindo à equipe</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 28px 0;">
                <p style="margin:0;font-size:15px;line-height:1.6;color:#444;">${intro} Use o botão abaixo para criar sua senha de acesso.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <a href="${params.resetLink}" style="display:inline-block;background:#c41e3a;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:12px;">Definir minha senha</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;">
                <p style="margin:0;font-size:13px;line-height:1.5;color:#666;">Válido por <strong>${params.expiresHours} horas</strong>. Se o botão não funcionar, copie e cole este link no navegador:</p>
                <p style="margin:12px 0 0;font-size:12px;line-height:1.5;color:#888;word-break:break-all;">${params.resetLink}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}
