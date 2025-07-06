<script lang="ts">
import type { ContextBundle } from "+/component"
import type { PrecisionFormat } from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"

import assertAuthentication from "$/page_requirement/assert_authentication"

import BasicForm from "%/precision_formats/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Card from "%/precision_formats/precision_format_card.svelte"
import TextContainer from "$/typography/text_container.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

function deriveID(resource: unknown): string {
	return `${(resource as PrecisionFormat).id}`
}

let name = $state("")
let minimumPresentationalPrecision = $state(0)
let maximumPresentationalPrecision = $state(12)

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"precision_format": {
			name,
			"minimum_presentational_precision": minimumPresentationalPrecision,
			"maximum_presentational_precision": maximumPresentationalPrecision
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	name = ""
	minimumPresentationalPrecision = 0
	maximumPresentationalPrecision = 0

	const { "precision_format": precisionFormat } = document
	return precisionFormat
}
</script>

<CompleteResourcePage
	pageTitle="Precision Formats"
	createTitle="Add Precision Format"
	listTitle="Available Precision Formats"
	collectiveName="precision_formats"
	defaultSortCriterion="name"
	availableSortCriteria={[
		"name",
		"created_at",
		"updated_at",
		"deleted_at"
	]}
	{deriveID}
	{makeNewResourceObject}
	{processCreatedResourceObject}>
	{#snippet description()}
		<TextContainer>
			<ElementalParagraph>
				Precision formats are shared between currencies and numerical tools to display the
				numbers properly. For example in cryptocurrencies, they usually have multiple decimal
				places. Meanwhile, fiat currencies usually have two decimal places to represent
				centavos.
			</ElementalParagraph>
		</TextContainer>
	{/snippet}
	{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
		<BasicForm
			bind:name={name}
			bind:minimumPresentationalPrecision={minimumPresentationalPrecision}
			bind:maximumPresentationalPrecision={maximumPresentationalPrecision}
			{isConnecting}
			{IDPrefix}
			{errors}
			{onsubmit}
			{button_group}>
		</BasicForm>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the precision formats that you have created in your profile.
		They can be associated to currencies or numerical tools.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available precision formats at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a precision format to view some data here.
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		{#each resources as entity, i((entity as PrecisionFormat).id)}
			<Card
				bind:data={
					() => entity as PrecisionFormat,
					updatedResource => updateResource(updatedResource, i)
				}
				remove={removeResource}/>
		{/each}
	{/snippet}
</CompleteResourcePage>
