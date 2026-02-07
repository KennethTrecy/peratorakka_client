import type { PrecisionFormat, Currency } from "+/entity"
import type { ExchangeRateInfo, ApproximateAndExactFormats } from "+/rest"

import prepareShownAmount from "$/utility/prepare_shown_amount"
import formatAmount from "$/utility/format_amount"

export default function makeShownAmount(
	precisionFormats: PrecisionFormat[],
	currencies: Currency[],
	exchangeRate: ExchangeRateInfo,
	statementCurrency: Currency,
	viewedCurrency: Currency,
	amount: string
): ApproximateAndExactFormats {
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

	return [
		formatAmount(precisionFormat, shownCurrency, convertedAmount),
		convertedAmount
	]
}
