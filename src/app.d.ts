// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	// interface Error {}
	// interface Locals {}
	// interface PageData {}
	// interface PageState {}
	interface Platform {
		env: {
			PUBLIC_PRODUCTION_SERVER_CHOICES: string
		}
		context: {
			waitUntil(promise: Promise<any>): void;
		}
		caches: CacheStorage & { default: Cache }
	}
}
