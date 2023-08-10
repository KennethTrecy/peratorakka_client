<script lang="ts">
	import type { Currency } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import makeJSONRequester from "$/rest/make_json_requester"

	import BasicForm from "%/currencies/basic_form.svelte"

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

<section class="s12 m12 l12 grid small-space">
	<h2 class="s12 m12 l12 center-align">Add Currency</h2>
	<div class="s12 m12 l6 grid small-space">
		<p class="s12 m12 l12 medium-line">
			Currencies are used as symbols for different financial entries and other parts of the
			application. You have a freedom to add currencies, regardless whether they are physical or
			crypto.
		</p>
		<p class="s12 m12 l12 medium-line">
			The limitation is that the application tracks the currency conversions through previous
			financial entries. Therefore, there is no network usage to check for current conversions which
			is a beneficial effect.
		</p>
	</div>
	<div class="s12 m12 l6 grid large-space">
		<BasicForm
			bind:code={code}
			bind:name={name}
			isConnecting={$isConnecting}
			{IDPrefix}
			errors={$errors}
			on:submit={createCurrency}>
			<svelte:fragment slot="buttonGroup">
				<button type="submit" disabled={$isConnecting}>
					Add
				</button>
			</svelte:fragment>
		</BasicForm>
	</div>
</section>

<style lang="scss">
	@use "@/components/third-party/index";

	p {
		text-align: justify;
	}

	button {
		margin: 0em;
	}
</style>
