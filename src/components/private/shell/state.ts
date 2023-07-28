import type { MenuItemInfo } from "%/shell/types"

import { THEME_MODE_KEY } from "#/storage_keys"
import { serverIcon } from "$/global_state"
import { derived, writable } from "svelte/store"

export const DARK_MODE = "dark"
export const LIGHT_MODE = "light"

export const mustBeInDarkMode = writable<boolean>(false)
export const themeMode = derived(
	mustBeInDarkMode,
	isInDarkMode => {
		if (isInDarkMode) return DARK_MODE
		return LIGHT_MODE
	}
)

export const menuItemInfos = derived<MenuItemInfo[]>(
	[ serverIcon ],
	([ currentServerIcon ]) => {
		return [
			{
				"link": "/",
				"icon": currentServerIcon,
				"label": "Server"
			}
		].filter(Boolean)
	}
)

const unsbscribeThemeMode = themeMode.subscribe(newTheme => {
	if (typeof window !== "undefined") {
		window.ui("mode", newTheme)
		window.localStorage.setItem(THEME_MODE_KEY, newTheme)
	}
})

export function initializeShellState() {
	// @ts-ignore
	mustBeInDarkMode.set(
		(
			window.localStorage.getItem(THEME_MODE_KEY)
			?? DARK_MODE
		) === DARK_MODE
	)
}

export function unsubscribeWatchedStates() {
	unsbscribeThemeMode()
}
