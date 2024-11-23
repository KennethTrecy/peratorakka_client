<script lang="ts">
import type { GeneralError } from "+/rest"

import GeneralField from "@/components/public/form/general_field.svelte"

export let fieldName: string
export let disabled: boolean
export let value: number
export let min: number
export let max: number
export let step: number
export let errorFieldName = ""
export let IDPrefix: string = ""
export let errors: GeneralError[]
</script>

<GeneralField {fieldName} {errorFieldName} {IDPrefix} {errors} let:fieldID let:labelID let:helperID>
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
</GeneralField>

<style lang="scss">
@use "@/components/third-party/index";
</style>
