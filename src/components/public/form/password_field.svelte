<script lang="ts">
import type { GeneralError } from "+/rest"

import { isFieldError } from "+/rest"

import GeneralField from "@/components/public/form/general_field.svelte"

export let fieldName: string
export let disabled: boolean
export let value: string
export let errorFieldID = ""
export let IDPrefix: string = ""
export let errors: GeneralError[]
</script>

<GeneralField {fieldName} {errorFieldID} {IDPrefix} {errors} let:fieldID let:labelID let:helperID>
	<input
		id={fieldID}
		role="textbox"
		type="password"
		bind:value={value}
		disabled={disabled}
		aria-labelledby={labelID}
		aria-controls={helperID}
		aria-describedby={helperID}/>
</GeneralField>

<style lang="scss">
@use "@/components/third-party/index";
</style>
