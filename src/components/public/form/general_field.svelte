<script lang="ts">
import type { GeneralError } from "+/rest"

import { isFieldError } from "+/rest"

export let fieldName: string
export let errorFieldName: string
export let IDPrefix: string
export let errors: GeneralError[]

$: normalizedFieldName = fieldName.replace(" ", "_").toLocaleLowerCase()
$: fieldID = errorFieldName === ""
	? (
		IDPrefix === ""
			? ""
			: `${IDPrefix}_`
	) + normalizedFieldName
	: errorFieldName
$: labelID = `${fieldID}_label`
$: helperID = `${fieldID}_helper`
$: message = errors.filter(
	error => isFieldError(error) && error.field.endsWith(errorFieldName)
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
</style>
