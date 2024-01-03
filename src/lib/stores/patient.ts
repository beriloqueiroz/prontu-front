import type { Patient } from "$lib/interface/professional/patient";
import type { Session } from "$lib/interface/session/session";
import { writable } from "svelte/store";

const { subscribe, set, update } = writable<Patient>();

export const patient = {
  subscribe,
  set,
  update,
  updateSessions,
  removeSession,
  addSession,
  populateSessions
}

function updateSessions(sessions: Session[]) {
  update(p => {
    p.sessions = sessions;
    return p;
  })
}

function removeSession(id: string | undefined) {
  update(p => {
    p.sessions = p.sessions?.filter(s => s?.Id !== id)
    return p;
  })
}

function addSession(session: Session) {
  update(p => {
    if (p?.sessions)
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