export type ProfileTermKey = "privacy" | "terms" | "media";

export const PROFILE_TERM_DOCUMENTS: Record<
  ProfileTermKey,
  { title: string; body: string }
> = {
  privacy: {
    title: "Política de privacidade",
    body: `A Gurgel Team Kart trata seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).

Coletamos informações de cadastro, contato, desempenho em aulas e registros de acesso para operar a plataforma, comunicar agendamentos e melhorar nossos serviços.

Seus dados não são vendidos a terceiros. Compartilhamos informações apenas com prestadores essenciais (pagamento, comunicação) e quando exigido por lei.

Você pode solicitar acesso, correção ou exclusão dos seus dados pelo canal de suporte indicado no site.

Última atualização: março de 2024.`,
  },
  terms: {
    title: "Termos de uso",
    body: `Ao utilizar a área do aluno da Gurgel Team Kart, você concorda com estas condições.

A plataforma destina-se à gestão de aulas, reservas, dados de pilotos e comunicações institucionais. O uso indevido, tentativas de acesso não autorizado ou compartilhamento de credenciais pode resultar em suspensão da conta.

Reservas e cancelamentos seguem as regras divulgadas na unidade. A escola pode alterar horários, categorias e valores mediante comunicação prévia.

O conteúdo disponibilizado (materiais, vídeos, rankings) é de propriedade da Gurgel Team ou de parceiros licenciados.

Última atualização: março de 2024.`,
  },
  media: {
    title: "Autorização de uso de imagem",
    body: `Autorizo a Gurgel Team Kart, suas unidades e parceiros autorizados a captar, utilizar e divulgar minha imagem e voz em fotos, vídeos e materiais promocionais relacionados a aulas, eventos, competições e ações institucionais.

A autorização é gratuita, válida em território nacional e internacional, em mídias digitais e impressas, redes sociais e site oficial, sem limite de prazo, salvo revogação por escrito.

Esta autorização não impede o uso da imagem em contexto jornalístico ou quando a captação ocorrer em evento público de livre acesso.

Última atualização: março de 2024.`,
  },
};
