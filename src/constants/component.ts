import type { Account } from "+/entity"
import type { BufferDelayConfiguration } from "+/component"

export const UNKNOWN_OPTION = "unknown"

export const UNKNOWN_ACCOUNT: Account = {
	"id": 0,
	"name": "Unknown",
	"description": "Either the associated account is still loading or not yet created.",
	currency_id: 0,
	kind: "unknown",
	created_at: "",
	updated_at: ""
}

export const DEFAULT_MINIMUM_FRACTION_DIGITS = 2
export const DEFAULT_MAXIMUM_FRACTION_DIGITS = 12
export const DEFAULT_MINIMUM_PROGRESS_RATE = 0.005
export const DEFAULT_BUFFER_DELAY_CONFIGURATIONS: BufferDelayConfiguration[] = [
	{
		"rate": 0.05,
		"delay": 150
	},
	{
		"rate": 0.1,
		"delay": 250
	},
	{
		"rate": 0.15,
		"delay": 500
	},
	{
		"rate": 0.2,
		"delay": 750
	}
]
