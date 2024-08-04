import type { Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

import { describe, it, expect } from "vitest"

import topicFunction from "./find_lightest_path"

describe("Find lightest exchange rate path function behavior", () => {
	it("can stop early", async () => {
		const currentTime = (new Date(Date.now())).getTime()
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
				"updated_at": (new Date(currentTime)).toJSON()
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
				"updated_at": (new Date(currentTime)).toJSON()
			}
		]

		const paths = [ [ exchangeRates[0], exchangeRates[1] ] ]

		const result = topicFunction(paths, currentTime)

		expect(result).toStrictEqual(paths[0])
	})

	it("can compare direct paths", async () => {
		const currentTime = (new Date(Date.now())).getTime()
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
				"updated_at": (new Date(currentTime - 200)).toJSON()
			},
			{
				"source": {
					"currency_id": 1,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date(currentTime)).toJSON()
			}
		]

		const paths = [
			[ exchangeRates[0] ],
			[ exchangeRates[1] ]
		]

		const result = topicFunction(paths, currentTime)

		expect(result).toStrictEqual(paths[1])
	})

	it("can compare indirect paths", async () => {
		const currentTime = (new Date(Date.now())).getTime()
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
				"updated_at": (new Date(currentTime)).toJSON()
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
				"updated_at": (new Date(currentTime)).toJSON()
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
				"updated_at": (new Date(currentTime)).toJSON()
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
				"updated_at": (new Date(currentTime)).toJSON()
			}
		]

		const paths = [
			[ exchangeRates[0], exchangeRates[1] ],
			[ exchangeRates[0], exchangeRates[2], exchangeRates[3] ]
		]

		const result = topicFunction(paths, currentTime)

		expect(result).toStrictEqual(paths[0])
	})
})
