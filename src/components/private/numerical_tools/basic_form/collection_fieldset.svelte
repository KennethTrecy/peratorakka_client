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

let currentCollectionID = `${collection.collection_id}`
let oldCollectionID = `${collection.collection_id}`
$: {
	if (oldCollectionID !== currentCollectionID) {
		oldCollectionID = currentCollectionID
		collection = { ...collection, "collection_id": +currentCollectionID }
	}
}

let currentCurrencyID = `${collection.currency_id}`
let oldCurrencyID = `${collection.currency_id}`
$: {
	if (oldCurrencyID !== currentCurrencyID) {
		oldCurrencyID = currentCurrencyID
		collection = { ...collection, "currency_id": +currentCurrencyID }
	}
}
</script>

<ChoiceListField
	fieldName="Collection"
	disabled={isConnecting}
	bind:value={currentCollectionID}
	rawChoices={collections}
	choiceConverter={transformCollection}
	{IDPrefix}
	{errors}/>
<ChoiceListField
	fieldName="Base Currency"
	disabled={isConnecting}
	bind:value={currentCurrencyID}
	rawChoices={currencies}
	choiceConverter={transformCurrency}
	{IDPrefix}
	{errors}/>
<ChoiceListField
	fieldName="Exchange Rate Basis"
	disabled={isConnecting}
	bind:value={collection.exchange_rate_basis}
	rawChoices={ACCEPTABLE_FORMULA_EXCHANGE_RATE_BASES}
	choiceConverter={transformString}
	{IDPrefix}
	{errors}/>
<ChoiceListField
	fieldName="Amount Stage Basis"
	disabled={isConnecting}
	bind:value={collection.stage_basis}
	rawChoices={ACCEPTABLE_AMOUNT_STAGE_BASES}
	choiceConverter={transformString}
	{IDPrefix}
	{errors}/>
<ChoiceListField
	fieldName="Amount Side Basis"
	disabled={isConnecting}
	bind:value={collection.side_basis}
	rawChoices={ACCEPTABLE_AMOUNT_SIDE_BASES}
	choiceConverter={transformString}
	{IDPrefix}
	{errors}/>
<CheckboxField
	fieldName="Show Individual Amounts"
	disabled={isConnecting}
	bind:value={collection.must_show_individual_amounts}
	{IDPrefix}
	{errors}/>
<CheckboxField
	fieldName="Show Collective Sum"
	disabled={isConnecting}
	bind:value={collection.must_show_collective_sum}
	{IDPrefix}
	{errors}/>
<CheckboxField
	fieldName="Show Collective Average"
	disabled={isConnecting}
	bind:value={collection.must_show_collective_average}
	{IDPrefix}
	{errors}/>
