import type { Unsubscriber, Readable } from "svelte/store"
import type { MenuItemInfo } from "%/shell/types"
import type { ContextBundle } from "+/component"

import { derived, writable } from "svelte/store"
import { setMode } from "@/components/third-party/index"

export default function makeShellContext(globalContext: ContextBundle): ContextBundle {
	const {
		serverIcon,
		hasToken,
		hasUser
	} = globalContext as {
		serverIcon: Readable<string>,
		hasToken: Readable<boolean>,
		hasUser: Readable<boolean>,
	}

	const menuItemInfos = derived<MenuItemInfo[]>(
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
					"link": "/frozen_periods",
					"icon": "weather_snowy",
					"label": "Frozen Periods"
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"link": "/log_out",
					"icon": "logout",
					"label": "Log out"
				} : null
			].filter(Boolean)
		}
	)

	return {
		menuItemInfos
	}
}
