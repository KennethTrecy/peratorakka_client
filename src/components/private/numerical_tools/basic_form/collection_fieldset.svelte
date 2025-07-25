<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Collection, CollectionSource } from "+/entity"

import { untrack } from "svelte"

import {
	acceptableAmountStageBases,
	acceptableAmountSideBases
} from "#/entity"

import transformCollection from "$/form/choice_info_transformer/transform_collection"
import transformString from "$/form/choice_info_transformer/transform_string"

import ChoiceListField from "$/form/choice_list_field.svelte"
import CheckboxField from "$/form/checkbox_field.svelte"

const ACCEPTABLE_AMOUNT_STAGE_BASES = [ ...acceptableAmountStageBases ]
const ACCEPTABLE_AMOUNT_SIDE_BASES = [ ...acceptableAmountSideBases ]

let {
	IDPrefix,
	collections,
	collection = $bindable(),
	isConnecting,
	errors
}: {
	IDPrefix: string
	collections: Collection[]
	collection: CollectionSource
	isConnecting: boolean
	errors: GeneralError[]
} = $props()

let collectionID = $state(`${collection.collection_id}`)
let stageBasis = $state(collection.stage_basis)
let sideBasis = $state(collection.side_basis)
let mustShowIndividualAmounts = $state(collection.must_show_individual_amounts)
let mustShowCollectiveSum = $state(collection.must_show_collective_sum)
let mustShowCollectiveAverage = $state(collection.must_show_collective_average)

$effect(() => {
	const parsedCollectionID = +collectionID

	untrack(() => {
		collection = {
			...collection,
			"collection_id": parsedCollectionID
		}
	})
})
$effect(() => {
	const newStageBasis = stageBasis

	untrack(() => {
		collection = {
			...collection,
			"stage_basis": newStageBasis
		}
	})
})
$effect(() => {
	const newSideBasis = sideBasis

	untrack(() => {
		collection = {
			...collection,
			"side_basis": newSideBasis
		}
	})
})
$effect(() => {
	const newMustShowIndividualAmounts = mustShowIndividualAmounts

	untrack(() => {
		collection = {
			...collection,
			"must_show_individual_amounts": newMustShowIndividualAmounts
		}
	})
})
$effect(() => {
	const newMustShowCollectiveSum = mustShowCollectiveSum

	untrack(() => {
		collection = {
			...collection,
			"must_show_collective_sum": newMustShowCollectiveSum
		}
	})
})
$effect(() => {
	const newMustShowCollectiveAverage = mustShowCollectiveAverage

	untrack(() => {
		collection = {
			...collection,
			"must_show_collective_average": newMustShowCollectiveAverage
		}
	})
})
</script>

<ChoiceListField
	fieldName="Collection"
	disabled={isConnecting}
	bind:value={collectionID}
	rawChoices={collections}
	choiceConverter={transformCollection}
	{IDPrefix}
	{errors}/>
<ChoiceListField
	fieldName="Amount Stage Basis"
	disabled={isConnecting}
	bind:value={stageBasis}
	rawChoices={ACCEPTABLE_AMOUNT_STAGE_BASES}
	choiceConverter={transformString}
	{IDPrefix}
	{errors}/>
<ChoiceListField
	fieldName="Amount Side Basis"
	disabled={isConnecting}
	bind:value={sideBasis}
	rawChoices={ACCEPTABLE_AMOUNT_SIDE_BASES}
	choiceConverter={transformString}
	{IDPrefix}
	{errors}/>
<CheckboxField
	fieldName="Show Individual Amounts"
	disabled={isConnecting}
	bind:value={mustShowIndividualAmounts}
	{IDPrefix}
	{errors}/>
<CheckboxField
	fieldName="Show Collective Sum"
	disabled={isConnecting}
	bind:value={mustShowCollectiveSum}
	{IDPrefix}
	{errors}/>
<CheckboxField
	fieldName="Show Collective Average"
	disabled={isConnecting}
	bind:value={mustShowCollectiveAverage}
	{IDPrefix}
	{errors}/>
