<script lang="ts">
	import type { Entity } from "%/currencies/types"

	import { get } from "svelte/store"
	import { goto } from "$app/navigation"
	import { onMount, onDestroy } from "svelte"

	import {
		serverURL,
		hasRequirements,
		mustHaveToken,
		mustBeAuthenticatedUser,
		redirectPath
	} from "$/global_state"
	import makeJSONRequester from "$/rest/make_json_requester"

	import Collection from "%/currencies/collection.svelte"
	import AddForm from "%/currencies/add_form.svelte"

	hasRequirements.set(true)
	mustHaveToken.set(true)
	mustBeAuthenticatedUser.set(true)
	const forgetPossibleRedirection = redirectPath.subscribe(path => {
		if (path !== "") goto(path as string)
	})
	onDestroy(forgetPossibleRedirection)

	let currencies: Entity[] = []
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
	<Collection data={currencies}/>
</article>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
