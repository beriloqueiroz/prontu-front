export interface Session {
  id?: string,
  patientIds: string[],
  professionalId: string,
  startDate: Date,
  timeInMinutes: number,
  amount?: number,
  endDate?: Date,
  notes?: string,
  cids?: Cid[]
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