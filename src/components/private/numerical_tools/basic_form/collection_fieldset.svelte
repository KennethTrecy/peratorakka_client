<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Collection, Currency, CollectionSource } from "+/entity"

import {
	acceptableExchangeRateBases,
	acceptableAmountStageBases,
	acceptableAmountSideBases
} from "#/entity"

import transformCollection from "$/form/choice_info_transformer/transform_collection"
import transformCurrency from "$/form/choice_info_transformer/transform_currency"
import transformString from "$/form/choice_info_transformer/transform_string"

import ChoiceListField from "$/form/choice_list_field.svelte"
import CheckboxField from "$/form/checkbox_field.svelte"

const ACCEPTABLE_FORMULA_EXCHANGE_RATE_BASES = [ ...acceptableExchangeRateBases ]
const ACCEPTABLE_AMOUNT_STAGE_BASES = [ ...acceptableAmountStageBases ]
const ACCEPTABLE_AMOUNT_SIDE_BASES = [ ...acceptableAmountSideBases ]

export let IDPrefix: string
export let collections: Collection[]
export let currencies: Currency[]
export let collection: CollectionSource

export let isConnecting: boolean
export let errors: GeneralError[]

let oldCollection = collection
let collectionID = `${collection.collection_id}`
let currencyID = `${collection.currency_id}`
let exchangeRateBasis = collection.exchange_rate_basis
let stageBasis = collection.stage_basis
let sideBasis = collection.side_basis
let mustShowIndividualAmounts = collection.must_show_individual_amounts
let mustShowCollectiveSum = collection.must_show_collective_sum
let mustShowCollectiveAverage = collection.must_show_collective_average

$: {
	if (JSON.stringify(oldCollection) !== JSON.stringify(collection)) {
		oldCollection = collection
		collectionID = `${collection.collection_id}`
		currencyID = `${collection.currency_id}`
		exchangeRateBasis = collection.exchange_rate_basis
		stageBasis = collection.stage_basis
		sideBasis = collection.side_basis
		mustShowIndividualAmounts = collection.must_show_individual_amounts
		mustShowCollectiveSum = collection.must_show_collective_sum
		mustShowCollectiveAverage = collection.must_show_collective_average
	} else {
		collection = {
			...collection,
			"collection_id": +collectionID,
			"currency_id": +currencyID,
			"exchange_rate_basis": exchangeRateBasis,
			"stage_basis": stageBasis,
			"side_basis": sideBasis,
			"must_show_individual_amounts": mustShowIndividualAmounts,
			"must_show_collective_sum": mustShowCollectiveSum,
			"must_show_collective_average": mustShowCollectiveAverage
		}
	}
}
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
	fieldName="Base Currency"
	disabled={isConnecting}
	bind:value={currencyID}
	rawChoices={currencies}
	choiceConverter={transformCurrency}
	{IDPrefix}
	{errors}/>
<ChoiceListField
	fieldName="Exchange Rate Basis"
	disabled={isConnecting}
	bind:value={exchangeRateBasis}
	rawChoices={ACCEPTABLE_FORMULA_EXCHANGE_RATE_BASES}
	choiceConverter={transformString}
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
