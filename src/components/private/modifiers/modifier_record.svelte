<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { CardStatus } from "+/component"
	import type { Currency, Account, AcceptableModifierKind, Modifier } from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import { acceptableModifierKinds } from "#/entity"
	import { UNKNOWN_ACCOUNT } from "#/component"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/modifiers/basic_form.svelte"
	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableRecord from "$/catalog/data_table_record.svelte"
	import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"

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
	$: debitAccount = accounts.find(
		account => account.id === data.debit_account_id
	) ?? UNKNOWN_ACCOUNT
	$: creditAccount = accounts.find(
		account => account.id === data.credit_account_id
	) ?? UNKNOWN_ACCOUNT
	$: resolveDescription = description || "None"

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
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={$isConnectingToUpdate}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<svelte:fragment slot="special_cells">
		<DataTableCell>
			{resolveDescription}
		</DataTableCell>
	</svelte:fragment>
</DataTableRecord>
