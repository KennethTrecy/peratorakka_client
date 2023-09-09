import type { Unsubscriber } from "svelte/store"

import { derived, writable } from "svelte/store"

import { SERVER_URL_KEY, CSRF_TOKEN_KEY, USER_EMAIL_KEY, ACCESS_TOKEN_KEY } from "#/storage_keys"

export const hasLoadedGlobalStates = writable<boolean>(false)
export const serverURL = writable<string>("")
export const CSRFToken = writable<string>("")
export const userEmail = writable<string>("")
export const accessToken = writable<string>("")

export const hasRequirements = writable<boolean>(false)
export const mustHaveToken = writable<boolean>(false)
export const mustHaveAccessToken = writable<boolean>(false)
export const mustBeGuest = writable<boolean>(false)
export const mustBeAuthenticatedUser = writable<boolean>(false)

export const hasServer = derived(serverURL, currentServerURL => currentServerURL !== "")
export const hasToken = derived(
	[ hasServer, CSRFToken ],
	([ hasServerCurrently, currentCSRFToken ]) => hasServerCurrently && currentCSRFToken !== ""
)
export const hasUser = derived(
	[ hasToken, userEmail ],
	([ hasTokenCurrently, currentUserEmail ]) => hasTokenCurrently && currentUserEmail !== ""
)
export const hasAccessToken = derived(
	[ hasServer, accessToken ],
	([ hasServerCurrently, currentAccessToken ]) => hasServerCurrently && currentAccessToken !== ""
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

export const redirectPath = derived<string>(
	[
		hasLoadedGlobalStates,
		hasRequirements,
		mustHaveToken,
		hasToken,
		mustHaveAccessToken,
		hasAccessToken,
		mustBeGuest,
		mustBeAuthenticatedUser,
		hasUser
	],
	([
		wereGlobalStatesLoaded,
		doesHaveRequirements,
		doesRequireToken,
		isTokenPresent,
		doesRequireAccessToken,
		isAccessTokenPresent,
		doesRequireGuest,
		doesRequireAuthenticatedUser,
		isAuthenticatedUserPresent
	]) => {
		if (wereGlobalStatesLoaded) {
			if (doesHaveRequirements) {
				if (doesRequireToken && !isTokenPresent) {
					return "/"
				}

				if (doesRequireAccessToken && !isAccessTokenPresent) {
					return "/"
				}

				if (doesRequireGuest && isAuthenticatedUserPresent) {
					return "/"
				}

				if (doesRequireAuthenticatedUser && !isAuthenticatedUserPresent) {
					return "/log_in"
				}
			}
		}

		return ""
	}
)

let stopStoringServerURL: Unsubscriber = () => null as void
let stopStoringCSRFToken: Unsubscriber = () => null as void
let stopStoringAccessToken: Unsubscriber = () => null as void
let stopStoringUserEmail: Unsubscriber = () => null as void

export function initializeGlobalStates() {
	const storedServerURL = window.localStorage.getItem(SERVER_URL_KEY) ?? ""
	const storedCSRFToken = window.localStorage.getItem(CSRF_TOKEN_KEY) ?? ""
	const storedAccessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? ""
	const storedUserEmail = window.localStorage.getItem(USER_EMAIL_KEY) ?? ""

	setTimeout(() => {
		serverURL.set(storedServerURL)
		CSRFToken.set(storedCSRFToken)
		accessToken.set(storedAccessToken)
		userEmail.set(storedUserEmail)
		hasLoadedGlobalStates.set(true)
	}, 250)

	stopStoringServerURL = serverURL.subscribe(newServerURL => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(SERVER_URL_KEY, newServerURL)
			if (newServerURL === "") CSRFToken.set("")
			if (newServerURL === "") accessToken.set("")
		}
	})
	stopStoringCSRFToken = CSRFToken.subscribe(newCSRFToken => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(CSRF_TOKEN_KEY, newCSRFToken)
			if (newCSRFToken === "") userEmail.set("")
		}
	})
	stopStoringAccessToken = accessToken.subscribe(newAccessToken => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken)
			if (newAccessToken === "") userEmail.set("")
		}
	})
	stopStoringUserEmail = userEmail.subscribe(newUserEmail => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(USER_EMAIL_KEY, newUserEmail)
		}
	})
}

export function unsubscribeWatchedGlobalStates() {
	if (typeof window !== "undefined") {
		stopStoringServerURL()
		stopStoringCSRFToken()
		stopStoringAccessToken()
		stopStoringUserEmail()
	}
}
