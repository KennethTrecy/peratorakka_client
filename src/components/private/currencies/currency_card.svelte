<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { Entity } from "%/currencies/types"

	import { writable } from "svelte/store"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/currencies/basic_form.svelte"

	export let data: Entity

	let edit = false
	let code = data.code
	let name = data.name

	$: IDPrefix = `old_currency_${data.id}`
	$: formID = `${IDPrefix}_form`
	let isConnecting = writable<boolean>(false)
	let errors = writable<GeneralError[]>([])
	let send = (request: Partial<RequestInit>) => Promise.resolve()

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/currencies/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "PUT",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						data = {
							...data,
							code,
							name
						}
						errors.set([])
						stopEditing()
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnecting = requesterInfo.isConnecting
		errors = requesterInfo.errors
		send = requesterInfo.send
	}

	function startEditing() {
		edit = true
	}

	function stopEditing() {
		edit = false
	}

	async function confirmEdit(event: SubmitEvent) {
		event.preventDefault()

		await send({
			"body": JSON.stringify({
				"currency": {
					code,
					name
				}
			})
		})
	}

	function cancelEdit() {
		stopEditing()
		code = data.code
		name = data.name
	}
</script>

<article class="secondary-container">
	{#if edit}
		<BasicForm
			id={formID}
			bind:code={code}
			bind:name={name}
			isConnecting={$isConnecting}
			{IDPrefix}
			errors={$errors}
			on:submit={confirmEdit}/>
	{:else}
		<h3>{data.code}</h3>
		<p>{data.name}</p>
	{/if}

	<div class="nav">
		{#if edit}
			<button type="submit" form={formID} disabled={$isConnecting}>
				<i>save</i>
			</button>
			<button on:click={cancelEdit} type="button" form={formID} disabled={true}>
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
