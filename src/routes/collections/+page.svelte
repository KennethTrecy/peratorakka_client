<script lang="ts">
import type { ContextBundle } from "+/component"
import type { Account, AccountCollection, Currency, Collection } from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"

import assertAuthentication from "$/page_requirement/assert_authentication"

import AddLinkForm from "%/collections/add_link_form.svelte"
import LinkCollection from "%/collections/link_collection.svelte"
import BasicForm from "%/collections/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Card from "%/collections/collection_card.svelte"
import TextContainer from "$/typography/text_container.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let selectedCollection = $state<Collection|null>(null)
let currencies = $state<Currency[]>([])
let accounts = $state<Account[]>([])
let accountCollections = $state<AccountCollection[]>([])

function deriveID(resource: unknown): string {
	return `${(resource as Collection).id}`
}

let name = $state("")
let description = $state("")

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"collection": {
			name,
			description
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	name = ""
	description = ""

	const { collection } = document
	return collection
}

function addAccountCollection(newAccountCollection: AccountCollection) {
	accountCollections = [
		newAccountCollection,
		...accountCollections
	]
}

function removeAccountCollection(oldAccountCollection: AccountCollection) {
	accountCollections = accountCollections.filter(
		accountCollection => accountCollection.id !== oldAccountCollection.id
	)
}

let linkedAccountCollections = $derived(accountCollections.filter(
	accountCollection => selectedCollection !== null
		&& accountCollection.collection_id === selectedCollection.id
))
let linkedAccountCollectionIDs = $derived(linkedAccountCollections.map(
	accountCollection => accountCollection.account_id
))
let linkedAccounts = $derived(accounts.filter(
	account => linkedAccountCollectionIDs.includes(account.id)
))

$inspect(linkedAccountCollections, selectedCollection, accountCollections)

function viewCollection(collection: Collection) {
	selectedCollection = collection
}
</script>

<CompleteResourcePage
	pageTitle="Collections"
	createTitle="Add Collection"
	listTitle="Collections"
	collectiveName="collections"
	defaultSortCriterion="name"
	availableSortCriteria={[
		"name",
		"created_at",
		"updated_at",
		"deleted_at"
	]}
	dependencies={[ accounts ]}
	dependencyInfos={[
		{
			"partialPath": "/api/v2/account_collections",
			"mainSortCriterion": "id",
			"resourceKey": "account_collections",
			"getResources": () => accountCollections,
			"setResources": newResources => {
				accountCollections = newResources as AccountCollection[]
			}
		},
		{
			"partialPath": "/api/v2/accounts",
			"mainSortCriterion": "name",
			"resourceKey": "accounts",
			"getResources": () => accounts,
			"setResources": newResources => {
				accounts = newResources as Account[]
			}
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
	{processCreatedResourceObject}>
	{#snippet general_description()}
		<TextContainer>
			<ElementalParagraph>
				Collections are used to group multiple financial accounts. They help in calculating a
				formula or presenting data.
			</ElementalParagraph>
		</TextContainer>
	{/snippet}
	{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
		<BasicForm
			bind:name={name}
			bind:description={description}
			{isConnecting}
			{IDPrefix}
			{errors}
			{onsubmit}
			{button_group}/>
	{/snippet}
	{#snippet requirement()}
		<ElementalParagraph>
			At least one account must exist in the profile to show the form for
			creating collections.
		</ElementalParagraph>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the collections that you have added on to your profile.
		They may have several financial accounts.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available collection at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a collection to view.
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		{#each resources as entity, i((entity as Collection).id)}
			<Card
				bind:data={
					() => entity as Collection,
					updatedResource => updateResource(updatedResource, i)
				}
				remove={removeResource}
				view={viewCollection}/>
		{/each}
	{/snippet}
	{#snippet list_grid_cell_rear()}
		{#if selectedCollection !== null}
			<AddLinkForm
				collection={selectedCollection}
				{currencies}
				{accounts}
				{linkedAccounts}
				create={addAccountCollection}/>
			<LinkCollection
				{selectedCollection}
				data={linkedAccountCollections}
				{currencies}
				{accounts}
				remove={removeAccountCollection}/>
		{/if}
	{/snippet}
</CompleteResourcePage>
