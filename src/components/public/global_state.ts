import { writable } from "svelte/store"

import { SERVER_URL_KEY, CSRF_TOKEN_KEY } from "#/storage_keys"

export const serverURL = writable<string>("")
export const CSRFToken = writable<string>("")

export function initializeGlobalStates() {
	if (typeof window !== "undefined") {
		serverURL.set(window.localStorage.getItem(SERVER_URL_KEY))
		CSRFToken.set(window.localStorage.getItem(CSRF_TOKEN_KEY))
	}
}
