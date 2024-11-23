<script lang="ts">
import type { GeneralError } from "+/rest"

import BasicForm from "$/form/basic_form.svelte"
import TextField from "$/form/text_field.svelte"
import NumberField from "$/form/number_field.svelte"

export let IDPrefix: string

export let code: string
export let name: string
export let presentationalPrecision: number

export let isConnecting: boolean
export let errors: GeneralError[]
export let id: string|null = null
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
		<TextField
			fieldName="Code"
			disabled={isConnecting}
			bind:value={code}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Name"
			disabled={isConnecting}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<NumberField
			fieldName="Presentational Precision"
			min={0}
			max={12}
			step={1}
			disabled={isConnecting}
			bind:value={presentationalPrecision}
			{IDPrefix}
			{errors}/>
	</svelte:fragment>
	<slot slot="button_group" name="button_group"/>
</BasicForm>
