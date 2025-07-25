<script lang="ts">
import type { ContextBundle } from "+/component"
import type { CashFlowActivity } from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"

import assertAuthentication from "$/page_requirement/assert_authentication"

import BasicForm from "%/cash_flow_activities/basic_form.svelte"
import CompleteResourcePage from "$/layout/complete_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Card from "%/cash_flow_activities/cash_flow_activity_card.svelte"
import TextContainer from "$/typography/text_container.svelte"

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

function deriveID(resource: unknown): string {
	return `${(resource as CashFlowActivity).id}`
}

let name = $state("")
let description = $state("")

function makeNewResourceObject(): Record<string, unknown> {
	return {
		"cash_flow_activity": {
			name,
			description
		}
	}
}

function processCreatedResourceObject(document: Record<string, unknown>): unknown {
	name = ""
	description = ""

	const { "cash_flow_activity": cashFlowActivity } = document
	return cashFlowActivity
}
</script>

<CompleteResourcePage
	pageTitle="Cash Flow Activities"
	createTitle="Add Cash Flow Activity"
	listTitle="Available Cash Flow Activities"
	collectiveName="cash_flow_activities"
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
	{#snippet general_description()}
		<TextContainer>
			<ElementalParagraph>
				Cash flow activities are used to classify changes in the current amount of accounts and
				determine the amount of available liquid cash and cash equivalents. Usual cash flow
				activities are operating activities, investment activities, and financing activities.
			</ElementalParagraph>
			<ElementalParagraph>
				A liquid financial account is an account that can be converted into cash immediately
				(e.g. bank deposits or physical cash in wallet). These are the accounts that do not need
				to be associated with cash flow activity in modifiers.
			</ElementalParagraph>
			<ElementalParagraph>
				Meanwhile, an illiquid financial account means that the account can be converted into
				cash after a long period or never at all (e.g. land or equipments). These accounts are
				required to be associated with a cash flow activity in modifiers.
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
			{button_group}>
		</BasicForm>
	{/snippet}
	{#snippet filled_collection_description()}
		Below are the cash flow activity that you have added on to your profile.
		They can be associated to modifiers.
	{/snippet}
	{#snippet empty_collection_description({ isPresent, isPresentAndArchived, isArchived })}
		There are no available cash flow activity at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a cash flow activity to view.
	{/snippet}
	{#snippet collection_items({ resources, updateResource, removeResource })}
		{#each resources as entity, i((entity as CashFlowActivity).id)}
			<Card
				bind:data={
					() => entity as CashFlowActivity,
					updatedResource => updateResource(updatedResource, i)
				}
				remove={removeResource}/>
		{/each}
	{/snippet}
</CompleteResourcePage>
