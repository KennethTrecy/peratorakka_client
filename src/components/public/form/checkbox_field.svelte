<script lang="ts">
import type { GeneralError } from "+/rest"

import GeneralContent from "$/form/general_content.svelte"

export let fieldName: string
export let disabled: boolean
export let value: boolean
export let errorFieldID = ""
export let IDPrefix: string = ""
export let errors: GeneralError[]
</script>

<div>
	<GeneralContent
		{fieldName}
		{errorFieldID}
		{IDPrefix}
		{errors}
		let:fieldID
		let:labelID
		let:helperID>
		<label for={fieldID} id={labelID}>
			<input
				id={fieldID}
				type="checkbox"
				class="filled-in"
				bind:value={value}
				disabled={disabled}
				aria-labelledby={labelID}
				aria-controls={helperID}
				aria-describedby={helperID}/>
			<span>{fieldName}</span>
		</label>
	</GeneralContent>
</div>

<style lang="scss">
@use "@/components/third-party/index";

input[type="checkbox"].filled-in:checked + span:not(.lever)::before {
	--md-sys-color-on-primary: var(--md-ref-palette-neutral80);
}
</style>
