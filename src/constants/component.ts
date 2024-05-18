import type { Account, CashFlowCategory } from "+/entity"
import type { BufferDelayConfiguration } from "+/component"

export const UNKNOWN_OPTION = "unknown"

export const UNKNOWN_ACCOUNT: Account = {
	"id": 0,
	"name": "Unknown",
	"description": "Either the associated account is still loading or not yet created.",
	"currency_id": 0,
	"cash_flow_category_id": 0,
	"kind": "unknown",
	"created_at": "",
	"updated_at": ""
}

export const NO_CASH_FLOW_CATEGORY: CashFlowCategory = {
	"id": 0,
	"name": "No Cash Flow Category",
	"description": "This is an option used to represent uncategorized accounts.",
	"kind": "unknown",
	"created_at": "",
	"updated_at": ""
}

export const DEFAULT_MINIMUM_FRACTION_DIGITS = 2
export const DEFAULT_MAXIMUM_FRACTION_DIGITS = 12
export const DEFAULT_MINIMUM_PROGRESS_RATE = 0.005
export const DEFAULT_BUFFER_DELAY_CONFIGURATIONS: BufferDelayConfiguration[] = [
	{
		"rate": 0.05,
		"delay": 0
	},
	{
		"rate": 0.1,
		"delay": 100
	},
	{
		"rate": 0.15,
		"delay": 300
	},
	{
		"rate": 0.165,
		"delay": 400
	},
	{
		"rate": 0.175,
		"delay": 525
	},
	{
		"rate": 0.185,
		"delay": 600
	},
	{
		"rate": 0.2,
		"delay": 750
	},
	{
		"rate": 0.235,
		"delay": 875
	},
	{
		"rate": 0.25,
		"delay": 1000
	},
	{
		"rate": 0.26,
		"delay": 1075
	},
	{
		"rate": 0.275,
		"delay": 1125
	},
	{
		"rate": 0.28,
		"delay": 1150
	},
	{
		"rate": 0.3,
		"delay": 1250
	},
	{
		"rate": 0.31,
		"delay": 1550
	},
	{
		"rate": 0.325,
		"delay": 1750
	},
	{
		"rate": 0.335,
		"delay": 2000
	},
	{
		"rate": 0.35,
		"delay": 2500
	},
	{
		"rate": 0.4,
		"delay": 3000
	}
]
