import type { Session } from "../session/session";
import type { FinancialInfo } from "./financialInfo";
import type { PersonalForm } from "./personalForm";

export interface Patient {
  id: string,
  name: string,
  email: string,
  document: string,
  isActive: boolean,
  financialInfo: FinancialInfo,
  personalForm: PersonalForm,
  phones: Phone[],
  avatar: string,
  sessions?: Session[]
}

export interface Phone { value: string, isChat: boolean }