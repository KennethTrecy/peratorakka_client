import type { Account } from "+/entity"

export const UNKNOWN_OPTION = "unknown"

export const UNKNOWN_ACCOUNT: Account = {
	"id": 0,
	"name": "Unknown",
	"description": "Either the associated account is still loading or not yet created."
}

export const DEFAULT_MINIMUM_FRACTION_DIGITS = 2
export const DEFAULT_MAXIMUM_FRACTION_DIGITS = 12
