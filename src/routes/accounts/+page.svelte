<script lang="ts">
	import type { Account, Currency } from "+/entity"
	import type { ContextBundle } from "+/component"
	import type { SearchMode, SortOrder } from "+/rest"

	import { get, writable } from "svelte/store"
	import { onMount, getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { GLOBAL_CONTEXT } from "#/contexts"
	import {
		SEARCH_NORMALLY,
		SEARCH_WITH_DELETED,
		ASCENDING_ORDER,
		MAXIMUM_PAGINATED_LIST_LENGTH
	} from "#/rest"

	import assertAuthentication from "$/page_requirement/assert_authentication"
	import makeJSONRequester from "$/rest/make_json_requester"
	import mergeUniqueResources from "$/utility/merge_unique_resources"

	import AddForm from "%/accounts/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import Collection from "%/accounts/collection.svelte"
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

	let isRequestingDependencies = true

	let currencies: Currency[] = []
	let accounts: Account[] = []

	let searchMode: SearchMode = SEARCH_NORMALLY
	let sortCriterion: string = "name"
	let sortOrder: SortOrder = ASCENDING_ORDER
	let lastOffset: number = 0

	const collectiveName = "accounts"
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
				...parameters,
				[ "page[offset]", `${lastOffset}` ],
				[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
			]).toString()
		}`)
	}

	let {
		"isConnecting": isConnectingForAccounts,
		"errors": errorsForAccounts,
		"send": requestForAccounts
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
					errorsForAccounts.set([])
					accounts = responseDocument[collectiveName]
					lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	const partialDependencyPath = "/api/v1/currencies"
	const dependencyPathParameters = [
		[ "filter[search_mode]", SEARCH_WITH_DELETED ],
		[ "sort[0][0]", "name" ],
		[ "sort[0][1]", "ascending" ],
		[ "sort[1][0]", "created_at" ],
		[ "sort[1][1]", "ascending" ]
	]
	let totalNumberOfDependencies: number = 0
	let lastDependencyOffset: number = -1
	const completeDependencyPath = writable(partialDependencyPath)
	$: {
		completeDependencyPath.set(`${partialDependencyPath}?${
			new URLSearchParams([
				...dependencyPathParameters,
				[ "page[offset]", `${lastDependencyOffset + 1}` ],
				[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
			]).toString()
		}`)
	}
	let {
		"isConnecting": isConnectingForCurrencies,
		"errors": errorsForCurrencies,
		"send": requestForCurrencies
	} = makeJSONRequester({
		"path": completeDependencyPath,
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForCurrencies.set([])
					currencies = mergeUniqueResources(currencies, responseDocument.currencies)
					lastDependencyOffset = lastDependencyOffset + responseDocument
						.currencies
						.length
					totalNumberOfDependencies = responseDocument.meta.overall_filtered_count
				}
			},
			{
				"statusCode": 204,
				"action": async (response: Response) => {
					errorsForCurrencies.set([])
					currencies = []
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function reloadAccounts() {
		accounts = []
		await requestForAccounts({})
	}

	async function loadList() {
		const currentServerURL = get(globalContext.serverURL as any)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		isRequestingDependencies = true

		await requestForCurrencies({})
		while (lastDependencyOffset + 1 < totalNumberOfDependencies) {
			await requestForCurrencies({})
		}

		isRequestingDependencies = false
		await reloadAccounts()
	}

	onMount(loadList)

	function addAccount(event: CustomEvent<Account>) {
		const newAccount = event.detail
		accounts = [
			newAccount,
			...accounts
		]
	}

	function addAccounts(event: CustomEvent<unknown[]>) {
		const newAccounts = event.detail as Account[]
		accounts = [
			...accounts,
			...newAccounts
		]
	}

	function removeAccount(event: CustomEvent<Account>) {
		const oldAccount = event.detail
		accounts = accounts.filter(account => account.id !== oldAccount.id)
	}
</script>

<svelte:head>
	<title>Chart of Accounts</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Chart of Accounts</PrimaryHeading>
		</GridCell>
		<AddForm
			{currencies}
			isLoadingInitialData={$isConnectingForCurrencies}
			on:create={addAccount}/>
		<Collection
			{currencies}
			data={accounts}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnectingForAccounts || isRequestingDependencies}
			listError={$errorsForAccounts}
			on:delete={removeAccount}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnectingForAccounts || isRequestingDependencies}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadAccounts}
			on:addResources={addAccounts}/>
	</InnerGrid>
</ArticleGrid>
