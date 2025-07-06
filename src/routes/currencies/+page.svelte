<script lang="ts">
import type { ContextBundle } from "+/component"
import type { PrecisionFormat, Currency } from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { UNKNOWN_OPTION } from "#/component"

import assertAuthentication from "$/page_requirement/assert_authentication"

import BasicForm from "%/currencies/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Card from "%/currencies/currency_card.svelte"
import TextContainer from "$/typography/text_container.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let precisionFormats = $state<PrecisionFormat[]>([])

function deriveID(resource: unknown): string {
	return `${(resource as Currency).id}`
}

let precisionFormatID = $state(UNKNOWN_OPTION)
let code = $state("")
let name = $state("")

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"currency": {
			"precision_format_id": parseInt(precisionFormatID),
			code,
			name
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	precisionFormatID = `${precisionFormats[0].id}`
	code = ""
	name = ""

	const { currency } = document
	return currency
}

let existingPrecisionFormats = $derived(precisionFormats.filter(
	precisionFormat => precisionFormat.deleted_at === null
))
</script>

<CompleteResourcePage
	pageTitle="Currencies"
	createTitle="Add Currency"
	listTitle="Available Currencies"
	collectiveName="currencies"
	defaultSortCriterion="name"
	availableSortCriteria={[
		"name",
		"created_at",
		"updated_at",
		"deleted_at"
	]}
	dependencies={[ existingPrecisionFormats ]}
	dependencyInfos={[
		{
			"partialPath": "/api/v2/precision_formats",
			"mainSortCriterion": "name",
			"resourceKey": "precision_formats",
			"getResources": () => precisionFormats,
			"setResources": newResources => { precisionFormats = newResources as PrecisionFormat[] }
		}
	]}
	{deriveID}
	{makeNewResourceObject}
	{processCreatedResourceObject}>
	{#snippet description()}
		<TextContainer>
			<ElementalParagraph>
				Currencies are used as symbols for different financial entries and other parts of the
				application. You have a freedom to add currencies, regardless whether they are physical
				or crypto. Some people may treat the shares in stocks or units in mutual funds as
				currency because the price changes over time.
			</ElementalParagraph>
			<ElementalParagraph>
				One limitation is that the application tracks the currency conversions through previous
				financial entries. Therefore, there is no network usage to check for current conversions
				which is a beneficial effect if you have a lot of currencies and save data usage.
			</ElementalParagraph>
		</TextContainer>
	{/snippet}
	{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
		<BasicForm
			precisionFormats={existingPrecisionFormats}
			bind:code={code}
			bind:name={name}
			bind:precisionFormatID={precisionFormatID}
			{isConnecting}
			{IDPrefix}
			{errors}
			{onsubmit}
			{button_group}/>
	{/snippet}
	{#snippet requirement()}
		<ElementalParagraph>
			At least one precision format must exist in the profile to show the form for creating
			currencies.
		</ElementalParagraph>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the currencies that you have added on to your profile.
		They can be associated to financial accounts.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available currencies at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a currency to view.
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		{#each resources as entity, i((entity as Currency).id)}
			<Card
				{precisionFormats}
				bind:data={
					() => entity as Currency,
					updatedResource => updateResource(updatedResource, i)
				}
				remove={removeResource}/>
		{/each}
	{/snippet}
</CompleteResourcePage>
