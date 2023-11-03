import type { PaymentType } from "./enums/paymentType";
import type { SessionType } from "./enums/sessionType";

export interface PersonalForm {
  defaultSessionPrice: number,
  estimatedSessionsByWeek: number,
  estimatedTimeSessionInMinutes: number,
  sessionType: SessionType,
  paymentType: PaymentType,
  paymentPeriodInDays: number,
  sessionQuantityPerPayment: number,
}