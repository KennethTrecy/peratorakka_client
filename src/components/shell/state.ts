import type { MenuItemInfo } from "@/components/shell/types"

import { derived, writable } from "svelte/store"

export const DARK_MODE = "dark"
export const LIGHT_MODE = "light"

export const mustBeInDarkMode = writable<boolean>(true)
export const themeName = derived(
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

const unsbscribeThemeName = themeName.subscribe(newTheme => {
	if (typeof window !== "undefined") {
		window.ui("mode", newTheme)
	}
})

export function unsubscribeWatchedStates() {
	unsbscribeThemeName()
}
