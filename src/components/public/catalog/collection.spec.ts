// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import { render, cleanup } from "@testing-library/svelte"

import type { Entity } from "%/currencies/types"

import Component from "./collection.svelte"

describe("Collection behavior", () => {
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

		const progress = container.querySelector("[role=progressbar]")

		expect(progress).toBeNull()

		cleanup()
	})
})
