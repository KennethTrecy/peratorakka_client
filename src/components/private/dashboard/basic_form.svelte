<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"

import BasicForm from "$/form/basic_form.svelte"
import TextField from "$/form/text_field.svelte"

let {
	IDPrefix,
	referenceDate = $bindable(),
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	referenceDate: string
	isConnecting: boolean
	errors: GeneralError[]
	id?: string|null
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()
</script>

<BasicForm {id} {isConnecting} {errors} {onsubmit} {button_group}>
	{#snippet fields()}
		<TextField
			variant="date"
			fieldName="Reference Date"
			disabled={isConnecting}
			bind:value={referenceDate}
			{IDPrefix}
			{errors}/>
	{/snippet}
</BasicForm>
