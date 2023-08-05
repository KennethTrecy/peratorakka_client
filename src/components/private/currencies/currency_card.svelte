<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { CardStatus } from "+/component"
	import type { Entity } from "%/currencies/types"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/currencies/basic_form.svelte"

	export let data: Entity

	let dispatch = createEventDispatcher<{
		"delete": Entity
	}>()
	let status: CardStatus = "reading"
	let code = data.code
	let name = data.name

	$: IDPrefix = `old_currency_${data.id}`
	$: formID = `${IDPrefix}_update_form`
	$: isEditing = status === "editing"
	$: isConfirmingDeletion = status === "confirming_deletion"
	$: cardClasses = [
		...(
			(isEditing || isConfirmingDeletion)
				? [ "s12", "m12", "l6" ]
				: [ "s6", "m6", "l3" ]
		),
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

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/currencies/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "DELETE",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						deleteErrors.set([])
						dispatch("delete", data)
						startReading()
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnectingToDelete = requesterInfo.isConnecting
		deleteErrors = requesterInfo.errors
		requestDelete = requesterInfo.send
	}

	function startReading() {
		status = "reading"
	}

	function startEditing() {
		status = "editing"
	}

	function confirmDeletion() {
		status = "confirming_deletion"
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

	async function confirmDelete() {
		await requestDelete({})
	}

	function cancelEdit() {
		startReading()
		code = data.code
		name = data.name
	}
</script>

<article class={cardClasses}>
	{#if isEditing}
		<BasicForm
			id={formID}
			bind:code={code}
			bind:name={name}
			isConnecting={$isConnectingToUpdate}
			{IDPrefix}
			errors={$updateErrors}
			on:submit={confirmEdit}/>
	{:else if isConfirmingDeletion}
		<h3>Delete {data.code}?</h3>
		<p>Deleting this currency may prevent other data from showing.</p>
	{:else}
		<h3>{data.code}</h3>
		<p>{data.name}</p>
	{/if}

	<div>
		{#if isEditing}
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
		{:else if isConfirmingDeletion}
			<button
				class="no-margin square round"
				on:click={confirmDelete}
				disabled={$isConnectingToDelete}>
				<i>check</i>
			</button>
			<button
				class="no-margin square round"
				on:click={startReading}
				type="button"
				disabled={$isConnectingToDelete}>
				<i>cancel</i>
			</button>
		{:else}
			<button
				class="no-margin square round"
				on:click={startEditing}>
				<i>edit</i>
			</button>
			<button
				class="no-margin square round"
				on:click={confirmDeletion}>
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
</style>
