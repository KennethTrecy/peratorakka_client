// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import { act, render, cleanup } from "@testing-library/svelte"

import { UNKNOWN_OPTION } from "#/component"

import Component from "./choice_list_field.svelte"

describe("Choice list field behavior", () => {
	it("can render with known value", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "",
			"disabled": false,
			"value": "a",
			"rawChoices": [ "a", "b", "c" ],
			"choiceConverter": (choice: any) => ({
				"data": choice,
				"label": choice.toUpperCase()
			}),
			"errors": []
		}
		const { container } = render(Component, props)

		const selectedText = container.querySelector("option:checked") as HTMLOptionElement

		expect(selectedText.innerHTML).toEqual("A")

		cleanup()
	})

	it("can render with unknown value and select first choice automatically", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "",
			"disabled": false,
			"value": UNKNOWN_OPTION,
			"rawChoices": [ "b", "a", "c" ],
			"choiceConverter": (choice: any) => ({
				"data": choice,
				"label": choice.toUpperCase()
			}),
			"errors": []
		}
		const { container } = render(Component, props)

		const selectedText = container.querySelector("option:checked") as HTMLOptionElement

		expect(selectedText.innerHTML).toEqual("B")

		cleanup()
	})

	it("can render with no error", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "hello",
			"disabled": false,
			"value": "",
			"rawChoices": [ "a", "b", "c" ],
			"choiceConverter": (choice: any) => ({
				"data": choice,
				"label": choice.toUpperCase()
			}),
			"errors": [
				{
					"message": "world"
				}
			]
		}
		const { container } = render(Component, props)

		const paragraph = container.querySelector("span")

		expect(paragraph).toBeNull()

		cleanup()
	})

	it("can render with error", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "hello",
			"disabled": false,
			"value": "",
			"rawChoices": [ "a", "b", "c" ],
			"choiceConverter": (choice: any) => ({
				"data": choice,
				"label": choice.toUpperCase()
			}),
			"errors": [
				{
					"field": "hello",
					"message": "world"
				}
			]
		}
		const { container } = render(Component, props)

		const paragraph = container.querySelector("span")

		expect(paragraph).not.toBeNull()

		cleanup()
	})
})
