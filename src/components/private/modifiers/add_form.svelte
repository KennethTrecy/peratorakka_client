<script lang="ts">
	import type { Currency, Account, AcceptableAccountKind } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import { acceptableAccountKinds } from "#/entity"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/modifiers/basic_form.svelte"
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

	$: mayShowForm = currencies.length > 0
</script>

<DescriptiveForm individualName="Financial Account" {mayShowForm}>
	<svelte:fragment slot="description">
		<JustifiedParagraph>
			Financial accounts are some kind of label for the numerical values in a financial entry.
			Some examples of these are capital, cash, or debt. They may be credited or debited
			depending on their kind. They may be asset, liability, or equity to name a few.
		</JustifiedParagraph>
		<JustifiedParagraph>
			To create a financial account to be used in the system, choose a currency and kind in order
			for the system to calculate properly the associated numerical values. After that, fill out
			other required info. Finally, press "Add" button.
		</JustifiedParagraph>
	</svelte:fragment>
	<svelte:fragment slot="requirement">
		<JustifiedParagraph>
			At least one currency must exist in the profile to show the form for creating financial
			accounts.
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
