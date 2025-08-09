<script lang="ts">
import type { ContextBundle } from "+/component"
import type {
	Currency,
	Account,
	AcceptableAccountKind,
	ItemConfigurationInput,
	ItemConfiguration,
	ItemDetail
} from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { UNKNOWN_OPTION } from "#/component"
import { acceptableAccountKinds } from "#/entity"

import assertAuthentication from "$/page_requirement/assert_authentication"
import mergeUniqueResources from "$/utility/merge_unique_resources"

import BasicForm from "%/accounts/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Card from "%/accounts/account_card.svelte"
import TextContainer from "$/typography/text_container.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let currencies = $state<Currency[]>([])
let itemDetails = $state<ItemDetail[]>([])
let itemConfigurations = $state<ItemConfiguration[]>([])

function deriveID(resource: unknown): string {
	return `${(resource as Account).id}`
}

let currencyID = $state<string>(UNKNOWN_OPTION)
let name = $state<string>("")
let description = $state<string>("")
let kind = $state<AcceptableAccountKind>(acceptableAccountKinds[0])
let configuration = $state<ItemConfigurationInput|null>(null)

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"account": {
			"currency_id": parseInt(currencyID),
			name,
			description,
			kind,
			...(configuration === null ? {} : {
				"@relationship": {
					"item_configuration": configuration
				}
			})
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	currencyID = UNKNOWN_OPTION
	name = ""
	description = ""
	configuration = null

	const { account } = document

	if (document.item_configuration) {
		itemConfigurations = [
			...itemConfigurations,
			document.item_configuration as ItemConfiguration
		]
	}

	return account
}

function processListResourceObject(document: Record<string, unknown>): void {
	itemConfigurations = mergeUniqueResources(
		itemConfigurations,
		document["item_configurations"] as ItemConfiguration[]
	)
}

let existingCurrencies = $derived(currencies.filter(
	currency => currency.deleted_at === null
))
</script>

<CompleteResourcePage
	pageTitle="Chart of Accounts"
	createTitle="Add Financial Account"
	listTitle="Available Accounts"
	collectiveName="accounts"
	defaultSortCriterion="name"
	availableSortCriteria={[
		"name",
		"created_at",
		"updated_at",
		"deleted_at"
	]}
	additionalListParameters={[
		[ "relationship", "item_configurations" ]
	]}
	dependencies={[ existingCurrencies ]}
	dependencyInfos={[
		{
			"partialPath": "/api/v2/currencies",
			"mainSortCriterion": "name",
			"resourceKey": "currencies",
			"getResources": () => currencies,
			"setResources": newResources => { currencies = newResources as Currency[] }
		},
		{
			"partialPath": "/api/v2/item_details",
			"mainSortCriterion": "name",
			"resourceKey": "item_details",
			"getResources": () => itemDetails,
			"setResources": newResources => { itemDetails = newResources as ItemDetail[] }
		}
	]}
	{deriveID}
	{makeNewResourceObject}
	{processCreatedResourceObject}
	{processListResourceObject}>
	{#snippet general_description()}
		<TextContainer>
			<ElementalParagraph>
				Financial accounts are some kind of label for the numerical values in a financial entry.
				Some examples of these are capital, cash, or debt. They may be credited or debited
				depending on their kind. They may be asset, liability, or equity to name a few.
			</ElementalParagraph>
			<ElementalParagraph>
				To create a financial account to be used in the system, choose a currency and kind in
				order for the system to calculate properly the associated numerical values. After that,
				fill out other required info. Finally, press "Add" button.
			</ElementalParagraph>
		</TextContainer>
	{/snippet}
	{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
		<BasicForm
			currencies={existingCurrencies}
			{itemDetails}
			bind:currencyID={currencyID}
			bind:name={name}
			bind:description={description}
			bind:kind={kind}
			bind:configuration={configuration}
			{isConnecting}
			{IDPrefix}
			{errors}
			{onsubmit}
			{button_group}/>
	{/snippet}
	{#snippet requirement()}
		<ElementalParagraph>
			At least one currency must exist in the profile to show the form for creating financial
			accounts.
		</ElementalParagraph>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the financial accounts that you have added on to your profile. They can be
		associated to modifiers.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available financial accounts at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if} a
		financial account to view.
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		{#each resources as entity, i((entity as Account).id)}
			<Card
				{currencies}
				{itemDetails}
				bind:data={
					() => entity as Account,
					updatedResource => updateResource(updatedResource, i)
				}
				bind:subdata={itemConfigurations}
				remove={removeResource}/>
		{/each}
	{/snippet}
</CompleteResourcePage>
