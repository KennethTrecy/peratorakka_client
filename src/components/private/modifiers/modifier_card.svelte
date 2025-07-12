<script lang="ts">
import type {
	Currency,
	CashFlowActivity,
	Account,
	AcceptableModifierKind,
	AcceptableModifierAction,
	Modifier,
	ModifierAtom,
	ModifierAtomActivity,
	ModifierAtomInput
} from "+/entity"

import {
	acceptableModifierKinds,
	acceptableModifierActions,
	REAL_DEBIT_MODIFIER_ATOM_KIND,
	REAL_CREDIT_MODIFIER_ATOM_KIND
} from "#/entity"

import checkArchivedState from "$/utility/check_archived_state"
import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/modifiers/basic_form.svelte"
import CardItem from "$/catalog/card_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import Flex from "$/layout/flex.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	currencies,
	cashFlowActivities,
	accounts,
	data = $bindable(),
	modifierAtoms = $bindable(),
	modifierAtomActivities = $bindable(),
	remove
}: {
	currencies: Currency[]
	cashFlowActivities: CashFlowActivity[]
	accounts: Account[]
	modifierAtoms: ModifierAtom[],
	modifierAtomActivities: ModifierAtomActivity[]
	data: Modifier
	remove: (resource: Modifier) => void
} = $props()

let name = $state(data.name)
let description = $state(data.description)
let kind = $state(fallbackToAceptableKind(data.kind))
let action = $state(fallbackToAceptableAction(data.action))
let atoms = $derived(modifierAtoms.filter(atom => atom.modifier_id === data.id))
let atomActivities = $derived(modifierAtomActivities.filter(
	atomActivity => atomActivity.modifier_atom_id !== null
))
let atomInputs = $derived<ModifierAtomInput[]>(
	atoms
	.filter(atom => atom.modifier_id === data.id)
	.map(atom => ({
		"account_id": atom.account_id,
		"kind": atom.kind,
		"cash_flow_activity_id": atomActivities.find(
			atomActivity => atomActivity.modifier_atom_id === atom.id
		)?.cash_flow_activity_id ?? null
	}))
)
const forceDisabledFields: (keyof Modifier)[] = [
	"action"
]

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_modifier_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let friendlyAction = $derived(data.action)
let friendlyKind = $derived(data.kind)
let resolvedDescription = $derived(description || "None")
let debitAtoms = $derived(atomInputs.filter(atom => atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND))
let creditAtoms = $derived(atomInputs.filter(atom => atom.kind === REAL_CREDIT_MODIFIER_ATOM_KIND))

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

let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/modifiers/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				name,
				description,
				kind
			}
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"modifier": {
				name,
				description,
				kind
			}
		})
	}
))

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

<CardItem
	label={data.name}
	{isArchived}
	options={restorableItemOptions}
	{resetDraft}>
	{#snippet edit_form({ confirmEdit, cancelEdit, isConnecting, errors })}
		<BasicForm
			id={formID}
			bind:name={name}
			bind:description={description}
			bind:kind={kind}
			bind:action={action}
			bind:atoms={atomInputs}
			{isConnecting}
			isEditing={true}
			{IDPrefix}
			{currencies}
			{accounts}
			{cashFlowActivities}
			{errors}
			{forceDisabledFields}
			onsubmit={confirmEdit}>
			{#snippet button_group()}
				<EditActionCardButtonPair
					disabled={isConnecting}
					{cancelEdit}/>
			{/snippet}
		</BasicForm>
	{/snippet}
	{#snippet delete_confirmation_message()}
		<ShortParagraph>
			Deleting this modifier may prevent related data from being shown temporarily.
		</ShortParagraph>
	{/snippet}
	{#snippet restore_confirmation_message()}
		<ShortParagraph>
			Restoring this modifier may show related data.
		</ShortParagraph>
	{/snippet}
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph>
			Deleting this modifier may prevent related data from being shown permanently.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		<Flex direction="row" mustPad={false}>
			{#if convertSnakeCaseToProperCase(resolvedDescription) !== "None"}
				<ShortParagraph>
					{resolvedDescription}
				</ShortParagraph>
			{/if}
			<ShortParagraph>
				The {friendlyKind} {friendlyAction} modifier
				debits {friendlyDebitAtoms}
				and credits {friendlyCreditAtoms}.
			</ShortParagraph>
		</Flex>
	{/snippet}
</CardItem>
