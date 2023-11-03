import type { FinancialInfo } from "./financialInfo";
import type { PersonalForm } from "./personalForm";

export interface Patient {
  name: string,
  email: string,
  document: string,
  active: string,
  financialInfo: FinancialInfo,
  personalForm: PersonalForm
}