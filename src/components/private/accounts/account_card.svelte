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
	import CollectionItem from "$/catalog/collection_item.svelte"
	import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"

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
				: [ "s6", "m6", "l4" ]
		),
		"secondary-container"
	].join(" ")
	let isConnectingToUpdate = writable<boolean>(false)
	let updateErrors = writable<GeneralError[]>([])
	let requestUpdate = () => Promise.resolve()
	let isConnectingToDelete = writable<boolean>(false)
	let deleteErrors = writable<GeneralError[]>([])
	let requestDelete = () => Promise.resolve()

	$: friendlyKind = convertSnakeCaseToProperCase(data.kind).toLocaleLowerCase()
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
					"account": {
						"currency_id": parseInt(currencyID),
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
			"path": `/api/v1/accounts/${data.id}`,
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
		bind:currencyID={currencyID}
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
		isConnecting={$isConnectingToUpdate}
		{IDPrefix}
		{currencies}
		errors={$updateErrors}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={$isConnectingToUpdate}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<svelte:fragment slot="delete_confirmation_message">
		<ShortParagraph>
			Deleting this account may prevent other data from showing.
		</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency.code} as its currency.
		</ShortParagraph>
	</svelte:fragment>
	<svelte:fragment slot="resource_info">
		<ShortParagraph>{data.description}</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency.code} as its currency.
		</ShortParagraph>
	</svelte:fragment>
</CollectionItem>
