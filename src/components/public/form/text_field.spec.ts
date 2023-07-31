// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import { act, render, cleanup } from "@testing-library/svelte"

import Component from "./text_field.svelte"

describe("Text field behavior", () => {
	it("can be activated with new value", async () => {
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

	it("can be activated with new value", async () => {
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
})
