import { derived, writable } from "svelte/store"

import { SERVER_URL_KEY, CSRF_TOKEN_KEY } from "#/storage_keys"

export const serverURL = writable<string>("")
export const CSRFToken = writable<string>("")

export const hasServer = derived(serverURL, currentServerURL => currentServerURL !== "")
export const hasToken = derived(
	[ hasServer, CSRFToken ],
	([ hasServerCurrently,currentCSRFToken ]) => hasServerCurrently && currentCSRFToken !== ""
)
export const serverIcon = derived<MenuItemInfo[]>(
	[ hasServer, hasToken ],
	([ hasServerCurrently, hasTokenCurrently ]) => (
		hasTokenCurrently
			? "cloud"
			: hasServerCurrently
				? "pending"
				: "cloud_off"
	)
)

export function initializeGlobalStates() {
	if (typeof window !== "undefined") {
		serverURL.set(window.localStorage.getItem(SERVER_URL_KEY) ?? "")
		CSRFToken.set(window.localStorage.getItem(CSRF_TOKEN_KEY) ?? "")
	}
}
