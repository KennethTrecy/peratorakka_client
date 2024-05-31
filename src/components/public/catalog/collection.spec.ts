// @vitest-environment jsdom

import { describe, it, expect } from "vitest"
import { render, cleanup } from "@testing-library/svelte"

import type { Currency } from "@/types/entity"

import Component from "./collection.svelte"

describe("Collection behavior", () => {
	it("can show loading state", async () => {
		const collectiveName = "Currencies"
		const isConnecting = true
		const data: Currency[] = []
		const { container, getAllByRole } = render(Component, {
			collectiveName,
			isConnecting,
			data,
			"progressRate": 0
		})

		const progress = getAllByRole("progressbar")

		expect(progress).not.toBeNull()

		cleanup()
	})

	it("can hide loading state", async () => {
		const collectiveName = "Currencies"
		const isConnecting = false
		const data: Currency[] = []
		const { container } = render(Component, {
			collectiveName,
			isConnecting,
			data,
			"progressRate": 1
		})

		const progress = container.querySelector(".mdc-linear-progress--closed")

		expect(progress).toBeNull()

		cleanup()
	})
})
