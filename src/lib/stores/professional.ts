import type { Patient } from "$lib/interface/professional/patient";
import type { Professional } from "$lib/interface/professional/professional";
import { writable } from "svelte/store";

const { subscribe, set, update } = writable<Professional | null>(null);

export const professional = {
  subscribe,
  set,
  update,
  changePatient
}

function changePatient(patient: Patient) {
  update(p => {
    if (p != null) {
      p.patients = p?.patients.filter(pat => pat.id === patient.id) ?? [];
      p?.patients.push(patient);
    }
    return p;
  })
}