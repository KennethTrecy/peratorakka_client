<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"

import BasicForm from "$/form/basic_form.svelte"
import TextField from "$/form/text_field.svelte"

let {
	IDPrefix,
	startedAt = $bindable(),
	finishedAt = $bindable(),
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	startedAt: string
	finishedAt: string
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
			fieldName="Started Date"
			errorFieldID="started_at"
			disabled={isConnecting}
			bind:value={startedAt}
			{IDPrefix}
			{errors}/>
		<TextField
			variant="date"
			fieldName="Finished Date"
			errorFieldID="finished_at"
			disabled={isConnecting}
			bind:value={finishedAt}
			{IDPrefix}
			{errors}/>
	{/snippet}
</BasicForm>
