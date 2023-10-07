<script lang="ts">
	import type { ContextBundle } from "+/component"
	import type { Currency } from "+/entity"
	import type { SearchMode, SortOrder } from "+/rest"

	import { get, writable } from "svelte/store"
	import { onMount, getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { GLOBAL_CONTEXT } from "#/contexts"
	import { SEARCH_NORMALLY, ASCENDING_ORDER } from "#/rest"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
	} from "$/global_state"

	import AddForm from "%/currencies/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import Collection from "%/currencies/collection.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PrimaryHeading from "$/typography/primary_heading.svelte"

	const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

	applyRequirements(globalContext, [
		globalContext.mustHaveToken,
		globalContext.mustHaveAccessToken,
		globalContext.mustBeAuthenticatedUser
	], {
		afterNavigate,
		beforeNavigate,
		goto
	})

	let currencies: Currency[] = []

	let searchMode: SearchMode = SEARCH_NORMALLY
	let sortCriterion: string = "name"
	let sortOrder: SortOrder = ASCENDING_ORDER

	const collectiveName = "currencies"
	const partialPath = `/api/v1/${collectiveName}`
	let parameters: [string, string][] = [
		[ "filter[search_mode]", searchMode as string ],
		[ "sort[0][0]", sortCriterion ],
		[ "sort[0][1]", sortOrder as string ]
	]
	let completePath = writable(partialPath)
	$: {
		parameters = [
			[ "filter[search_mode]", searchMode as string ],
			[ "sort[0][0]", sortCriterion ],
			[ "sort[0][1]", sortOrder as string ]
		]

		completePath.set(`${partialPath}?${
			new URLSearchParams([
				...parameters
			]).toString()
		}`)

		reloadCurrencies()
	}

	let { isConnecting, errors, send } = makeJSONRequester({
		"path": completePath,
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

	async function reloadCurrencies() {
		currencies = []
		await send({})
	}

	async function loadList() {
		const currentServerURL = get(serverURL)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		await reloadCurrencies()
	}

	onMount(loadList)

	function addCurrency(event: CustomEvent<Currency>) {
		const newCurrency = event.detail
		currencies = [
			newCurrency,
			...currencies
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
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting}
			listError={$errors}
			on:delete={removeCurrency}/>
	</InnerGrid>
</ArticleGrid>
