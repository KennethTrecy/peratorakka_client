import type { Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

import { describe, it, expect } from "vitest"

import topicFunction from "./find_exchange_rate_path"

describe("Find exchange rate path function behavior", () => {
	it("can find direct rates", async () => {
		const destinationCurrency: Currency = {
			"id": 3,
			"name": "Currency C",
			"code": "C"
		}

		const exchangeRates: ExchangeRateInfo[] = [
			{
				"source": {
					"currency_id": 1,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			},
			{
				"source": {
					"currency_id": 2,
					"value": "2"
				},
				"destination": {
					"currency_id": 3,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			}
		]

		const currentPath: ExchangeRateInfo = [ exchangeRates[0] ]

		const result = topicFunction(destinationCurrency, exchangeRates, currentPath)

		expect(result).toStrictEqual([ [ exchangeRates[0], exchangeRates[1] ] ])
	})

	it("can find indirect rates", async () => {
		const destinationCurrency: Currency = {
			"id": 2,
			"name": "Currency B",
			"code": "B"
		}

		const exchangeRates: ExchangeRateInfo[] = [
			{
				"source": {
					"currency_id": 1,
					"value": "2"
				},
				"destination": {
					"currency_id": 3,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			},
			{
				"source": {
					"currency_id": 3,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			},
			{
				"source": {
					"currency_id": 3,
					"value": "2"
				},
				"destination": {
					"currency_id": 4,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			},
			{
				"source": {
					"currency_id": 4,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			}
		]

		const currentPath: ExchangeRateInfo = [ exchangeRates[0] ]

		const result = topicFunction(destinationCurrency, exchangeRates, currentPath)

		expect(result).toStrictEqual([
			[ exchangeRates[0], exchangeRates[1] ],
			[ exchangeRates[0], exchangeRates[2], exchangeRates[3] ]
		])
	})

	it("can stop early", async () => {
		const destinationCurrency: Currency = {
			"id": 2,
			"name": "Currency B",
			"code": "B"
		}

		const exchangeRates: ExchangeRateInfo[] = [
			{
				"source": {
					"currency_id": 1,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			}
		]

		const currentPath: ExchangeRateInfo = [ exchangeRates[0] ]

		const result = topicFunction(destinationCurrency, exchangeRates, currentPath)

		expect(result).toStrictEqual([ [ exchangeRates[0] ] ])
	})

	it("can skip loops", async () => {
		const destinationCurrency: Currency = {
			"id": 2,
			"name": "Currency B",
			"code": "B"
		}

		const exchangeRates: ExchangeRateInfo[] = [
			{
				"source": {
					"currency_id": 1,
					"value": "2"
				},
				"destination": {
					"currency_id": 3,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			},
			{
				"source": {
					"currency_id": 3,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			},
			{
				"source": {
					"currency_id": 3,
					"value": "2"
				},
				"destination": {
					"currency_id": 4,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			},
			{
				"source": {
					"currency_id": 4,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			},
			{
				"source": {
					"currency_id": 4,
					"value": "2"
				},
				"destination": {
					"currency_id": 3,
					"value": "3"
				},
				"updated_at": (new Date()).toDateString()
			}
		]

		const currentPath: ExchangeRateInfo = [ exchangeRates[0] ]

		const result = topicFunction(destinationCurrency, exchangeRates, currentPath)

		expect(result).toStrictEqual([
			[ exchangeRates[0], exchangeRates[1] ],
			[ exchangeRates[0], exchangeRates[2], exchangeRates[3] ]
		])
	})
})
