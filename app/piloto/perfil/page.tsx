import type { Metadata } from "next";
import { Suspense } from "react";
import { ProfilePage } from "@/components/student-area/profile/profile-page";

export const metadata: Metadata = {
  title: "Meu perfil — Área do Piloto | Gurgel Team",
  description:
    "Gerencie seus dados pessoais, preferências e configurações de conta na Gurgel Team.",
};

export default function PilotoPerfilRoutePage() {
  return (
    <Suspense fallback={null}>
      <ProfilePage />
    </Suspense>
  );
}
