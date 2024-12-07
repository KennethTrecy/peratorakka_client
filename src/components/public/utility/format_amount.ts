import type { Currency } from "+/entity"

import { DEFAULT_MINIMUM_FRACTION_DIGITS, DEFAULT_MAXIMUM_FRACTION_DIGITS } from "#/component"

import { formatAmount as formatAmountStrictly } from "!/index"

export default function formatAmount(currency: Currency | undefined, amount: string): string {
	const minimumFractionDigits = typeof currency === "undefined"
		? DEFAULT_MINIMUM_FRACTION_DIGITS
		: currency.presentational_precision
	const maximumFractionDigits = typeof currency === "undefined"
		? DEFAULT_MAXIMUM_FRACTION_DIGITS
		: currency.presentational_precision

	const isNegative = amount.startsWith("-")
	const cleanAmount = isNegative ? amount.slice(1): amount

	return `${isNegative ? "(" : ""}${formatAmountStrictly(
		currency,
		cleanAmount,
		minimumFractionDigits,
		maximumFractionDigits
	)}${isNegative ? ")" : ""}`
}
