import type { MenuItemInfo } from "%/shell/types"

import { THEME_MODE_KEY } from "#/storage_keys"
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

export const menuItemInfos = writable<MenuItemInfo[]>([
	{
		"link": "/",
		"icon": "cloud_off",
		"label": "Server"
	}
])

const unsbscribeThemeMode = themeMode.subscribe(newTheme => {
	if (typeof window !== "undefined") {
		window.ui("mode", newTheme)
		window.localStorage.setItem(THEME_MODE_KEY, newTheme)
	}
})

export function unsubscribeWatchedStates() {
	unsbscribeThemeMode()
}
