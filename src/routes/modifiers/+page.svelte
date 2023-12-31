<script lang="ts">
	import type { Account, Currency, Modifier } from "+/entity"
	import type { ContextBundle } from "+/component"
	import type { SearchMode, SortOrder } from "+/rest"

	import { get, writable } from "svelte/store"
	import { onMount, getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { GLOBAL_CONTEXT } from "#/contexts"
	import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

	import assertAuthentication from "$/page_requirement/assert_authentication"
	import makeJSONRequester from "$/rest/make_json_requester"

	import AddForm from "%/modifiers/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import DataTable from "%/modifiers/data_table.svelte"
	import ExtraResourceLoader from "$/catalog/extra_resource_loader.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PrimaryHeading from "$/typography/primary_heading.svelte"

	const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

	assertAuthentication(globalContext, {
		afterNavigate,
		beforeNavigate,
		goto
	})

	let hasRequestedFirstList = false

	let currencies: Currency[] = []
	let accounts: Account[] = []
	let modifiers: Modifier[] = []

	let searchMode: SearchMode = SEARCH_NORMALLY
	let sortCriterion: string = "name"
	let sortOrder: SortOrder = ASCENDING_ORDER
	let lastOffset: number = 0

	const collectiveName = "modifiers"
	const partialPath = `/api/v1/${collectiveName}`
	let parameters: [string, string][] = [
		[ "filter[search_mode]", searchMode as string ],
		[ "sort[0][0]", sortCriterion ],
		[ "sort[0][1]", sortOrder as string ],
		[ "sort[1][0]", "created_at" ],
		[ "sort[1][1]", sortOrder as string ]
	]
	let completePath = writable(partialPath)
	$: {
		parameters = [
			[ "filter[search_mode]", searchMode as string ],
			[ "sort[0][0]", sortCriterion ],
			[ "sort[0][1]", sortOrder as string ],
			[ "sort[1][0]", "created_at" ],
			[ "sort[1][1]", sortOrder as string ]
		]

		completePath.set(`${partialPath}?${
			new URLSearchParams([
				...parameters,
				[ "page[offset]", `${lastOffset}` ],
				[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
			]).toString()
		}`)
	}

	let {
		"isConnecting": isConnectingForModifiers,
		"errors": errorsForModifiers,
		"send": requestForModifiers
	} = makeJSONRequester({
		"path": completePath,
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForModifiers.set([])
					modifiers = responseDocument[collectiveName]
					lastOffset = responseDocument[collectiveName].length - 1
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
		"path": `/api/v1/accounts?${
			new URLSearchParams([
				[ "sort[0][0]", "name" ],
				[ "sort[0][1]", "ascending" ],
				[ "sort[1][0]", "created_at" ],
				[ "sort[1][1]", "ascending" ]
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
		const currentServerURL = get(globalContext.serverURL as any)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		await reloadModifiers()
		await requestForAccounts({})
		hasRequestedFirstList = true
	}

	onMount(loadList)

	function addModifier(event: CustomEvent<Modifier>) {
		const newModifier = event.detail
		modifiers = [
			newModifier,
			...modifiers
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
			isConnectingForInitialList={$isConnectingForModifiers && hasRequestedFirstList}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadModifiers}
			on:addResources={addModifiers}/>
	</InnerGrid>
</ArticleGrid>
