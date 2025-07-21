import type { PrecisionFormat, Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

import cleanValue from "$/utility/clean_value"
import { formatAmount as formatAmountStrictly } from "!/index"
import prepareShownAmount from "$/utility/prepare_shown_amount"

export default function makeCleanShownAmount(
	precisionFormats: PrecisionFormat[],
	currencies: Currency[],
	exchangeRate: ExchangeRateInfo,
	statementCurrency: Currency,
	viewedCurrency: Currency,
	amount: string
): [ boolean, string ] {
	const [
		precisionFormat,
		shownCurrency,
		convertedAmount
	] = prepareShownAmount(
		precisionFormats,
		currencies,
		exchangeRate,
		statementCurrency,
		viewedCurrency,
		amount
	)

	const [ isNegative, cleanAmount ] = cleanValue(convertedAmount)

	return [ isNegative, formatAmountStrictly(precisionFormat, shownCurrency, cleanAmount) ]
}
