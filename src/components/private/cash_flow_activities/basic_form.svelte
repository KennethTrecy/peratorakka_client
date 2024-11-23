<script lang="ts">
import type { GeneralError } from "+/rest"
import type { CashFlowActivity } from "+/entity"

import BasicForm from "$/form/basic_form.svelte"
import TextField from "$/form/text_field.svelte"

export let IDPrefix: string

export let name: string
export let description: string
export let forceDisabledFields: (keyof CashFlowActivity)[] = []

export let isConnecting: boolean
export let errors: GeneralError[]
export let id: string|null = null
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
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
	</svelte:fragment>
	<slot slot="button_group" name="button_group"/>
</BasicForm>
