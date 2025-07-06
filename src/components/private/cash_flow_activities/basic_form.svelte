<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type { CashFlowActivity } from "+/entity"

import BasicForm from "$/form/basic_form.svelte"
import TextField from "$/form/text_field.svelte"

let {
	IDPrefix,
	name = $bindable(),
	description = $bindable(),
	forceDisabledFields = [],
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	name: string
	description: string
	forceDisabledFields?: (keyof CashFlowActivity)[];
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
			fieldName="Name"
			disabled={isConnecting || forceDisabledFields.includes("name")}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Description"
			disabled={isConnecting || forceDisabledFields.includes("description")}
			bind:value={description}
			{IDPrefix}
			{errors}/>
	{/snippet}
</BasicForm>
