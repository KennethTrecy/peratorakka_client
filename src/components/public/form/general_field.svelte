<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"

import GeneralFieldContainer from "$/form/general_field_container.svelte"
import GeneralContent from "$/form/general_content.svelte"

let {
	fieldName,
	errorFieldID,
	IDPrefix,
	errors,
	supportText = "",
	input
}: {
	fieldName: string
	errorFieldID: string
	IDPrefix: string
	errors: GeneralError[]
	supportText?: string
	input: Snippet<[ { fieldID: string, labelID: string, helperID: string } ]>
} = $props()
</script>

<GeneralFieldContainer tag="div">
	<GeneralContent
		{fieldName}
		{supportText}
		{errorFieldID}
		{IDPrefix}
		{errors}>
		{#snippet children({ fieldID, labelID, helperID })}
			{@render input({ fieldID, labelID, helperID, })}
			<label for={fieldID} id={labelID}>{fieldName}</label>
		{/snippet}
	</GeneralContent>
</GeneralFieldContainer>

<style>
label { width: 100%; }
</style>
