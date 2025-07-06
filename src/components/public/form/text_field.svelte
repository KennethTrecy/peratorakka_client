<script lang="ts">
import type { TextFieldVariant } from "+/component"
import type { GeneralError } from "+/rest"

import GeneralField from "@/components/public/form/general_field.svelte"

let {
	fieldName,
	disabled,
	value = $bindable(),
	errorFieldID = "",
	IDPrefix = "",
	errors,
	variant = "text"
}: {
	fieldName: string
	disabled: boolean
	value: string
	errorFieldID?: string
	IDPrefix?: string
	errors: GeneralError[]
	variant?: TextFieldVariant
} = $props()
</script>

<GeneralField {fieldName} {errorFieldID} {IDPrefix} {errors}>
	{#snippet input({ fieldID, labelID, helperID })}
		{#if variant === "text"}
			<input
				id={fieldID}
				type="text"
				bind:value={value}
				disabled={disabled}
				aria-labelledby={labelID}
				aria-controls={helperID}
				aria-describedby={helperID}/>
		{:else if variant === "date"}
			<input
				id={fieldID}
				type="date"
				bind:value={value}
				disabled={disabled}
				aria-labelledby={labelID}
				aria-controls={helperID}
				aria-describedby={helperID}/>
		{:else}
			<input
				id={fieldID}
				type="email"
				bind:value={value}
				disabled={disabled}
				aria-labelledby={labelID}
				aria-controls={helperID}
				aria-describedby={helperID}/>
		{/if}
	{/snippet}
</GeneralField>
