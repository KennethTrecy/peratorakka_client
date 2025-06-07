<script lang="ts">
import type { PrecisionFormat } from "+/entity"

import { createEventDispatcher } from "svelte"

import makeJSONRequester from "$/rest/make_json_requester"

import BasicForm from "%/precision_formats/basic_form.svelte"
import DescriptiveForm from "$/form/descriptive_form.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

const dispatch = createEventDispatcher<{
	"create": PrecisionFormat
}>()
const IDPrefix = "new_"
let name = ""
let minimumPresentationalPrecision = 0
let maximumPresentationalPrecision = 12
let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/api/v1/precision_formats",
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 201,
			"action": async (response: Response) => {
				const document = await response.json()
				const { "precision_format": precisionFormat } = document

				name = ""
				minimumPresentationalPrecision = 0
				maximumPresentationalPrecision = 0
				errors.set([])
				dispatch("create", precisionFormat)
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function createPrecisionFormat() {
	await send({
		"body": JSON.stringify({
			"precision_format": {
				name,
				"minimum_presentational_precision": minimumPresentationalPrecision,
				"maximum_presentational_precision": maximumPresentationalPrecision
			}
		})
	})
}
</script>

<DescriptiveForm individualName="Precision Format" mayShowForm>
	<TextContainer slot="description">
		<ElementalParagraph>
			Precision formats are shared between currencies and numerical tools to display the numbers properly. For example in cryptocurrencies, they usually have multiple decimal places. Meanwhile, fiat currencies usually have two decimal places to represent centavos.
		</ElementalParagraph>
	</TextContainer>
	<BasicForm
		slot="form"
		bind:name={name}
		bind:minimumPresentationalPrecision={minimumPresentationalPrecision}
		bind:maximumPresentationalPrecision={maximumPresentationalPrecision}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createPrecisionFormat}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Add"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
