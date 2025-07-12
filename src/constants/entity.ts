export const UNKNOWN_ACCOUNT_KIND = "unknown"
export const GENERAL_ASSET_ACCOUNT_KIND = "general_asset"
export const LIABILITY_ACCOUNT_KIND = "liability"
export const EQUITY_ACCOUNT_KIND = "equity"
export const GENERAL_EXPENSE_ACCOUNT_KIND = "general_expense"
export const GENERAL_REVENUE_ACCOUNT_KIND = "general_revenue"
export const LIQUID_ASSET_ACCOUNT_KIND = "liquid_asset"
export const DEPRECIATIVE_ASSET_ACCOUNT_KIND = "depreciative_asset"
export const GENERAL_TEMPORARY_ACCOUNT_KIND = "general_temporary"
export const ITEMIZED_ASSET_ACCOUNT_KIND = "itemized_asset"
export const DIRECT_COST_ACCOUNT_KIND = "direct_cost"
export const NOMINAL_RETURN_ACCOUNT_KIND = "nominal_return"

export const acceptableAccountKinds = [
	GENERAL_ASSET_ACCOUNT_KIND,
	LIABILITY_ACCOUNT_KIND,
	EQUITY_ACCOUNT_KIND,
	GENERAL_EXPENSE_ACCOUNT_KIND,
	GENERAL_REVENUE_ACCOUNT_KIND,
	LIQUID_ASSET_ACCOUNT_KIND,
	DEPRECIATIVE_ASSET_ACCOUNT_KIND,
	GENERAL_TEMPORARY_ACCOUNT_KIND,
	DIRECT_COST_ACCOUNT_KIND,
	NOMINAL_RETURN_ACCOUNT_KIND
	// Below are the kinds not yet supported
	// ITEMIZED_ASSET_ACCOUNT_KIND
] as const

export const accountKinds = [
	UNKNOWN_ACCOUNT_KIND,
	...acceptableAccountKinds
] as const

export const RECORD_MODIFIER_ACTION = "record"
export const CLOSE_MODIFIER_ACTION = "close"
export const EXCHANGE_MODIFIER_ACTION = "exchange"

