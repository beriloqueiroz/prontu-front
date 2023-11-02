// See https://kit.svelte.dev/docs/types#app

import type { User } from "$lib/interface/user";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | undefined,
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };

export type PageServerLoad = Kit.ServerLoad<RouteParams>;
export type PageLoad = Kit.Load<RouteParams>;