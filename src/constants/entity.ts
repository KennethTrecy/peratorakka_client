export const acceptableAccountKinds = [
	"asset",
	"liability",
	"equity",
	"expense",
	"income"
] as const

export const accountKinds = [
	"unknown",
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

export const acceptableCashFlowCategoryKinds = [
	"liquid",
	"illiquid"
] as const

export const cashFlowCategoryKinds = [
	"unknown",
	...acceptableCashFlowCategoryKinds
] as const
