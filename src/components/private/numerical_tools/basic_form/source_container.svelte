<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Collection, Formula, AcceptableSource } from "+/entity"

import { untrack } from "svelte"

import {
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

let {
	IDPrefix,
	formulae,
	collections,
	index,
	maxIndex,
	source = $bindable(),
	isConnecting,
	errors,
	remove,
	up,
	down
}: {
	IDPrefix: string
	formulae: Formula[]
	collections: Collection[]
	index: number
	maxIndex: number
	source: AcceptableSource
	isConnecting: boolean
	errors: GeneralError[],
	remove: (index: number) => void
	up: (index: number) => void
	down: (index: number) => void
} = $props()

let oldSource = $state(source)
let oldType = $state(source.type)
let currentType = $state(source.type)
$effect(() => {
	if (JSON.stringify(untrack(() => oldSource)) !== JSON.stringify(source)) {
		untrack(() => {
			oldSource = source
			currentType = source.type
			oldType = currentType
		})
	} else if (untrack(() => oldType) !== currentType) {
		untrack(() => {
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
						"stage_basis": acceptableAmountStageBases[0],
						"side_basis": acceptableAmountSideBases[0],
						"must_show_individual_amounts": true,
						"must_show_collective_average": false,
						"must_show_collective_sum": false
					}
			}
		})
	}
})

let ACCEPTABLE_SOURCES = $derived([
	collections.length === 0 ? null : "collection",
	formulae.length === 0 ? null : "formula"
].filter(type => type !== null) as (AcceptableSource["type"])[])
</script>

{#if ACCEPTABLE_SOURCES.length === 0}
	<ShortParagraph>
		There are no available formula or collection to show a data. Please make a formula or a
		collection first.
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
				{collections}
				{IDPrefix}
				{isConnecting}
				{errors}/>
		{/if}
		<TextButton
			label="Remove"
			disabled={maxIndex === 0}
			onclick={() => remove(index)}/>
		<TextButton
			label="Move Up"
			disabled={index === 0}
			onclick={() => up(index)}/>
		<TextButton
			label="Move Down"
			disabled={index === maxIndex}
			onclick={() => down(index)}/>
	</GeneralFieldContainer>
{/if}
