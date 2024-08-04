import type { Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

import { multiplyAmount, divideAmount } from "!/index"

import convertAmount from "$/utility/convert_amount"
import findLightestPath from "$/utility/derive_exchange_rate/find_lightest_path"
import findPaths from "$/utility/derive_exchange_rate/find_paths"

export default function deriveExchangeRate(
	sourceCurrency: Currency,
	destinationCurrency: Currency,
	exchangeRates: ExchangeRateInfo[]
): ExchangeRateInfo {
	if (sourceCurrency.id === destinationCurrency.id) {
		return {
			"source": {
				"currency_id": sourceCurrency.id,
				value: "1"
			},
			"destination": {
				"currency_id": destinationCurrency.id,
				value: "1"
			},
			"updated_at": (new Date()).toDateString()
		}
	}

	const reverseExchangeRates = exchangeRates.map(exchangeRate => ({
		"source": exchangeRate.destination,
		"destination": exchangeRate.source,
		"updated_at": exchangeRate.updated_at
	}))

	const knownExchangeRates = [
		...exchangeRates,
		...reverseExchangeRates
	]

	const initialPaths = knownExchangeRates.filter(
		exchangeRate => exchangeRate.source.currency_id === sourceCurrency.id
	).map(foundExchangeRate => [ foundExchangeRate ])
	const paths = initialPaths
		.map(path => findPaths(destinationCurrency, exchangeRates, path))
		.reduce((previousPaths, currentPathCollection) => {
			return [
				...previousPaths,
				...currentPathCollection
			]
		}, [])

	const lightPath = findLightestPath(paths, Date.now())
	const timestamps = lightPath.map(
		exchangeRate => new Date(exchangeRate.updated_at)
	)
	timestamps.sort().reverse()

	return {
		"source": {
			"currency_id": sourceCurrency.id,
			value: lightPath
				.map(exchangeRate => exchangeRate.source.value)
				.reduce((previousValue, currentValue) => {
					return multiplyAmount(previousValue, currentValue)
				}, "1")
		},
		"destination": {
			"currency_id": destinationCurrency.id,
			value: lightPath
			.map(exchangeRate => exchangeRate.destination.value)
			.reduce((previousValue, currentValue) => {
				return multiplyAmount(previousValue, currentValue)
			}, "1")
		},
		"updated_at": timestamps[0]
	}
}
