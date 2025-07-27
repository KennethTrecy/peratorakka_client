// @vitest-environment jsdom
import type { TextFieldVariant } from "+/component"

import { describe, it, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import { render, cleanup } from "@testing-library/svelte/svelte5"

import Component from "./text_field.svelte"

describe("Text field behavior", () => {
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

	it("can render as email", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "",
			"disabled": false,
			"value": "",
			"errors": [],
			"variant": "email" as TextFieldVariant
		}
		const { container, getByRole } = render(Component, props)

		const textBox = getByRole("textbox") as HTMLInputElement

		expect(textBox.type).toBe("email")

		cleanup()
	})
})
