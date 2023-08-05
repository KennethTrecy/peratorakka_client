<script lang="ts">
	import makeJSONRequester from "$/rest/make_json_requester"

	import TextField from "$/form/text_field.svelte"

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
					let newCurrency = await response.json()

					code = ""
					name = ""
					errors.set([])
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

<section>
	<h2>Add Currency</h2>
	<p class="medium-line">
		Currencies are used as symbols for different financial entries and other parts of the
		application. You have a freedom to add currencies, regardless whether they are physical or
		crypto.
	</p>
	<p class="medium-line">
		The limitation is that the application tracks the currency conversions through previous
		financial entries. Therefore, there is no network usage to check for current conversions which
		is a beneficial effect.
	</p>
	<form on:submit={createCurrency}>
		<fieldset>
			<TextField
				fieldName="Code"
				disabled={$isConnecting}
				bind:value={code}
				{IDPrefix}
				errors={$errors}/>
			<TextField
				fieldName="Name"
				disabled={$isConnecting}
				bind:value={name}
				{IDPrefix}
				errors={$errors}/>
			<div class="row">
				<button type="submit" disabled={$isConnecting}>
					Add
				</button>
			</div>
		</fieldset>
	</form>
</section>

<style lang="scss">
	@use "@/components/third-party/index";

	p {
		text-align: justify;
	}
</style>
