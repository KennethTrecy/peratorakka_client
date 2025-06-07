<script lang="ts">
import type { GeneralError } from "+/rest"

import { isFieldError } from "+/rest"

export let fieldName: string
export let supportText: string = ""
export let errorFieldID: string
export let IDPrefix: string
export let errors: GeneralError[]

$: normalizedFieldName = fieldName.replaceAll(" ", "_", ).toLocaleLowerCase()
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

<slot {fieldID} {labelID} {helperID}></slot>
{#if message !== ""}
	<span class="supporting-text" id={helperID}>{message}</span>
{:else if supportText !== ""}
	<span class="supporting-text" id={helperID}>{supportText}</span>
{/if}

<style lang="scss">
@use "@/components/third-party/index";
</style>
