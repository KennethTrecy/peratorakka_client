<script lang="ts">
import type {
	PrecisionFormat,
	Formula,
	AcceptableFormulaOutputFormat
} from "+/entity"
import type { ContextBundle } from "+/component"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { UNKNOWN_OPTION } from "#/component"
import { acceptableFormulaOutputFormats } from "#/entity"

import assertAuthentication from "$/page_requirement/assert_authentication"

import BasicForm from "%/formulae/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Card from "%/formulae/formula_card.svelte"
import TextContainer from "$/typography/text_container.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let precisionFormats: PrecisionFormat[] = $state([])

function deriveID(resource: unknown): string {
	return `${(resource as Formula).id}`
}

let precisionFormatID = $state(UNKNOWN_OPTION)
let name = $state<string>("")
let description = $state<string>("")
let outputFormat = $state<AcceptableFormulaOutputFormat>(acceptableFormulaOutputFormats[0])
let expression = $state<string>("")

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"formula": {
			"precision_format_id": parseInt(precisionFormatID),
			name,
			description,
			"output_format": outputFormat,
			expression
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	precisionFormatID = `${precisionFormats[0].id}`
	name = ""
	description = ""
	expression = ""

	const { formula } = document
	return formula
}

let existingPrecisionFormats = $derived(precisionFormats.filter(
	precisionFormat => precisionFormat.deleted_at === null
))
</script>

<CompleteResourcePage
	pageTitle="Formulae"
	createTitle="Add Formula"
	listTitle="Available Formulae"
	collectiveName="formulae"
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
	{#snippet general_description()}
		<TextContainer>
			<ElementalParagraph>
				Formulas (or formulae) summarize multiple data into meaningful information that a person
				may use. This may be inflation rate of expenses, total annual income, or total amount of
				loans need to be paid.
			</ElementalParagraph>
			<ElementalParagraph>
				To create a formula to be used in the system, choose a base currency which will be used
				as the basis for calculating amounts from multiple currencies. An output format
				indicates the type of result after calculation.
			</ElementalParagraph>
			<ElementalParagraph>
				Exchange rate basis may be periodic (which is the latest exchange rate on a paricular
				period) or latest (which is the latest overall exchange rate regardless of the time). It
				also has presentation precision which is used when displayed by a numerical tool.
			</ElementalParagraph>
		</TextContainer>
	{/snippet}
	{#snippet form({ IDPrefix, isConnecting, errors, onsubmit, button_group })}
		<BasicForm
			precisionFormats={existingPrecisionFormats}
			bind:precisionFormatID={precisionFormatID}
			bind:name={name}
			bind:description={description}
			bind:outputFormat={outputFormat}
			bind:expression={expression}
			{isConnecting}
			{IDPrefix}
			{errors}
			{onsubmit}
			{button_group}/>
	{/snippet}
	{#snippet requirement()}
		<ElementalParagraph>
			At least one currency must exist in the profile to show the form for creating formulae.
		</ElementalParagraph>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the formulae that you have added on to your profile.
		They can be associated to numerical tools in order to display their results.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available formulae at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if} a
		formula to view.
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		{#each resources as entity, i((entity as Formula).id)}
			<Card
				{precisionFormats}
				bind:data={
					() => entity as Formula,
					updatedResource => updateResource(updatedResource, i)
				}
				remove={removeResource}/>
		{/each}
	{/snippet}
</CompleteResourcePage>
