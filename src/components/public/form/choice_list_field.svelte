<script lang="ts">
import type { ChoiceInfo } from "+/component"
import type { GeneralError } from "+/rest"

import { onMount } from "svelte"

import { UNKNOWN_OPTION } from "#/component"

import GeneralField from "@/components/public/form/general_field.svelte"

const UNKNOWN_OPTION_LABEL = "Please select one of the choices..."

let {
	fieldName,
	errorFieldID = "",
	disabled,
	value = $bindable(),
	IDPrefix = "",
	supportText = "",
	errors,
	rawChoices,
	choiceConverter
}: {
	fieldName: string
	errorFieldID?: string
	disabled: boolean
	value: string
	IDPrefix?: string
	supportText?: string
	errors: GeneralError[]
	rawChoices: unknown[]
	choiceConverter: (choice: any) => ChoiceInfo
} = $props()

let choices = $derived(rawChoices.map(choiceConverter))
let selectedLabelIndex = $derived(choices.findIndex(choice => choice.data === value))
let selectedLabel = $derived(selectedLabelIndex === -1
	? UNKNOWN_OPTION_LABEL
	: choices[selectedLabelIndex].label)

$effect(() => {
	if (value === UNKNOWN_OPTION && rawChoices.length > 0) {
		value = choiceConverter(rawChoices[0]).data
	}
});

let selectElement: HTMLSelectElement|null = $state(null)

onMount(() => {
	if (selectElement !== null) {
		// @ts-ignore
		M.FormSelect.init([ selectElement ], {
			// specify options here
		});
	}
})

$effect(() => {
	if (selectElement !== null && (!disabled || value !== UNKNOWN_OPTION)) {
		setTimeout(() => {
			if (selectElement === null) return

			// @ts-ignore
			M.FormSelect.getInstance(selectElement).destroy()

			// @ts-ignore
			M.FormSelect.init([ selectElement ], {
				// specify options here
			});
		}, 250)
	}
});
</script>

<GeneralField
	{fieldName}
	{errorFieldID}
	{IDPrefix}
	{errors}
	{supportText}>
	{#snippet input({ fieldID, labelID, helperID })}
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
					title={label}>{label}</option>
			{/each}
			{#if value === UNKNOWN_OPTION}
				<option
					aria-selected="true"
					data-value={UNKNOWN_OPTION}
					value={UNKNOWN_OPTION}
					title={UNKNOWN_OPTION_LABEL}>{UNKNOWN_OPTION_LABEL}</option>
			{/if}
		</select>
	{/snippet}
</GeneralField>
