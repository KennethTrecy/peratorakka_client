<script lang="ts">
import type { GeneralError } from "+/rest"
import type { ChoiceInfo } from "+/component"
import type {
	Account,
	CashFlowActivity,
	AcceptableModifierAction,
	ModifierAtomInput
} from "+/entity"

import { untrack } from "svelte"

import { UNKNOWN_ACCOUNT } from "#/component"
import {
	MODIFIER_ACTION_COMBINATIONS,
	LIQUID_ASSET_ACCOUNT_KIND,
	CLOSE_MODIFIER_ACTION
} from "#/entity"

import AtomFieldset from "%/modifiers/basic_form/atom_fieldset.svelte"
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
	remove: (event: MouseEvent) => void
	up: (event: MouseEvent) => void
	down: (event: MouseEvent) => void
} = $props()

let allowedModifierAtomKinds = $derived(MODIFIER_ACTION_COMBINATIONS[action].map(
	atomKindCombination => atomKindCombination[0]
) as string[])
let allowedAccountKinds = $derived(MODIFIER_ACTION_COMBINATIONS[action].filter(
	atomKindCombination => atomKindCombination[0] === atom.kind
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
</script>

<GeneralFieldContainer tag="fieldset">
	<AtomFieldset
		{isAllowedModifierAtomKind}
		{allowedModifierAtomKinds}
		{hasAllowedAccounts}
		{allowedAccounts}
		{isAllowedAccountKind}
		{allowedAccountKinds}
		{isCashFlowActivityProhibited}
		{cashFlowActivities}
		{disabled}
		bind:atom={atom}
		{IDPrefix}
		{isConnecting}
		{errors}
		{transformAccount}/>
	{#if !disabled}
		<TextButton
			label="Remove"
			disabled={maxIndex < 2}
			onclick={remove}/>
		<TextButton
			label="Move Up"
			disabled={index === 0}
			onclick={up}/>
		<TextButton
			label="Move Down"
			disabled={index === maxIndex}
			onclick={down}/>
	{/if}
</GeneralFieldContainer>
