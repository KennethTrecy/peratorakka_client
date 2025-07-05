<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"

import { isFieldError } from "+/rest"

let {
	fieldName,
	supportText = "",
	errorFieldID,
	IDPrefix,
	errors,
	children
}: {
	fieldName: string
	supportText?: string
	errorFieldID: string
	IDPrefix: string
	errors: GeneralError[]
	children: Snippet<[ { fieldID: string, labelID: string, helperID: string } ]>;
} = $props()

let normalizedFieldName = $derived(fieldName.replaceAll(" ", "_", ).toLocaleLowerCase())
let fieldID = $derived(fieldName === ""
	? errorFieldID
	: (
		IDPrefix === ""
			? ""
			: `${IDPrefix}_`
	) + normalizedFieldName)
let resolvedErrorFieldID = $derived(errorFieldID === ""
	? normalizedFieldName
	: errorFieldID)
let labelID = $derived(`${fieldID}_label`)
let helperID = $derived(`${fieldID}_helper`)
let message = $derived(errors.filter(
	error => isFieldError(error) && error.field.endsWith(resolvedErrorFieldID)
).map(error => error.message).join(" "))
</script>

{@render children({ fieldID, labelID, helperID, })}
{#if message !== ""}
	<div class="supporting-text" id={helperID}>{message}</div>
{:else if supportText !== ""}
	<div class="supporting-text" id={helperID}>{supportText}</div>
{/if}
