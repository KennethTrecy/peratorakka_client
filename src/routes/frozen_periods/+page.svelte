<script lang="ts">
import type {
	Account,
	Currency,
	CashFlowActivity,
	FrozenPeriod,
	SummaryCalculation,
	FlowCalculation
} from "+/entity"
import type { ContextBundle } from "+/component"
import type { GeneralError, FinancialStatementGroup, ExchangeRateInfo, SortOrder } from "+/rest"

import { get, writable } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { DESCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import makeJSONRequester from "$/rest/make_json_requester"

import AddForm from "%/frozen_periods/add_form.svelte"
import ArticleGrid from "$/layout/article_grid.svelte"
import DataTable from "%/frozen_periods/data_table.svelte"
import ExtraResourceLoader from "$/catalog/extra_resource_loader.svelte"
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

let sortCriterion: string = "started_at"
let sortOrder: SortOrder = DESCENDING_ORDER
let lastOffset: number = 0

const collectiveName = "frozen_periods"
const partialPath = `/api/v1/${collectiveName}`
let parameters: [string, string][] = [
	[ "sort[0][0]", sortCriterion ],
	[ "sort[0][1]", sortOrder as string ]
]
let completePath = writable(partialPath)
$: {
	parameters = [
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
	"isConnecting": isConnectingForFrozenPeriods,
	"errors": errorsForFrozenPeriods,
	"send": requestForFrozenPeriods
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
				errorsForFrozenPeriods.set([])
				frozenPeriods = responseDocument.frozen_periods
				summaryCalculations = responseDocument.summary_calculations
				accounts = responseDocument.accounts
				currencies = responseDocument.currencies
				lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

let currencies: Currency[] = []
let cashFlowActivities: CashFlowActivity[] = []
let accounts: Account[] = []
let summaryCalculations: SummaryCalculation[] = []
let flowCalculations: FlowCalculation[] = []
let statements: FinancialStatementGroup[] = []
let exchangeRates: ExchangeRateInfo[] = []

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
						const responseDocument = await response.json()
						currencies = responseDocument.currencies
						cashFlowActivities = responseDocument.cash_flow_activities
						accounts = responseDocument.accounts
						summaryCalculations = responseDocument.summary_calculations
						flowCalculations = responseDocument.flow_calculations
						statements = responseDocument["@meta"].statements
						exchangeRates = responseDocument["@meta"].exchange_rates

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

async function reloadFrozenPeriods() {
	frozenPeriods = []
	await requestForFrozenPeriods({})
}

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

function addFrozenPeriods(event: CustomEvent<unknown[]>) {
	const newFrozenPeriods = event.detail as FrozenPeriod[]

	frozenPeriods = [
		...frozenPeriods,
		...newFrozenPeriods
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
			on:remove={removeFrozenPeriod}
			on:check={checkFrozenPeriod}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnectingForFrozenPeriods}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadFrozenPeriods}
			on:addResources={addFrozenPeriods}/>
		{#if chosenPeriod !== null && currencies}
			<FinancialStatements
				isConnecting={$isConnectingToShow}
				startedAt={startedAt}
				finishedAt={finishedAt}
				{statements}
				{exchangeRates}
				{accounts}
				{currencies}
				{cashFlowActivities}
				{summaryCalculations}
				{flowCalculations}>
				<svelte:fragment slot="empty_collection_description">
					There are no financial statements at the chosen date range. Please check another range.
				</svelte:fragment>
			</FinancialStatements>
		{/if}
	</InnerGrid>
</ArticleGrid>
