<script lang="ts">
	import type { GeneralError } from "+/rest"

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
		"mdc-text-field--outlined",
		disabled ? "mdc-text-field--disabled" : false
	].filter(Boolean).join(" ")
</script>

<label class={textfieldClass}>
	<span class="mdc-notched-outline">
		<span class="mdc-notched-outline__leading"></span>
		<span class="mdc-notched-outline__notch">
			<span class="mdc-floating-label" id={fieldID}>{fieldName}</span>
		</span>
		<span class="mdc-notched-outline__trailing"></span>
	</span>
	{#if variant === "text"}
		<input
			class="mdc-text-field__input"
			type="text"
			bind:value={value}
			id={fieldID}
			disabled={disabled}
			aria-controls={helperID}
			aria-describedby={helperID}>
	{:else}
		<input
			class="mdc-text-field__input"
			type="email"
			bind:value={value}
			id={fieldID}
			disabled={disabled}
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
