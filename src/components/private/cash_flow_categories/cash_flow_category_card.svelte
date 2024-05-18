<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { AcceptableCashFlowCategoryKind, CashFlowCategory } from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/cash_flow_categories/basic_form.svelte"
	import CollectionItem from "$/catalog/collection_item.svelte"
	import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"

	export let data: CashFlowCategory

	const dispatch = createEventDispatcher<{
		"delete": CashFlowCategory
	}>()
	let name = data.name
	let description = data.description
	let kind = data.kind as AcceptableCashFlowCategoryKind

	$: IDPrefix = `old_cash_flow_category_${data.id}`
	$: formID = `${IDPrefix}_update_form`
	let isConnectingToUpdate = writable<boolean>(false)
	let updateErrors = writable<GeneralError[]>([])
	let requestUpdate = () => Promise.resolve()
	let isConnectingToDelete = writable<boolean>(false)
	let deleteErrors = writable<GeneralError[]>([])
	let requestDelete = () => Promise.resolve()

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/cash_flow_categories/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "PUT",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						data = {
							...data,
							name,
							description,
							kind
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
					"cash_flow_category": {
						name,
						description,
						kind
					}
				})
			})
		}
	}

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/cash_flow_categories/${data.id}`,
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
		name = data.name
		description = data.description
		kind = data.kind as AcceptableCashFlowCategoryKind
	}
</script>

<CollectionItem
	label={data.name}
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
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
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
		Deleting this cash flow category may cause inaccuracy of the cash flow statement.
	</ShortParagraph>
	<ShortParagraph slot="resource_info">
		{data.name}
	</ShortParagraph>
</CollectionItem>
