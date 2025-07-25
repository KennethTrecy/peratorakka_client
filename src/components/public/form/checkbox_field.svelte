<script lang="ts">
import type { GeneralError } from "+/rest"

import GeneralContent from "$/form/general_content.svelte"

let {
	fieldName,
	disabled,
	value = $bindable(),
	errorFieldID = "",
	IDPrefix = "",
	errors
}: {
	fieldName: string
	disabled: boolean
	value: boolean
	errorFieldID?: string
	IDPrefix?: string
	errors: GeneralError[]
} = $props()
</script>

<div>
	<GeneralContent
		{fieldName}
		{errorFieldID}
		{IDPrefix}
		{errors}>
		{#snippet children({ fieldID, labelID, helperID })}
			<label for={fieldID} id={labelID}>
				<input
					id={fieldID}
					type="checkbox"
					class="filled-in"
					bind:checked={value}
					disabled={disabled}
					aria-labelledby={labelID}
					aria-controls={helperID}
					aria-describedby={helperID}/>
				<span>{fieldName}</span>
			</label>
		{/snippet}
	</GeneralContent>
</div>

<style lang="scss">
input[type="checkbox"].filled-in:checked + span:not(.lever)::before {
	--md-sys-color-on-primary: var(--md-ref-palette-neutral80);
}
</style>
