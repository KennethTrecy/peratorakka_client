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
