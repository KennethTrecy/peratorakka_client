<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type {
	Currency,
	Account,
	CashFlowActivity,
	Modifier,
	ModifierAtomInput,
	AcceptableModifierKind,
	AcceptableModifierAction
} from "+/entity"

import {
	acceptableModifierActions,
	REAL_DEBIT_MODIFIER_ATOM_KIND,
	REAL_CREDIT_MODIFIER_ATOM_KIND,
	LIQUID_ASSET_ACCOUNT_KIND
} from "#/entity"

import transformString from "$/form/choice_info_transformer/transform_string"

import AtomManager from "%/modifiers/basic_form/atom_manager.svelte"
import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextField from "$/form/text_field.svelte"

const ACCEPTABLE_MODIFIER_ACTIONS = [ ...acceptableModifierActions ]

let {
	IDPrefix,
	currencies,
	accounts,
	cashFlowActivities,
	name = $bindable(),
	description = $bindable(),
	action = $bindable(),
	kind = $bindable(),
	atoms = $bindable(),
	forceDisabledFields = [],
	isConnecting,
	isEditing,
	errors,
	id = null,
	onsubmit,
	"button_group": common_button_group
}: {
	IDPrefix: string
	currencies: Currency[]
	accounts: Account[]
	cashFlowActivities: CashFlowActivity[]
	name: string
	description: string
	action: AcceptableModifierAction
	kind: AcceptableModifierKind
	atoms: ModifierAtomInput[]
	forceDisabledFields?: (keyof Modifier)[]
	isConnecting: boolean
	isEditing: boolean
	errors: GeneralError[]
	id?: string|null
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()
let debitAtoms = $derived(atoms.filter(atom => atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND))
let creditAtoms = $derived(atoms.filter(atom => atom.kind === REAL_CREDIT_MODIFIER_ATOM_KIND))

let friendlyDebitAtoms = $derived(debitAtoms.map(atom => {
	const account = accounts.find(account => account.id === atom.account_id)
	const cashFlowActivity = cashFlowActivities.find(
		cashFlowActivity => cashFlowActivity.id === atom.cash_flow_activity_id
	)
	const friendlyCashFlowActivity = typeof cashFlowActivity === "undefined"
		? ""
		: ` (as part of “${cashFlowActivity.name}”)`

	return `“${account?.name ?? "Unknown Account"}”${friendlyCashFlowActivity}`
}).join(", "))
let friendlyCreditAtoms = $derived(creditAtoms.map(atom => {
	const account = accounts.find(account => account.id === atom.account_id)
	const cashFlowActivity = cashFlowActivities.find(
		cashFlowActivity => cashFlowActivity.id === atom.cash_flow_activity_id
	)
	const friendlyCashFlowActivity = typeof cashFlowActivity === "undefined"
		? ""
		: ` (as part of “${cashFlowActivity.name}”)`
	return `“${account?.name ?? "Unknown Account"}”${friendlyCashFlowActivity}`
}).join(", "))

function addAtom() {
	const realDebitModifierKindCount = atoms.filter(
		atom => atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND
	).length
	const realCreditModifierKindCount = atoms.filter(
		atom => atom.kind === REAL_CREDIT_MODIFIER_ATOM_KIND
	).length
	const nextAtomKind = realDebitModifierKindCount > realCreditModifierKindCount
		? REAL_CREDIT_MODIFIER_ATOM_KIND
		: REAL_DEBIT_MODIFIER_ATOM_KIND

	const defaultAccountID = accounts[0].id
	const accountInfo = accounts.find(
		account => account.id === defaultAccountID
	) as Account
	const isLiquidAsset = accountInfo.kind === LIQUID_ASSET_ACCOUNT_KIND
	const defaultCashFlowActivityID = isLiquidAsset
		? null
		: cashFlowActivities[0].id

	atoms = [ ...atoms, {
		"account_id": defaultAccountID,
		"cash_flow_activity_id": defaultCashFlowActivityID,
		"kind": nextAtomKind
	} ]
}
</script>

<BasicForm {id} {isConnecting} {errors} {onsubmit}>
	{#snippet fields()}
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
		{#if isEditing}
			<ShortParagraph>
				Debits {friendlyDebitAtoms}
				and credits {friendlyCreditAtoms}.
			</ShortParagraph>
		{:else}
			<AtomManager
				{IDPrefix}
				{currencies}
				{accounts}
				{cashFlowActivities}
				disabled={isConnecting || isEditing}
				{action}
				bind:atoms={atoms}
				{isConnecting}
				{errors}/>
		{/if}
	{/snippet}
	{#snippet button_group()}
		{#if !isEditing}
			<TextCardButton
				kind="button"
				disabled={isConnecting}
				label="Add Atom"
				onclick={addAtom}/>
		{/if}
		{@render common_button_group()}
	{/snippet}
</BasicForm>
