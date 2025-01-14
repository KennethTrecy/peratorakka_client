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
	acceptableNumericalToolKinds,
	numericalToolKinds,
	acceptableNumericalToolRecurrencePeriods,
	numericalToolRecurrencePeriods,
	acceptableAmountSideBases,
	amountSideBases,
	acceptableAmountStageBases,
	amountStageBases
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

type OutputFormat = typeof formulaOutputFormats[number]

export type AcceptableFormulaOutputFormat = typeof acceptableFormulaOutputFormats[number]

export function fallbackToAcceptableFormulaOutputFormat(data: string)
: AcceptableFormulaOutputFormat {
	return isAcceptableFormulaOutputFormat(data) ? data : acceptableFormulaOutputFormats[0]
}

function isAcceptableFormulaOutputFormat(data: string): data is AcceptableFormulaOutputFormat {
	return (<string[]>[ ...acceptableFormulaOutputFormats ]).indexOf(data) > -1
}

type ExchangeRateBasis = typeof exchangeRateBases[number]

export type AcceptableExchangeRateBasis = typeof acceptableExchangeRateBases[number]

export interface Formula extends RestorableEntity {
	currency_id: number
	name: string
	description: string
	output_format: OutputFormat
	exchange_rate_basis: ExchangeRateBasis
	presentational_precision: number
	formula: string
}

type NumericalToolKind = typeof numericalToolKinds[number]

export type AcceptableNumericalToolKind = typeof acceptableNumericalToolKinds[number]

type NumericalToolRecurrencePeriod = typeof numericalToolRecurrencePeriods[number]

export type AcceptableNumericalToolRecurrencePeriod
	= typeof acceptableNumericalToolRecurrencePeriods[number]

interface NumericalToolSource {
	type: string
}

export type AcceptableAmountStageBasis = typeof acceptableAmountStageBases[number]

type AmountStageBasis = typeof amountStageBases[number]

export type AcceptableAmountSideBasis = typeof acceptableAmountSideBases[number]

type AmountSideBasis = typeof amountSideBases[number]

export interface CollectionSource extends NumericalToolSource {
	type: "collection"
	collection_id: number
	currency_id: number
	exchange_rate_basis: ExchangeRateBasis
	stage_basis: AmountStageBasis
	side_basis: AmountSideBasis
	must_show_individual_amounts: boolean
	must_show_collective_sum: boolean
	must_show_collective_average: boolean
}

export interface FormulaSource extends NumericalToolSource {
	type: "formula"
	formula_id: number
}

export type AcceptableSource = CollectionSource|FormulaSource

interface NumericalToolConfiguration {
	sources: AcceptableSource[]
}

export interface NumericalTool extends RestorableEntity {
	name: string
	kind: NumericalToolKind
	recurrence: NumericalToolRecurrencePeriod
	recency: number
	order: number
	notes: string
	configuration: NumericalToolConfiguration
}
