// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import { act, render, cleanup } from "@testing-library/svelte"

import Component from "./choice_list_field.svelte"

describe("Choice list field behavior", () => {
	it("can render with known value", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "",
			"disabled": false,
			"value": "a",
			"rawChoices": [ "a", "b", "c" ],
			"choiceConverter": (choice) => ({
				"data": choice,
				"label": choice.toUpperCase()
			}),
			"errors": []
		}
		const { container, getByRole } = render(Component, props)

		const select = getByRole("combobox")

		expect(select.querySelector("option[value='']")).toBeFalsy()

		cleanup()
	})

	it("can render with unknown value", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "",
			"disabled": false,
			"value": "",
			"rawChoices": [ "a", "b", "c" ],
			"choiceConverter": (choice) => ({
				"data": choice,
				"label": choice.toUpperCase()
			}),
			"rawChoices": [ "a", "b", "c" ],
			"rawChoices": [ "a", "b", "c" ],
			"choiceConverter": (choice) => ({
				"data": choice,
				"label": choice.toUpperCase()
			}),
			"errors": []
		}
		const { container, getByRole } = render(Component, props)

		const select = getByRole("combobox")

		expect(select.querySelector("option[value='']")).toBeTruthy()

		cleanup()
	})

	it("can render with no error", async () => {
		const user = userEvent.setup()
		const props = {
			"fieldName": "hello",
			"disabled": false,
			"value": "",
			"rawChoices": [ "a", "b", "c" ],
			"choiceConverter": (choice) => ({
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
			"rawChoices": [ "a", "b", "c" ],
			"choiceConverter": (choice) => ({
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

		const paragraph = container.querySelector("p")

		expect(paragraph).not.toBeNull()

		cleanup()
	})
})
