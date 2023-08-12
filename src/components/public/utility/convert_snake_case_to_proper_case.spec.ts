import { describe, it, expect } from "vitest"

import topicFunction from "./convert_snake_case_to_proper_case"

describe("Snake case to proper case function behavior", () => {
	it("can convert correctly", async () => {
		const data = "hello_world"

		const result = topicFunction(data)

		expect(result).toBe("Hello World")
	})
})
