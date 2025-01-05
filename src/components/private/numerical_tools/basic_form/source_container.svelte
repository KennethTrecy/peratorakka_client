<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Collection, Currency, Formula, AcceptableSource } from "+/entity"

import { createEventDispatcher } from "svelte"

import {
	acceptableExchangeRateBases,
	acceptableAmountStageBases,
	acceptableAmountSideBases
} from "#/entity"

import transformString from "$/form/choice_info_transformer/transform_string"

import ShortParagraph from "$/typography/short_paragraph.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import FormulaFieldset from "%/numerical_tools/basic_form/formula_fieldset.svelte"
import CollectionFieldset from "%/numerical_tools/basic_form/collection_fieldset.svelte"
import GeneralFieldContainer from "$/form/general_field_container.svelte"
import TextButton from "$/button/text.svelte"

const dispatch = createEventDispatcher<{
	"remove": number
	"up": number
	"down": number
}>()

export let IDPrefix: string
export let formulae: Formula[]
export let currencies: Currency[]
export let collections: Collection[]

export let index: number
export let source: AcceptableSource

export let isConnecting: boolean
export let errors: GeneralError[]

let oldType = source.type
let currentType = source.type
$: {
	if (oldType !== currentType) {
		oldType = currentType
		switch (currentType) {
			case "formula":
				source = {
					"type": "formula",
					"formula_id": formulae[0].id,
				}
			case "collection":
				source = {
					"type": "collection",
					"collection_id": collections[0].id,
					"currency_id": currencies[0].id,
					"exchange_rate_basis": acceptableExchangeRateBases[0],
					"stage_basis": acceptableAmountStageBases[0],
					"side_basis": acceptableAmountSideBases[0],
					"must_show_individual_amounts": true,
					"must_show_collective_average": false,
					"must_show_collective_sum": false
				}
		}
	}
}

$: ACCEPTABLE_SOURCES = [
	collections.length === 0 || currencies.length === 0 ? null : "collection",
	formulae.length === 0 ? null : "formula"
].filter(type => type !== null) as (AcceptableSource["type"])[]
</script>

{#if ACCEPTABLE_SOURCES.length === 0}
	<ShortParagraph>
		There are no available formula or collection to show a data. Please make a formula or a collection first. If want show a collections, at least one currency is required too.
	</ShortParagraph>
{:else}
	<GeneralFieldContainer tag="fieldset">
		<ChoiceListField
			fieldName="Source Type"
			disabled={isConnecting}
			bind:value={currentType}
			rawChoices={ACCEPTABLE_SOURCES}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		{#if source.type === "formula"}
			<FormulaFieldset
				bind:formula={source}
				{formulae}
				{IDPrefix}
				{isConnecting}
				{errors}/>
		{:else if source.type === "collection"}
			<CollectionFieldset
				bind:collection={source}
				{currencies}
				{collections}
				{IDPrefix}
				{isConnecting}
				{errors}/>
		{/if}
		<TextButton
			label="Remove"
			on:click={() => dispatch("remove", index)}/>
	</GeneralFieldContainer>
{/if}
