import type { Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

export default function findPaths(
	viewedCurrency: Currency,
	exchangeRates: ExchangeRateInfo[],
	currentPath: ExchangeRateInfo[]
): ExchangeRateInfo[][] {
	const lastPathIndex = currentPath.length - 1;
	const lastExchangeRate = currentPath[lastPathIndex]
	if (lastExchangeRate.destination.currency_id === viewedCurrency.id) {
		return [
			currentPath
		]
	}

	const lastFoundCurrencyIDs = new Set(
		currentPath.reduce((previousIDs, exchangeRate) => {
			return [
				...previousIDs,
				exchangeRate.source.currency_id,
				exchangeRate.destination.currency_id
			]
		}, [])
	)

	let foundPaths: ExchangeRateInfo[][] = []

	for (const exchangeRate of exchangeRates) {
		if (
			exchangeRate.source.currency_id === lastExchangeRate.destination.currency_id
			&& !lastFoundCurrencyIDs.has(exchangeRate.destination.currency_id)
		) {
			const newPath = [ ...currentPath, exchangeRate ];
			foundPaths = [
				...foundPaths,
				...findPaths(viewedCurrency, exchangeRates, newPath)
			]
		}
	}

	return foundPaths
}
