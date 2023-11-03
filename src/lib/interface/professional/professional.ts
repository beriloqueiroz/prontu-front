import type { Patient } from "./patient";

export interface Professional {
  id: string,
  name: string,
  document: string,
  professionalDocument: string,
  email: string,
  patients: Patient
} 