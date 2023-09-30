import { describe, it, expect } from "vitest"

import topicFunction from "./merge_unique_resources"

describe("Merge unique resources function behavior", () => {
	it("can retain element order upon merging", async () => {
		const originalData = [
			{ "id": 1, "name": "foo" },
			{ "id": 2, "name": "bar" }
		]
		const newData = [
			{ "id": 3, "name": "baz" },
			{ "id": 2, "name": "bar" },
			{ "id": 1, "name": "foo" }
		]

		const result = topicFunction(originalData, newData)

		expect(result).toStrictEqual([
			{ "id": 1, "name": "foo" },
			{ "id": 2, "name": "bar" },
			{ "id": 3, "name": "baz" }
		])
	})

	it("can retain element order upon merging same but different order of resources", async () => {
		const originalData = [
			{ "id": 1, "name": "foo" },
			{ "id": 2, "name": "bar" }
		]
		const newData = [
			{ "id": 2, "name": "bar" },
			{ "id": 1, "name": "foo" }
		]

		const result = topicFunction(originalData, newData)

		expect(result).toStrictEqual([
			{ "id": 1, "name": "foo" },
			{ "id": 2, "name": "bar" }
		])
	})
})
