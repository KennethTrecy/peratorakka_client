<script lang="ts">
	import type { Currency, Account, AcceptableAccountKind } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import { acceptableAccountKinds } from "#/entity"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/accounts/basic_form.svelte"
	import DescriptiveForm from "$/form/descriptive_form.svelte"

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
		<p class="s12 m12 l12 medium-line">
			Currencies are used as symbols for different financial entries and other parts of the
			application. You have a freedom to add accounts, regardless whether they are physical or
			crypto.
		</p>
		<p class="s12 m12 l12 medium-line">
			The limitation is that the application tracks the account conversions through previous
			financial entries. Therefore, there is no network usage to check for current conversions
			which is a beneficial effect.
		</p>
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
			<button type="submit" disabled={$isConnecting}>
				Add
			</button>
		</svelte:fragment>
	</BasicForm>
</DescriptiveForm>

<style lang="scss">
	@use "@/components/third-party/index";

	p {
		text-align: justify;
	}

	button {
		margin: 0em;
	}
</style>
