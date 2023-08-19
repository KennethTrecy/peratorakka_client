<script lang="ts">
	import type { GeneralError } from "+/rest"

	import { onMount } from "svelte"
	import { MDCTextField } from "@material/textfield"

	import { isFieldError } from "+/rest"

	export let fieldName: string
	export let disabled: boolean
	export let value: string
	export let IDPrefix: string = ""
	export let errors: GeneralError[]
	export let variant: "email"|"text" = "text"

	$: normalizedFieldName = fieldName.replace(" ", "_").toLocaleLowerCase()
	$: fieldID = (
		IDPrefix === ""
			? ""
			: `${IDPrefix}_`
	) + normalizedFieldName
	$: helperID = `${fieldID}_helper`
	$: isActive = Boolean(value)
	$: activeClass = isActive ? "active" : ""
	$: message = errors.filter(
		error => isFieldError(error) && error.field.endsWith(normalizedFieldName)
	).map(error => error.message).join(" ")
	$: textfieldClass = [
		"mdc-text-field",
		"mdc-text-field--filled",
		disabled ? "mdc-text-field--disabled" : false
	].filter(Boolean).join(" ")
	$: floatingLabelClass = [
		"mdc-floating-label",
		isActive ? "mdc-floating-label--float-above" : false
	].filter(Boolean).join(" ")

	let fieldElement: any
	onMount(() => {
		const field = new MDCTextField(fieldElement)
	})
</script>

<label class={textfieldClass} bind:this={fieldElement}>
	<span class="mdc-notched-outline">
		<span class="mdc-notched-outline__leading"></span>
		<span class="mdc-notched-outline__notch">
			<span
				class={floatingLabelClass}
				id={fieldID}>
				{fieldName}
			</span>
		</span>
		<span class="mdc-notched-outline__trailing"></span>
	</span>
	{#if variant === "text"}
		<input
			class="mdc-text-field__input"
			type="text"
			bind:value={value}
			disabled={disabled}
			aria-labelledby={fieldID}
			aria-controls={helperID}
			aria-describedby={helperID}>
	{:else}
		<input
			class="mdc-text-field__input"
			type="email"
			bind:value={value}
			disabled={disabled}
			aria-labelledby={fieldID}
			aria-controls={helperID}
			aria-describedby={helperID}>
	{/if}
</label>
{#if message !== ""}
	<div class="mdc-text-field-helper-line">
		<p class="mdc-text-field-helper-text" id={helperID}>{message}</p>
	</div>
{/if}

<style lang="scss">
	@use "@/components/third-party/new_index";

	@use "@material/floating-label/mdc-floating-label";
	@use "@material/notched-outline/mdc-notched-outline";
	@use "@material/textfield";

	@include textfield.core-styles;
</style>
