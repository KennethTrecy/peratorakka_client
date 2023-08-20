<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { CardStatus } from "+/component"
	import type { Currency, Account, AcceptableModifierKind, Modifier } from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import { acceptableModifierKinds } from "#/entity"

	import makeJSONRequester from "$/rest/make_json_requester"
	import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"

	import BasicForm from "%/modifiers/basic_form.svelte"
	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableRecord from "$/catalog/data_table_record.svelte"

	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Modifier

	const dispatch = createEventDispatcher<{
		"delete": Modifier
	}>()
	let debitAccountID = `${data.debit_account_id}`
	let creditAccountID = `${data.credit_account_id}`
	let name = data.name
	let description = data.description
	let kind = fallbackToAceptableKind(data.kind)

	$: IDPrefix = `old_modifier_${data.id}`
	$: formID = `${IDPrefix}_update_form`
	$: debitAccount = accounts.find(account => account.id === data.debit_account_id) as Account
	$: creditAccount = accounts.find(account => account.id === data.credit_account_id) as Account

	let isConnectingToUpdate = writable<boolean>(false)
	let updateErrors = writable<GeneralError[]>([])
	let requestUpdate = () => Promise.resolve()
	let isConnectingToDelete = writable<boolean>(false)
	let deleteErrors = writable<GeneralError[]>([])
	let requestDelete = () => Promise.resolve()

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/modifiers/${data.id}`,
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
							description
						}
						updateErrors.set([])
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
					"modifier": {
						name,
						description
					}
				})
			})
		}
	}
	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/modifiers/${data.id}`,
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
	}

	function fallbackToAceptableKind(kind: string): AcceptableModifierKind {
		return isAcceptable(kind) ? kind : acceptableModifierKinds[0]
	}

	function isAcceptable(kind: string): kind is AcceptableModifierKind {
		return (<string[]>[ ...acceptableModifierKinds ]).indexOf(kind) > -1
	}
</script>

<DataTableRecord
	label={data.name}
	{debitAccount}
	{creditAccount}
	{updateErrors}
	{requestUpdate}
	isConnectingToDelete={$isConnectingToDelete}
	{deleteErrors}
	{requestDelete}
	on:resetDraft={resetDraft}>
	<BasicForm
		slot="edit_form"
		let:confirmEdit
		let:cancelEdit
		id={formID}
		bind:debitAccountID={debitAccountID}
		bind:creditAccountID={creditAccountID}
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
		isConnecting={$isConnectingToUpdate}
		{IDPrefix}
		{currencies}
		{accounts}
		errors={$updateErrors}
		on:submit={confirmEdit}/>
	<svelte:fragment slot="special_cells">
		<DataTableCell>
			{data.description}
		</DataTableCell>
	</svelte:fragment>
</DataTableRecord>
