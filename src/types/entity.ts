import {
	acceptableAccountKinds,
	accountKinds,
	acceptableModifierKinds,
	modifierKinds,
	acceptableModifierActions,
	modifierActions,
	acceptableModifierAtomKinds,
	modifierAtomKinds,
	acceptableFinancialEntryAtomKinds,
	financialEntryAtomKinds,
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
}

interface TimestampedEntity extends Entity {
	created_at: string
	updated_at: string
}

export interface RestorableEntity extends TimestampedEntity {
	deleted_at: string|null
}

export interface PrecisionFormat extends RestorableEntity {
	name: string
	minimum_presentational_precision: number
	maximum_presentational_precision: number
}

export interface Currency extends RestorableEntity {
	precision_format_id: number
	name: string
	code: string
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

type ModifierAtomKind = typeof modifierAtomKinds[number]

export type AcceptableModifierAtomKind = typeof acceptableModifierAtomKinds[number]

export interface Modifier extends RestorableEntity {
	name: string
	description: string
	kind: ModifierKind
	action: ModifierAction
}

interface CoreModifierAtomInput {
	account_id: number
	kind: ModifierAtomKind
}

export interface ModifierAtomInput extends CoreModifierAtomInput {
	cash_flow_activity_id: number|null
}

export type ModifierAtom = Entity & CoreModifierAtomInput & {
	modifier_id: number
}

export interface ModifierAtomActivity extends Entity {
	modifier_atom_id: number
	cash_flow_activity_id: number
}

export interface FinancialEntry extends RestorableEntity {
	modifier_id: number
	transacted_at: string
	remarks: string
}

export type FinancialEntryAtomKind = typeof financialEntryAtomKinds[number]

export type AcceptableFinancialEntryAtomKind = typeof acceptableFinancialEntryAtomKinds[number]

interface CoreFinancialEntryAtomInput {
	id?: number
	modifier_atom_id: number
	kind: FinancialEntryAtomKind
	numerical_value: string
}

export type FinancialEntryAtomInput = CoreFinancialEntryAtomInput

export type FinancialEntryAtom = Entity & CoreFinancialEntryAtomInput & {
	financial_entry_id: number
}

export interface CompleteFinancialEntryAtomInput {
	modifier_atom: ModifierAtom
	account: Account
	currency: Currency
	input: FinancialEntryAtomInput
}

export interface CompleteFinancialEntryAtom {
	modifier_atom: ModifierAtom
	cash_flow_activity: CashFlowActivity|null
	account: Account
	currency: Currency
	precision_format: PrecisionFormat
	financial_entry_atom: FinancialEntryAtom
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
