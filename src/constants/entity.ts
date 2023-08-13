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

export const acceptableModifierKinds = [
	// Below are the kinds not yet supported
	// "reactive",
	// "dependent",
	"manual"
] as const

export const modifierKinds = [
	"unknown",
	...acceptableModifierKinds
] as const
