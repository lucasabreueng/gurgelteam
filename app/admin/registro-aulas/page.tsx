import { Suspense } from "react";
import { LessonRegistrationPage } from "@/components/admin/lesson-registration/lesson-registration-page";

export const metadata = {
  title: "Registro de Aulas — Gurgel Team",
  description:
    "Central operacional para registrar resultados de aulas e treinos agendados.",
};

export default function AdminRegistroAulasPage() {
  return (
    <Suspense fallback={null}>
      <LessonRegistrationPage />
    </Suspense>
  );
}
