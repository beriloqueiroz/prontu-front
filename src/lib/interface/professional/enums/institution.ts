export enum Institution {
  CRP_CE = "crpce", CRP_SP = "crpsp", CRM = "crm",
}

export const allInstitution: Institution[] = [Institution.CRM, Institution.CRP_CE, Institution.CRP_SP]

export function getInstitutionKey(value: string) {
  const indexOfS = Object.values(Institution).indexOf(value as unknown as Institution);
  return Object.keys(Institution)[indexOfS];;
}
