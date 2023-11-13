export enum PaymentType {
  "POR SESSÃO" = 0,
  "COMBO" = 1
}

export const allPaymentTypes: PaymentType[] = [PaymentType["POR SESSÃO"], PaymentType.COMBO]

export function getPaymentTypeKey(value: number) {
  const indexOfS = Object.values(PaymentType).indexOf(value as unknown as PaymentType);
  return Object.keys(PaymentType)[indexOfS];
}