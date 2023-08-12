<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { CardStatus } from "+/component"
	import type { Currency, Account, AcceptableAccountKind } from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import { acceptableAccountKinds } from "#/entity"

	import makeJSONRequester from "$/rest/make_json_requester"
	import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"

	import BasicForm from "%/accounts/basic_form.svelte"

	export let currencies: Currency[]
	export let data: Account

	const dispatch = createEventDispatcher<{
		"delete": Account
	}>()
	let status: CardStatus = "reading"
	let currencyID = `${data.currency_id}`
	let name = data.name
	let description = data.description
	let kind = fallbackToAceptableKind(data.kind)

	$: IDPrefix = `old_account_${data.id}`
	$: formID = `${IDPrefix}_update_form`
	$: isEditing = status === "editing"
	$: isConfirmingDeletion = status === "confirming_deletion"
	$: associatedCurrency = currencies.find(
		currency => currency.id === parseInt(currencyID)
	) as Currency

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

	$: friendlyKind = convertSnakeCaseToProperCase(data.kind)
	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/accounts/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "PUT",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						data = {
							...data,
							"currency_id": parseInt(currencyID),
							name,
							description,
							kind
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
			"path": `/api/v1/accounts/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "DELETE",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						deleteErrors.set([])
						dispatch("delete", data)
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
				"account": {
					"currency_id": parseInt(currencyID),
					name,
					description,
					kind
				}
			})
		})
	}

	async function confirmDelete() {
		await requestDelete({})
	}

	function cancelEdit() {
		startReading()
		currencyID = `${data.currency_id}`
		name = data.name
		description = data.description
		kind = fallbackToAceptableKind(data.kind)
	}

	function fallbackToAceptableKind(kind: string): AcceptableAccountKind {
		return isAcceptable(kind) ? kind : acceptableAccountKinds[0]
	}

	function isAcceptable(kind: string): kind is AcceptableAccountKind {
		return (<string[]>[ ...acceptableAccountKinds ]).indexOf(kind) > -1
	}
</script>

<article class={cardClasses}>
	{#if isEditing}
		<BasicForm
			id={formID}
			bind:currencyID={currencyID}
			bind:name={name}
			bind:description={description}
			bind:kind={kind}
			isConnecting={$isConnectingToUpdate}
			{IDPrefix}
			{currencies}
			errors={$updateErrors}
			on:submit={confirmEdit}/>
	{:else if isConfirmingDeletion}
		<h3>
			Delete
			{data.name}
			({associatedCurrency.code})
			<span class="badge primary">{friendlyKind}</span>?
		</h3>
		<p>Deleting this account may prevent other data from showing.</p>
	{:else}
		<h3>
			{data.name}
			({associatedCurrency.code})
			<span class="badge primary">{friendlyKind}</span>
		</h3>
		<p>{data.description}</p>
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
