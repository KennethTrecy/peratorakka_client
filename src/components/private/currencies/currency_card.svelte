<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { Entity } from "%/currencies/types"

	import { get } from "svelte/store"

	import { serverURL } from "$/global_state"

	import TextField from "$/form/text_field.svelte"

	export let data: Entity

	let edit = false
	let code = data.code
	let name = data.name
	let isConnecting = false
	let errors: GeneralError[] = []

	$: entityID = data.id
	$: IDPrefix = `old_currency_${entityID}`
	$: formID = `${IDPrefix}_form`

	function startEditing() {
		edit = true
	}

	function stopEditing() {
		edit = false
	}

	async function confirmEdit(event: SubmitEvent) {
		event.preventDefault()

		const currentServerURL = get(serverURL)
		isConnecting = true

		try {
			const response = await fetch(`${currentServerURL}/api/v1/currencies/${entityID}`, {
				"method": "PUT",
				"mode": "cors",
				"credentials": "include",
				"referrer": currentServerURL,
				"body": JSON.stringify({
					"currency": {
						code,
						name
					}
				}),
				"headers": {
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			})

			const statusCode = response.status
			if (statusCode === 204) {
				errors = []
				data = {
					...data,
					code,
					name
				}
				stopEditing()
			} else if (statusCode === 401) {
				errors = (await response.json()).errors
			} else {
				throw new Error(
					`Unexpected status code was returned by the server: ${response.status}.`
				)
			}
		} catch (receivedErrors) {
			if (Array.isArray(receivedErrors)) {
				errors = receivedErrors
			} else {
				errors = [
					{
						"message": (receivedErrors as Error).message
					}
				]
			}
		}

		isConnecting = false
	}

	function cancelEdit() {
		stopEditing()
		code = data.code
		name = data.name
	}
</script>

<article class="secondary-container">
	{#if edit}
		<form id={formID} on:submit={confirmEdit}>
			<fieldset>
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
			</fieldset>
		</form>
	{:else}
		<h3>{data.code}</h3>
		<p>{data.name}</p>
	{/if}

	<div class="nav">
		{#if edit}
			<button type="submit" form={formID} disabled={isConnecting}>
				<i>save</i>
			</button>
			<button on:click={cancelEdit} type="button" form={formID}  disabled={isConnecting}>
				<i>cancel</i>
			</button>
		{:else}
			<button on:click={startEditing}>
				<i>edit</i>
			</button>
			<button>
				<i>delete</i>
			</button>
		{/if}
	</div>
</article>


<style lang="scss">
	@use "@/components/third-party/index";

	h3 {
		@extend h5;
	}

	div.nav {
		@extend nav;
	}
</style>
