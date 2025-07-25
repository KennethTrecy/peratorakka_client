<script lang="ts">
import type { ContextBundle } from "+/component"
import type { PrecisionFormat, Currency, Formula, NumericalTool } from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"

import assertAuthentication from "$/page_requirement/assert_authentication"

import ListResourcePage from "$/layout/list_resource_page.svelte"
import DashboardCard from "%/dashboard/dashboard_card.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let formulae = $state<Formula[]>([])
let precisionFormats = $state<PrecisionFormat[]>([])
let currencies = $state<Currency[]>([])

function deriveID(resource: unknown): string {
	return `${(resource as NumericalTool).id}`
}

let workingIndex = $state(0)
let skippedIndexes = $state<number[]>([])
let finishedIndexes = $state<number[]>([])
let lastIndex = $state(0)

function setLastIndex(count: number): void {
	lastIndex = count - 1
}

function finish(): void {
	finishedIndexes.push(workingIndex)
	forwardIndex()
}

function skip(): void {
	skippedIndexes.push(workingIndex)
	forwardIndex()
}

function forwardIndex(): void {
	workingIndex = workingIndex + 1
	if ((
		workingIndex >= lastIndex
		|| finishedIndexes.includes(workingIndex)
	) && skippedIndexes.length > 0) {
		workingIndex = skippedIndexes.shift() as number
	}
}
</script>

<ListResourcePage
	pageTitle="Dashboard"
	listTitle="Summarized Information"
	collectiveName="numerical_tools"
	defaultSortCriterion="order"
	availableSortCriteria={[
		"name",
		"order",
		"created_at",
		"updated_at",
		"deleted_at"
	]}
	dependencyInfos={[
		{
			"partialPath": "/api/v2/precision_formats",
			"mainSortCriterion": "name",
			"resourceKey": "precision_formats",
			"getResources": () => precisionFormats,
			"setResources": newResources => { precisionFormats = newResources as PrecisionFormat[] }
		},
		{
			"partialPath": "/api/v2/currencies",
			"mainSortCriterion": "name",
			"resourceKey": "currencies",
			"getResources": () => currencies,
			"setResources": newResources => { currencies = newResources as Currency[] }
		},
		{
			"partialPath": "/api/v2/formulae",
			"mainSortCriterion": "name",
			"resourceKey": "formulae",
			"getResources": () => formulae,
			"setResources": newResources => { formulae = newResources as Formula[] }
		}
	]}
	{deriveID}
	announceFinalCount={setLastIndex}>
	{#snippet filled_collection_description()}
		Below are the summarized information that was instructed by your numerical tools in your
		profile.
	{/snippet}
	{#snippet empty_collection_description()}
		There are no available numerical tools at the moment. Create a numerical tools to view
		summarized information.
	{/snippet}
	{#snippet collection_items({ resources })}
		{#each resources as entity, index((entity as NumericalTool).id)}
			<DashboardCard
				data={entity as NumericalTool}
				{formulae}
				{currencies}
				{precisionFormats}
				{workingIndex}
				assignedIndex={index}
				{finish}
				{skip}/>
		{/each}
	{/snippet}
</ListResourcePage>
