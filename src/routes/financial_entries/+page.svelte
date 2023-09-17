<script lang="ts">
	import type { RequesterConstraints, SearchMode, SortOrder } from "+/rest"
	import type { Account, Currency, Modifier, FinancialEntry } from "+/entity"

	import debounce from "lodash.debounce"
	import { get } from "svelte/store"
	import { onMount } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
		mustHaveToken,
		mustHaveAccessToken,
		mustBeAuthenticatedUser
	} from "$/global_state"

	import AddForm from "%/financial_entries/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import DataTable from "%/financial_entries/data_table.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PrimaryHeading from "$/typography/primary_heading.svelte"
	import { SEARCH_NORMALLY, DESCENDING_ORDER } from "#/rest";

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
	let financialEntries: FinancialEntry[] = []

	let searchMode: SearchMode = SEARCH_NORMALLY
	let sortCriterion: string = "transacted_at"
	let sortOrder: SortOrder = DESCENDING_ORDER
	let lastOffset: number = 0

	let financialEntryConstraints: RequesterConstraints = {
		"path": "/api/v1/financial_entries",
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForFinancialEntries.set([])
					financialEntries = responseDocument.financial_entries
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	}

	let {
		"isConnecting": isConnectingForFinancialEntries,
		"errors": errorsForFinancialEntries,
		"send": requestForFinancialEntries
	} = makeJSONRequester(financialEntryConstraints)

	let {
		"isConnecting": isConnectingForModifiers,
		"errors": errorsForModifiers,
		"send": requestForModifiers
	} = makeJSONRequester({
		"path": "/api/v1/modifiers",
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForModifiers.set([])
					currencies = responseDocument.currencies
					accounts = responseDocument.accounts
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

	let abortController: AbortController|null = null

	async function loadFinancialEntries() {
		if (abortController !== null) abortController.abort()

		abortController = new AbortController()

		await requestForFinancialEntries({
			"signal": abortController.signal
		})
	}

	const reloadFinancialEntries = debounce(loadFinancialEntries, 500)


	$: {
		const path = `/api/v1/financial_entries?${
			new URLSearchParams([
				[ "filter[search_mode]", searchMode as string ],
				[ "sort[0][0]", sortCriterion ],
				[ "sort[0][1]", sortOrder as string ],
				[ "page[offset]", `${lastOffset}` ],
				[ "page[limit]", "20" ]
			]).toString()
		}`

		financialEntryConstraints.path = path
		reloadFinancialEntries()
	}

	async function loadList() {
		const currentServerURL = get(serverURL)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		reloadFinancialEntries()
		await requestForModifiers({})
	}

	onMount(loadList)

	function addFinancialEntry(event: CustomEvent<FinancialEntry>) {
		const newFinancialEntry = event.detail
		financialEntries = [
			...financialEntries,
			newFinancialEntry
		]
	}

	function removeFinancialEntry(event: CustomEvent<FinancialEntry>) {
		const oldFinancialEntry = event.detail
		financialEntries = financialEntries.filter(
			financialEntry => financialEntry.id !== oldFinancialEntry.id
		)
	}
</script>

<svelte:head>
	<title>Financial Entries</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Financial Entries</PrimaryHeading>
		</GridCell>
		<AddForm
			{currencies}
			{accounts}
			{modifiers}
			isLoadingInitialData={$isConnectingForModifiers}
			on:create={addFinancialEntry}/>
		<DataTable
			{currencies}
			{accounts}
			{modifiers}
			data={financialEntries}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnectingForFinancialEntries}
			listError={$errorsForFinancialEntries}
			on:delete={removeFinancialEntry}/>
	</InnerGrid>
</ArticleGrid>
