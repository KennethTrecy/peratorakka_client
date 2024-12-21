<script lang="ts">
import type { Collection, Currency, Formula, NumericalTool, AcceptableSource } from "+/entity"

import { createEventDispatcher } from "svelte"

import { acceptableNumericalToolKinds, acceptableNumericalToolRecurrencePeriods } from "#/entity"

import makeJSONRequester from "$/rest/make_json_requester"

import BasicForm from "%/numerical_tools/basic_form.svelte"
import DescriptiveForm from "$/form/descriptive_form.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

const dispatch = createEventDispatcher<{
	"create": NumericalTool
}>()
const IDPrefix = "new_"

export let isLoadingInitialData: boolean
export let formulae: Formula[]
export let currencies: Currency[]
export let collections: Collection[]

let name = ""
let kind = acceptableNumericalToolKinds[0]
let recurrence = acceptableNumericalToolRecurrencePeriods[0]
let recency = 0
let order = 0
let notes = ""
let sources: AcceptableSource[] = []

let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/api/v1/numerical_tools",
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 201,
			"action": async (response: Response) => {
				const document = await response.json()
				const { numerical_tool } = document

				name = ""
				kind = acceptableNumericalToolKinds[0]
				recurrence = acceptableNumericalToolRecurrencePeriods[0]
				recency = 0
				order = 0
				notes = ""
				sources = []
				errors.set([])
				dispatch("create", numerical_tool)
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function createNumericalTool() {
	await send({
		"body": JSON.stringify({
			"numerical_tool": {
				name,
				kind,
				recurrence,
				recency,
				order,
				notes,
				"configuration": JSON.stringify({
					sources
				})
			}
		})
	})
}

$: mayShowForm = formulae.length > 0 || (collections.length > 0 && currencies.length > 0)
</script>

<DescriptiveForm individualName="Numerical Tool" {mayShowForm} {isLoadingInitialData}>
	<TextContainer slot="description">
		<ElementalParagraph>
			Numerical tools contains information for the data visualizers shown in the dashboard. There are different kinds of visualizers. Some only show numbers. Others show as a table. Line charts and pie charts are also a possibility too.
		</ElementalParagraph>
		<ElementalParagraph>
			Recurrence indicates that data would be grouped per frozen period or per year. Meanwhile, recency indicates the maximum number of frozen periods or frozen years to be visualized. It may also indicate if the current unfrozen period or unfrozen year should be included in the visualization.
		</ElementalParagraph>
		<ElementalParagraph>
			Finally, order indicates the likeliness of the visualizer to be shown first compare to other tools. The lower the order number, the more likely the visualizer to appear first in the dashboard.
		</ElementalParagraph>
	</TextContainer>
	<BasicForm
		slot="form"
		{formulae}
		{currencies}
		{collections}
		bind:name={name}
		bind:kind={kind}
		bind:recurrence={recurrence}
		bind:recency={recency}
		bind:order={order}
		bind:notes={notes}
		bind:sources={sources}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createNumericalTool}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Make Numerical Tool"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
