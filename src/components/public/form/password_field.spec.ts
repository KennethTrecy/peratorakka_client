// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import { act, render, cleanup } from "@testing-library/svelte"

import Component from "./password_field.svelte"

describe("Password field behavior", () => {
	it.skip("can render with no value", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "",
			"disabled": false,
			"value": "",
			"errors": [],
		}
		const { container, getByRole } = render(Component, props)

		const textBox = getByRole("textbox")

		expect(textBox.classList.contains("active")).toBeFalsy()

		cleanup()
	})

	it.skip("can render with new value", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "",
			"disabled": false,
			"value": "",
			"errors": [],
		}
		const { container, getByRole } = render(Component, props)

		const textBox = getByRole("textbox")
		await user.type(textBox, "Hello world")

		expect(textBox.classList.contains("active")).toBeTruthy()

		cleanup()
	})

	it.skip("can render with no error", async () => {
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

		const paragraph = container.querySelector("p")

		expect(paragraph).toBeNull()

		cleanup()
	})

	it.skip("can render with error", async () => {
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

		const paragraph = container.querySelector("p")

		expect(paragraph).not.toBeNull()

		cleanup()
	})
})
