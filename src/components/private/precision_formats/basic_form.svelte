<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"

import BasicForm from "$/form/basic_form.svelte"
import TextField from "$/form/text_field.svelte"
import NumberField from "$/form/number_field.svelte"

let {
	IDPrefix,
	name = $bindable(),
	minimumPresentationalPrecision = $bindable(),
	maximumPresentationalPrecision = $bindable(),
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	name: string
	minimumPresentationalPrecision: number
	maximumPresentationalPrecision: number
	isConnecting: boolean
	errors: GeneralError[]
	id?: string|null,
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()
</script>

<BasicForm {id} {isConnecting} {errors} {onsubmit} {button_group}>
	{#snippet fields()}
		<TextField
			fieldName="Name"
			disabled={isConnecting}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<NumberField
			fieldName="Minimum Presentational Precision"
			min={0}
			max={12}
			step={1}
			disabled={isConnecting}
			bind:value={minimumPresentationalPrecision}
			{IDPrefix}
			{errors}/>
		<NumberField
			fieldName="Maximum Presentational Precision"
			min={0}
			max={12}
			step={1}
			disabled={isConnecting}
			bind:value={maximumPresentationalPrecision}
			{IDPrefix}
			{errors}/>
	{/snippet}
</BasicForm>
