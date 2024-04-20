<script lang="ts">
	import type { Account, Currency, FrozenPeriod, SummaryCalculation } from "+/entity"
	import type { ContextBundle } from "+/component"
	import type { GeneralError, FinancialStatementGroup } from "+/rest"

	import { get, writable } from "svelte/store"
	import { onMount, getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { GLOBAL_CONTEXT } from "#/contexts"

	import assertAuthentication from "$/page_requirement/assert_authentication"
	import makeJSONRequester from "$/rest/make_json_requester"

	import AddForm from "%/frozen_periods/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import DataTable from "%/frozen_periods/data_table.svelte"
	import FinancialStatements from "%/frozen_periods/financial_statements.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PrimaryHeading from "$/typography/primary_heading.svelte"

	const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

	assertAuthentication(globalContext, {
		afterNavigate,
		beforeNavigate,
		goto
	})

	let frozenPeriods: FrozenPeriod[] = []

	let {
		"isConnecting": isConnectingForFrozenPeriods,
		"errors": errorsForFrozenPeriods,
		"send": requestForFrozenPeriods
	} = makeJSONRequester({
		"path": "/api/v1/frozen_periods",
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForFrozenPeriods.set([])
					frozenPeriods = responseDocument.frozen_periods
					summaryCalculations = responseDocument.summary_calculations
					accounts = responseDocument.accounts
					currencies = responseDocument.currencies
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	let currencies: Currency[] = []
	let accounts: Account[] = []
	let summaryCalculations: SummaryCalculation[] = []
	let statements: FinancialStatementGroup[] = []

	let chosenPeriod: FrozenPeriod|null = null
	let isConnectingToShow = writable<boolean>(false)
	let showErrors = writable<GeneralError[]>([])
	$: {
		if (chosenPeriod !== null) {
			const requesterInfo = makeJSONRequester({
				"path": `/api/v1/frozen_periods/${chosenPeriod.id}`,
				"defaultRequestConfiguration": {
					"method": "GET",
				},
				"manualResponseHandlers": [
					{
						"statusCode": 200,
						"action": async (response: Response) => {
							const document = await response.json()
							currencies = document.currencies
							accounts = document.accounts
							summaryCalculations = document.summary_calculations
							statements = document["@meta"].statements

							showErrors.set([])
						}
					}
				],
				"expectedErrorStatusCodes": [ 400 ]
			})

			isConnectingToShow = requesterInfo.isConnecting
			showErrors = requesterInfo.errors
			requesterInfo.send({})
		}
	}

	$: startedAt = (chosenPeriod?.started_at || "----------").slice(0, "YYYY-MM-DD".length)
	$: finishedAt = (chosenPeriod?.finished_at || "----------").slice(0, "YYYY-MM-DD".length)

	async function loadList() {
		const currentServerURL = get(globalContext.serverURL as any)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		await requestForFrozenPeriods({})
	}

	onMount(loadList)

	function addFrozenPeriod(event: CustomEvent<FrozenPeriod>) {
		const newFrozenPeriod = event.detail
		frozenPeriods = [
			...frozenPeriods,
			newFrozenPeriod
		]
	}

	function removeFrozenPeriod(event: CustomEvent<FrozenPeriod>) {
		const oldFrozenPeriod = event.detail
		frozenPeriods = frozenPeriods.filter(
			frozenPeriod => frozenPeriod.id !== oldFrozenPeriod.id
		)
	}

	function checkFrozenPeriod(event: CustomEvent<FrozenPeriod>) {
		const selectedFrozenPeriod = event.detail
		chosenPeriod = selectedFrozenPeriod
	}
</script>

<svelte:head>
	<title>Frozen Periods</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Frozen Periods</PrimaryHeading>
		</GridCell>
		<AddForm
			isLoadingInitialData={$isConnectingForFrozenPeriods}
			on:create={addFrozenPeriod}/>
		<DataTable
			isConnecting={$isConnectingForFrozenPeriods}
			data={frozenPeriods}
			on:delete={removeFrozenPeriod}
			on:check={checkFrozenPeriod}/>
		{#if chosenPeriod !== null && currencies}
			<FinancialStatements
				isConnecting={$isConnectingToShow}
				startedAt={startedAt}
				finishedAt={finishedAt}
				{statements}
				{accounts}
				{currencies}
				data={summaryCalculations}>
				<svelte:fragment slot="empty_collection_description">
					There are no financial statements at the chosen date range. Please check another range.
				</svelte:fragment>
			</FinancialStatements>
		{/if}
	</InnerGrid>
</ArticleGrid>
