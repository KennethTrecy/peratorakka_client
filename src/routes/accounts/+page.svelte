<script lang="ts">
	import type { Account, Currency } from "+/entity"
	import type { ContextBundle } from "+/component"
	import type { SearchMode, SortOrder } from "+/rest"

	import { get, writable } from "svelte/store"
	import { onMount, getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { GLOBAL_CONTEXT } from "#/contexts"
	import { SEARCH_NORMALLY, ASCENDING_ORDER } from "#/rest"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL
	} from "$/global_state"

	import AddForm from "%/accounts/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import Collection from "%/accounts/collection.svelte"
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
	let accounts: Account[] = []

	let isInClient = false
	let searchMode: SearchMode = SEARCH_NORMALLY
	let sortCriterion: string = "name"
	let sortOrder: SortOrder = ASCENDING_ORDER

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
				...parameters
			]).toString()
		}`)

		if (isInClient) reloadAccounts()
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
					accounts = responseDocument.accounts
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	let {
		"isConnecting": isConnectingForCurrencies,
		"errors": errorsForCurrencies,
		"send": requestForCurrencies
	} = makeJSONRequester({
		"path": `/api/v1/currencies?${
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
					errorsForCurrencies.set([])
					currencies = responseDocument.currencies
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
		const currentServerURL = get(serverURL)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		await requestForCurrencies({})
		await reloadAccounts()
		isInClient = true
	}

	onMount(loadList)

	function addAccount(event: CustomEvent<Account>) {
		const newAccount = event.detail
		accounts = [
			newAccount,
			...accounts
		]
	}

	function removeAccount(event: CustomEvent<Account>) {
		const oldAccount = event.detail
		accounts = accounts.filter(account => account.id !== oldAccount.id)
	}
</script>

<svelte:head>
	<title>Financial Accounts</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Financial Accounts</PrimaryHeading>
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
			isConnecting={$isConnectingForAccounts}
			listError={$errorsForAccounts}
			on:delete={removeAccount}/>
	</InnerGrid>
</ArticleGrid>
