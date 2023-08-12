<script lang="ts">
	import type { GeneralError } from "+/rest"

	import { isFieldError } from "+/rest"

	export let fieldName: string
	export let disabled: boolean
	export let value: string
	export let IDPrefix: string = ""
	export let errors: GeneralError[]

	$: normalizedFieldName = fieldName.replace(" ", "_").toLocaleLowerCase()
	$: fieldID = (
		IDPrefix === ""
			? ""
			: `${IDPrefix}_`
	) + normalizedFieldName
	$: isActive = Boolean(value)
	$: activeClass = isActive ? "active" : ""
	$: message = errors.filter(
		error => isFieldError(error) && error.field.endsWith(normalizedFieldName)
	).map(error => error.message).join(" ")
</script>

<div class="field label border no-margin">
	<input
		role="textbox"
		class={activeClass}
		type="password"
		bind:value={value}
		id={fieldID}
		disabled={disabled}>
	<label class={activeClass} for={fieldID}>{fieldName}</label>
	{#if message !== ""}
		<p class="error no-margin">{message}</p>
	{/if}
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	p {
		@extend span;
	}
</style>
