// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import { render, cleanup } from "@testing-library/svelte/svelte5"

import Component from "./password_field.svelte"

describe("Password field behavior", () => {
	it("can render with no error", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "hello",
			"disabled": false,
			"value": "",
			"errors": [
				{
					"message": "world"
				}
			]
		}
		const { container } = render(Component, props)

		const paragraph = container.querySelector("div.supporting-text")

		expect(paragraph).toBeNull()

		cleanup()
	})

	it("can render with error", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "hello",
			"disabled": false,
			"value": "",
			"errors": [
				{
					"field": "hello",
					"message": "world"
				}
			]
		}
		const { container } = render(Component, props)

		const paragraph = container.querySelector("div.supporting-text")

		expect(paragraph).not.toBeNull()

		cleanup()
	})
})
