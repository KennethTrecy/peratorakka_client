import type { Currency } from "+/entity"

import { DEFAULT_MINIMUM_FRACTION_DIGITS, DEFAULT_MAXIMUM_FRACTION_DIGITS } from "#/component"

import { formatAmount as formatAmountStrictly } from "!/index"
import cleanValue from "$/utility/clean_value"
import parenthesizeValue from "$/utility/parenthesize_value"

export default function formatAmount(currency: Currency | undefined, amount: string): string {
	const minimumFractionDigits = typeof currency === "undefined"
		? DEFAULT_MINIMUM_FRACTION_DIGITS
		: currency.presentational_precision
	const maximumFractionDigits = typeof currency === "undefined"
		? DEFAULT_MAXIMUM_FRACTION_DIGITS
		: currency.presentational_precision

	const [ isNegative, cleanAmount ] = cleanValue(amount)

	return parenthesizeValue(isNegative, formatAmountStrictly(
		currency,
		cleanAmount,
		minimumFractionDigits,
		maximumFractionDigits
	))
}
