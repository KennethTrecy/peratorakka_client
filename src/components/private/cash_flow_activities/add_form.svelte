<script lang="ts">
	import type { CashFlowActivity } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/cash_flow_activities/basic_form.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	const dispatch = createEventDispatcher<{
		"create": CashFlowActivity
	}>()
	const IDPrefix = "new_"
	let name = ""
	let description = ""
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/api/v1/cash_flow_activities",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 201,
				"action": async (response: Response) => {
					const document = await response.json()
					const { cash_flow_activity } = document

					name = ""
					description = ""
					errors.set([])
					dispatch("create", cash_flow_activity)
				}
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	async function createCashFlowActivity() {
		await send({
			"body": JSON.stringify({
				"cash_flow_activity": {
					name,
					description
				}
			})
		})
	}
</script>

<DescriptiveForm individualName="Cash Flow Activity" mayShowForm>
	<TextContainer slot="description">
		<ElementalParagraph>
			Cash flow activities are used to classify changes in the current amount of accounts and determine the amount of available liquid cash and cash equivalents. Usual cash flow activities are operating activities, investment activities, and financing activities.
		</ElementalParagraph>
		<ElementalParagraph>
			A liquid financial account is an account that can be converted into cash immediately (e.g. bank deposits or physical cash in wallet). Illiquid financial account means that the account can be converted into cash after a long period or never at all (e.g. land or equipments).
		</ElementalParagraph>
	</TextContainer>
	<BasicForm
		slot="form"
		bind:name={name}
		bind:description={description}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createCashFlowActivity}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Add"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
