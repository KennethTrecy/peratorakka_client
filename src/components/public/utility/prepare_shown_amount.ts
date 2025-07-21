import type { PrecisionFormat, Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

import convertAmount from "$/utility/convert_amount"

export default function prepareShownAmount(
	precisionFormats: PrecisionFormat[],
	currencies: Currency[],
	exchangeRate: ExchangeRateInfo,
	statementCurrency: Currency,
	viewedCurrency: Currency,
	amount: string
): [ PrecisionFormat | undefined, Currency, string ] {
	const convertedAmount = convertAmount(amount, exchangeRate)
	let shownCurrency = viewedCurrency

	if (exchangeRate.destination.currency_id === statementCurrency.id) {
		shownCurrency = statementCurrency
	} else if (exchangeRate.destination.currency_id !== viewedCurrency.id) {
		shownCurrency = currencies.find(currency => {
			return currency.id === exchangeRate.destination.currency_id
		}) ?? viewedCurrency
	}

	const precisionFormat = precisionFormats.find(precisionFormat => {
		return precisionFormat.id === shownCurrency.precision_format_id
	})

	return [ precisionFormat, shownCurrency, convertedAmount ]
}
