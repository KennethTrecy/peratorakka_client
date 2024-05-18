import {
	acceptableAccountKinds,
	accountKinds,
	acceptableModifierKinds,
	modifierKinds,
	acceptableModifierActions,
	modifierActions,
	acceptableCashFlowCategoryKinds,
	cashFlowCategoryKinds
} from "#/entity"

interface Entity {
	id: number
	created_at: string
	updated_at: string
}

export interface Currency extends Entity {
	name: string
	code: string
}

type CashFlowCategoryKind = typeof cashFlowCategoryKinds[number]

export type AcceptableCashFlowCategoryKind = typeof acceptableCashFlowCategoryKinds[number]

export interface CashFlowCategory extends Entity {
	name: string
	description: string
	kind: CashFlowCategoryKind
}

type AccountKind = typeof accountKinds[number]

export type AcceptableAccountKind = typeof acceptableAccountKinds[number]

export interface Account extends Entity{
	currency_id: number
	cash_flow_category_id: number|null
	name: string
	description: string
	kind: AccountKind
}

type ModifierKind = typeof modifierKinds[number]

export type AcceptableModifierKind = typeof acceptableModifierKinds[number]

type ModifierAction = typeof modifierActions[number]

export type AcceptableModifierAction = typeof acceptableModifierActions[number]

export interface Modifier extends Entity {
	debit_account_id: number
	credit_account_id: number
	name: string
	description: string
	kind: ModifierKind
	action: ModifierAction
}

export interface FinancialEntry extends Entity {
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
