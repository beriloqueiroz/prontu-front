// See https://kit.svelte.dev/docs/types#app

import type { User } from "$lib/interface/user";
import type { ZodIssue } from 'zod';

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string,
			code?: number,
			formDetail?: ZodIssue[]
		}
		interface Locals {
			user: User | undefined,
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };

export interface DefaultError {
	message: string,
	code?: number
}

export type PageServerLoad = Kit.ServerLoad<RouteParams>;
export type PageLoad = Kit.Load<RouteParams>;

