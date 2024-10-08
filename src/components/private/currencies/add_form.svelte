<script lang="ts">
	import type { Currency } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/currencies/basic_form.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	const dispatch = createEventDispatcher<{
		"create": Currency
	}>()
	const IDPrefix = "new_"
	let code = ""
	let name = ""
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/api/v1/currencies",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 201,
				"action": async (response: Response) => {
					const document = await response.json()
					const { currency } = document

					code = ""
					name = ""
					errors.set([])
					dispatch("create", currency)
				}
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	async function createCurrency() {
		await send({
			"body": JSON.stringify({
				"currency": {
					code,
					name
				}
			})
		})
	}
</script>

<DescriptiveForm individualName="Currency" mayShowForm>
	<TextContainer slot="description">
		<ElementalParagraph>
			Currencies are used as symbols for different financial entries and other parts of the
			application. You have a freedom to add currencies, regardless whether they are physical or
			crypto. Some people may treat the shares in stocks or units in mutual funds as currency because the price changes over time.
		</ElementalParagraph>
		<ElementalParagraph>
			One limitation is that the application tracks the currency conversions through previous
			financial entries. Therefore, there is no network usage to check for current conversions
			which is a beneficial effect.
		</ElementalParagraph>
	</TextContainer>
	<BasicForm
		slot="form"
		bind:code={code}
		bind:name={name}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createCurrency}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Add"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
