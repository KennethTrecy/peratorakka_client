<script lang="ts">
	import type { FieldError, GeneralError } from "+/rest"

	export let fieldName: string
	export let disabled: boolean
	export let value: string
	export let IDPrefix: string = ""
	export let errors: GeneralError[]

	$: fieldID = (
		IDPrefix === ""
			? ""
			: `${IDPrefix}_`
	) + fieldName.replace(" ", "_").toLocaleLowerCase()
	$: isActive = Boolean(value)
	$: activeClass = isActive ? "active" : ""
	$: message = errors.filter(
		error => isFieldError(error) && error.field === fieldName
	).join(" ")

	function isFieldError(error: any): error is FieldError {
		return Object.keys(error).includes("field")
	}
</script>

<div class="field label border">
	<input
		role="textbox"
		class={activeClass}
		type="password"
		bind:value={value}
		id={fieldID}
		disabled={disabled}>
	<label class={activeClass} for={fieldID}>{fieldName}</label>
	{#if message !== ""}
		<p class="error">{message}</p>
	{/if}
</div>

<style lang="scss">
	@use "@/components/third-party/index";

	p {
		@extend span;

		margin: 0em;
	}
</style>
