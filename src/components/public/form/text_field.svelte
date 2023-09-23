<script lang="ts">
	import type { GeneralError } from "+/rest"

	import { onMount } from "svelte"
	import { MDCTextField } from "@material/textfield"
	import { MDCLineRipple } from "@material/line-ripple"

	import { isFieldError } from "+/rest"

	export let fieldName: string
	export let disabled: boolean
	export let value: string
	export let errorFieldName = ""
	export let IDPrefix: string = ""
	export let errors: GeneralError[]
	export let variant: "email"|"text"|"date" = "text"

	$: normalizedFieldName = fieldName.replace(" ", "_").toLocaleLowerCase()
	$: fieldID = errorFieldName === ""
		? (
			IDPrefix === ""
				? ""
				: `${IDPrefix}_`
		) + normalizedFieldName
		: errorFieldName
	$: helperID = `${fieldID}_helper`
	$: isActive = Boolean(value)
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

	let fieldElement: any = null
	let topLineRippleElement: any = null
	let bottomLineRippleElement: any = null
	onMount(() => {
		const field = new MDCTextField(fieldElement)
		const topLineRipple = new MDCLineRipple(topLineRippleElement)
		const bottomLineRipple = new MDCLineRipple(bottomLineRippleElement)
	})
</script>

<label class={textfieldClass} bind:this={fieldElement}>
	<span class="mdc-text-field__ripple" bind:this={topLineRippleElement}></span>
	<span
		class={floatingLabelClass}
		id={fieldID}>
		{fieldName}
	</span>
	{#if variant === "text"}
		<input
			class="mdc-text-field__input"
			type="text"
			bind:value={value}
			disabled={disabled}
			aria-labelledby={fieldID}
			aria-controls={helperID}
			aria-describedby={helperID}/>
	{:else if variant === "date"}
		<input
			class="mdc-text-field__input"
			type="date"
			bind:value={value}
			disabled={disabled}
			aria-labelledby={fieldID}
			aria-controls={helperID}
			aria-describedby={helperID}/>
	{:else}
		<input
			class="mdc-text-field__input"
			type="email"
			bind:value={value}
			disabled={disabled}
			aria-labelledby={fieldID}
			aria-controls={helperID}
			aria-describedby={helperID}/>
	{/if}
	<span class="mdc-line-ripple" bind:this={bottomLineRippleElement}></span>
</label>
{#if message !== ""}
	<div class="mdc-text-field-helper-line">
		<p
			class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent mdc-text-field-helper-text--validation-msg"
			id={helperID}>
			{message}
		</p>
	</div>
{/if}

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/floating-label/mdc-floating-label";
	@use "@material/line-ripple/mdc-line-ripple";
	@use "@material/textfield";
	@use "@material/textfield/helper-text";

	@include textfield.core-styles;
	@include helper-text.helper-text-core-styles;
</style>
