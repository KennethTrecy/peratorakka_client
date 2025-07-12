<script lang="ts">
import type { GeneralError } from "+/rest"
import type { ChoiceInfo } from "+/component"
import type {
	Account,
	CashFlowActivity,
	AcceptableModifierAction,
	AcceptableModifierAtomKind,
	ModifierAtomInput
} from "+/entity"

import { untrack } from "svelte"

import { UNKNOWN_ACCOUNT } from "#/component"
import {
	MODIFIER_ACTION_COMBINATIONS,
	LIQUID_ASSET_ACCOUNT_KIND,
	CLOSE_MODIFIER_ACTION
} from "#/entity"

import transformString from "$/form/choice_info_transformer/transform_string"
import transformCashFlowActivity
	from "$/form/choice_info_transformer/transform_cash_flow_activity"

import ShortParagraph from "$/typography/short_paragraph.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import GeneralFieldContainer from "$/form/general_field_container.svelte"
import TextButton from "$/button/text.svelte"

let {
	accounts,
	cashFlowActivities,
	index,
	maxIndex,
	disabled,
	action,
	atom = $bindable(),
	IDPrefix,
	isConnecting,
	errors,
	transformAccount,
	remove,
	up,
	down
}: {
	accounts: Account[]
	cashFlowActivities: CashFlowActivity[]
	index: number
	maxIndex: number
	disabled: boolean
	action: AcceptableModifierAction
	atom: ModifierAtomInput
	IDPrefix: string
	isConnecting: boolean
	errors: GeneralError[]
	transformAccount: (account: Account) => ChoiceInfo
	remove: (index: number) => void
	up: (index: number) => void
	down: (index: number) => void
} = $props()

let accountID = $state(`${atom.account_id}`)
let cashFlowActivityID = $state("")
let kind = $state(atom.kind)

let allowedModifierAtomKinds = $derived(MODIFIER_ACTION_COMBINATIONS[action].map(
	atomKindCombination => atomKindCombination[0]
) as string[])
let allowedAccountKinds = $derived(MODIFIER_ACTION_COMBINATIONS[action].filter(
	atomKindCombination => atomKindCombination[0] === kind
)[0][1] as string[])
let allowedAccounts = $derived(accounts.filter(
	account => allowedAccountKinds.indexOf(account.kind) > -1
))

let account = $derived(accounts.find(
	account => atom.account_id === account.id
) ?? UNKNOWN_ACCOUNT)
let accountKind = $derived(account.kind)
let isLiquidAsset = $derived(accountKind === LIQUID_ASSET_ACCOUNT_KIND)
let isCloseAction = $derived(action === CLOSE_MODIFIER_ACTION)
let isCashFlowActivityProhibited = $derived(isLiquidAsset || isCloseAction)
let hasAllowedAccounts = $derived(allowedAccounts.length > 0)
let isAllowedAccountKind = $derived(allowedAccountKinds.indexOf(accountKind) > -1)
let isAllowedModifierAtomKind = $derived(allowedModifierAtomKinds.indexOf(atom.kind) > -1)

$effect(() => {
	if (atom.kind !== untrack(() => kind)) {
		untrack(() => {
			kind = atom.kind
		})
	}
})

$effect(() => {
	if (isAllowedModifierAtomKind) {
		if (kind !== untrack(() => atom.kind)) {
			untrack(() => {
				atom = { ...atom, kind }
			})
		}
	} else {
		untrack(() => {
			atom = { ...atom, kind: allowedModifierAtomKinds[0] as AcceptableModifierAtomKind }
		})
	}
})

$effect(() => {
	if (atom.account_id !== untrack(() => +accountID)) {
		untrack(() => {
			accountID = `${atom.account_id}`
		})
	}
})

$effect(() => {
	if (isAllowedAccountKind) {
		if (accountID !== untrack(() => `${atom.account_id}`)) {
			untrack(() => {
				atom = { ...atom, "account_id": +accountID }
			})
		}
	} else {
		untrack(() => {
			atom = { ...atom, "account_id": allowedAccounts[0].id }
		})
	}
})

$effect(() => {
	if (
		(isCashFlowActivityProhibited && atom.cash_flow_activity_id !== null)
		|| (atom.cash_flow_activity_id === null && untrack(() => cashFlowActivityID) !== "")
		|| (atom.cash_flow_activity_id !== untrack(() => +cashFlowActivityID))
	) {
		untrack(() => {
			cashFlowActivityID = atom.cash_flow_activity_id === null || isCashFlowActivityProhibited
				? ""
				: `${atom.cash_flow_activity_id}`
		})
	}
})

$effect(() => {
	if (
		(isCashFlowActivityProhibited && cashFlowActivityID !== null)
		|| (cashFlowActivityID === "" && untrack(() => atom.cash_flow_activity_id) !== null)
		|| (cashFlowActivityID !== untrack(() => `${atom.cash_flow_activity_id}`))
	) {
		untrack(() => {
			atom = {
				...atom,
				"cash_flow_activity_id": isCashFlowActivityProhibited
					? null
					: cashFlowActivityID === ""
						? cashFlowActivities[0].id
						: +cashFlowActivityID
			}
		})
	}
})

// let oldKind = $derived(oldAtom.kind)
// let currentKind = $derived(atom.kind)
// $effect(() => {
// 	if (JSON.stringify(oldAtom) !== JSON.stringify(atom)) {
// 		untrack(() => {
// 			oldAtom = atom
// 		})
// 	} else if (oldKind !== currentKind) {
// 		untrack(() => {
// 			oldKind = currentKind
// 			switch (currentKind) {
// 				case REAL_DEBIT_MODIFIER_ATOM_KIND:
// 				case REAL_CREDIT_MODIFIER_ATOM_KIND:
// 					break;
// 				case ITEM_COUNT_MODIFIER_ATOM_KIND:
// 				case PRICE_COUNT_MODIFIER_ATOM_KIND:
// 					// TODO: Limit the accounts to itemized accounts
// 					break;
// 			}
// 		})
// 	}
// })
</script>

<GeneralFieldContainer tag="fieldset">
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
	{#if !disabled}
		<TextButton
			label="Remove"
			disabled={maxIndex < 2}
			onclick={() => remove(index)}/>
		<TextButton
			label="Move Up"
			disabled={index === 0}
			onclick={() => up(index)}/>
		<TextButton
			label="Move Down"
			disabled={index === maxIndex}
			onclick={() => down(index)}/>
	{/if}
</GeneralFieldContainer>
