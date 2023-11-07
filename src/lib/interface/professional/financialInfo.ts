import type { PaymentType } from "./enums/paymentType";
import type { SessionType } from "./enums/sessionType";

export interface FinancialInfo {
  defaultSessionPrice: number,
  estimatedSessionsByWeek: number,
  estimatedTimeSessionInMinutes: number,
  sessionType: SessionType,
  paymentType: PaymentType,
  paymentPeriodInDays: number,
  sessionQuantityPerPayment: number,
}