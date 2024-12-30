<script lang="ts">
import type {
	Collection,
	Currency,
	Formula,
	NumericalTool,
	AcceptableNumericalToolKind,
	AcceptableNumericalToolRecurrencePeriod
} from "+/entity"

import { createEventDispatcher } from "svelte"

import {
	NUMBER_NUMERICAL_TOOL_KIND,
	TABLE_NUMERICAL_TOOL_KIND,
	PIE_NUMERICAL_TOOL_KIND,
	LINE_NUMERICAL_TOOL_KIND,
	PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD,
	YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD,
	acceptableNumericalToolKinds,
	acceptableNumericalToolRecurrencePeriods
} from "#/entity"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/numerical_tools/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let data: NumericalTool
export let formulae: Formula[]
export let currencies: Currency[]
export let collections: Collection[]

const dispatch = createEventDispatcher<{
	"remove": NumericalTool
}>()
let name = data.name
let kind = fallbackToAcceptableKind(data.kind)
let recurrence = fallbackToAcceptableRecurrencePeriod(data.recurrence)
let recency = data.recency
let order = data.order
let notes = data.notes
let sources = data.configuration.sources

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_numerical_tool_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: friendlyKind = kind === NUMBER_NUMERICAL_TOOL_KIND
	? ( recency === 0 || recency === 1 ? "a number" : "one or more numbers" )
	: (
		kind === LINE_NUMERICAL_TOOL_KIND
			? "a line chart"
			: kind === TABLE_NUMERICAL_TOOL_KIND
				? "a table"
				: kind === PIE_NUMERICAL_TOOL_KIND
					? "a pie chart"
					: "an unknown visualizer"
	)
$: friendlyRecurrence = recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD
	? "every frozen period"
	: recurrence === YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD
		? "every year"
		: "unknown time cluster"
$: friendlyRecency = `${recency} ${Math.abs(recency) === 1
	? ( recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD ? "frozen period ago" : "year ago" )
	: (
		recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD
			? "frozen periods ago"
			: "years ago"
	)}${
		recency < 1
			? ""
			: ` including ${recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD ? "current frozen period" : "current year"}`
	}`
$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/numerical_tools/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				name,
				kind,
				recurrence,
				recency,
				order,
				notes,
				"configuration": {
					sources
				}
			}
		},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"numerical_tool": {
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
		})
	}
)

function resetDraft() {
	name = data.name
	kind = fallbackToAcceptableKind(data.kind)
	recurrence = fallbackToAcceptableRecurrencePeriod(data.recurrence)
	recency = data.recency
	order = data.order
	notes = data.notes
	sources = data.configuration.sources
}

function fallbackToAcceptableKind(data: string): AcceptableNumericalToolKind {
	return isAcceptableNumericalToolKind(data) ? data : acceptableNumericalToolKinds[0]
}

function isAcceptableNumericalToolKind(data: string): data is AcceptableNumericalToolKind {
	return (<string[]>[ ...acceptableNumericalToolKinds ]).indexOf(data) > -1
}

function fallbackToAcceptableRecurrencePeriod(data: string)
: AcceptableNumericalToolRecurrencePeriod {
	return isAcceptableNumericalToolRecurrencePeriod(data) ? data : acceptableNumericalToolRecurrencePeriods[0]
}

function isAcceptableNumericalToolRecurrencePeriod(data: string)
: data is AcceptableNumericalToolRecurrencePeriod {
	return (<string[]>[ ...acceptableNumericalToolRecurrencePeriods ]).indexOf(data) > -1
}
</script>

<CollectionItem
	label={data.name}
	{isArchived}
	options={restorableItemOptions}
	on:resetDraft={resetDraft}
	kind="triad">
	<BasicForm
		slot="edit_form"
		let:confirmEdit
		let:cancelEdit
		let:isConnecting
		let:errors
		id={formID}
		{formulae}
		{currencies}
		{collections}
		bind:name={name}
		bind:kind={kind}
		bind:recurrence={recurrence}
		bind:recency={recency}
		bind:order={order}
		bind:notes={notes}
		bind:sources={sources}
		{IDPrefix}
		{isConnecting}
		{errors}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={isConnecting}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<ShortParagraph slot="delete_confirmation_message">
		Deleting this numerical tool may prevent related data from being shown temporarily.
	</ShortParagraph>
	<ShortParagraph slot="restore_confirmation_message">
		Restoring this numerical tool may show related data.
	</ShortParagraph>
	<ShortParagraph slot="force_delete_confirmation_message">
		Deleting this numerical tool may prevent related data from being shown permanently.
	</ShortParagraph>
	<svelte:fragment slot="resource_info">
		<ShortParagraph>
			This tool would show {friendlyKind} coming from the source(s) listed below. Data would be grouped by {friendlyRecurrence} showing from up to {friendlyRecency}.
		</ShortParagraph>
		<ShortParagraph>
			It would be displayed with other numerical tools with an order of {order}.
		</ShortParagraph>
		<ShortParagraph>
			{data.notes}
		</ShortParagraph>
	</svelte:fragment>
</CollectionItem>
