import { redirect } from "next/navigation";

/** Rota legada — cadastro de piloto abre no drawer do perfil */
export default function CadastrarPilotoRedirectPage() {
  redirect("/piloto/perfil?demo=responsavel");
}
