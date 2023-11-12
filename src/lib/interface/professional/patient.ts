import type { FinancialInfo } from "./financialInfo";
import type { PersonalForm } from "./personalForm";

export interface Patient {
  id: string,
  name: string,
  email: string,
  document: string,
  isActive: string,
  financialInfo: FinancialInfo,
  personalForm: PersonalForm,
  phones: Phone[],
  avatar: string
}

export interface Phone { value: string, isChat: boolean }