<script lang="ts">
import type { ChoiceInfo } from "+/component"
import type { GeneralError } from "+/rest"

import { onMount } from "svelte"

import { UNKNOWN_OPTION } from "#/component"

import { isFieldError } from "+/rest"

const UNKNOWN_OPTION_LABEL = "Please select one of the choices..."

export let fieldName: string
export let errorFieldName: string|null = null
export let disabled: boolean
export let value: string
export let IDPrefix: string = ""
export let errors: GeneralError[]
export let rawChoices: unknown[]
export let choiceConverter: (choice: any) => ChoiceInfo

$: normalizedFieldName = errorFieldName === null
	? fieldName.replace(" ", "_").toLocaleLowerCase()
	: errorFieldName
$: fieldID = (
		IDPrefix === ""
		? ""
		: `${IDPrefix}_`
) + normalizedFieldName
$: labelID = `${fieldID}_label`
$: helperID = `${fieldID}_helper`
$: message = errors.filter(
	error => isFieldError(error) && error.field.endsWith(normalizedFieldName)
).map(error => error.message).join(" ")
$: choices = rawChoices.map(choiceConverter)
$: selectedLabelIndex = choices.findIndex(choice => choice.data === value)
$: selectedLabel = selectedLabelIndex === -1
	? UNKNOWN_OPTION_LABEL
	: choices[selectedLabelIndex].label

$: {
	if (value === UNKNOWN_OPTION && rawChoices.length > 0) {
		value = choiceConverter(rawChoices[0]).data
	}
}

let selectElement: HTMLSelectElement

onMount(() => {
	// @ts-ignore
	var instances = M.FormSelect.init([ selectElement ], {
		// specify options here
	});
})
</script>

<select
	id={labelID}
	bind:value={value}
	bind:this={selectElement}
	aria-labelledby={labelID}
	aria-controls={helperID}
	aria-describedby={helperID}
	aria-disabled={disabled}
	title={selectedLabel}>
	{#each choices as { label, data }(data)}
		<option
			aria-selected={`${(data === value)}`}
			data-value={data}
			value={data}
			title={label}>
			{label}
		</option>
	{/each}
	{#if value === UNKNOWN_OPTION}
		<option
			aria-selected="true"
			data-value={UNKNOWN_OPTION}
			value={UNKNOWN_OPTION}
			title={UNKNOWN_OPTION_LABEL}>
			{UNKNOWN_OPTION_LABEL}
		</option>
	{/if}
</select>
<label for={labelID}>{fieldName}</label>
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
</style>
