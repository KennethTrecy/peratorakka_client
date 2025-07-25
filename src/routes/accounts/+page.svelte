<script lang="ts">
import type { ContextBundle } from "+/component"
import type { Currency, Account, AcceptableAccountKind } from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { UNKNOWN_OPTION } from "#/component"
import { acceptableAccountKinds } from "#/entity"

import assertAuthentication from "$/page_requirement/assert_authentication"

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

function deriveID(resource: unknown): string {
	return `${(resource as Account).id}`
}

let currencyID: string = $state(UNKNOWN_OPTION)
let name: string = $state("")
let description: string = $state("")
let kind: AcceptableAccountKind = $state(acceptableAccountKinds[0])

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"account": {
			"currency_id": parseInt(currencyID),
			name,
			description,
			kind
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	currencyID = UNKNOWN_OPTION
	name = ""
	description = ""

	const { account } = document
	return account
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
	dependencies={[ existingCurrencies ]}
	dependencyInfos={[
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
			bind:currencyID={currencyID}
			bind:name={name}
			bind:description={description}
			bind:kind={kind}
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
				bind:data={
					() => entity as Account,
					updatedResource => updateResource(updatedResource, i)
				}
				remove={removeResource}/>
		{/each}
	{/snippet}
</CompleteResourcePage>
