<script lang="ts">
import type { DataTableCellStatus } from "+/component"
import type {
	Currency,
	CashFlowActivity,
	Account,
	Modifier,
	FinancialEntry
} from "+/entity"

import { createEventDispatcher } from "svelte"

import { UNKNOWN_OPTION, UNKNOWN_ACCOUNT, NO_CASH_FLOW_ACTIVITY } from "#/component"

import checkArchivedState from "$/utility/check_archived_state"
import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import formatAmount from "$/utility/format_amount"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/financial_entries/basic_form.svelte"
import DataTableAccountCell from "$/catalog/data_table_account_cell.svelte"
import DataTableCell from "$/catalog/data_table_cell.svelte"
import InnerGrid from "$/layout/inner_grid.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import DataTableRecord from "$/catalog/data_table_record.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"

export let currencies: Currency[]
export let cashFlowActivities: CashFlowActivity[]
export let accounts: Account[]
export let modifiers: Modifier[]
export let data: FinancialEntry

const dispatch = createEventDispatcher<{
	"remove": FinancialEntry
}>()
let modifierID = `${data.modifier_id}`
let debitAmount = `${data.debit_amount}`
let creditAmount = `${data.credit_amount}`
let transactedAt = data.transacted_at.slice(0, "YYYY-MM-DD".length)
let remarks = data.remarks
const forceDisabledFields: (keyof FinancialEntry)[] = [
	"modifier_id"
]

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_modifier_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: chosenModifier = modifiers.find(
	modifier => `${modifier.id}` === modifierID
)
$: friendlyAction = convertSnakeCaseToProperCase(chosenModifier?.action ?? "unknown")
$: label = `${chosenModifier?.name ?? UNKNOWN_OPTION}${
	typeof chosenModifier === "undefined" ? "" : ` (${friendlyAction})`
}`
$: debitCashFlowActivity = (
	chosenModifier
	&& cashFlowActivities.find(
		cashFlowActivity => cashFlowActivity.id === chosenModifier?.debit_cash_flow_activity_id
	)
) ?? NO_CASH_FLOW_ACTIVITY
$: creditCashFlowActivity = (
	chosenModifier
	&& cashFlowActivities.find(
		cashFlowActivity => cashFlowActivity.id === chosenModifier?.credit_cash_flow_activity_id
	)
) ?? NO_CASH_FLOW_ACTIVITY
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
$: debitAccountExistence = !checkArchivedState(debitAccount)
$: creditAccountExistence = !checkArchivedState(creditAccount)
$: friendlyDebitAmount = formatAmount(debitCurrency, data.debit_amount)
$: friendlyCreditAmount = formatAmount(creditCurrency, data.credit_amount)
$: resolvedRemarks = remarks || "None"
$: headerStatus = (
	chosenModifier?.deleted_at === null
		? "present"
		: "archived"
) as DataTableCellStatus

$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/financial_entries/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				"modifier_id": parseInt(modifierID),
				"transacted_at": `${transactedAt} 00:00:00`,
				"debit_amount": debitAmount,
				"credit_amount": creditAmount,
				remarks
			}
		},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"financial_entry": {
				"modifier_id": parseInt(modifierID),
				"transacted_at": `${transactedAt} 00:00:00`,
				"debit_amount": debitAmount,
				"credit_amount": creditAmount,
				remarks
			}
		})
	}
)

function resetDraft() {
	modifierID = `${data.modifier_id}`
	debitAmount = `${data.debit_amount}`
	creditAmount = `${data.credit_amount}`
	transactedAt = data.transacted_at.slice(0, "YYYY-MM-DD".length)
	remarks = data.remarks
}
</script>

<DataTableRecord
	{label}
	{isArchived}
	{headerStatus}
	options={restorableItemOptions}
	on:resetDraft={resetDraft}>
	<BasicForm
		slot="edit_form"
		let:confirmEdit
		let:cancelEdit
		let:isConnecting
		let:errors
		id={formID}
		bind:modifierID={modifierID}
		bind:transactedAt={transactedAt}
		bind:debitAmount={debitAmount}
		bind:creditAmount={creditAmount}
		bind:remarks={remarks}
		{IDPrefix}
		{isConnecting}
		{currencies}
		{accounts}
		{modifiers}
		{forceDisabledFields}
		{errors}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={isConnecting}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<DataTableCell slot="leading_cells">
		{transactedAt}
	</DataTableCell>
	<svelte:fragment slot="trailing_cells">
		<DataTableAccountCell
			rawDebitExistence={[ debitAccountExistence, debitAccountExistence ]}
			rawDebit={[ debitAccount.name, `(${debitCashFlowActivity.name})` ]}
			rawCreditExistence={[ creditAccountExistence, creditAccountExistence ]}
			rawCredit={[ creditAccount.name, `(${creditCashFlowActivity.name})` ]}/>
		<DataTableAccountCell
			kind="numeric"
			rawDebitExistence={[ debitAccountExistence, true ]}
			rawDebit={[ friendlyDebitAmount, " " ]}
			rawCreditExistence={[ creditAccountExistence, true ]}
			rawCredit={[ friendlyCreditAmount, " " ]}/>
	</svelte:fragment>
	<svelte:fragment slot="other_info">
		<InnerGrid>
			<GridCell kind="full">
				<ElementalParagraph>{resolvedRemarks}</ElementalParagraph>
			</GridCell>
		</InnerGrid>
	</svelte:fragment>
</DataTableRecord>
