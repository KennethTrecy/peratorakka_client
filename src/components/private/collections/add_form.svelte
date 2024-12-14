<script lang="ts">
import type { Collection } from "+/entity"

import { createEventDispatcher } from "svelte"

import makeJSONRequester from "$/rest/make_json_requester"

import BasicForm from "%/collections/basic_form.svelte"
import DescriptiveForm from "$/form/descriptive_form.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

const dispatch = createEventDispatcher<{
	"create": Collection
}>()
const IDPrefix = "new_"
let name = ""
let description = ""
let { isConnecting, errors, send } = makeJSONRequester({
	"path": "/api/v1/collections",
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 201,
			"action": async (response: Response) => {
				const document = await response.json()
				const { collection } = document

				name = ""
				description = ""
				errors.set([])
				dispatch("create", collection)
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function createCollection() {
	await send({
		"body": JSON.stringify({
			"collection": {
				name,
				description
			}
		})
	})
}
</script>

<DescriptiveForm individualName="Collection" mayShowForm>
	<TextContainer slot="description">
		<ElementalParagraph>
			Collections are used to group multiple financial accounts. They help in calculating a formula or presenting data.
		</ElementalParagraph>
	</TextContainer>
	<BasicForm
		slot="form"
		bind:name={name}
		bind:description={description}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createCollection}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Add"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
