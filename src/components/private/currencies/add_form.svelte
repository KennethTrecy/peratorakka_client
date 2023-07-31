<script lang="ts">
	import type { GeneralError } from "+/rest"

	import { get } from "svelte/store"

	import { serverURL } from "$/global_state"

	import TextField from "$/form/text_field.svelte"

	const IDPrefix = "new_"
	let code = ""
	let name = ""
	let isConnecting = false
	let errors: GeneralError[] = []

	async function createCurrency() {
		const currentServerURL = get(serverURL)
		isConnecting = true

		try {
			const response = await fetch(`${currentServerURL}/api/v1/currencies`, {
				"method": "POST",
				"mode": "cors",
				"credentials": "include",
				"referrer": currentServerURL,
				"body": JSON.stringify({
					"currency": {
						code,
						name
					}
				}),
				"headers": {
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			})

			const statusCode = response.status
			if (statusCode === 201) {
				let newCurrency = await response.json()

				errors = []
				code = ""
				name = ""
			} else if (statusCode === 401) {
				errors = (await response.json()).errors
			} else {
				throw new Error(
					`Unexpected status code was returned by the server: ${response.status}.`
				)
			}
		} catch (receivedErrors) {
			if (Array.isArray(receivedErrors)) {
				errors = receivedErrors
			} else {
				errors = [
					{
						"message": (receivedErrors as Error).message
					}
				]
			}
		}

		isConnecting = false
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
				disabled={isConnecting}
				bind:value={code}
				{IDPrefix}
				{errors}/>
			<TextField
				fieldName="Name"
				disabled={isConnecting}
				bind:value={name}
				{IDPrefix}
				{errors}/>
			<div class="row">
				<button type="submit" disabled={isConnecting}>
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
