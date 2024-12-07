<script lang="ts">
	import type { GeneralError } from "+/rest"

	import BasicForm from "$/form/basic_form.svelte"
	import TextField from "$/form/text_field.svelte"

	export let IDPrefix: string

	export let startedAt: string
	export let finishedAt: string

	export let isConnecting: boolean
	export let errors: GeneralError[]
	export let id: string|null = null
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
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
	</svelte:fragment>
	<slot slot="button_group" name="button_group"/>
</BasicForm>
