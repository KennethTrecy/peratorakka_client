<script lang="ts">
import type { ContextBundle } from "+/component"
import type {
	Collection,
	Currency,
	Formula,
	NumericalTool,
	AcceptableSource
} from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { UNKNOWN_OPTION } from "#/component"
import {
	acceptableNumericalToolKinds,
	acceptableNumericalToolRecurrencePeriods,
	acceptableExchangeRateBases
} from "#/entity"

import assertAuthentication from "$/page_requirement/assert_authentication"

import BasicForm from "%/numerical_tools/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Card from "%/numerical_tools/numerical_tool_card.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let formulae: Formula[] = $state([])
let collections: Collection[] = $state([])
let currencies: Currency[] = $state([])

function deriveID(resource: unknown): string {
	return `${(resource as NumericalTool).id}`
}

let currencyID = $state(UNKNOWN_OPTION)
let exchangeRateBasis = $state(acceptableExchangeRateBases[0])
let name = $state("")
let kind = $state(acceptableNumericalToolKinds[0])
let recurrence = $state(acceptableNumericalToolRecurrencePeriods[0])
let recency = $state(0)
let order = $state(0)
let notes = $state("")
let sources = $state<AcceptableSource[]>([])

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"numerical_tool": {
			"currency_id": parseInt(currencyID),
			"exchange_rate_basis": exchangeRateBasis,
			name,
			kind,
			recurrence,
			recency,
			order,
			notes,
			"configuration": JSON.stringify({
				sources
			})
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	currencyID = `${currencies[0].id}`
	exchangeRateBasis = acceptableExchangeRateBases[0]
	name = ""
	kind = acceptableNumericalToolKinds[0]
	recurrence = acceptableNumericalToolRecurrencePeriods[0]
	recency = 0
	order = 0
	notes = ""
	sources = []

	const { numerical_tool } = document

	return numerical_tool
}

</script>

<CompleteResourcePage
	pageTitle="Numerical Tools"
	createTitle="Add Numerical Tool"
	listTitle="Numerical Tools"
	collectiveName="numerical_tools"
	defaultSortCriterion="name"
	availableSortCriteria={[
		"name",
		"created_at",
		"updated_at",
		"deleted_at"
	]}
	dependencies={[ currencies, collections, formulae ]}
	dependencyInfos={[
		{
			"partialPath": "/api/v2/formulae",
			"mainSortCriterion": "name",
			"resourceKey": "formulae",
			"getResources": () => formulae,
			"setResources": newResources => { formulae = newResources as Formula[] }
		},
		{
			"partialPath": "/api/v2/collections",
			"mainSortCriterion": "name",
			"resourceKey": "collections",
			"getResources": () => collections,
			"setResources": newResources => { collections = newResources as Collection[] }
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
		<ElementalParagraph>
			Numerical tools contains information for the data visualizers shown in the dashboard. There
			are different kinds of visualizers. Some only show numbers. Others show as a table. Line
			charts and pie charts are also a possibility too.
		</ElementalParagraph>
		<ElementalParagraph>
			Recurrence indicates that data would be grouped per frozen period or per year. Meanwhile,
			recency indicates the maximum number of frozen periods or frozen years to be visualized. It
			may also indicate if the current unfrozen period or unfrozen year should be included in the
			visualization.
		</ElementalParagraph>
		<ElementalParagraph>
			Finally, order indicates the likeliness of the visualizer to be shown first compare to
			other tools. The lower the order number, the more likely the visualizer to appear first in
			the dashboard.
		</ElementalParagraph>
	{/snippet}
	{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
		<BasicForm
			{formulae}
			{collections}
			{currencies}
			bind:currencyID={currencyID}
			bind:exchangeRateBasis={exchangeRateBasis}
			bind:name={name}
			bind:kind={kind}
			bind:recurrence={recurrence}
			bind:recency={recency}
			bind:order={order}
			bind:notes={notes}
			bind:sources={sources}
			{isConnecting}
			{IDPrefix}
			{errors}
			{onsubmit}
			{button_group}/>
	{/snippet}
	{#snippet requirement()}
		<ElementalParagraph>
			At least one collection or one formula must exist in the profile to show the form for
			creating numerical tools.
		</ElementalParagraph>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the numerical tools that you have added on to your profile.
		Their outputs can be seen on the dashboard.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available numerical tools at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a numerical tool to view.
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		{#each resources as entity, i((entity as Collection).id)}
			<Card
				{formulae}
				{collections}
				{currencies}
				bind:data={
					() => entity as NumericalTool,
					updatedResource => updateResource(updatedResource, i)
				}
				remove={removeResource}/>
		{/each}
	{/snippet}
</CompleteResourcePage>
