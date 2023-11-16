import type { Patient } from "$lib/interface/professional/patient";
import type { Session } from "$lib/interface/session/session";
import { writable } from "svelte/store";

const { subscribe, set, update } = writable<Patient>();

export const patient = {
  subscribe,
  set,
  update,
  updateSessions
}

function updateSessions(sessions: Session[]) {
  update(p => {
    p.sessions = sessions;
    return p;
  })
}