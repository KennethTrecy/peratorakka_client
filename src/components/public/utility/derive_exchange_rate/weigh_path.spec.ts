import type { Currency } from "+/entity"
import type { ExchangeRateInfo } from "+/rest"

import { describe, it, expect } from "vitest"

import topicFunction from "./weigh_path"

describe("Grade path function behavior", () => {
	it("can weigh direct rates", async () => {
		const currentTime = (new Date(Date.now())).getTime()
		const currentPath: ExchangeRateInfo[] = [
			{
				"source": {
					"currency_id": 1,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date(currentTime - 1000)).toISOString()
			}
		]

		const result = topicFunction(currentPath, currentTime)

		expect(result).toBe(1000)
	})

	it("can weigh indirect rates", async () => {
		const currentTime = (new Date(Date.now())).getTime()
		const currentPath: ExchangeRateInfo[] = [
			{
				"source": {
					"currency_id": 1,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date(currentTime - 1000)).toISOString()
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
				"updated_at": (new Date(currentTime - 500)).toISOString()
			}
		]

		const result = topicFunction(currentPath, currentTime)

		expect(result).toBe(1500)
	})

	it("can weigh multiple indirect rates", async () => {
		const currentTime = (new Date(Date.now())).getTime()
		const currentPath: ExchangeRateInfo[] = [
			{
				"source": {
					"currency_id": 1,
					"value": "2"
				},
				"destination": {
					"currency_id": 2,
					"value": "3"
				},
				"updated_at": (new Date(currentTime - 1000)).toISOString()
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
				"updated_at": (new Date(currentTime - 500)).toISOString()
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
				"updated_at": (new Date(currentTime - 200)).toISOString()
			}
		]

		const result = topicFunction(currentPath, currentTime)

		expect(result).toBe(1700)
	})
})
