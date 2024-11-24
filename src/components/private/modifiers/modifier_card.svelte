<script lang="ts">
import type {
	Currency,
	CashFlowActivity,
	Account,
	AcceptableModifierKind,
	AcceptableModifierAction,
	Modifier
} from "+/entity"

import { createEventDispatcher } from "svelte"

import { acceptableModifierKinds, acceptableModifierActions } from "#/entity"
import { UNKNOWN_ACCOUNT } from "#/component"
import { NO_CASH_FLOW_ACTIVITY } from "#/component"

import checkArchivedState from "$/utility/check_archived_state"
import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/modifiers/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import Flex from "$/layout/flex.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let currencies: Currency[]
export let cashFlowActivities: CashFlowActivity[]
export let accounts: Account[]
export let data: Modifier

const dispatch = createEventDispatcher<{
	"remove": Modifier
}>()
let debitAccountID = `${data.debit_account_id}`
let creditAccountID = `${data.credit_account_id}`
let debitCashFlowActivityID = data.debit_cash_flow_activity_id === null
	? `${NO_CASH_FLOW_ACTIVITY.id}`
	: `${data.debit_cash_flow_activity_id}`
let creditCashFlowActivityID = data.credit_cash_flow_activity_id === null
	? `${NO_CASH_FLOW_ACTIVITY.id}`
	: `${data.credit_cash_flow_activity_id}`
let name = data.name
let description = data.description
let kind = fallbackToAceptableKind(data.kind)
let action = fallbackToAceptableAction(data.action)
const forceDisabledFields: (keyof Modifier)[] = [
	"debit_account_id",
	"credit_account_id",
	"debit_cash_flow_activity_id",
	"credit_cash_flow_activity_id",
	"kind",
	"action"
]

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_modifier_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: debitAccount = accounts.find(
	account => account.id === data.debit_account_id
) ?? UNKNOWN_ACCOUNT
$: creditAccount = accounts.find(
	account => account.id === data.credit_account_id
) ?? UNKNOWN_ACCOUNT
$: friendlyAction = data.action
$: friendlyKind = data.kind
$: resolvedDescription = description || "None"
$: hasDebitCashFlowActivity = debitCashFlowActivityID !== `${NO_CASH_FLOW_ACTIVITY.id}`
$: associatedDebitCashFlowActivity = hasDebitCashFlowActivity ? cashFlowActivities.find(
	cashFlowActivity => cashFlowActivity.id === parseInt(debitCashFlowActivityID)
) as CashFlowActivity : null
$: hasCreditCashFlowActivity = creditCashFlowActivityID !== `${NO_CASH_FLOW_ACTIVITY.id}`
$: associatedCreditCashFlowActivity = hasCreditCashFlowActivity ? cashFlowActivities.find(
	cashFlowActivity => cashFlowActivity.id === parseInt(creditCashFlowActivityID)
) as CashFlowActivity : null

$: friendlyDebitActivityName = hasDebitCashFlowActivity
	? associatedDebitCashFlowActivity?.name
	: null
$: friendlyCreditActivityName = hasCreditCashFlowActivity
	? associatedCreditCashFlowActivity?.name
	: null

$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/accounts/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				"debit_account_id": parseInt(debitAccountID),
				"credit_account_id": parseInt(creditAccountID),
				name,
				description
			}
		},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"modifier": {
				"debit_account_id": parseInt(debitAccountID),
				"credit_account_id": parseInt(creditAccountID),
				name,
				description
			}
		})
	}
)

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

<CollectionItem
	label={data.name}
	{isArchived}
	options={restorableItemOptions}
	on:resetDraft={resetDraft}>
	<BasicForm
		slot="edit_form"
		let:confirmEdit
		let:cancelEdit
		let:isConnecting
		let:errors
		id={formID}
		bind:debitAccountID={debitAccountID}
		bind:creditAccountID={creditAccountID}
		bind:debitCashFlowActivityID={debitCashFlowActivityID}
		bind:creditCashFlowActivityID={creditCashFlowActivityID}
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
		bind:action={action}
		{isConnecting}
		{IDPrefix}
		{currencies}
		{accounts}
		{cashFlowActivities}
		{errors}
		{forceDisabledFields}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={isConnecting}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<ShortParagraph slot="delete_confirmation_message">
		Deleting this modifier may prevent related data from being shown temporarily.
	</ShortParagraph>
	<ShortParagraph slot="restore_confirmation_message">
		Restoring this modifier may show related data.
	</ShortParagraph>
	<ShortParagraph slot="force_delete_confirmation_message">
		Deleting this modifier may prevent related data from being shown permanently.
	</ShortParagraph>
	<svelte:fragment slot="resource_info">
		<Flex direction="row" mustPad={false}>
			{#if convertSnakeCaseToProperCase(resolvedDescription) !== "None"}
				<ShortParagraph>
					{resolvedDescription}
				</ShortParagraph>
			{/if}
			<ShortParagraph>
				The {friendlyKind} {friendlyAction} modifier
				debits “{debitAccount.name}”
				{#if hasDebitCashFlowActivity}
					(debited cash flow is considered under “{friendlyDebitActivityName}”)
				{/if}
				and credits “{creditAccount.name}”
				{#if hasCreditCashFlowActivity}
					(credited cash flow is considered under “{friendlyCreditActivityName}”)
				{/if}.
			</ShortParagraph>
		</Flex>
	</svelte:fragment>
</CollectionItem>
