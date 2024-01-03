import type { Patient } from "$lib/interface/professional/patient";
import type { Professional } from "$lib/interface/professional/professional";
import type { Session } from "$lib/interface/session/session";
import { writable } from "svelte/store";

const { subscribe, set, update } = writable<Professional>();

export const professional = {
  subscribe,
  set,
  update,
  changePatient,
  addSession,
  removeSession,
  populateSessions
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

function addSession(session: Session) {
  update(p => {
    p.sessions = [...p.sessions, session]
    return p;
  })
}

function populateSessions(sessions: Session[]) {
  update(p => {
    p.sessions = sessions
    return p;
  })
}

function removeSession(id: string | undefined) {
  update(p => {
    p.sessions = p.sessions.filter(s => s?.Id !== id)
    return p;
  })
}