// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			user: any,
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export { };