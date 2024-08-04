import type { Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

import { multiplyAmount } from "!/index"

export default function deriveExchangeRate(
	sourceCurrency: Currency,
	destinationCurrency: Currency,
	exchangeRates: ExchangeRateInfo[]
): ExchangeRateInfo {

}
