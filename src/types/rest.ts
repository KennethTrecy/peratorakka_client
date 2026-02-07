import type { Writable, Readable } from "svelte/store"
import type { ContextBundle } from "+/component"
import type {
	PrecisionFormat,
	Currency,
	ItemDetail,
	Account,
	ItemConfiguration,
	CashFlowActivity,
	FrozenPeriod,
	FrozenAccount,
	RealAdjustedSummaryCalculation,
	RealUnadjustedSummaryCalculation,
	RealFlowCalculation,
	ItemCalculation
} from "+/entity"

import { SEARCH_MODES, SORT_ORDERS, ACCEPTABLE_CONSTELLATION_KINDS } from "#/rest"

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
	globalContext?: ContextBundle,
	path: string|Readable<string>
	defaultRequestConfiguration: Partial<RequestInit>
	manualResponseHandlers: RequesterCase[]
	expectedErrorStatusCodes: number[]
}

export interface RequesterDependencies {
	globalContext: ContextBundle
	isConnecting: Writable<boolean>
	errors: Writable<GeneralError[]>
}

export interface RequesterInfo extends RequesterDependencies {
	send: (requestInfo: Partial<RequestInit>) => Promise<void>
}

export type ApproximateAndExactFormats = [ string, string ]

export interface TrialBalance<T extends string|ApproximateAndExactFormats> {
	debit_total: T
	credit_total: T
}

export interface ProxyRequest {
	targetURL: string
	method: "GET"|"POST"|"PATCH"|"DELETE"
	body: Record<string, any>|null
}

export interface CashFlowActivitySubtotal<T extends string|ApproximateAndExactFormats> {
	cash_flow_activity_id: number
	subtotal: T
	net_income: T
}

export interface FinancialStatementGroup<T extends string|ApproximateAndExactFormats> {
	currency_id: number
	unadjusted_trial_balance: TrialBalance<T>
	income_statement: {
		net_total: T
	}
	balance_sheet: {
		total_assets: T
		total_liabilities: T
		total_equities: T
	}
	cash_flow_statement: {
		opened_real_liquid_amount: T
		closed_real_liquid_amount: T
		real_liquid_amount_difference: T
		subtotals: CashFlowActivitySubtotal<T>[]
	}
	adjusted_trial_balance: TrialBalance<T>
}

interface CurrencyInfo {
	currency_id: number
	value: string
}

export interface ExchangeRateInfo {
	source: CurrencyInfo
	destination: CurrencyInfo
	updated_at: string
}

export interface CompleteFrozenPeriodInfo {
	"@meta": {
		statements: FinancialStatementGroup<string>[]
		exchange_rates: ExchangeRateInfo[]
	}
	precision_formats: PrecisionFormat[]
	currencies: Currency[]
	item_details: ItemDetail[]
	accounts: Account[]
	item_configurations: ItemConfiguration[]
	cash_flow_activities: CashFlowActivity[]
	frozen_period: FrozenPeriod
	frozen_accounts: FrozenAccount[]
	real_adjusted_summary_calculations: RealAdjustedSummaryCalculation[]
	real_unadjusted_summary_calculations: RealUnadjustedSummaryCalculation[]
	real_flow_calculations: RealFlowCalculation[]
	item_calculations: ItemCalculation[]
}

export type SearchMode = typeof SEARCH_MODES[number]

export type SortOrder = typeof SORT_ORDERS[number]

export type SortOrderInfo = [ string, SortOrder ]

export interface Star {
	display_value: string
	numerical_value: number
}

export type AcceptableConstellationKind = typeof ACCEPTABLE_CONSTELLATION_KINDS[number]

export interface Constellation {
	name: string
	kind: AcceptableConstellationKind
	stars: Star[]
}

export interface NumericalToolConclusion {
	time_tags: string[]
	constellations: Constellation[]
}
