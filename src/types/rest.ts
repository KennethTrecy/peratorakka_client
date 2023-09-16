import type { Writable } from "svelte/store"

import { SEARCH_MODES, ASCENDING_ORDER, DESCENDING_ORDER } from "#/rest"

export interface SimpleError {
	message: string
}

export interface FieldError extends SimpleError {
	field: string
}

export function isFieldError(error: any): error is FieldError {
	return Object.keys(error).includes("field")
}

export function isSimpleError(error: any): error is SimpleError {
	const keys = Object.keys(error)
	return keys.length === 1 && keys.includes("message")
}

export type GeneralError =
	| SimpleError
	| FieldError

interface RequesterCase {
	statusCode: number,
	action: (response: Response) => Promise<void>
}

export interface RequesterConstraints {
	path: string,
	defaultRequestConfiguration: Partial<RequestInit>,
	manualResponseHandlers: RequesterCase[],
	expectedErrorStatusCodes: number[]
}

export interface RequesterDependencies {
	isConnecting: Writable<boolean>,
	errors: Writable<GeneralError[]>
}

export interface RequesterInfo extends RequesterDependencies {
	send: (requestInfo: Partial<RequestInit>) => Promise<void>
}

export interface TrialBalance {
	debit_total: string,
	credit_total: string
}

export interface FinancialStatementGroup {
	currency_id: number
	unadjusted_trial_balance: TrialBalance,
	income_statement: {
		net_total: string
	},
	balance_sheet: {
		total_assets: string,
		total_liabilities: string,
		total_equities: string
	},
	adjusted_trial_balance: TrialBalance
}

export type SearchMode = typeof SEARCH_MODES[number]

export type SortOrder =
	| ASCENDING_ORDER
	| DESCENDING_ORDER

export type SortOrderInfo = [ string, SortOrder ]
