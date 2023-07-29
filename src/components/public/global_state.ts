import type { Unsubscriber } from "svelte/store"

import { derived, writable } from "svelte/store"

import { SERVER_URL_KEY, CSRF_TOKEN_KEY } from "#/storage_keys"

export const hasLoadedGlobalStates = writable<boolean>(false)
export const serverURL = writable<string>("")
export const CSRFToken = writable<string>("")

export const hasRequirements = writable<boolean>(false)
export const mustHaveToken = writable<boolean>(false)

export const hasServer = derived(serverURL, currentServerURL => currentServerURL !== "")
export const hasToken = derived(
	[ hasServer, CSRFToken ],
	([ hasServerCurrently,currentCSRFToken ]) => hasServerCurrently && currentCSRFToken !== ""
)

export const serverIcon = derived<string>(
	[ hasServer, hasToken ],
	([ hasServerCurrently, hasTokenCurrently ]) => (
		hasTokenCurrently
			? "cloud"
			: hasServerCurrently
				? "pending"
				: "cloud_off"
	)
)

let stopStoringServerURL: Unsubscriber = () => null as void
let stopStoringCSRFToken: Unsubscriber = () => null as void

export const redirectPath = derived<string>(
	[
		hasLoadedGlobalStates,
		hasRequirements,
		mustHaveToken,
		hasToken
	],
	([
		wereGlobalStatesLoaded,
		doesHaveRequirements,
		doesRequireToken,
		isTokenPresent
	]) => {
		if (wereGlobalStatesLoaded) {
			if (doesHaveRequirements) {
				if (doesRequireToken && !isTokenPresent) {
					return "/"
				}
			}
		}

		return ""
	}
)

export function initializeGlobalStates() {
	const storedServerURL = window.localStorage.getItem(SERVER_URL_KEY) ?? ""
	const storedCSRFToken = window.localStorage.getItem(CSRF_TOKEN_KEY) ?? ""

	setTimeout(() => {
		serverURL.set(storedServerURL)
		CSRFToken.set(storedCSRFToken)
		hasLoadedGlobalStates.set(true)
	}, 250)

	stopStoringServerURL = serverURL.subscribe(newServerURL => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(SERVER_URL_KEY, newServerURL)
			if (newServerURL === "") CSRFToken.set("")
		}
	})
	stopStoringCSRFToken = CSRFToken.subscribe(newCSRFToken => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(CSRF_TOKEN_KEY, newCSRFToken)
		}
	})
}

export function unsubscribeWatchedGlobalStates() {
	if (typeof window !== "undefined") {
		stopStoringServerURL()
		stopStoringCSRFToken()
	}
}
