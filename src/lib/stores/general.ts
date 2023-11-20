import { writable } from "svelte/store";


export const initialGeneralState: GeneralState = {
  showMenu: false
}
const { subscribe, set, update } = writable<GeneralState>(initialGeneralState);

export const general = {
  subscribe,
  set,
  update,
  toggleMenu
}

export interface GeneralState {
  showMenu: boolean
}

function toggleMenu() {
  update((g) => {
    g.showMenu = !g?.showMenu;
    return g;
  })
}