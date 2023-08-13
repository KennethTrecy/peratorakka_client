import {
	acceptableAccountKinds,
	accountKinds,
	acceptableModifierKinds,
	modifierKinds
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

type AccountKind = typeof accountKinds[number]

export type AcceptableAccountKind = typeof acceptableAccountKinds[number]

export interface Account extends Entity{
	currency_id: number
	name: string
	description: string
	kind: AccountKind
}

type ModifierKind = typeof modifierKinds[number]

export type AcceptableModifierKind = typeof acceptableModifierKinds[number]

export interface Modifier extends Entity {
	debit_account_id: number
	credit_account_id: number
	name: string
	description: string
	kind: ModifierKind
}
