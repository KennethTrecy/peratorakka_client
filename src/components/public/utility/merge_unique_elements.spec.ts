import { describe, it, expect } from "vitest"

import topicFunction from "./merge_unique_elements"

describe("Merge unique elements function behavior", () => {
	it("can retain element order upon merging", async () => {
		const originalData = [
			{ "name": "foo" },
			{ "name": "bar" }
		]
		const newData = [
			{ "name": "baz" },
			{ "name": "bar" },
			{ "name": "foo" }
		]
		const keyGenerator = element => element.name

		const result = topicFunction(originalData, newData, keyGenerator)

		expect(result).toStrictEqual([
			{ "name": "foo" },
			{ "name": "bar" },
			{ "name": "baz" }
		])
	})

	it("can retain element order upon merging same but different order of elements", async () => {
		const originalData = [
			{ "name": "foo" },
			{ "name": "bar" }
		]
		const newData = [
			{ "name": "bar" },
			{ "name": "foo" }
		]
		const keyGenerator = element => element.name

		const result = topicFunction(originalData, newData, keyGenerator)

		expect(result).toStrictEqual([
			{ "name": "foo" },
			{ "name": "bar" }
		])
	})
})
