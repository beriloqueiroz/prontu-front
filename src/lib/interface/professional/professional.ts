import type { Session } from "../session/session";
import type { Patient } from "./patient";

export interface Professional {
  id: string,
  name: string,
  document: string,
  professionalDocument: string,
  professionalDocumentInstitution: string,
  email: string,
  patients: Patient[],
  sessions: Session[]
}

export type ProfessionalRecord = Record<
  keyof Professional,
  Professional[keyof Professional]>;