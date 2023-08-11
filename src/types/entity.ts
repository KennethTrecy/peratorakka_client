import { acceptableAccountKinds, accountKinds } from "#/entity"

export interface Currency {
	id: number
	name: string
	code: string
	created_at: string
	updated_at: string
}

type AccountKind = typeof accountKinds[number]

export type AcceptableAccountKind = typeof acceptableAccountKinds[number]

export interface Account {
	id: number
	currency_id: number
	name: string
	description: string
	kind: AccountKind
	created_at: string
	updated_at: string
}
