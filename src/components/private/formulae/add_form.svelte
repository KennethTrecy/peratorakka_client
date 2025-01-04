<script lang="ts">
import type {
	Currency,
	Formula,
	AcceptableFormulaOutputFormat,
	AcceptableExchangeRateBasis
} from "+/entity"

import { createEventDispatcher } from "svelte"

import { UNKNOWN_OPTION } from "#/component"
import { acceptableFormulaOutputFormats, acceptableExchangeRateBases } from "#/entity"

import makeJSONRequester from "$/rest/make_json_requester"

import BasicForm from "%/formulae/basic_form.svelte"
import DescriptiveForm from "$/form/descriptive_form.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

const dispatch = createEventDispatcher<{
	"create": Formula
}>()
const IDPrefix = "new_"

export let isLoadingInitialData: boolean
export let currencies: Currency[]

let currencyID: string = UNKNOWN_OPTION
let name: string = ""
let description: string = ""
let outputFormat: AcceptableFormulaOutputFormat = acceptableFormulaOutputFormats[0]
let exchangeRateBasis: AcceptableExchangeRateBasis = acceptableExchangeRateBases[0]
let presentationalPrecision: number = 12
let formulaText: string =""

let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/api/v1/formulae",
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 201,
			"action": async (response: Response) => {
				const document = await response.json()
				const { formula } = document

				currencyID = UNKNOWN_OPTION
				name = ""
				description = ""
				formulaText = ""
				errors.set([])
				dispatch("create", formula)
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function createFormula() {
	await send({
		"body": JSON.stringify({
			"formula": {
				"currency_id": parseInt(currencyID),
				name,
				description,
				"output_format": outputFormat,
				"exchange_rate_basis": exchangeRateBasis,
				"presentational_precision": presentationalPrecision,
				"formula": formulaText
			}
		})
	})
}

$: mayShowForm = currencies.length > 0
</script>

<DescriptiveForm individualName="Formula" {mayShowForm} {isLoadingInitialData}>
	<TextContainer slot="description">
		<ElementalParagraph>
			Formulas (or formulae) summarize multiple data into meaningful information that a person may use. This may be inflation rate of expenses, total annual income, or total amount of loans need to be paid.
		</ElementalParagraph>
		<ElementalParagraph>
			To create a formula to be used in the system, choose a base currency which will be used as the basis for calculating amounts from multiple currencies. An output format indicates the type of result after calculation.
		</ElementalParagraph>
		<ElementalParagraph>
			Exchange rate basis may be periodic (which is the latest exchange rate on a paricular period) or latest (which is the latest overall exchange rate regardless of the time). It also has presentation precision which is used when displayed by a numerical tool.
		</ElementalParagraph>
	</TextContainer>
	<svelte:fragment slot="requirement">
		<ElementalParagraph>
			At least one currency must exist in the profile to show the form for creating formulae.
		</ElementalParagraph>
	</svelte:fragment>
	<BasicForm
		slot="form"
		bind:currencies={currencies}
		bind:currencyID={currencyID}
		bind:name={name}
		bind:description={description}
		bind:outputFormat={outputFormat}
		bind:exchangeRateBasis={exchangeRateBasis}
		bind:presentationalPrecision={presentationalPrecision}
		bind:formula={formulaText}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createFormula}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Add"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
