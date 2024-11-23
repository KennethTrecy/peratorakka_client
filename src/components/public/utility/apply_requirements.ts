import type { Writable } from "svelte/store"
import type { ContextBundle } from "+/component"

export default function applyRequirements(
	globalContext: ContextBundle,
	guards: Writable<boolean>[],
	methods: {
		goto: (url: string|URL) => void,
		afterNavigate: (navigate: any) => void
		beforeNavigate: (navigate: any) => void
	}
): void {
	const {
		hasRequirements,
		redirectPath
	} = globalContext as {
		hasRequirements: Writable<boolean>,
		redirectPath: Writable<string>
	}

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
