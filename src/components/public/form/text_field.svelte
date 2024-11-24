<script lang="ts">
import type { TextFieldVariant } from "+/component"
import type { GeneralError } from "+/rest"

import GeneralField from "@/components/public/form/general_field.svelte"

export let fieldName: string
export let disabled: boolean
export let value: string
export let errorFieldID = ""
export let IDPrefix: string = ""
export let errors: GeneralError[]
export let variant: TextFieldVariant = "text"
</script>

<GeneralField {fieldName} {errorFieldID} {IDPrefix} {errors} let:fieldID let:labelID let:helperID>
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
</GeneralField>

<style lang="scss">
@use "@/components/third-party/index";
</style>
