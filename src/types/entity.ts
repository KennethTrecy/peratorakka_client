import { acceptableAccountKinds, accountKinds } from "#/entity"

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
