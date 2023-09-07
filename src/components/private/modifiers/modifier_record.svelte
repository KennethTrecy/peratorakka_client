<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type {
		Currency,
		Account,
		AcceptableModifierKind,
		AcceptableModifierAction,
		Modifier
	} from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import { acceptableModifierKinds, acceptableModifierActions } from "#/entity"
	import { UNKNOWN_ACCOUNT } from "#/component"

	import makeJSONRequester from "$/rest/make_json_requester"
	import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"

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
	let action = fallbackToAceptableAction(data.action)
	const forceDisabledFields: (keyof Modifier)[] = [
		"debit_account_id",
		"credit_account_id",
		"kind",
		"action"
	]

	$: IDPrefix = `old_modifier_${data.id}`
	$: formID = `${IDPrefix}_update_form`
	$: debitAccount = accounts.find(
		account => account.id === data.debit_account_id
	) ?? UNKNOWN_ACCOUNT
	$: creditAccount = accounts.find(
		account => account.id === data.credit_account_id
	) ?? UNKNOWN_ACCOUNT
	$: friendlyAction = convertSnakeCaseToProperCase(data.action)
	$: friendlyKind = convertSnakeCaseToProperCase(data.kind)
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
		return isAcceptableKind(kind) ? kind : acceptableModifierKinds[0]
	}

	function isAcceptableKind(kind: string): kind is AcceptableModifierKind {
		return (<string[]>[ ...acceptableModifierKinds ]).indexOf(kind) > -1
	}

	function fallbackToAceptableAction(action: string): AcceptableModifierAction {
		return isAcceptableAction(action) ? action : acceptableModifierActions[0]
	}

	function isAcceptableAction(action: string): action is AcceptableModifierAction {
		return (<string[]>[ ...acceptableModifierActions ]).indexOf(action) > -1
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
		bind:action={action}
		isConnecting={$isConnectingToUpdate}
		{IDPrefix}
		{currencies}
		{accounts}
		errors={$updateErrors}
		{forceDisabledFields}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={$isConnectingToUpdate}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<svelte:fragment slot="trailing_cells">
		<DataTableCell>
			{friendlyAction}
		</DataTableCell>
		<DataTableCell>
			{friendlyKind}
		</DataTableCell>
		<DataTableCell>
			{resolveDescription}
		</DataTableCell>
	</svelte:fragment>
</DataTableRecord>
