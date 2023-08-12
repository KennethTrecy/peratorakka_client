<script lang="ts">
	import type { Currency, Account, AcceptableAccountKind } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import { acceptableAccountKinds } from "#/entity"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/accounts/basic_form.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"
	import MarginlessButton from "$/utility/marginless_button.svelte"
	import JustifiedParagraph from "$/utility/justified_paragraph.svelte"

	const dispatch = createEventDispatcher<{
		"create": Account
	}>()
	const IDPrefix = "new_"

	export let currencies: Currency[]
	export let currencyID: string = ""
	export let name: string = ""
	export let description: string =""
	export let kind: AcceptableAccountKind = acceptableAccountKinds[0]

	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/api/v1/accounts",
		"defaultRequestConfiguration": {
			"method": "POST"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 201,
				"action": async (response: Response) => {
					const document = await response.json()
					const { account } = document

					name = ""
					description = ""
					kind = acceptableAccountKinds[0]
					errors.set([])
					dispatch("create", account)
				}
			}
		],
		"expectedErrorStatusCodes": [ 400 ]
	})

	async function createAccount() {
		await send({
			"body": JSON.stringify({
				"account": {
					"currency_id": parseInt(currencyID),
					name,
					description,
					kind
				}
			})
		})
	}
</script>

<DescriptiveForm individualName="Financial Account">
	<svelte:fragment slot="description">
		<JustifiedParagraph>
			Currencies are used as symbols for different financial entries and other parts of the
			application. You have a freedom to add accounts, regardless whether they are physical or
			crypto.
		</JustifiedParagraph>
		<JustifiedParagraph>
			The limitation is that the application tracks the account conversions through previous
			financial entries. Therefore, there is no network usage to check for current conversions
			which is a beneficial effect.
		</JustifiedParagraph>
	</svelte:fragment>
	<BasicForm
		slot="form"
		bind:currencies={currencies}
		bind:currencyID={currencyID}
		bind:name={name}
		bind:description={description}
		bind:kind={kind}
		isConnecting={$isConnecting}
		{IDPrefix}
		errors={$errors}
		on:submit={createAccount}>
		<svelte:fragment slot="buttonGroup">
			<MarginlessButton kind="submit" disabled={$isConnecting}>
				Add
			</MarginlessButton>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>
