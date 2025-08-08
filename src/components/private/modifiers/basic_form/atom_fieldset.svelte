<script lang="ts">
import type { GeneralError } from "+/rest"
import type { ChoiceInfo } from "+/component"
import type {
	Account,
	CashFlowActivity,
	AcceptableModifierAtomKind,
	ModifierAtomInput
} from "+/entity"

import { untrack } from "svelte"

import transformString from "$/form/choice_info_transformer/transform_string"
import transformCashFlowActivity
	from "$/form/choice_info_transformer/transform_cash_flow_activity"

import ShortParagraph from "$/typography/short_paragraph.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"

let {
	allowedModifierAtomKinds,
	hasAllowedAccounts,
	allowedAccounts,
	allowedAccountKinds,
	isCashFlowActivityProhibited,
	cashFlowActivities,
	disabled,
	atom = $bindable(),
	IDPrefix,
	isConnecting,
	errors,
	transformAccount
}: {
	allowedModifierAtomKinds: string[]
	hasAllowedAccounts: boolean
	allowedAccounts: Account[]
	allowedAccountKinds: string[]
	isCashFlowActivityProhibited: boolean
	cashFlowActivities: CashFlowActivity[]
	disabled: boolean
	atom: ModifierAtomInput
	IDPrefix: string
	isConnecting: boolean
	errors: GeneralError[]
	transformAccount: (account: Account) => ChoiceInfo
} = $props()

let accountID = $state(`${atom.account_id}`)
let cashFlowActivityID = $state(atom.cash_flow_activity_id === null
	? ""
	: `${atom.cash_flow_activity_id}`)
let kind = $state(atom.kind)

$effect(() => {
	const newKind = kind

	if (allowedModifierAtomKinds.indexOf(newKind) > -1) {
		untrack(() => {
			atom = {
				...atom,
				"kind": newKind
			}
		})
	} else {
		untrack(() => {
			atom = {
				...atom,
				"kind": allowedModifierAtomKinds[0] as AcceptableModifierAtomKind
			}
		})
	}
})

$effect(() => {
	const newAccountID = +accountID
	const account = allowedAccounts.find(
		account => newAccountID === account.id
	)

	if (account && allowedAccountKinds.indexOf(account.kind) > -1) {
		untrack(() => {
			atom = {
				...atom,
				"account_id": newAccountID
			}
		})
	} else {
		untrack(() => {
			atom = {
				...atom,
				"account_id": allowedAccounts[0].id
			}
		})
	}
})

$effect(() => {
	const oldCashFlowActivityID = untrack(() => atom.cash_flow_activity_id)
	const newCashFlowActivityID = +cashFlowActivityID

	if (
		(isCashFlowActivityProhibited && oldCashFlowActivityID !== null)
		|| (oldCashFlowActivityID === null && newCashFlowActivityID !== null)
		|| (oldCashFlowActivityID !== newCashFlowActivityID)
	) {
		untrack(() => {
			atom = {
				...atom,
				"cash_flow_activity_id": isCashFlowActivityProhibited
					? null
					: oldCashFlowActivityID === null
						? cashFlowActivities[0].id
						: newCashFlowActivityID
			}
		})
	}
})
</script>

<ChoiceListField
	fieldName="Kind"
	disabled={isConnecting || disabled}
	bind:value={kind}
	rawChoices={allowedModifierAtomKinds}
	choiceConverter={transformString}
	{IDPrefix}
	{errors}/>
{#if hasAllowedAccounts}
	<ChoiceListField
		fieldName="Account"
		disabled={isConnecting || disabled}
		bind:value={accountID}
		rawChoices={allowedAccounts}
		choiceConverter={transformAccount}
		{IDPrefix}
		{errors}/>
	{#if !isCashFlowActivityProhibited}
		<ChoiceListField
			fieldName="Cash Flow Activity"
			disabled={isConnecting || disabled}
			bind:value={cashFlowActivityID}
			rawChoices={cashFlowActivities}
			choiceConverter={transformCashFlowActivity}
			{IDPrefix}
			{errors}/>
	{/if}
{:else}
	<ShortParagraph>
		No accounts exist for this type of modifier atom.
	</ShortParagraph>
{/if}
