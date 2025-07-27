import { describe, it, expect } from "vitest"

import topicFunction from "./separate_numeric_parts"

describe("Separate numeric parts function behavior", () => {
	it("can separate positive whole values", async () => {
		const data = "PHP 1"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", "", "", "" ])
	})

	it("can separate positive values with no hidden decimal places", async () => {
		const data = "PHP 1.00"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", ".00", "", "" ])
	})

	it("can separate positive values with some hidden decimal places", async () => {
		const data = "PHP 1.0-"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", ".0", "0", ""])
	})

	it("can separate positive values with all hidden decimal places", async () => {
		const data = "PHP 1.--"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 1", "", ".00", "" ])
	})

	it("can separate zero whole values", async () => {
		const data = "PHP 0"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 0", "", "", "" ])
	})

	it("can separate zero values with no hidden decimal places", async () => {
		const data = "PHP 0.00"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 0", ".00", "", "" ])
	})

	it("can separate zero values with some hidden decimal places", async () => {
		const data = "PHP 0.0-"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 0", ".0", "0", ""])
	})

	it("can separate zero values with all hidden decimal places", async () => {
		const data = "PHP 0.--"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "PHP 0", "", ".00", "" ])
	})

	it("can separate negative whole values", async () => {
		const data = "(PHP 1)"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "(PHP 1)", "", "", "" ])
	})

	it("can separate negative values with no hidden decimal places", async () => {
		const data = "(PHP 1.00)"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "(PHP 1", ".00", "", ")" ])
	})

	it("can separate negative values with some hidden decimal places", async () => {
		const data = "(PHP 1.0-)"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "(PHP 1", ".0", "0", ")"])
	})

	it("can separate negative values with all hidden decimal places", async () => {
		const data = "(PHP 1.--)"

		const result = topicFunction(data)

		expect(result).toStrictEqual([ "(PHP 1", "", ".00", ")" ])
	})
})
