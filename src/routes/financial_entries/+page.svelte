<script lang="ts">
import type { Account, Currency, CashFlowActivity, FinancialEntry, Modifier } from "+/entity"
import type { ContextBundle } from "+/component"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import { get, writable, derived } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { ANY_ACCOUNT, ANY_MODIFIER, DEFAULT_MINIMUM_PROGRESS_RATE } from "#/component"
import { GLOBAL_CONTEXT } from "#/contexts"
import {
	SEARCH_NORMALLY,
	DESCENDING_ORDER,
	MAXIMUM_PAGINATED_LIST_LENGTH
} from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import loadAllDependencies from "$/rest/load_all_dependencies"
import makeDateFieldValue from "$/utility/make_date_field_value"
import makeJSONRequester from "$/rest/make_json_requester"

import AddForm from "%/financial_entries/add_form.svelte"
import ArticleGrid from "$/layout/article_grid.svelte"
import DataTable from "%/financial_entries/data_table.svelte"
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

const currentTransactedDate = makeDateFieldValue(new Date())
const lastDate =  new Date()
lastDate.setMonth(lastDate.getMonth() - 1)
const lastTransactedDate = makeDateFieldValue(lastDate)

let isRequestingDependencies = false

let currencies: Currency[] = []
let accounts: Account[] = []
let cashFlowActivities: CashFlowActivity[] = []
let modifiers: Modifier[] = []
let financialEntries: FinancialEntry[] = []

let beginDate: string = lastTransactedDate
let endDate: string = currentTransactedDate
let selectedAccountID: string = `${ANY_ACCOUNT.id}`
let selectedModifierID: string = `${ANY_MODIFIER.id}`
let searchMode: SearchMode = SEARCH_NORMALLY
let sortCriterion: string = "transacted_at"
let sortOrder: SortOrder = DESCENDING_ORDER
let lastOffset: number = 0
let progressRate = 0

const collectiveName = "financial_entries"
const partialPath = `/api/v1/${collectiveName}`
let parameters: [string, string][] = [
	[ "filter[search_mode]", searchMode as string ],
	[ "filter[begin_date]", beginDate as string ],
	[ "filter[end_date]", endDate as string ],
	[ "sort[0][0]", sortCriterion ],
	[ "sort[0][1]", sortOrder as string ],
	[ "sort[1][0]", "created_at" ],
	[ "sort[1][1]", sortOrder as string ]
]
let completePath = writable(partialPath)
$: {
	parameters = [
		[ "filter[search_mode]", searchMode as string ],
		[ "filter[begin_date]", beginDate as string ],
		[ "filter[end_date]", endDate as string ],
		[ "sort[0][0]", sortCriterion ],
		[ "sort[0][1]", sortOrder as string ],
		[ "sort[1][0]", "created_at" ],
		[ "sort[1][1]", sortOrder as string ]
	]

	if (selectedAccountID !== `${ANY_ACCOUNT.id}`) {
		parameters.push([ "filter[account_id]", selectedAccountID as string ])
	}

	if (selectedModifierID !== `${ANY_MODIFIER.id}`) {
		parameters.push([ "filter[modifier_id]", selectedModifierID as string ])
	}

	completePath.set(`${partialPath}?${
		new URLSearchParams([
			...parameters,
			[ "page[offset]", `${lastOffset}` ],
			[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
		]).toString()
	}`)
}

const dependencyErrors = writable([] as GeneralError[])

let {
	isConnecting,
	errors,
	send
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
				errors.set([])
				financialEntries = responseDocument[collectiveName]
				lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

const allErrors = derived([ dependencyErrors, errors ], ([ dependencyErrors, errors ]) => [
	...dependencyErrors,
	...errors
])

async function reloadFinancialEntries() {
	financialEntries = []
	await send({})
}

async function loadList() {
	const currentServerURL = get(globalContext.serverURL as any)

	if (currentServerURL === "") {
		setTimeout(loadList, 1000)
		return
	}

	isRequestingDependencies = true

	await loadAllDependencies(globalContext, [
		{
			"partialPath": "/api/v1/modifiers",
			"mainSortCriterion": "name",
			"resourceKey": "modifiers",
			"getResources": () => modifiers,
			"setResources": newResources => { modifiers = newResources },
			"getLinkedResources": () => [
				{
					"resourceKey": "currencies",
					"resources": currencies
				},
				{
					"resourceKey": "cash_flow_activities",
					"resources": cashFlowActivities
				},
				{
					"resourceKey": "accounts",
					"resources": accounts
				}
			],
			"setLinkedResources": newResources => {
				currencies = newResources[0] as Currency[]
				cashFlowActivities = newResources[1] as CashFlowActivity[]
				accounts = newResources[2] as Account[]
			}
		}
	], {
		"updateProgressRate": newProgressRate => { progressRate = newProgressRate },
		"updateErrors": newErrors => { dependencyErrors.set(newErrors) }
	})

	isRequestingDependencies = false
	await reloadFinancialEntries()
}

onMount(loadList)

function addFinancialEntry(event: CustomEvent<FinancialEntry>) {
	if (searchMode === "only_deleted") return

	const newFinancialEntry = event.detail
	financialEntries = [
		newFinancialEntry,
		...financialEntries
	]
}

function addFinancialEntries(event: CustomEvent<unknown[]>) {
	const newFinancialEntries = event.detail as FinancialEntry[]
	financialEntries = [
		...financialEntries,
		...newFinancialEntries
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
	<title>General Ledger</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>General Ledger</PrimaryHeading>
		</GridCell>
		<AddForm
			{currencies}
			{accounts}
			{modifiers}
			isLoadingInitialData={isRequestingDependencies}
			on:create={addFinancialEntry}/>
		<DataTable
			{currencies}
			{cashFlowActivities}
			{accounts}
			{modifiers}
			data={financialEntries}
			bind:beginDate={beginDate}
			bind:endDate={endDate}
			bind:selectedAccountID={selectedAccountID}
			bind:selectedModifierID={selectedModifierID}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting || isRequestingDependencies}
			{progressRate}
			listErrors={$allErrors}
			on:remove={removeFinancialEntry}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting || isRequestingDependencies}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadFinancialEntries}
			on:addResources={addFinancialEntries}/>
	</InnerGrid>
</ArticleGrid>
