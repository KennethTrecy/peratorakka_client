import {
	acceptableAccountKinds,
	accountKinds,
	acceptableModifierKinds,
	modifierKinds,
	acceptableModifierActions,
	modifierActions,
	acceptableFormulaOutputFormats,
	formulaOutputFormats,
	acceptableExchangeRateBases,
	exchangeRateBases,
} from "#/entity"

interface Entity {
	id: number
	created_at: string
	updated_at: string
}

export interface RestorableEntity extends Entity {
	deleted_at: string|null
}

export interface Currency extends RestorableEntity {
	name: string
	code: string
	presentational_precision: number
}

export interface CashFlowActivity extends RestorableEntity {
	name: string
	description: string
}

type AccountKind = typeof accountKinds[number]

export type AcceptableAccountKind = typeof acceptableAccountKinds[number]

export interface Account extends RestorableEntity {
	currency_id: number
	name: string
	description: string
	kind: AccountKind
}

type ModifierKind = typeof modifierKinds[number]

export type AcceptableModifierKind = typeof acceptableModifierKinds[number]

type ModifierAction = typeof modifierActions[number]

export type AcceptableModifierAction = typeof acceptableModifierActions[number]

export interface Modifier extends RestorableEntity {
	debit_account_id: number
	credit_account_id: number
	debit_cash_flow_activity_id: number|null
	credit_cash_flow_activity_id: number|null
	name: string
	description: string
	kind: ModifierKind
	action: ModifierAction
}

export interface FinancialEntry extends RestorableEntity {
	modifier_id: number
	transacted_at: string
	debit_amount: string
	credit_amount: string
	remarks: string
}

export interface FrozenPeriod extends Entity {
	started_at: string
	finished_at: string
}

export interface SummaryCalculation extends Entity {
	frozen_period_id: number
	account_id: number
	opened_debit_amount: string
	opened_credit_amount: string
	unadjusted_debit_amount: string
	unadjusted_credit_amount: string
	closed_debit_amount: string
	closed_credit_amount: string
}

export interface FlowCalculation extends Entity {
	frozen_period_id: number
	cash_flow_activity_id: number
	account_id: number
	net_amount: string
}

export interface Collection extends RestorableEntity {
	name: string
	description: string
}

export interface AccountCollection extends RestorableEntity {
	collection_id: number
	account_id: number
}

type FormulaOutputFormat = typeof formulaOutputFormats[number]

export type AcceptableFormulaOutputFormat = typeof acceptableFormulaOutputFormats[number]

type ExchangeRateBasis = typeof exchangeRateBases[number]

export type AcceptableExchangeRateBasis = typeof acceptableExchangeRateBases[number]

export interface Formula extends RestorableEntity {
	currency_id: number
	name: string
	description: string
	output_format: FormulaOutputFormat
	exchange_rate_basis: ExchangeRateBasis
	presentational_precision: number
	formula: string
}
