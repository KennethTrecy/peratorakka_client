<script lang="ts">
	import type { DataTableCellStatus } from "+/component"
	import type { GeneralError } from "+/rest"
	import type {
		Currency,
		Account,
		Modifier,
		FinancialEntry
	} from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"

	import { UNKNOWN_OPTION, UNKNOWN_ACCOUNT } from "#/component"

	import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
	import formatAmount from "$/utility/format_amount"
	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/financial_entries/basic_form.svelte"
	import DataTableAccountCell from "$/catalog/data_table_account_cell.svelte"
	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableRecord from "$/catalog/data_table_record.svelte"
	import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"

	export let currencies: Currency[]
	export let accounts: Account[]
	export let modifiers: Modifier[]
	export let data: FinancialEntry

	const dispatch = createEventDispatcher<{
		"delete": FinancialEntry
	}>()
	let modifierID = `${data.modifier_id}`
	let debitAmount = `${data.debit_amount}`
	let creditAmount = `${data.credit_amount}`
	let transactedAt = data.transacted_at.slice(0, "YYYY-MM-DD".length)
	let remarks = data.remarks
	const forceDisabledFields: (keyof FinancialEntry)[] = [
		"modifier_id"
	]

	$: IDPrefix = `old_modifier_${data.id}`
	$: formID = `${IDPrefix}_update_form`
	$: chosenModifier = modifiers.find(
		modifier => `${modifier.id}` === modifierID
	)
	$: friendlyAction = convertSnakeCaseToProperCase(chosenModifier?.action ?? "unknown")
	$: debitAccount = (
		chosenModifier
		&& accounts.find(
			account => account.id === chosenModifier?.debit_account_id
		)
	) ?? UNKNOWN_ACCOUNT
	$: creditAccount = (
		chosenModifier
		&& accounts.find(
			account => account.id === chosenModifier?.credit_account_id
		)
	) ?? UNKNOWN_ACCOUNT
	$: debitCurrency = debitAccount && currencies.find(
		currency => currency.id === debitAccount?.currency_id
	)
	$: creditCurrency = creditAccount && currencies.find(
		currency => currency.id === creditAccount?.currency_id
	)
	$: friendlyDebitAmount = formatAmount(debitCurrency, data.debit_amount)
	$: friendlyCreditAmount = formatAmount(creditCurrency, data.credit_amount)
	$: resolveRemarks = remarks || "None"

	let isConnectingToUpdate = writable<boolean>(false)
	let updateErrors = writable<GeneralError[]>([])
	let requestUpdate = () => Promise.resolve()
	let isConnectingToDelete = writable<boolean>(false)
	let deleteErrors = writable<GeneralError[]>([])
	let requestDelete = () => Promise.resolve()

	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/financial_entries/${data.id}`,
			"defaultRequestConfiguration": {
				"method": "PUT",
			},
			"manualResponseHandlers": [
				{
					"statusCode": 204,
					"action": async (response: Response) => {
						data = {
							...data,
							"modifier_id": parseInt(modifierID),
							"transacted_at": `${transactedAt} 00:00:00`,
							"debit_amount": debitAmount,
							"credit_amount": creditAmount,
							remarks
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
					"financial_entry": {
						"modifier_id": parseInt(modifierID),
						"transacted_at": `${transactedAt} 00:00:00`,
						"debit_amount": debitAmount,
						"credit_amount": creditAmount,
						remarks
					}
				})
			})
		}
	}
	$: {
		const requesterInfo = makeJSONRequester({
			"path": `/api/v1/financial_entries/${data.id}`,
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
	$: headerStatus = (
		chosenModifier?.deleted_at === null
			? "present"
			: "archived"
	) as DataTableCellStatus

	function resetDraft() {
		modifierID = `${data.modifier_id}`
		debitAmount = `${data.debit_amount}`
		creditAmount = `${data.credit_amount}`
		transactedAt = data.transacted_at.slice(0, "YYYY-MM-DD".length)
		remarks = data.remarks
	}
</script>

<DataTableRecord
	label={chosenModifier?.name ?? UNKNOWN_OPTION}
	{headerStatus}
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
		bind:modifierID={modifierID}
		bind:transactedAt={transactedAt}
		bind:debitAmount={debitAmount}
		bind:creditAmount={creditAmount}
		bind:remarks={remarks}
		isConnecting={$isConnectingToUpdate}
		{IDPrefix}
		{currencies}
		{accounts}
		{modifiers}
		{forceDisabledFields}
		errors={$updateErrors}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={$isConnectingToUpdate}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<DataTableCell slot="leading_cells">
		{transactedAt}
	</DataTableCell>
	<svelte:fragment slot="trailing_cells">
		<DataTableCell>
			{friendlyAction}
		</DataTableCell>
		<DataTableAccountCell
			kind="numeric"
			rawDebitExistence={[ true ]}
			rawDebit={[ friendlyDebitAmount ]}
			rawCreditExistence={[ true ]}
			rawCredit={[ friendlyCreditAmount ]}/>
		<DataTableCell kind="descriptive">
			{resolveRemarks}
		</DataTableCell>
	</svelte:fragment>
</DataTableRecord>
