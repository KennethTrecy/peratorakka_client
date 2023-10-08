<script lang="ts">
	import type { ContextBundle } from "+/component"

	import { getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { GLOBAL_CONTEXT } from "#/contexts"

	import applyRequirements from "$/utility/apply_requirements"

	import Form from "%/log_in/form.svelte"

	const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

	applyRequirements(globalContext, [
		globalContext.mustHaveToken,
		globalContext.mustBeGuest
	], {
		afterNavigate,
		beforeNavigate,
		goto
	})
</script>

<svelte:head>
	<title>Log in</title>
</svelte:head>

<Form/>
