import type { ContextBundle } from "+/component"

import applyRequirements from "$/utility/apply_requirements"

export default function assertAuthentication(
	globalContext: ContextBundle,
	methods: {
		goto: (url: string|URL) => void,
		afterNavigate: (navigate: any) => void
		beforeNavigate: (navigate: any) => void
	}
): void {
	applyRequirements(globalContext, [
		globalContext.mustHaveToken,
		globalContext.mustHaveAccessToken,
		globalContext.mustBeAuthenticatedUser
	], {
		afterNavigate,
		beforeNavigate,
		goto
	})
}
