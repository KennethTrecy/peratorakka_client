import type { Unsubscriber } from "svelte/store"
import type { ContextBundle } from "+/component"

import { compare } from "semver"
import { derived, writable } from "svelte/store"

import { RECOMMENDED_API_VERSION, MAINTENANCE_EXPIRATION_MECHANISM } from "#/rest"
import { LIGHT_MODE, DARK_MODE } from "#/theme"
import {
	SERVER_URL_KEY,
	CSRF_TOKEN_KEY,
	USER_EMAIL_KEY,
	ACCESS_TOKEN_KEY,
	ACCESS_TOKEN_METADATA_KEY,
	THEME_NAME_KEY,

	USER_EMAIL_KEY_v0_2_1
} from "#/storage_keys"

export default function makeGlobalContext(): ContextBundle {
	const hasLoadedGlobalStates = writable<boolean>(false)
	const serverURL = writable<string>("")
	const hasCompatibleServer = writable<boolean>(true)
	const CSRFToken = writable<string>("")
	const userEmail = writable<string>("")
	const accessToken = writable<string>("")
	const accessTokenMetadata = writable<Map<string, string>>(new Map())
	const themeName = writable<string>(DARK_MODE)

	const hasRequirements = writable<boolean>(false)
	const mustHaveCompatibleServer = writable<boolean>(false)
	const mustHaveToken = writable<boolean>(false)
	const mustHaveAccessToken = writable<boolean>(false)
	const mustBeGuest = writable<boolean>(false)
	const mustBeAuthenticatedUser = writable<boolean>(false)

	const hasServer = derived(serverURL, currentServerURL => currentServerURL !== "")
	const hasToken = derived(
		[ hasServer, CSRFToken ],
		([ hasServerCurrently, currentCSRFToken ]) => hasServerCurrently && currentCSRFToken !== ""
	)
	const hasUser = derived(
		[ hasToken, userEmail ],
		([ hasTokenCurrently, currentUserEmail ]) => hasTokenCurrently && currentUserEmail !== ""
	)
	const hasAccessToken = derived(
		[ hasServer, accessToken, accessTokenMetadata ],
		([
			hasServerCurrently,
			currentAccessToken,
			currentAccessTokenMetadata
		]) => hasServerCurrently
			&& currentAccessToken !== ""
			&& currentAccessTokenMetadata.size > 0
	)
	const hasSupportedAccessToken = derived(
		[ hasAccessToken, accessTokenMetadata ],
		([ hasAccessTokenCurrently, currentAccessTokenMetadata ]) => {
			if (!hasAccessTokenCurrently) return true

			if (currentAccessTokenMetadata.get("type") === MAINTENANCE_EXPIRATION_MECHANISM) {
				const lastUsedAt = new Date(currentAccessTokenMetadata.get("lastUsedAt") ?? new Date())
				const currentDateAndTime = new Date()
				const millisecondDifference = currentDateAndTime.valueOf() - lastUsedAt.valueOf()
				// Round off which the author guess that millisecond slippage is acceptable
				const secondDifference = Math.round(millisecondDifference / 1000)
				const lifetime = Number(currentAccessTokenMetadata.get("data")) ?? 0

				return secondDifference < lifetime
			} else {
				return false
			}
		}
	)

	const serverIcon = derived(
		[ hasServer, hasToken ],
		([ hasServerCurrently, hasTokenCurrently ]) => (
			hasTokenCurrently
				? "cloud"
				: hasServerCurrently
					? "pending"
					: "cloud_off"
		)
	)

	const redirectPath = derived(
		[
			hasLoadedGlobalStates,
			hasRequirements,
			mustHaveCompatibleServer,
			hasCompatibleServer,
			mustHaveToken,
			hasToken,
			mustHaveAccessToken,
			hasAccessToken,
			hasSupportedAccessToken,
			mustBeGuest,
			mustBeAuthenticatedUser,
			hasUser
		],
		([
			wereGlobalStatesLoaded,
			doesHaveRequirements,
			doesHaveCompatibleServer,
			isServerCompatible,
			doesRequireToken,
			isTokenPresent,
			doesRequireAccessToken,
			isAccessTokenPresent,
			isAccessTokenSupported,
			doesRequireGuest,
			doesRequireAuthenticatedUser,
			isAuthenticatedUserPresent
		]) => {
			if (wereGlobalStatesLoaded) {
				if (doesHaveRequirements) {
					if (doesHaveCompatibleServer && !isServerCompatible) {
						return "/"
					}

					if (doesRequireToken && !isTokenPresent) {
						return "/"
					}

					if (doesRequireAccessToken && (!isAccessTokenPresent || !isAccessTokenSupported)) {
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
	const mustBeInDarkMode = derived(themeName, mode => mode === DARK_MODE)

	let stopStoringServerURL: Unsubscriber = () => null as unknown as void
	let stopStoringCSRFToken: Unsubscriber = () => null as unknown as void
	let stopStoringAccessToken: Unsubscriber = () => null as unknown as void
	let stopStoringAccessTokenMetadata: Unsubscriber = () => null as unknown as void
	let stopStoringUserEmail: Unsubscriber = () => null as unknown as void
	let stopStoringThemeName: Unsubscriber = () => null as unknown as void

	function initializeGlobalStates(): void {
		const storedServerURL = window.localStorage.getItem(SERVER_URL_KEY) ?? ""
		const storedCSRFToken = window.localStorage.getItem(CSRF_TOKEN_KEY) ?? ""
		const storedAccessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY) ?? ""
		const storedAccessTokenMetadata = window.localStorage.getItem(ACCESS_TOKEN_METADATA_KEY)
			?? "[]"
		const storedThemeName = window.localStorage.getItem(THEME_NAME_KEY)
			?? LIGHT_MODE
		const storedUserEmail = window.localStorage.getItem(USER_EMAIL_KEY_v0_2_1)
			?? window.localStorage.getItem(USER_EMAIL_KEY)
			?? ""

		setTimeout(() => {
			serverURL.set(storedServerURL)
			CSRFToken.set(storedCSRFToken)
			accessToken.set(storedAccessToken)
			accessTokenMetadata.set(new Map(JSON.parse(storedAccessTokenMetadata)))
			userEmail.set(storedUserEmail)
			themeName.set(storedThemeName)
			hasLoadedGlobalStates.set(true)
		}, 250)

		stopStoringServerURL = serverURL.subscribe(newServerURL => {
			if (typeof window !== "undefined") {
				window.localStorage.setItem(SERVER_URL_KEY, newServerURL)
				if (newServerURL === "") CSRFToken.set("")
				if (newServerURL === "") accessToken.set("")
				if (newServerURL === "") accessTokenMetadata.set(new Map())
				if (newServerURL === "") hasCompatibleServer.set(false)
				if (newServerURL !== "") {
					fetch(newServerURL, {
						"headers": {
							"Content-Type": "application/json",
							"Accept": "application/json"
						},
						"mode": "cors"
					}).then(async response => {
						if (response.status === 200) {
							const serverInfo = await response.json()
							hasCompatibleServer.set(compare(
								serverInfo.meta.versions.lowest_supported_api_specification,
								RECOMMENDED_API_VERSION
							) === 0)
						} else {
							hasCompatibleServer.set(false)
						}
					})
				}
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
		stopStoringAccessTokenMetadata = accessTokenMetadata.subscribe(newAccessTokenMetadata => {
			if (typeof window !== "undefined") {
				window.localStorage.setItem(
					ACCESS_TOKEN_METADATA_KEY,
					JSON.stringify(Array.from(newAccessTokenMetadata.entries()))
				)
				if (newAccessTokenMetadata.size === 0) accessToken.set("")
			}
		})
		stopStoringUserEmail = userEmail.subscribe(newUserEmail => {
			if (typeof window !== "undefined") {
				if (window.localStorage.getItem(USER_EMAIL_KEY_v0_2_1) !== null) {
					window.localStorage.removeItem(USER_EMAIL_KEY_v0_2_1);
				}

				window.localStorage.setItem(USER_EMAIL_KEY, newUserEmail)
			}
		})
		stopStoringThemeName = themeName.subscribe(newMode => {
			if (typeof window !== "undefined") {
				window.localStorage.setItem(
					THEME_NAME_KEY,
					newMode
				)
			}
		})
	}

	function unsubscribeWatchedGlobalStates(): void {
		if (typeof window !== "undefined") {
			stopStoringServerURL()
			stopStoringCSRFToken()
			stopStoringAccessToken()
			stopStoringAccessTokenMetadata()
			stopStoringUserEmail()
			stopStoringThemeName()
		}
	}

	return {
		hasLoadedGlobalStates,
		serverURL,
		hasCompatibleServer,
		CSRFToken,
		userEmail,
		accessToken,
		accessTokenMetadata,
		mustBeInDarkMode,
		themeName,

		hasRequirements,
		mustHaveCompatibleServer,
		mustHaveToken,
		mustHaveAccessToken,
		mustBeGuest,
		mustBeAuthenticatedUser,
		hasServer,
		hasToken,
		hasUser,
		hasAccessToken,
		hasSupportedAccessToken,

		serverIcon,
		redirectPath,

		initializeGlobalStates,
		unsubscribeWatchedGlobalStates
	}
}
