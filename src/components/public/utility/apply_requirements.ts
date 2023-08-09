import type { Subcriber, Readable } from "svelte"

import { hasRequirements, redirectPath } from "$/global_state"

export default function applyRequirements(guards: Readable[], methods: {
	goto: (url: string|URL) => void,
	afterNavigate: (navigate: any) => void
	beforeNavigate: (navigate: any) => void
}): void {
	methods.afterNavigate(() => {
		hasRequirements.set(guards.length > 0)
		guards.map(guard => guard.set(true))
	})

	const forgetPossibleRedirection = redirectPath.subscribe(path => {
		if (path !== "") methods.goto(path as string)
	})
	methods.beforeNavigate(() => {
		forgetPossibleRedirection()
		hasRequirements.set(false)
		guards.map(guard => guard.set(false))
	})
}
