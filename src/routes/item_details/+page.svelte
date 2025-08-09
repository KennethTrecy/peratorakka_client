<script lang="ts">
import type { ContextBundle } from "+/component"
import type { PrecisionFormat, ItemDetail } from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { UNKNOWN_OPTION } from "#/component"

import assertAuthentication from "$/page_requirement/assert_authentication"

import BasicForm from "%/item_details/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Card from "%/item_details/item_detail_card.svelte"
import TextContainer from "$/typography/text_container.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let precisionFormats = $state<PrecisionFormat[]>([])

function deriveID(resource: unknown): string {
	return `${(resource as ItemDetail).id}`
}

let precisionFormatID = $state(UNKNOWN_OPTION)
let name = $state("")
let unit = $state("")
let description = $state("")

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"item_detail": {
			"precision_format_id": parseInt(precisionFormatID),
			name,
			unit,
			description
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	precisionFormatID = `${precisionFormats[0].id}`
	name = ""
	unit = ""
	description = ""

	const { item_detail } = document
	return item_detail
}

let existingPrecisionFormats = $derived(precisionFormats.filter(
	precisionFormat => precisionFormat.deleted_at === null
))
</script>

<CompleteResourcePage
	pageTitle="Item Details"
	createTitle="Add Item Detail"
	listTitle="Available Item Details"
	collectiveName="item_details"
	defaultSortCriterion="name"
	availableSortCriteria={[
		"name",
		"unit",
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
	{#snippet general_description()}
		<TextContainer>
			<ElementalParagraph>
				Item details are used as standard unit of measurement for different things for itemized
				assets. It could be the unit of weight (e.g. kilograms), the unit of volume (e.g.
				liters), the unit of length (e.g. meters), etc.
			</ElementalParagraph>
			<ElementalParagraph>
				Item details can also be some other kind of units like chairs, tables, or boxes.
			</ElementalParagraph>
		</TextContainer>
	{/snippet}
	{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
		<BasicForm
			precisionFormats={existingPrecisionFormats}
			bind:precisionFormatID={precisionFormatID}
			bind:name={name}
			bind:unit={unit}
			bind:description={description}
			{isConnecting}
			{IDPrefix}
			{errors}
			{onsubmit}
			{button_group}/>
	{/snippet}
	{#snippet requirement()}
		<ElementalParagraph>
			At least one precision format must exist in the profile to show the form for creating
			item details.
		</ElementalParagraph>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the item details that you have added on to your profile.
		They can be associated to financial accounts.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available item details at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a item detail to view.
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		{#each resources as entity, i((entity as ItemDetail).id)}
			<Card
				{precisionFormats}
				bind:data={
					() => entity as ItemDetail,
					updatedResource => updateResource(updatedResource, i)
				}
				remove={removeResource}/>
		{/each}
	{/snippet}
</CompleteResourcePage>
