import type { Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

export default function findExchangeRatePaths(
	destinationCurrency: Currency,
	exchangeRates: ExchangeRateInfo[],
	currentPath: ExchangeRateInfo[]
): ExchangeRateInfo[][] {
	return []
}
