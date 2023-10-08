import type { Unsubscriber, Readable } from "svelte/store"
import type { DividerItemInfo, MenuItemInfo } from "%/shell/types"
import type { ContextBundle } from "+/component"

import { derived, writable } from "svelte/store"
import { setMode } from "@/components/third-party/index"

export default function makeShellContext(globalContext: ContextBundle): ContextBundle {
	const {
		serverIcon,
		userEmail,
		hasToken,
		hasUser
	} = globalContext as {
		serverIcon: Readable<string>,
		hasToken: Readable<boolean>,
		hasUser: Readable<boolean>,
	}

	const menuItemInfos = derived<(DividerItemInfo|MenuItemInfo)[]>(
		[ serverIcon, userEmail, hasToken, hasUser ],
		([ currentServerIcon, currentUserEmail, hasTokenCurrently, hasUserCurrently ]) => {
			return [
				{
					"type": "item",
					"link": "/",
					"icon": currentServerIcon,
					"label": "Server"
				},
				hasTokenCurrently && hasUserCurrently ? {
					"type": "item",
					"link": "/profile",
					"icon": "edit",
					"label": `Profile`
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"type": "item",
					"link": "/log_out",
					"icon": "logout",
					"label": "Log out"
				} : null,
				hasTokenCurrently ? {
					"type": "divider"
				} : null,
				hasTokenCurrently && !hasUserCurrently ? {
					"type": "item",
					"link": "/log_in",
					"icon": "login",
					"label": "Log in"
				} : null,
				hasTokenCurrently && !hasUserCurrently ? {
					"type": "item",
					"link": "/register",
					"icon": "add_circle",
					"label": "Register"
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"type": "item",
					"link": "/currencies",
					"icon": "universal_currency_alt",
					"label": "Currencies"
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"type": "item",
					"link": "/accounts",
					"icon": "category",
					"label": "Accounts"
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"type": "item",
					"link": "/modifiers",
					"icon": "component_exchange",
					"label": "Modifiers"
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"type": "item",
					"link": "/financial_entries",
					"icon": "receipt_long",
					"label": "Financial Entries"
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"type": "item",
					"link": "/frozen_periods",
					"icon": "weather_snowy",
					"label": "Frozen Periods"
				} : null
			].filter(Boolean)
		}
	)

	return {
		menuItemInfos
	}
}
