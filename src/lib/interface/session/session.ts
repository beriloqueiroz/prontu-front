export interface Session {
  startDate: Date,
  endDate?: Date,
  timeInMinutes: number,
  amount?: number,
  patientIds: string[],
  professionalId: string,
  notes?: string,
  cid?: Cid[]
  forms?: Form[]
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