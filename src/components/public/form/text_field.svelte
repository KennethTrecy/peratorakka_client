<script lang="ts">
	import type { FieldError, GeneralError } from "+/rest"

	export let fieldName: string
	export let disabled: boolean
	export let value: string
	export let IDPrefix: string = ""
	export let errors: GeneralError[]
	export let variant: "email"|"text" = "text"

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

<div class="field label border no-margin">
	{#if variant === "text"}
		<input
			class={activeClass}
			type="text"
			bind:value={value}
			id={fieldID}
			disabled={disabled}>
	{:else}
		<input
			class={activeClass}
			type="email"
			bind:value={value}
			id={fieldID}
			disabled={disabled}>
	{/if}
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
