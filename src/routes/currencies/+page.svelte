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

	import AddForm from "%/currencies/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import Collection from "%/currencies/collection.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PrimaryHeading from "$/typography/primary_heading.svelte"

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

	function addCurrency(event: CustomEvent<Currency>) {
		const newCurrency = event.detail
		currencies = [
			...currencies,
			newCurrency
		]
	}

	function removeCurrency(event: CustomEvent<Currency>) {
		const oldCurrency = event.detail
		currencies = currencies.filter(currency => currency.id !== oldCurrency.id)
	}
</script>

<svelte:head>
	<title>Currencies</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Currencies</PrimaryHeading>
		</GridCell>
		<AddForm on:create={addCurrency}/>
		<Collection
			data={currencies}
			isConnecting={$isConnecting}
			on:delete={removeCurrency}/>
	</InnerGrid>
</ArticleGrid>
