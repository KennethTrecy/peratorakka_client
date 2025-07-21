import type { Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

import deriveExchangeRate from "$/utility/derive_exchange_rate"

export default function deriveExchangeRateQuickly(
	sourceCurrencyID: number,
	viewedCurrencyID: number,
	currencies: Currency[],
	exchangeRates: ExchangeRateInfo[]
): ExchangeRateInfo|null {
	const sourceCurrency = currencies.find(
		currency => currency.id === sourceCurrencyID
	) ?? currencies[0]
	const viewedCurrency = currencies.find(
		currency => currency.id === viewedCurrencyID
	) ?? sourceCurrency

	return deriveExchangeRate(sourceCurrency, viewedCurrency, exchangeRates)
}
