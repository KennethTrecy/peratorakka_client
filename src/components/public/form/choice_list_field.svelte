<script lang="ts">
import type { ChoiceInfo } from "+/component"
import type { GeneralError } from "+/rest"

import { onMount } from "svelte"

import { UNKNOWN_OPTION } from "#/component"

import GeneralField from "@/components/public/form/general_field.svelte"

const UNKNOWN_OPTION_LABEL = "Please select one of the choices..."

export let fieldName: string
export let errorFieldID: string = ""
export let disabled: boolean
export let value: string
export let IDPrefix: string = ""
export let errors: GeneralError[]
export let rawChoices: unknown[]
export let choiceConverter: (choice: any) => ChoiceInfo

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

let selectElement: HTMLSelectElement|null = null

onMount(() => {
	if (selectElement !== null) {
		// @ts-ignore
		M.FormSelect.init([ selectElement ], {
			// specify options here
		});
	}
})

$: {
	if (selectElement !== null && (!disabled || value !== UNKNOWN_OPTION)) {
		setTimeout(() => {
			// @ts-ignore
			M.FormSelect.getInstance(selectElement).destroy()

			// @ts-ignore
			M.FormSelect.init([ selectElement ], {
				// specify options here
			});
		}, 250)
	}
}
</script>

<GeneralField {fieldName} {errorFieldID} {IDPrefix} {errors} let:fieldID let:labelID let:helperID>
	<select
		id={fieldID}
		bind:value={value}
		bind:this={selectElement}
		aria-labelledby={labelID}
		aria-controls={helperID}
		aria-describedby={helperID}
		aria-disabled={disabled}
		{disabled}
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
</GeneralField>

<style lang="scss">
@use "@/components/third-party/index";
</style>
