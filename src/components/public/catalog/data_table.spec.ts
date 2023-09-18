// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import { render, cleanup } from "@testing-library/svelte"

import type { Entity } from "%/currencies/types"

import Component from "./data_table.svelte"

describe("Data table behavior", () => {
	it("can show loading state", async () => {
		const collectiveName = "Currencies"
		const isConnecting = true
		const data: Entity[] = []
		const { container, getAllByRole } = render(Component, {
			collectiveName,
			isConnecting,
			data
		})

		const progress = getAllByRole("progressbar")

		expect(progress).not.toBeNull()

		cleanup()
	})

	it("can hide loading state", async () => {
		const collectiveName = "Currencies"
		const isConnecting = false
		const data: Entity[] = []
		const { container } = render(Component, {
			collectiveName,
			isConnecting,
			data
		})

		const progress = container.querySelector(".mdc-linear-progress--closed")

		expect(progress).not.toBeNull()

		cleanup()
	})

	it("can show empty state", async () => {
		const collectiveName = "Currencies"
		const isConnecting = false
		const data: Entity[] = []
		const { container } = render(Component, {
			collectiveName,
			isConnecting,
			data
		})

		const paragraph = container.querySelector("p")

		expect(paragraph).not.toBeNull()

		cleanup()
	})

	it("can show filled state", async () => {
		const collectiveName = "Currencies"
		const isConnecting = false
		const data: Entity[] = [
			{
				"id": 1,
				"name": "Hello World",
				"code": "HW0",
				"created_at": (new Date()).toISOString(),
				"updated_at": (new Date()).toISOString()
			},
			{
				"id": 2,
				"name": "Bar Foo",
				"code": "BF1",
				"created_at": (new Date()).toISOString(),
				"updated_at": (new Date()).toISOString()
			}
		]
		const { container, getAllByRole } = render(Component, {
			collectiveName,
			isConnecting,
			data
		})

		const table = getAllByRole("table")

		expect(table).not.toBeNull()

		cleanup()
	})
})
