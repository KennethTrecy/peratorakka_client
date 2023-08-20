<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { Currency } from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/currencies/basic_form.svelte"
	import CollectionItem from "$/catalog/collection_item.svelte"
	import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"

	export let data: Currency

	const dispatch = createEventDispatcher<{
		"delete": Currency
	}>()
	let code = data.code
	let name = data.name

	$: IDPrefix = `old_currency_${data.id}`
	$: formID = `${IDPrefix}_update_form`
	let isConnectingToUpdate = writable<boolean>(false)
	let updateErrors = writable<GeneralError[]>([])
	let requestUpdate = () => Promise.resolve()
	let isConnectingToDelete = writable<boolean>(false)
	let deleteErrors = writable<GeneralError[]>([])
	let requestDelete = () => Promise.resolve()

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
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnectingToUpdate = requesterInfo.isConnecting
		updateErrors = requesterInfo.errors
		requestUpdate = async () => {
			await requesterInfo.send({
				"body": JSON.stringify({
					"currency": {
						code,
						name
					}
				})
			})
		}
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
						dispatch("delete", data)
					}
				}
			],
			"expectedErrorStatusCodes": [ 400 ]
		})

		isConnectingToDelete = requesterInfo.isConnecting
		deleteErrors = requesterInfo.errors
		requestDelete = async () => await requesterInfo.send({})
	}

	function resetDraft() {
		code = data.code
		name = data.name
	}
</script>

<CollectionItem
	label={data.code}
	updateErrors={updateErrors}
	{requestUpdate}
	isConnectingToDelete={$isConnectingToDelete}
	deleteErrors={deleteErrors}
	{requestDelete}
	on:resetDraft={resetDraft}>
	<BasicForm
		slot="edit_form"
		let:confirmEdit
		let:cancelEdit
		id={formID}
		bind:code={code}
		bind:name={name}
		isConnecting={$isConnectingToUpdate}
		{IDPrefix}
		errors={$updateErrors}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={$isConnectingToUpdate}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<ShortParagraph slot="delete_confirmation_message">
		Deleting this currency may prevent other data from showing.
	</ShortParagraph>
	<ShortParagraph slot="resource_info">
		{data.name}
	</ShortParagraph>
</CollectionItem>
