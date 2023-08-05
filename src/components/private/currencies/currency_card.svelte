<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { CardStatus } from "+/component"
	import type { Entity } from "%/currencies/types"

	import { writable } from "svelte/store"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/currencies/basic_form.svelte"

	export let data: Entity

	let status: CardStatus = "reading"
	let code = data.code
	let name = data.name

	$: IDPrefix = `old_currency_${data.id}`
	$: formID = `${IDPrefix}_form`
	$: isReading = status === "reading"
	$: cardClasses = [
		...(!isReading ? [ "s12", "m12", "l6" ] : [ "s6", "m6", "l3" ]),
		"secondary-container"
	].join(" ")
	let isConnectingToUpdate = writable<boolean>(false)
	let updateErrors = writable<GeneralError[]>([])
	let requestUpdate = (request: Partial<RequestInit>) => Promise.resolve()
	let isConnectingToDelete = writable<boolean>(false)
	let deleteErrors = writable<GeneralError[]>([])
	let requestDelete = (request: Partial<RequestInit>) => Promise.resolve()

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
						updateErrors.set([])
						startReading()
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnectingToUpdate = requesterInfo.isConnecting
		updateErrors = requesterInfo.errors
		requestUpdate = requesterInfo.send
	}

	function startEditing() {
		status = "editing"
	}

	function startReading() {
		status = "reading"
	}

	async function confirmEdit(event: SubmitEvent) {
		event.preventDefault()

		await requestUpdate({
			"body": JSON.stringify({
				"currency": {
					code,
					name
				}
			})
		})
	}

	function cancelEdit() {
		startReading()
		code = data.code
		name = data.name
	}
</script>

<article class={cardClasses}>
	{#if isReading}
		<h3>{data.code}</h3>
		<p>{data.name}</p>
	{:else}
		<BasicForm
			id={formID}
			bind:code={code}
			bind:name={name}
			isConnecting={$isConnectingToUpdate}
			{IDPrefix}
			errors={$updateErrors}
			on:submit={confirmEdit}/>
	{/if}

	<div>
		{#if isReading}
			<button
				class="no-margin square round"
				on:click={startEditing}>
				<i>edit</i>
			</button>
			<button
				class="no-margin square round"
				disabled={false}>
				<i>delete</i>
			</button>
		{:else}
			<button
				class="no-margin square round"
				type="submit"
				form={formID}
				disabled={$isConnectingToUpdate}>
				<i>save</i>
			</button>
			<button
				class="no-margin square round"
				on:click={cancelEdit}
				type="button"
				form={formID}
				disabled={$isConnectingToUpdate}>
				<i>cancel</i>
			</button>
		{/if}
	</div>
</article>


<style lang="scss">
	@use "@/components/third-party/index";

	h3 {
		@extend h5;
	}
</style>
