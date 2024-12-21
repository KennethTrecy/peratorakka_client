<script lang="ts">
import type { GeneralError } from "+/rest"
import type {
	AcceptableModifierKind,
	AcceptableModifierAction,
	Account,
	CashFlowActivity,
	Currency,
	Modifier
} from "+/entity"

import { NO_CASH_FLOW_ACTIVITY } from "#/component"
import { acceptableModifierKinds, acceptableModifierActions } from "#/entity"

import makeAccountTransformer from "$/form/choice_info_transformer/make_account_transformer"
import transformString from "$/form/choice_info_transformer/transform_string"
import transformCashFlowActivity
	from "$/form/choice_info_transformer/transform_cash_flow_activity"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import TextField from "$/form/text_field.svelte"

const ACCEPTABLE_MODIFIER_KINDS = [ ...acceptableModifierKinds ]
const ACCEPTABLE_MODIFIER_ACTIONS = [ ...acceptableModifierActions ]

export let IDPrefix: string
export let currencies: Currency[]
export let accounts: Account[]
export let cashFlowActivities: CashFlowActivity[]

export let debitAccountID: string
export let creditAccountID: string
export let debitCashFlowActivityID: string
export let creditCashFlowActivityID: string
export let name: string
export let description: string
const kind: AcceptableModifierKind = ACCEPTABLE_MODIFIER_KINDS[0] as AcceptableModifierKind
export let action: AcceptableModifierAction
export let forceDisabledFields: (keyof Modifier)[] = []

export let isConnecting: boolean
export let errors: GeneralError[]
export let id: string|null = null

$: availableAccounts = accounts.filter(account => account.deleted_at === null)
$: availableCashFlowActivities = [
	NO_CASH_FLOW_ACTIVITY,
	...cashFlowActivities.filter(
		cashFlowActivity => cashFlowActivity.deleted_at === null
	)
]
$: transformAccount = makeAccountTransformer(currencies)
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
		<ChoiceListField
			fieldName="Debit Account"
			errorFieldID="debit_account_id"
			disabled={isConnecting || forceDisabledFields.includes("debit_account_id")}
			bind:value={debitAccountID}
			rawChoices={availableAccounts}
			choiceConverter={transformAccount}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Debit Cash Flow Activity"
			errorFieldID="debit_cash_flow_activity_id"
			disabled={isConnecting || forceDisabledFields.includes("debit_cash_flow_activity_id")}
			bind:value={debitCashFlowActivityID}
			rawChoices={availableCashFlowActivities}
			choiceConverter={transformCashFlowActivity}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Credit Account"
			errorFieldID="credit_account_id"
			disabled={isConnecting || forceDisabledFields.includes("credit_account_id")}
			bind:value={creditAccountID}
			rawChoices={availableAccounts}
			choiceConverter={transformAccount}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Credit Cash Flow Activity"
			errorFieldID="credit_cash_flow_activity_id"
			disabled={isConnecting || forceDisabledFields.includes("credit_cash_flow_activity_id")}
			bind:value={creditCashFlowActivityID}
			rawChoices={availableCashFlowActivities}
			choiceConverter={transformCashFlowActivity}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Action"
			disabled={isConnecting || forceDisabledFields.includes("action")}
			bind:value={action}
			rawChoices={ACCEPTABLE_MODIFIER_ACTIONS}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Name"
			disabled={isConnecting || forceDisabledFields.includes("name")}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Description"
			disabled={isConnecting || forceDisabledFields.includes("description")}
			bind:value={description}
			{IDPrefix}
			{errors}/>
	</svelte:fragment>
	<slot slot="button_group" name="button_group"/>
</BasicForm>
