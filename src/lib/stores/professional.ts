import type { Professional } from "$lib/interface/professional/professional";
import { writable } from "svelte/store";

const { subscribe, set, update } = writable<Professional | null>(null);

export const professional = {
  subscribe,
  set,
  update
}