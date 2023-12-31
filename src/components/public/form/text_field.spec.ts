// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import { act, render, cleanup } from "@testing-library/svelte"

import Component from "./text_field.svelte"

describe("Text field behavior", () => {
	it("can render with no value", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "",
			"disabled": false,
			"value": "",
			"errors": [],
		}
		const { container, getByRole } = render(Component, props)

		expect(container.querySelector(".mdc-floating-label--float-above")).toBeNull()

		cleanup()
	})

	it("can render with new value", async () => {
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

		expect(container.querySelector(".mdc-floating-label--float-above")).not.toBeNull()

		cleanup()
	})

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

		const paragraph = container.querySelector("p")

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

		const paragraph = container.querySelector("p")

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
			"variant": "email"
		}
		const { container, getByRole } = render(Component, props)

		const textBox = getByRole("textbox")

		expect(textBox.type).toBe("email")

		cleanup()
	})
})
