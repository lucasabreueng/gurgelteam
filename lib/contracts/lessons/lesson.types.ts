import type { LessonStatus } from "../enums";

export type LessonSessionDTO = {
  id: string;
  scheduleEventId: string;
  date: string;
  start: string;
  end: string;
  studentName: string;
  studentId?: string;
  avatar: string;
  category: string;
  typeLabel: string;
  registeredByName: string;
  kartNumber: number;
  status: LessonStatus;
  objective?: string;
  previousNote?: string;

  // Relacionamentos/metadata esperados no backend
  createdAt?: string;
  updatedAt?: string;
};

export type LessonRegistrationStatusFilterDTO =
  | ""
  | "pendentes"
  | "em_andamento"
  | "concluidas";

export type LessonRegistrationQueryDTO = {
  date: string;
  statusFilter: LessonRegistrationStatusFilterDTO;
  category: string;
  search: string;
};

