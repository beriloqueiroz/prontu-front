import type { Patient } from "$lib/interface/professional/patient";
import type { ZodIssue } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function processFormError(result: any) {
  const errorFormDetails: ZodIssue[] = result.error.formDetail;
  errorFormDetails.forEach((issue) => {
    const id = issue.path[0].toString();
    const element = document.getElementById(id);
    const labelElements = document.querySelector("label[for='" + id + "']");
    labelElements?.classList.add('text-red-600');
    element?.classList.add('border-red-600');
    element?.classList.add('border-2');
  });
}

export function clearFormError() {
  const inputs = document.getElementsByTagName("INPUT");
  const labels = document.getElementsByTagName("LABEL");
  const elements = [...inputs, ...labels];
  elements.forEach((element) => {
    element?.classList.remove('text-red-600');
    element?.classList.remove('border-red-600');
    element?.classList.remove('border-2');
  });
}

export function simplePatient(patient: Patient | undefined) {
  if (!patient) {
    return ``;
  }
  return `${patient?.id.substring(0, 4)} - ${patient?.name}`;
}