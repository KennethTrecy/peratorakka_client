<script lang="ts">
import type { ContextBundle } from "+/component"
import type {
	Currency,
	Account,
	CashFlowActivity,
	Modifier,
	ModifierAtom,
	ModifierAtomActivity,
	ModifierAtomInput,
	AcceptableModifierKind,
	AcceptableModifierAction
} from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { UNKNOWN_OPTION } from "#/component"
import {
	acceptableModifierKinds,
	acceptableModifierActions,
	REAL_DEBIT_MODIFIER_ATOM_KIND,
	REAL_CREDIT_MODIFIER_ATOM_KIND,
	LIQUID_ASSET_ACCOUNT_KIND
} from "#/entity"

import assertAuthentication from "$/page_requirement/assert_authentication"
import mergeUniqueElements from "$/utility/merge_unique_elements"
import mergeUniqueResources from "$/utility/merge_unique_resources"

import BasicForm from "%/modifiers/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Card from "%/modifiers/modifier_card.svelte"
import TextContainer from "$/typography/text_container.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let currencies = $state<Currency[]>([])
let accounts = $state<Account[]>([])
let cashFlowActivities = $state<CashFlowActivity[]>([])
let modifierAtoms = $state<ModifierAtom[]>([])
let modifierAtomActivities = $state<ModifierAtomActivity[]>([])

function deriveID(resource: unknown): string {
	return `${(resource as Modifier).id}`
}

let currencyID: string = $state(UNKNOWN_OPTION)
let name: string = $state("")
let description: string = $state("")
let kind = $state<AcceptableModifierKind>(acceptableModifierKinds[0] as AcceptableModifierKind)
let action = $state<AcceptableModifierAction>(
	acceptableModifierActions[0] as AcceptableModifierAction
)
let atoms = $state<ModifierAtomInput[]>([])

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"modifier": {
			"currency_id": parseInt(currencyID),
			name,
			description,
			kind,
			action,
			"@relationship": {
				"modifier_atoms": atoms
			}
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	currencyID = UNKNOWN_OPTION
	name = ""
	description = ""
	kind = acceptableModifierKinds[0]
	action = acceptableModifierActions[0]

	const defaultAccountID = accounts[0].id
	const accountInfo = accounts.find(
		account => account.id === defaultAccountID
	) as Account
	const isLiquidAsset = accountInfo.kind === LIQUID_ASSET_ACCOUNT_KIND
	const defaultCashFlowActivityID = isLiquidAsset
		? null
		: cashFlowActivities[0].id

	atoms = [
		{
			"account_id": defaultAccountID,
			"cash_flow_activity_id": defaultCashFlowActivityID,
			"kind": REAL_DEBIT_MODIFIER_ATOM_KIND
		},
		{
			"account_id": defaultAccountID,
			"cash_flow_activity_id": defaultCashFlowActivityID,
			"kind": REAL_CREDIT_MODIFIER_ATOM_KIND
		}
	]

	const {
		modifier,
		"modifier_atoms": newModifierAtoms,
		"modifier_atom_activities": newModifierAtomActivities
	} = document

	modifierAtoms = mergeUniqueResources(modifierAtoms, newModifierAtoms as ModifierAtom[])
	modifierAtomActivities = mergeUniqueElements(
		modifierAtomActivities,
		newModifierAtomActivities as ModifierAtomActivity[],
		element => `${element.modifier_atom_id}_${element.cash_flow_activity_id}`
	)
	return modifier
}

function processListResourceObject(document: Record<string, unknown>): void {
	modifierAtoms = mergeUniqueResources(modifierAtoms, document["modifier_atoms"] as ModifierAtom[])
	modifierAtomActivities = mergeUniqueElements(
		modifierAtomActivities,
		document["modifier_atom_activities"] as ModifierAtomActivity[],
		element => `${element.modifier_atom_id}_${element.cash_flow_activity_id}`
	)
}

let existingCurrencies = $derived(currencies.filter(
	currency => currency.deleted_at === null
))
let existingAccounts = $derived(accounts.filter(
	account => account.deleted_at === null
))
let existingCashFlowActivities = $derived(cashFlowActivities.filter(
	cashFlowActivity => cashFlowActivity.deleted_at === null
))
</script>

<CompleteResourcePage
pageTitle="Modifiers"
createTitle="Add Modifier"
listTitle="Available Modifiers"
	collectiveName="modifiers"
	defaultSortCriterion="name"
	availableSortCriteria={[
		"name",
		"created_at",
		"updated_at",
		"deleted_at"
	]}
	additionalListParameters={[
		[ "relationship", "modifier_atoms,modifier_atom_activities" ]
	]}
	dependencies={[ existingCurrencies, existingAccounts, existingCashFlowActivities ]}
	dependencyInfos={[
		{
			"partialPath": "/api/v2/cash_flow_activities",
			"mainSortCriterion": "name",
			"resourceKey": "cash_flow_activities",
			"getResources": () => cashFlowActivities,
			"setResources": newResources => { cashFlowActivities = newResources as CashFlowActivity[] }
		},
		{
			"partialPath": "/api/v2/accounts",
			"mainSortCriterion": "name",
			"resourceKey": "accounts",
			"getResources": () => accounts,
			"setResources": newResources => { accounts = newResources as Account[] }
		},
		{
			"partialPath": "/api/v2/currencies",
			"mainSortCriterion": "name",
			"resourceKey": "currencies",
			"getResources": () => currencies,
			"setResources": newResources => { currencies = newResources as Currency[] }
		}
	]}
	{deriveID}
	{makeNewResourceObject}
	{processCreatedResourceObject}
	{processListResourceObject}>
	{#snippet general_description()}
		<TextContainer>
			<ElementalParagraph>
				Modifiers are premade actions to create financial entries. Currently, manual input is
				the only kind of modifier available. Other kinds may added in the future to allow
				automated modifications on different accounts.
			</ElementalParagraph>
			<ElementalParagraph>
				Modifiers can also serve as references for financial entries. Everyone reading the
				entries would know if a financial entry was a result of manual input or automated
				calculations.
			</ElementalParagraph>
			<ElementalParagraph>
				To create a modifier to be used by the system, choose a debit account and a credit
				account that the modifier would be responsible. After that, fill out other required
				info. Finally, press "Add" button.
			</ElementalParagraph>
		</TextContainer>
	{/snippet}
	{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
		<BasicForm
			currencies={existingCurrencies}
			accounts={existingAccounts}
			cashFlowActivities={existingCashFlowActivities}
			bind:name={name}
			bind:description={description}
			bind:kind={kind}
			bind:action={action}
			bind:atoms={atoms}
			{isConnecting}
			isEditing={false}
			{IDPrefix}
			{errors}
			{onsubmit}
			{button_group}/>
	{/snippet}
	{#snippet requirement()}
		<ElementalParagraph>
			At least two financial accounts must exist in the profile to show the form for creating
			modifiers.
		</ElementalParagraph>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the financial entries that you have added on to your profile.
		Entries should be frozen to prevent editing or deletion.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available modifiers at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if} a
		modifier to view.
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		{#each resources as entity, i((entity as Modifier).id)}
			<Card
				{currencies}
				{accounts}
				{cashFlowActivities}
				{modifierAtoms}
				{modifierAtomActivities}
				bind:data={
					() => entity as Modifier,
					updatedResource => updateResource(updatedResource, i)
				}
				remove={removeResource}/>
		{/each}
	{/snippet}
</CompleteResourcePage>
