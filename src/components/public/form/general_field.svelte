<script lang="ts">
import type { GeneralError } from "+/rest"

import GeneralFieldContainer from "$/form/general_field_container.svelte"
import GeneralContent from "$/form/general_content.svelte"

export let fieldName: string
export let errorFieldID: string
export let IDPrefix: string
export let errors: GeneralError[]
</script>

<GeneralFieldContainer tag="div">
	<GeneralContent
		{fieldName}
		{errorFieldID}
		{IDPrefix}
		{errors}
		let:fieldID
		let:labelID
		let:helperID>
		<slot {fieldID} {labelID} {helperID}></slot>
		<label for={fieldID} id={labelID}>{fieldName}</label>
	</GeneralContent>
</GeneralFieldContainer>

<style lang="scss">
@use "@/components/third-party/index";
</style>
