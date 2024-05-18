<script lang="ts">
	import type { CashFlowCategory } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import { acceptableCashFlowCategoryKinds } from "#/entity"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/cash_flow_categories/basic_form.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"
	import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
	import TextCardButton from "$/button/card/text.svelte"
	import TextContainer from "$/typography/text_container.svelte"

	const dispatch = createEventDispatcher<{
		"create": CashFlowCategory
	}>()
	const IDPrefix = "new_"
	let name = ""
	let description = ""
	let kind = acceptableCashFlowCategoryKinds[0]
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/api/v1/cash_flow_categories",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 201,
				"action": async (response: Response) => {
					const document = await response.json()
					const { cash_flow_category } = document

					name = ""
					description = ""
					kind = acceptableCashFlowCategoryKinds[0]
					errors.set([])
					dispatch("create", cash_flow_category)
				}
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	async function createCashFlowCategory() {
		await send({
			"body": JSON.stringify({
				"cash_flow_category": {
					name,
					description,
					kind
				}
			})
		})
	}
</script>

<DescriptiveForm individualName="Cash Flow Category" mayShowForm>
	<TextContainer slot="description">
		<ElementalParagraph>
			Cash flow categories are used to classify changes in the current amount of accounts and determine the amount of available liquid cash and cash equivalents. Usual cash flow categories are cash and cash equivalent, operating activities, investment activities, and financing activities.
		</ElementalParagraph>
		<ElementalParagraph>
			A financial account in liquid category means that the account can be converted into cash immediately (e.g. bank deposits or physical cash in wallet) or an imaginary expense (e.g. depreciation expense). A financial account in illiquid category means that the account can be converted into cash after a long period or never at all such as land or equipments.
		</ElementalParagraph>
	</TextContainer>
	<BasicForm
		slot="form"
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createCashFlowCategory}>
		<svelte:fragment slot="button_group">
			<TextCardButton
				kind="submit"
				disabled={$isConnecting}
				label="Add"/>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
