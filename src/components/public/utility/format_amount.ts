import type { Currency } from "+/entity"

import { DEFAULT_MINIMUM_FRACTION_DIGITS, DEFAULT_MAXIMUM_FRACTION_DIGITS } from "#/component"

import { formatAmount as formatAmountStrictly } from "!/index"

export default function formatAmount(currency: Currency | undefined, amount: string): string {
	const minimumFractionDigits = DEFAULT_MINIMUM_FRACTION_DIGITS
	const maximumFractionDigits = DEFAULT_MAXIMUM_FRACTION_DIGITS
	const isNegative = amount.startsWith("-")
	const cleanAmount = isNegative ? amount.slice(1): amount

	return `${isNegative ? "(" : ""}${formatAmountStrictly(
		currency,
		cleanAmount,
		minimumFractionDigits,
		maximumFractionDigits
	)}${isNegative ? ")" : ""}`
}
