<script lang="ts">
	import type { Currency } from "+/entity"

	import { get } from "svelte/store"
	import { onMount } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
		mustHaveToken,
		mustBeAuthenticatedUser
	} from "$/global_state"

	import Collection from "%/currencies/collection.svelte"
	import AddForm from "%/currencies/add_form.svelte"

	applyRequirements([
		mustHaveToken,
		mustBeAuthenticatedUser
	], {
		afterNavigate,
		beforeNavigate,
		goto
	})

	let currencies: Currency[] = []
	let { isConnecting, errors, send } = makeJSONRequester({
		"path": "/api/v1/currencies",
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errors.set([])
					currencies = responseDocument.currencies
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function loadList() {
		const currentServerURL = get(serverURL)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		await send({})
	}

	onMount(loadList)
</script>

<svelte:head>
	<title>Currencies</title>
</svelte:head>

<article class="grid large-space large-margin large-padding">
	<h1 class="s12 m12 l12 center-align">Currencies</h1>
	<AddForm/>
	<Collection
		data={currencies}
		isConnecting={$isConnecting}/>
</article>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
