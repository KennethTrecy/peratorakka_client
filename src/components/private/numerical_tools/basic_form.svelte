<script lang="ts">
import type { GeneralError } from "+/rest"
import type {
	Collection,
	Currency,
	Formula,
	NumericalTool,
	AcceptableNumericalToolKind,
	AcceptableNumericalToolRecurrencePeriod,
	AcceptableSource
} from "+/entity"

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

export let IDPrefix: string
export let formulae: Formula[]
export let currencies: Currency[]
export let collections: Collection[]

export let name: string
export let kind: AcceptableNumericalToolKind
export let recurrence: AcceptableNumericalToolRecurrencePeriod
export let recency: number
export let order: number
export let notes: string
export let sources: AcceptableSource[]
export let forceDisabledFields: (keyof NumericalTool)[] = []

export let isConnecting: boolean
export let errors: GeneralError[]
export let id = ""

let expectedNewRecency = recency
$: {
	if (expectedNewRecency !== recency) recency = expectedNewRecency
}

let numberOfFrozenCycles = 0
let mustIncludeLatestUnfrozenCycle = true
$: expectedNewRecency = (mustIncludeLatestUnfrozenCycle ? -1 : 1) * numberOfFrozenCycles
$: friendlyFrozenRecurrenceFieldName = recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD
	? "Maximum number of frozen periods to show"
	: recurrence === YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD
		? "Maximum number of frozen years to show"
		: "Maximum number of frozen cycles to show"
$: friendlyUnfrozenRecurrenceFieldName = recurrence === PERIODIC_NUMERICAL_TOOL_RECURRENCE_PERIOD
	? "May show current unfrozen period"
	: recurrence === YEARLY_NUMERICAL_TOOL_RECURRENCE_PERIOD
		? "May show current unfrozen year"
		: "May show current unfrozen cycle"

function addSource() {
	sources = [
		...sources,
		formulae.length > 0 ? {
			"type": "formula",
			"formula_id": formulae[0].id
		} : {
			"type": "collection",
			"collection_id": collections[0].id,
			"currency_id": currencies[0].id,
			"exchange_rate_basis": acceptableExchangeRateBases[0],
			"side_basis": acceptableAmountSideBases[0],
			"stage_basis": acceptableAmountStageBases[0],
			"must_show_individual_amounts": true,
			"must_show_collective_sum": false,
			"must_show_collective_average": false
		}
	]
}
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
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
		<NumberField
			fieldName={friendlyFrozenRecurrenceFieldName}
			errorFieldID="recurrence"
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
			{currencies}
			{collections}
			{IDPrefix}
			{isConnecting}
			{errors}/>
	</svelte:fragment>
	<svelte:fragment slot="button_group">
		<TextCardButton
			kind="button"
			disabled={isConnecting}
			label="Add Source"
			on:click={addSource}/>
		<slot name="button_group"/>
	</svelte:fragment>

</BasicForm>
