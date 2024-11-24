<script lang="ts">
import type { GeneralError } from "+/rest"

import { isFieldError } from "+/rest"

export let fieldName: string
export let errorFieldID: string
export let IDPrefix: string
export let errors: GeneralError[]

$: normalizedFieldName = fieldName.replace(" ", "_").toLocaleLowerCase()
$: fieldID = fieldName === ""
	? errorFieldID
	: (
		IDPrefix === ""
			? ""
			: `${IDPrefix}_`
	) + normalizedFieldName
$: resolvedErrorFieldID = errorFieldID === ""
	? normalizedFieldName
	: errorFieldID
$: labelID = `${fieldID}_label`
$: helperID = `${fieldID}_helper`
$: message = errors.filter(
	error => isFieldError(error) && error.field.endsWith(resolvedErrorFieldID)
).map(error => error.message).join(" ")
</script>

<div class="input-field">
	<slot {fieldID} {labelID} {helperID}></slot>
	<label for={fieldID} id={labelID}>{fieldName}</label>
	{#if message !== ""}
		<span class="supporting-text" id={helperID}>{message}</span>
	{/if}
</div>

<style lang="scss">
@use "@/components/third-party/index";

:global(.input-field:has([disabled])) {
	--input-color: var(--md-ref-palette-neutral60);
	--md-sys-color-on-surface: var(--input-color);
	--md-sys-color-primary: var(--input-color);
	color: var(--input-color);
}
</style>
