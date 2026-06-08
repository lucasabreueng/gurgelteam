import { createStudentProfileService } from "@/services/student/studentProfileService";

/** Compat — prefer `getAppServices().studentProfile` ou `createStudentProfileService()`. */
export const StudentProfileServiceMock = createStudentProfileService();
