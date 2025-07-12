import type { PrecisionFormat, Currency } from "+/entity"

import { formatAmount as formatAmountStrictly } from "!/index"
import cleanValue from "$/utility/clean_value"
import parenthesizeValue from "$/utility/parenthesize_value"

export default function formatAmount(
	precisionFormat: PrecisionFormat | undefined,
	currency: Currency | undefined,
	amount: string
): string {
	const [ isNegative, cleanAmount ] = cleanValue(amount)

	return parenthesizeValue(isNegative, formatAmountStrictly(
		precisionFormat,
		currency,
		cleanAmount
	))
}
