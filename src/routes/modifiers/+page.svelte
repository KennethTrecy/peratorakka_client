<script lang="ts">
	import type { SearchMode, SortOrder } from "+/rest"
	import type { Account, Currency, Modifier } from "+/entity"

	import { get } from "svelte/store"
	import { onMount } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { SEARCH_NORMALLY, DESCENDING_ORDER } from "#/rest"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
		mustHaveToken,
		mustHaveAccessToken,
		mustBeAuthenticatedUser
	} from "$/global_state"

	import AddForm from "%/modifiers/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import DataTable from "%/modifiers/data_table.svelte"
	import ExtraResourceLoader from "$/catalog/extra_resource_loader.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PrimaryHeading from "$/typography/primary_heading.svelte"

	applyRequirements([
		mustHaveToken,
		mustHaveAccessToken,
		mustBeAuthenticatedUser
	], {
		afterNavigate,
		beforeNavigate,
		goto
	})

	let currencies: Currency[] = []
	let accounts: Account[] = []
	let modifiers: Modifier[] = []

	let searchMode: SearchMode = SEARCH_NORMALLY
	let sortCriterion: string = "transacted_at"
	let sortOrder: SortOrder = DESCENDING_ORDER
	let lastOffset: number = 0

	const individualName = "modifier"
	const partialPath = `/api/v1/${individualName}`
	let parameters: [string, string][] = [
		[ "filter[search_mode]", searchMode as string ],
		[ "sort[0][0]", sortCriterion ],
		[ "sort[0][1]", sortOrder as string ]
	]
	$: {
		parameters = [
			[ "filter[search_mode]", searchMode as string ],
			[ "sort[0][0]", sortCriterion ],
			[ "sort[0][1]", sortOrder as string ]
		]
	}

	let {
		"isConnecting": isConnectingForModifiers,
		"errors": errorsForModifiers,
		"send": requestForModifiers
	} = makeJSONRequester({
		"path": `${partialPath}?${
			new URLSearchParams([
				...parameters,
				[ "page[offset]", `${lastOffset}` ],
				[ "page[limit]", "1" ]
			]).toString()
		}`,
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForModifiers.set([])
					modifiers = responseDocument.modifiers
				}
			},
			{
				"statusCode": 204,
				"action": async (response: Response) => {
					errorsForModifiers.set([])
					modifiers = []
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	let {
		"isConnecting": isConnectingForAccounts,
		"errors": errorsForAccounts,
		"send": requestForAccounts
	} = makeJSONRequester({
		"path": "/api/v1/accounts",
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForAccounts.set([])
					accounts = responseDocument.accounts
					currencies = responseDocument.currencies
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function reloadModifiers() {
		modifiers = []
		await requestForModifiers({})
	}

	async function loadList() {
		const currentServerURL = get(serverURL)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		await reloadModifiers()
		await requestForAccounts({})
	}

	onMount(loadList)

	function addModifier(event: CustomEvent<Modifier>) {
		const newModifier = event.detail
		modifiers = [
			...modifiers,
			newModifier
		]
	}

	function addModifiers(event: CustomEvent<unknown[]>) {
		const newModifiers = event.detail as Modifier[]
		modifiers = [
			...modifiers,
			...newModifiers
		]
	}

	function removeModifier(event: CustomEvent<Modifier>) {
		const oldModifier = event.detail
		modifiers = modifiers.filter(modifier => modifier.id !== oldModifier.id)
	}
</script>

<svelte:head>
	<title>Modifiers</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Modifiers</PrimaryHeading>
		</GridCell>
		<AddForm
			{currencies}
			{accounts}
			isLoadingInitialData={$isConnectingForAccounts}
			on:create={addModifier}/>
		<DataTable
			{currencies}
			{accounts}
			data={modifiers}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnectingForModifiers}
			listError={$errorsForModifiers}
			on:delete={removeModifier}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnectingForModifiers}
			{partialPath}
			{parameters}
			{individualName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadModifiers}
			on:addResources={addModifiers}/>
	</InnerGrid>
</ArticleGrid>
