export const UNKNOWN_ACCOUNT_KIND = "unknown"
export const GENERAL_ASSET_ACCOUNT_KIND = "general_asset"
export const LIABILITY_ACCOUNT_KIND = "liability"
export const EQUITY_ACCOUNT_KIND = "equity"
export const EXPENSE_ACCOUNT_KIND = "expense"
export const INCOME_ACCOUNT_KIND = "income"
export const LIQUID_ASSET_ACCOUNT_KIND = "liquid_asset"
export const DEPRECIATIVE_ASSET_ACCOUNT_KIND = "depreciative_asset"

export const acceptableAccountKinds = [
	GENERAL_ASSET_ACCOUNT_KIND,
	LIABILITY_ACCOUNT_KIND,
	EQUITY_ACCOUNT_KIND,
	EXPENSE_ACCOUNT_KIND,
	INCOME_ACCOUNT_KIND,
	LIQUID_ASSET_ACCOUNT_KIND,
	DEPRECIATIVE_ASSET_ACCOUNT_KIND
] as const

export const accountKinds = [
	UNKNOWN_ACCOUNT_KIND,
	...acceptableAccountKinds
] as const

export const acceptableModifierActions = [
	"record",
	"close",
	"exchange"
] as const

export const modifierActions = [
	"unknown",
	...acceptableModifierActions
] as const

export const acceptableModifierKinds = [
	"manual",
	// Below are the kinds not yet supported
	// "reactive",
	// "dependent",
] as const

export const modifierKinds = [
	"unknown",
	...acceptableModifierKinds
] as const


export const ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY = {
	[LIQUID_ASSET_ACCOUNT_KIND]: 0,
	[DEPRECIATIVE_ASSET_ACCOUNT_KIND]: 1,
	[GENERAL_ASSET_ACCOUNT_KIND]: 2,
	[EXPENSE_ACCOUNT_KIND]: 3,
	[LIABILITY_ACCOUNT_KIND]: 4,
	[EQUITY_ACCOUNT_KIND]: 5,
	[INCOME_ACCOUNT_KIND]: 6,
	[UNKNOWN_ACCOUNT_KIND]: 9
}
