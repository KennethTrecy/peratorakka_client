<script lang="ts">
	import type { Account, Currency, Modifier, FinancialEntry } from "+/entity"

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

	let {
		"isConnecting": isConnectingForFinancialEntries,
		"errors": errorsForFinancialEntries,
		"send": requestForFinancialEntries
	} = makeJSONRequester({
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
	})

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

	async function loadList() {
		const currentServerURL = get(serverURL)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		await requestForFinancialEntries({})
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
			isConnecting={$isConnectingForFinancialEntries}
			on:delete={removeFinancialEntry}/>
	</InnerGrid>
</ArticleGrid>