export const acceptableModifierActions = [
	RECORD_MODIFIER_ACTION,
	CLOSE_MODIFIER_ACTION,
	EXCHANGE_MODIFIER_ACTION
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

export const UNKNOWN_MODIFIER_ATOM_KIND = "unknown"
export const REAL_DEBIT_MODIFIER_ATOM_KIND = "real_debit"
export const REAL_CREDIT_MODIFIER_ATOM_KIND = "real_credit"
export const IMAGINARY_DEBIT_MODIFIER_ATOM_KIND = "imaginary_debit"
export const IMAGINARY_CREDIT_MODIFIER_ATOM_KIND = "imaginary_credit"
export const PRICE_MODIFIER_ATOM_KIND = "price"

export const acceptableModifierAtomKinds = [
	REAL_DEBIT_MODIFIER_ATOM_KIND,
	REAL_CREDIT_MODIFIER_ATOM_KIND
	// Below are the kinds not yet supported
	//  IMAGINARY_DEBIT_MODIFIER_ATOM_KIND,
	//  IMAGINARY_CREDIT_MODIFIER_ATOM_KIND,
	//  PRICE_MODIFIER_ATOM_KIND
] as const

export const modifierAtomKinds = [
	UNKNOWN_MODIFIER_ATOM_KIND,
	...acceptableModifierAtomKinds
] as const

export const UNKNOWN_FINANCIAL_ENTRY_ATOM_KIND = "unknown";
export const QUANTITY_FINANCIAL_ENTRY_ATOM_KIND = "quantity";
export const PRICE_FINANCIAL_ENTRY_ATOM_KIND = "price";
export const TOTAL_FINANCIAL_ENTRY_ATOM_KIND = "total";

export const acceptableFinancialEntryAtomKinds = [
    TOTAL_FINANCIAL_ENTRY_ATOM_KIND,
    QUANTITY_FINANCIAL_ENTRY_ATOM_KIND,
    PRICE_FINANCIAL_ENTRY_ATOM_KIND
];

export const financialEntryAtomKinds = [
    UNKNOWN_FINANCIAL_ENTRY_ATOM_KIND,
    ...acceptableFinancialEntryAtomKinds
];

// The lower the value, the earlier it is in the list
export const ACCOUNT_KIND_AGGREGATED_LIST_PRIOITY = {
	[LIQUID_ASSET_ACCOUNT_KIND]: 0,
	[GENERAL_ASSET_ACCOUNT_KIND]: 1,
	[ITEMIZED_ASSET_ACCOUNT_KIND]: 2,
	[GENERAL_TEMPORARY_ACCOUNT_KIND]: 3,
	[GENERAL_REVENUE_ACCOUNT_KIND]: 4,
	[NOMINAL_RETURN_ACCOUNT_KIND]: 5,
	[LIABILITY_ACCOUNT_KIND]: 6,
	[EQUITY_ACCOUNT_KIND]: 7,
	[GENERAL_EXPENSE_ACCOUNT_KIND]: 8,
	[DIRECT_COST_ACCOUNT_KIND]: 9,
	[DEPRECIATIVE_ASSET_ACCOUNT_KIND]: 10,
	[UNKNOWN_ACCOUNT_KIND]: 11
}

export const ACCOUNT_KIND_DESCRIPTIONS = {
	[LIQUID_ASSET_ACCOUNT_KIND]: "Liquid asset accounts can be converted into cash immediately (e.g. bank deposits or physical cash in wallet).",
	[ITEMIZED_ASSET_ACCOUNT_KIND]: "Itemized asset accounts are used to keep track of specific items whose quantity, costs, and value may change over time (e.g. raw materials, manufactured goods, mutual fund units).",
	[DEPRECIATIVE_ASSET_ACCOUNT_KIND]: "Depreciative asset accounts are used to keep track of assets whose value may only decrease over time (e.g. machinery, furniture).",
	[GENERAL_ASSET_ACCOUNT_KIND]: "General asset account kind is an umbrella category for assets that are neither highly liquid, itemized, nor depreciative.",
	[GENERAL_TEMPORARY_ACCOUNT_KIND]: "Temporary accounts are used to close other accounts for the next period.",
	[NOMINAL_RETURN_ACCOUNT_KIND]: "Nominal return accounts represent money made or lost as a result of price changes (e.g. gross profits, capital gains, capital losses).",
	[GENERAL_REVENUE_ACCOUNT_KIND]: "General revenue account kind is an umbrella category for revenue or income accounts that are not due to price changes.",
	[LIABILITY_ACCOUNT_KIND]: "Liability accounts represent money owed to different parties (e.g. creditors, employees, suppliers).",
	[EQUITY_ACCOUNT_KIND]: "Equity accounts represent money owned by different parties (e.g. shareholders, employees, creditors).",
	[DIRECT_COST_ACCOUNT_KIND]: "Direct cost accounts represent costs that are directly attributable to the production or acquisition of itemized assets (e.g. wages, fees).",
	[GENERAL_EXPENSE_ACCOUNT_KIND]: "General expense account kind is an umbrella category for expense accounts that are not due to direct costs.",
	[UNKNOWN_ACCOUNT_KIND]: "Unknown account kind is an umbrella category for accounts that are not yet supported."
}

export const MODIFIER_ACTION_COMBINATIONS: Record<
	typeof acceptableModifierActions[number], [
		typeof acceptableModifierAtomKinds[number], (typeof acceptableAccountKinds[number])[]
	][]
> = {
	[RECORD_MODIFIER_ACTION]: [
		[ REAL_DEBIT_MODIFIER_ATOM_KIND, [
			GENERAL_ASSET_ACCOUNT_KIND,
			LIABILITY_ACCOUNT_KIND,
			EQUITY_ACCOUNT_KIND,
			GENERAL_EXPENSE_ACCOUNT_KIND,
			GENERAL_REVENUE_ACCOUNT_KIND,
			LIQUID_ASSET_ACCOUNT_KIND,
			DEPRECIATIVE_ASSET_ACCOUNT_KIND,
			DIRECT_COST_ACCOUNT_KIND,
			NOMINAL_RETURN_ACCOUNT_KIND
		] ],
		[ REAL_CREDIT_MODIFIER_ATOM_KIND, [
			GENERAL_ASSET_ACCOUNT_KIND,
			LIABILITY_ACCOUNT_KIND,
			EQUITY_ACCOUNT_KIND,
			GENERAL_EXPENSE_ACCOUNT_KIND,
			GENERAL_REVENUE_ACCOUNT_KIND,
			LIQUID_ASSET_ACCOUNT_KIND,
			DEPRECIATIVE_ASSET_ACCOUNT_KIND,
			DIRECT_COST_ACCOUNT_KIND,
			NOMINAL_RETURN_ACCOUNT_KIND
		] ]
	],
	[CLOSE_MODIFIER_ACTION]: [
		[ REAL_DEBIT_MODIFIER_ATOM_KIND, [
			EQUITY_ACCOUNT_KIND,
			GENERAL_REVENUE_ACCOUNT_KIND,
			GENERAL_TEMPORARY_ACCOUNT_KIND,
			NOMINAL_RETURN_ACCOUNT_KIND
		] ],
		[ REAL_CREDIT_MODIFIER_ATOM_KIND, [
			EQUITY_ACCOUNT_KIND,
			GENERAL_EXPENSE_ACCOUNT_KIND,
			GENERAL_TEMPORARY_ACCOUNT_KIND,
			DIRECT_COST_ACCOUNT_KIND
		] ]
	],
	[EXCHANGE_MODIFIER_ACTION]: [
		[ REAL_DEBIT_MODIFIER_ATOM_KIND, [
			GENERAL_ASSET_ACCOUNT_KIND,
			LIABILITY_ACCOUNT_KIND,
			EQUITY_ACCOUNT_KIND,
			GENERAL_EXPENSE_ACCOUNT_KIND,
			GENERAL_REVENUE_ACCOUNT_KIND,
			LIQUID_ASSET_ACCOUNT_KIND,
			DEPRECIATIVE_ASSET_ACCOUNT_KIND
		] ],
		[ REAL_CREDIT_MODIFIER_ATOM_KIND, [
			GENERAL_ASSET_ACCOUNT_KIND,
			LIABILITY_ACCOUNT_KIND,
			EQUITY_ACCOUNT_KIND,
			GENERAL_EXPENSE_ACCOUNT_KIND,
			GENERAL_REVENUE_ACCOUNT_KIND,
			LIQUID_ASSET_ACCOUNT_KIND,
			DEPRECIATIVE_ASSET_ACCOUNT_KIND
		] ]
	]
}

const UNKNOWN_FORMULA_OUTPUT_FORMAT = "unknown"
export const RAW_FORMULA_OUTPUT_FORMAT = "raw"
export const PERCENTAGE_FORMULA_OUTPUT_FORMAT = "percentage"
export const CURRENCY_FORMULA_OUTPUT_FORMAT = "currency"

export const acceptableFormulaOutputFormats = [
	RAW_FORMULA_OUTPUT_FORMAT,
	PERCENTAGE_FORMULA_OUTPUT_FORMAT,
	CURRENCY_FORMULA_OUTPUT_FORMAT
] as const

export const formulaOutputFormats = [
	UNKNOWN_FORMULA_OUTPUT_FORMAT,
	...acceptableFormulaOutputFormats
] as const

const UNKNOWN_EXCHANGE_RATE_BASIS = "unknown"
const PERIODIC_EXCHANGE_RATE_BASIS = "periodic"
const LATEST_EXCHANGE_RATE_BASIS = "latest"

export const acceptableExchangeRateBases = [
	PERIODIC_EXCHANGE_RATE_BASIS,
	LATEST_EXCHANGE_RATE_BASIS
] as const

export const exchangeRateBases = [
	UNKNOWN_EXCHANGE_RATE_BASIS,
	...acceptableExchangeRateBases
] as const

const UNKNOWN_NUMERICAL_TOOL_KIND = "unknown"
export const NUMBER_NUMERICAL_TOOL_KIND = "number"
export const TABLE_NUMERICAL_TOOL_KIND = "table"
export const PIE_NUMERICAL_TOOL_KIND = "pie"
export const LINE_NUMERICAL_TOOL_KIND = "line"

export const acceptableNumericalToolKinds = [
	NUMBER_NUMERICAL_TOOL_KIND,
	TABLE_NUMERICAL_TOOL_KIND,
	PIE_NUMERICAL_TOOL_KIND,
	LINE_NUMERICAL_TOOL_KIND
] as const

export const numericalToolKinds = [
	UNKNOWN_NUMERICAL_TOOL_KIND,
	...acceptableNumericalToolKinds
] as const

const UNKNOWN_NUMERICAL_TOOL_RECURRENCE_PERIOD = "unknown"
export const PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD = "periodic"
export const YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD = "yearly"

export const acceptableNumericalToolRecurrencePeriods = [
	PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD,
	YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD
] as const

export const numericalToolRecurrencePeriods = [
	UNKNOWN_NUMERICAL_TOOL_RECURRENCE_PERIOD,
	...acceptableNumericalToolRecurrencePeriods
] as const

const UNKNOWN_AMOUNT_STAGE_BASIS = "unknown"
const OPENED_AMOUNT_STAGE_BASIS = "opened"
const UNADJUSTED_AMOUNT_STAGE_BASIS = "unadjusted"
const CLOSED_AMOUNT_STAGE_BASIS = "closed"

export const acceptableAmountStageBases = [
	OPENED_AMOUNT_STAGE_BASIS,
	UNADJUSTED_AMOUNT_STAGE_BASIS,
	CLOSED_AMOUNT_STAGE_BASIS
] as const

export const amountStageBases = [
	UNKNOWN_AMOUNT_STAGE_BASIS,
	...acceptableAmountStageBases
] as const

const UNKNOWN_AMOUNT_SIDE_BASIS = "unknown"
const DEBIT_AMOUNT_SIDE_BASIS = "debit"
const CREDIT_AMOUNT_SIDE_BASIS = "credit"
const NET_DEBIT_AMOUNT_SIDE_BASIS = "net_debit"
const NET_CREDIT_AMOUNT_SIDE_BASIS = "net_credit"

export const acceptableAmountSideBases = [
	DEBIT_AMOUNT_SIDE_BASIS,
	CREDIT_AMOUNT_SIDE_BASIS,
	NET_DEBIT_AMOUNT_SIDE_BASIS,
	NET_CREDIT_AMOUNT_SIDE_BASIS
] as const

export const amountSideBases = [
	UNKNOWN_AMOUNT_SIDE_BASIS,
	...acceptableAmountSideBases
] as const
