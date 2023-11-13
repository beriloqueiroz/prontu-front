export enum SessionType {
  REMOTO = 0,
  PRESENCIAL = 1
}

export const allSessionTypes: SessionType[] = [SessionType.REMOTO, SessionType.PRESENCIAL]

export function getSessionTypeKey(value: number) {
  const indexOfS = Object.values(SessionType).indexOf(value as unknown as SessionType);
  return Object.keys(SessionType)[indexOfS];
}