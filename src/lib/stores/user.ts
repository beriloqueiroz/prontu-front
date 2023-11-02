import type { User } from "$lib/interface/user";
import { writable } from "svelte/store";

const { subscribe, set, update } = writable<User | null>(null);

export const user = {
  subscribe,
  set,
  update,
}