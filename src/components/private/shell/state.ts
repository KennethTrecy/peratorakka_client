import type { Unsubscriber } from "svelte/store"
import type { MenuItemInfo } from "%/shell/types"

import { derived, writable } from "svelte/store"
import { setMode } from "@/components/third-party/index"

import { serverIcon, hasToken, hasUser } from "$/global_state"
import { THEME_MODE_KEY } from "#/storage_keys"

export const DARK_MODE = "dark"
export const LIGHT_MODE = "light"

const mustBeLoadedCompletely = writable<boolean>(false)
export const mustBeInDarkMode = writable<boolean>(false)
export const themeMode = derived(
	[ mustBeLoadedCompletely, mustBeInDarkMode ],
	([ hasLoadedInBrowser, isInDarkMode ]) => {
		if (hasLoadedInBrowser) {
			if (isInDarkMode) return DARK_MODE
			return LIGHT_MODE
		}

		return LIGHT_MODE
	}
)

export const menuItemInfos = derived<MenuItemInfo[]>(
	[ serverIcon, hasToken, hasUser ],
	([ currentServerIcon, hasTokenCurrently, hasUserCurrently ]) => {
		return [
			{
				"link": "/",
				"icon": currentServerIcon,
				"label": "Server"
			},
			hasTokenCurrently && !hasUserCurrently ? {
				"link": "/log_in",
				"icon": "login",
				"label": "Log in"
			} : null,
			hasTokenCurrently && !hasUserCurrently ? {
				"link": "/register",
				"icon": "add_circle",
				"label": "Register"
			} : null,
			hasTokenCurrently && hasUserCurrently ? {
				"link": "/currencies",
				"icon": "universal_currency_alt",
				"label": "Currencies"
			} : null,
			hasTokenCurrently && hasUserCurrently ? {
				"link": "/accounts",
				"icon": "category",
				"label": "Accounts"
			} : null,
			hasTokenCurrently && hasUserCurrently ? {
				"link": "/modifiers",
				"icon": "component_exchange",
				"label": "Modifiers"
			} : null,
			hasTokenCurrently && hasUserCurrently ? {
				"link": "/financial_entries",
				"icon": "receipt_long",
				"label": "Financial Entries"
			} : null,
			hasTokenCurrently && hasUserCurrently ? {
				"link": "/log_out",
				"icon": "logout",
				"label": "Log out"
			} : null
		].filter(Boolean)
	}
)

let unsubscribeThemeMode: Unsubscriber = () => null as void

export function initializeShellState() {
	// @ts-ignore
	const storedMode = window.localStorage.getItem(THEME_MODE_KEY) ?? DARK_MODE
	mustBeInDarkMode.set(storedMode === DARK_MODE)
	mustBeLoadedCompletely.set(true)
	setTimeout(() => setMode(storedMode), 250)
	unsubscribeThemeMode = themeMode.subscribe(newTheme => {
		if (typeof window !== "undefined") {
			setMode(newTheme)
			window.localStorage.setItem(THEME_MODE_KEY, newTheme)
		}
	})
}

export function unsubscribeWatchedStates() {
	unsubscribeThemeMode()
}
