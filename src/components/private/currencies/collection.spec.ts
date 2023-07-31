// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import { render, cleanup } from "@testing-library/svelte"

import type { Entity } from "%/currencies/types"

import Component from "./collection.svelte"

describe("Currency collection behavior", () => {
	it("can render two records as collection", async () => {
		const data: Entry[] = [
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
		const { container, getAllByRole } = render(Component, { data })

		const articles = getAllByRole("article")

		expect(articles).not.toBeNull()

		cleanup()
	})

	it("can render single record as collection", async () => {
		const data: Entry[] = [
			{
				"id": 1,
				"name": "Hello World",
				"code": "HW0",
				"created_at": (new Date()).toISOString(),
				"updated_at": (new Date()).toISOString()
			}
		]
		const { container, getAllByRole } = render(Component, { data })

		const articles = getAllByRole("article")

		expect(articles).not.toBeNull()

		cleanup()
	})

	it("can render no record", async () => {
		const data: Entry[] = []
		const { container, queryAllByRole } = render(Component, { data })

		const articles = queryAllByRole("article")

		expect(articles).not.toBeNull()

		cleanup()
	})
})
