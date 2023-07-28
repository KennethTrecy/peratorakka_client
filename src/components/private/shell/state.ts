import type { Unsubscriber } from "svelte/store"
import type { MenuItemInfo } from "%/shell/types"

import { derived, writable } from "svelte/store"
import { setMode } from "@/components/third-party/index"

import { serverIcon, hasToken } from "$/global_state"
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
	[ serverIcon, hasToken ],
	([ currentServerIcon, hasTokenCurrently ]) => {
		return [
			{
				"link": "/",
				"icon": currentServerIcon,
				"label": "Server"
			},
			hasTokenCurrently ? {
				"link": "/log_in",
				"icon": "login",
				"label": "Log in"
			} : null,
			hasTokenCurrently ? {
				"link": "/register",
				"icon": "add_circle",
				"label": "Register"
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
