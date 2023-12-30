export interface Session {
  Id?: string,
  Patients: PatientSession[],
  Professionals: ProfessionalSession[],
  StartDate: Date,
  TimeInMinutes: number,
  Amount?: number,
  EndDate?: Date,
  Notes?: string,
  Cids?: string,
  Forms?: string,
  Origin: string,
  ExternalId?: string,
  Location: string
}

export interface PatientSession {
  PatientId: string
}

export interface ProfessionalSession {
  ProfessionalId: string
}

export interface Cid {
  code: string,
  name: string,
  observation?: string,
}

export interface Form {
  name: string,
  link: string,
}