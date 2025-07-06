<script lang="ts">
import type { GeneralError } from "+/rest"

import GeneralField from "@/components/public/form/general_field.svelte"

let {
	fieldName,
	disabled,
	value = $bindable(),
	min,
	max,
	step,
	errorFieldID = "",
	IDPrefix = "",
	errors
}: {
	fieldName: string
	disabled: boolean
	value: number
	min: number
	max: number
	step: number
	errorFieldID?: string
	IDPrefix?: string
	errors: GeneralError[]
} = $props()
</script>

<GeneralField {fieldName} {errorFieldID} {IDPrefix} {errors}   >
	{#snippet input({ fieldID, labelID, helperID })}
		<input
			id={fieldID}
			type="number"
			bind:value={value}
			{max}
			{min}
			{step}
			disabled={disabled}
			aria-labelledby={labelID}
			aria-controls={helperID}
			aria-describedby={helperID}/>
	{/snippet}
</GeneralField>
