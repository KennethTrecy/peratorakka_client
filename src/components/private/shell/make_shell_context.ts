import type { Readable } from "svelte/store"
import type { ContextBundle } from "+/component"

import { derived } from "svelte/store"

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

	const menuItemInfos = derived(
		[ serverIcon, hasToken, hasUser ],
		([ currentServerIcon, hasTokenCurrently, hasUserCurrently ]) => {
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
					"link": "/cash_flow_activities",
					"icon": "dynamic_feed",
					"label": "Cash Flow Activities"
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"type": "item",
					"link": "/accounts",
					"icon": "category",
					"label": "Chart of Accounts"
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
					"label": "General Ledger"
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"type": "item",
					"link": "/frozen_periods",
					"icon": "weather_snowy",
					"label": "Frozen Periods"
				} : null,
				hasTokenCurrently && hasUserCurrently ? {
					"type": "group",
					"icon": "borg",
					"label": "Advance",
					"items": [
						{
							"type": "item",
							"link": "/collections",
							"icon": "view_comfy_alt",
							"label": "Collections"
						},
						{
							"type": "item",
							"link": "/formulae",
							"icon": "rule_settings",
							"label": "Formulae"
						},
						{
							"type": "item",
							"link": "/numerical_tools",
							"icon": "browse_activity",
							"label": "Numerical Tools"
						},
						{
							"type": "item",
							"link": "/numerical_tools",
							"icon": "dashboard",
							"label": "Dashboard"
						}
					]
				} : null,
			].filter(Boolean)
		}
	)

	return {
		menuItemInfos
	}
}
