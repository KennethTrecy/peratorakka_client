import { describe, it, expect } from "vitest"

import topicFunction from "./separate_numeric_parts"

describe("Separate numeric parts function behavior", () => {
	it("can separate positive whole with no zero decimal places", async () => {
		const data = "PHP 1"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", "", "", "" ])
	})

	it("can separate positive values with no hidden zero decimal places", async () => {
		const data = "PHP 1.00"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", ".00", "", "" ])
	})

	it("can separate positive values with some hidden zero decimal places", async () => {
		const data = "PHP 1.0-"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", ".0", "0", ""])
	})

	it("can separate positive whole with non-zero decimal places", async () => {
		const data = "PHP 1.1"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", ".1", "", "" ])
	})

	it("can separate positive values with no hidden non-zero decimal places", async () => {
		const data = "PHP 1.20"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", ".20", "", "" ])
	})

	it("can separate positive values with some hidden non-zero decimal places", async () => {
		const data = "PHP 1.4-"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", ".4", "0", ""])
	})

	it("can separate positive values with most hidden non-zero decimal places", async () => {
		const data = "PHP 1.4--"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", ".4", "00", ""])
	})

	it("can separate zero whole with no zero decimal places", async () => {
		const data = "PHP 0"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 0", "", "", "" ])
	})

	it("can separate zero values with no hidden zero decimal places", async () => {
		const data = "PHP 0.00"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 0", ".00", "", "" ])
	})

	it("can separate zero values with some hidden zero decimal places", async () => {
		const data = "PHP 0.0-"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 0", ".0", "0", ""])
	})

	it("can separate zero values with most hidden non-zero decimal places", async () => {
		const data = "PHP 0.0--"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 0", ".0", "00", ""])
	})

	it("can separate zero values with all hidden zero decimal places", async () => {
		const data = "PHP 0.--"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 0", "", ".00", "" ])
	})

	it("can separate negative whole with no zero decimal places", async () => {
		const data = "(PHP 1)"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "(PHP 1)", "", "", "" ])
	})

	it("can separate negative values with no hidden zero decimal places", async () => {
		const data = "(PHP 1.00)"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "(PHP 1", ".00", "", ")" ])
	})

	it("can separate negative values with some hidden zero decimal places", async () => {
		const data = "(PHP 1.0-)"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "(PHP 1", ".0", "0", ")"])
	})

	it("can separate negative values with most hidden non-zero decimal places", async () => {
		const data = "(PHP 1.4--)"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "(PHP 1", ".4", "00", ")"])
	})

	it("can separate negative values with all hidden zero decimal places", async () => {
		const data = "(PHP 1.--)"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "(PHP 1", "", ".00", ")" ])
	})
})
