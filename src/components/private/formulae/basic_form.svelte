<script lang="ts">
import type { GeneralError } from "+/rest"
import type {
	Currency,
	Formula,
	AcceptableFormulaOutputFormat,
	AcceptableExchangeRateBasis
} from "+/entity"

import { acceptableFormulaOutputFormats, acceptableExchangeRateBases } from "#/entity"

import transformCurrency from "$/form/choice_info_transformer/transform_currency"
import transformString from "$/form/choice_info_transformer/transform_string"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import NumberField from "$/form/number_field.svelte"
import TextField from "$/form/text_field.svelte"

const ACCEPTABLE_FORMULA_OUTPUT_FORMATS = [ ...acceptableFormulaOutputFormats ]
const ACCEPTABLE_FORMULA_EXCHANGE_RATE_BASES = [ ...acceptableExchangeRateBases ]

export let IDPrefix: string
export let currencies: Currency[]

export let currencyID: string
export let name: string
export let description: string
export let outputFormat: AcceptableFormulaOutputFormat
export let exchangeRateBasis: AcceptableExchangeRateBasis
export let presentationalPrecision: number
export let formula: string
export let forceDisabledFields: (keyof Formula)[] = []

export let isConnecting: boolean
export let errors: GeneralError[]
export let id = ""
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
		<ChoiceListField
			fieldName="Currency"
			errorFieldID="currency_id"
			disabled={isConnecting || forceDisabledFields.includes("currency_id")}
			bind:value={currencyID}
			rawChoices={currencies}
			choiceConverter={transformCurrency}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Name"
			disabled={isConnecting || forceDisabledFields.includes("name")}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Description"
			disabled={isConnecting || forceDisabledFields.includes("description")}
			bind:value={description}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Output Format"
			disabled={isConnecting || forceDisabledFields.includes("output_format")}
			bind:value={outputFormat}
			rawChoices={ACCEPTABLE_FORMULA_OUTPUT_FORMATS}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Exchange Rate Basis"
			disabled={isConnecting || forceDisabledFields.includes("exchange_rate_basis")}
			bind:value={exchangeRateBasis}
			rawChoices={ACCEPTABLE_FORMULA_EXCHANGE_RATE_BASES}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		<NumberField
			fieldName="Presentational Precision"
			min={0}
			max={12}
			step={1}
			disabled={isConnecting}
			bind:value={presentationalPrecision}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Formula"
			disabled={isConnecting || forceDisabledFields.includes("formula")}
			bind:value={formula}
			{IDPrefix}
			{errors}/>
		</svelte:fragment>
		<slot slot="button_group" name="button_group"/>
</BasicForm>
