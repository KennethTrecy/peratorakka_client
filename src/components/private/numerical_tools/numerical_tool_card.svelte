<script lang="ts">
import type {
	Collection,
	Currency,
	Formula,
	NumericalTool,
	AcceptableNumericalToolKind,
	AcceptableNumericalToolRecurrencePeriod,
	AcceptableExchangeRateBasis,
	AcceptableSource
} from "+/entity"

import {
	NUMBER_NUMERICAL_TOOL_KIND,
	TABLE_NUMERICAL_TOOL_KIND,
	PIE_NUMERICAL_TOOL_KIND,
	LINE_NUMERICAL_TOOL_KIND,
	PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD,
	YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD,
	acceptableNumericalToolKinds,
	acceptableNumericalToolRecurrencePeriods,
	acceptableExchangeRateBases
} from "#/entity"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/numerical_tools/basic_form.svelte"
import CardItem from "$/catalog/card_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	data = $bindable(),
	formulae,
	currencies,
	collections,
	remove
}: {
	data: NumericalTool
	formulae: Formula[]
	currencies: Currency[]
	collections: Collection[]
	remove: (resource: NumericalTool) => void
} = $props()

let name = $state(data.name)
let kind = $state(fallbackToAcceptableKind(data.kind))
let recurrence = $state(fallbackToAcceptableRecurrencePeriod(data.recurrence))
let recency = $state(data.recency)
let currencyID = $state(`${data.currency_id}`)
let exchangeRateBasis = $state(fallbackToAcceptableExchangeRateBasis(data.exchange_rate_basis))
let order = $state(data.order)
let notes = $state(data.notes)
let sources = $state<AcceptableSource[]>(JSON.parse(data.configuration)?.sources ?? [])

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_numerical_tool_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let friendlyKind = $derived(kind === NUMBER_NUMERICAL_TOOL_KIND
	? ( recency === 0 || recency === 1 ? "a number" : "one or more numbers" )
	: (
		kind === LINE_NUMERICAL_TOOL_KIND
			? "a line chart"
			: kind === TABLE_NUMERICAL_TOOL_KIND
				? "a table"
				: kind === PIE_NUMERICAL_TOOL_KIND
					? "a pie chart"
					: "an unknown visualizer"
	))
let friendlyRecurrence = $derived(recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD
	? "every frozen period"
	: recurrence === YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD
		? "every year"
		: "unknown time cluster")
let friendlyRecency = $derived(`${Math.abs(recency)} ${Math.abs(recency) === 1
	? ( recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD ? "frozen period ago" : "year ago" )
	: (
		recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD
			? "frozen periods ago"
			: "years ago"
	)}${
		recency < 1
			? ` including ${
				recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD
					? "current unfrozen period"
					: "current year"
			}`: ""
	}`)
let associatedCurrency = $derived(currencies.find(currency => currency.id === parseInt(currencyID)))
let friendlyExchangeRateBasis = $derived(exchangeRateBasis === "latest"
	? "per period"
	: "regardless of the period")

let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/numerical_tools/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				name,
				kind,
				recurrence,
				recency,
				"currency_id": parseInt(currencyID),
				"exchange_rate_basis": exchangeRateBasis,
				order,
				notes,
				"configuration": JSON.stringify({
					sources
				})
			}
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"numerical_tool": {
				name,
				kind,
				recurrence,
				recency,
				"currency_id": parseInt(currencyID),
				"exchange_rate_basis": exchangeRateBasis,
				order,
				notes,
				"configuration": JSON.stringify({
					sources
				})
			}
		})
	}
))

function resetDraft() {
	name = data.name
	kind = fallbackToAcceptableKind(data.kind)
	recurrence = fallbackToAcceptableRecurrencePeriod(data.recurrence)
	recency = data.recency
	currencyID = `${data.currency_id}`
	exchangeRateBasis = fallbackToAcceptableExchangeRateBasis(data.exchange_rate_basis)
	order = data.order
	notes = data.notes
	sources = JSON.parse(data.configuration)?.sources ?? []
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

function fallbackToAcceptableExchangeRateBasis(data: string): AcceptableExchangeRateBasis {
	return isAcceptableExchangeRateBasis(data) ? data : acceptableExchangeRateBases[0]
}

function isAcceptableExchangeRateBasis(data: string): data is AcceptableExchangeRateBasis {
	return (<string[]>[ ...acceptableExchangeRateBases ]).indexOf(data) > -1
}
</script>

<CardItem
	label={data.name}
	{isArchived}
	options={restorableItemOptions}
	{resetDraft}
	kind="triad">
	{#snippet edit_form({ confirmEdit, cancelEdit, isConnecting, errors })}
		<BasicForm
			id={formID}
			{formulae}
			{currencies}
			{collections}
			bind:name={name}
			bind:kind={kind}
			bind:recurrence={recurrence}
			bind:recency={recency}
			bind:currencyID={currencyID}
			bind:exchangeRateBasis={exchangeRateBasis}
			bind:order={order}
			bind:notes={notes}
			bind:sources={sources}
			{IDPrefix}
			{isConnecting}
			{errors}
			onsubmit={confirmEdit}>
			{#snippet button_group()}
				<EditActionCardButtonPair
					disabled={isConnecting}
					{cancelEdit}/>
			{/snippet}
		</BasicForm>
	{/snippet}
	{#snippet delete_confirmation_message()}
		<ShortParagraph >
			Deleting this numerical tool may prevent related data from being shown temporarily.
		</ShortParagraph>
	{/snippet}
	{#snippet restore_confirmation_message()}
		<ShortParagraph >
			Restoring this numerical tool may show related data.
		</ShortParagraph>
	{/snippet}
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph >
			Deleting this numerical tool may prevent related data from being shown permanently.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		<ShortParagraph>
			This tool would show {friendlyKind} coming from the source(s) specified. Data would be
			grouped by {friendlyRecurrence} showing up to {friendlyRecency}. It converts financial
			amounts in {associatedCurrency?.code ?? "???"} before calculation of result using the
			latest exchange rate {friendlyExchangeRateBasis}
		</ShortParagraph>
		<ShortParagraph>
			It would be displayed with other numerical tools with an order of {order}.
		</ShortParagraph>
		<ShortParagraph>
			{data.notes}
		</ShortParagraph>
	{/snippet}
</CardItem>
