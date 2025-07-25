<script lang="ts">
import type { Snippet } from "svelte"

import type { GeneralError } from "+/rest"
import type {
	Collection,
	Currency,
	Formula,
	NumericalTool,
	AcceptableNumericalToolKind,
	AcceptableNumericalToolRecurrencePeriod,
	AcceptableSource,
	AcceptableExchangeRateBasis
} from "+/entity"

import { onMount, onDestroy, untrack } from "svelte"

import {
	acceptableExchangeRateBases,
	acceptableAmountStageBases,
	acceptableAmountSideBases,
	acceptableNumericalToolKinds,
	acceptableNumericalToolRecurrencePeriods,
	PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD,
	YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD
} from "#/entity"

import transformString from "$/form/choice_info_transformer/transform_string"
import transformCurrency from "$/form/choice_info_transformer/transform_currency"

import BasicForm from "$/form/basic_form.svelte"
import CheckboxField from "$/form/checkbox_field.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import NumberField from "$/form/number_field.svelte"
import SourceManager from "%/numerical_tools/basic_form/source_manager.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextField from "$/form/text_field.svelte"

const ACCEPTABLE_NUMERICAL_TOOL_KINDS = [ ...acceptableNumericalToolKinds ]
const ACCEPTABLE_NUMERICAL_TOOL_RECURRENCE_PERIODS = [
	...acceptableNumericalToolRecurrencePeriods
]
const ACCEPTABLE_EXCHANGE_RATE_BASES = [ ...acceptableExchangeRateBases ]

let {
	IDPrefix,
	formulae,
	currencies,
	collections,
	name = $bindable(),
	kind = $bindable(),
	recurrence = $bindable(),
	recency = $bindable(),
	currencyID = $bindable(),
	exchangeRateBasis = $bindable(),
	order = $bindable(),
	notes = $bindable(),
	sources = $bindable(),
	forceDisabledFields = [],
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	formulae: Formula[]
	currencies: Currency[]
	collections: Collection[]
	name: string
	kind: AcceptableNumericalToolKind
	recurrence: AcceptableNumericalToolRecurrencePeriod
	recency: number
	currencyID: string
	exchangeRateBasis: AcceptableExchangeRateBasis
	order: number
	notes: string
	sources: AcceptableSource[];
	forceDisabledFields?: (keyof NumericalTool)[]
	isConnecting: boolean
	errors: GeneralError[]
	id?: string|null
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()

let isShown = $state(false)
let expectedNewRecency = $state(recency)
$effect(() => {
	if (expectedNewRecency !== untrack(() => recency) && isShown) untrack(() => {
		recency = expectedNewRecency
	})
})

let numberOfFrozenCycles = $state(0)
let mustIncludeLatestUnfrozenCycle = $state(true)
$effect(() => {
	const newRecency = (mustIncludeLatestUnfrozenCycle ? -1 : 1) * numberOfFrozenCycles
	untrack(() => {
		expectedNewRecency = newRecency
	})
})
let friendlyFrozenRecurrenceFieldName = $derived(
	recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD
		? "Maximum number of frozen periods to show"
		: recurrence === YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD
			? "Maximum number of frozen years to show"
			: "Maximum number of frozen cycles to show"
)
let friendlyUnfrozenRecurrenceFieldName = $derived(
	recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD
		? "May show current unfrozen period"
		: recurrence === YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD
			? "May show current unfrozen year"
			: "May show current unfrozen cycle"
)
function addSource() {
	sources = [
		...sources,
		formulae.length > 0 ? {
			"type": "formula",
			"formula_id": formulae[0].id
		} : {
			"type": "collection",
			"collection_id": collections[0].id,
			"side_basis": acceptableAmountSideBases[0],
			"stage_basis": acceptableAmountStageBases[0],
			"must_show_individual_amounts": true,
			"must_show_collective_sum": false,
			"must_show_collective_average": false
		}
	]
}

onMount(() => {
	numberOfFrozenCycles = Math.abs(recency)
	mustIncludeLatestUnfrozenCycle = Math.sign(recency) !== 1
	isShown = true
})

onDestroy(() => {
	isShown = false
})
</script>

{#snippet custom_button_group()}
	<TextCardButton
		kind="button"
		disabled={isConnecting}
		label="Add Source"
		onclick={addSource}/>
	{@render button_group()}
{/snippet}

<BasicForm {id} {isConnecting} {errors} {onsubmit} button_group={custom_button_group}>
	{#snippet fields()}
		<TextField
			fieldName="Name"
			disabled={isConnecting || forceDisabledFields.includes("name")}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Kind"
			disabled={isConnecting || forceDisabledFields.includes("kind")}
			bind:value={kind}
			rawChoices={ACCEPTABLE_NUMERICAL_TOOL_KINDS}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Recurrence Period"
			disabled={isConnecting || forceDisabledFields.includes("recurrence")}
			bind:value={recurrence}
			rawChoices={ACCEPTABLE_NUMERICAL_TOOL_RECURRENCE_PERIODS}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		{#if isShown}
			<NumberField
				fieldName={friendlyFrozenRecurrenceFieldName}
				errorFieldID="recency"
				min={0}
				max={100}
				step={1}
				disabled={isConnecting}
				bind:value={numberOfFrozenCycles}
				{IDPrefix}
				{errors}/>
			<CheckboxField
				fieldName={friendlyUnfrozenRecurrenceFieldName}
				disabled={isConnecting}
				bind:value={mustIncludeLatestUnfrozenCycle}
				{IDPrefix}
				{errors}/>
		{/if}
		<ChoiceListField
			fieldName="Base Currency"
			errorFieldID="currency_id"
			disabled={isConnecting || forceDisabledFields.includes("currency_id")}
			bind:value={currencyID}
			rawChoices={currencies}
			choiceConverter={transformCurrency}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Exchange Rate Basis"
			errorFieldID="exchange_rate_basis"
			disabled={isConnecting || forceDisabledFields.includes("exchange_rate_basis")}
			bind:value={exchangeRateBasis}
			rawChoices={ACCEPTABLE_EXCHANGE_RATE_BASES}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		<NumberField
			fieldName="Dashboard Order"
			errorFieldID="order"
			min={0}
			max={100}
			step={1}
			disabled={isConnecting}
			bind:value={order}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Notes"
			disabled={isConnecting || forceDisabledFields.includes("notes")}
			bind:value={notes}
			{IDPrefix}
			{errors}/>
		<SourceManager
			bind:sources={sources}
			{formulae}
			{collections}
			{IDPrefix}
			{isConnecting}
			{errors}/>
	{/snippet}
</BasicForm>
