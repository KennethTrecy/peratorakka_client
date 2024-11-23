<script lang="ts">
import type { ContextBundle } from "+/component"
import type { CashFlowActivity } from "+/entity"
import type { SearchMode, SortOrder } from "+/rest"

import { get, writable } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import makeJSONRequester from "$/rest/make_json_requester"

import AddForm from "%/cash_flow_activities/add_form.svelte"
import ArticleGrid from "$/layout/article_grid.svelte"
import Collection from "%/cash_flow_activities/collection.svelte"
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

let cashFlowActivities: CashFlowActivity[] = []

let searchMode: SearchMode = SEARCH_NORMALLY
let sortCriterion: string = "name"
let sortOrder: SortOrder = ASCENDING_ORDER
let lastOffset: number = 0

const collectiveName = "cash_flow_activities"
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
		[ "sort[0][1]", sortOrder as string ],
	]

	completePath.set(`${partialPath}?${
		new URLSearchParams([
			...parameters,
			[ "page[offset]", `${lastOffset}` ],
			[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
		]).toString()
	}`)
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
				cashFlowActivities = responseDocument[collectiveName]
				lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

async function reloadCashFlowActivities() {
	cashFlowActivities = []
	await send({})
}

async function loadList() {
	const currentServerURL = get(globalContext.serverURL as any)

	if (currentServerURL === "") {
		setTimeout(loadList, 1000)
		return
	}

	await reloadCashFlowActivities()
}

onMount(loadList)

function addCashFlowActivity(event: CustomEvent<CashFlowActivity>) {
	if (searchMode === "only_deleted") return

	const newCashFlowActivities = event.detail
	cashFlowActivities = [
		newCashFlowActivities,
		...cashFlowActivities
	]
}

function addCashFlowActivities(event: CustomEvent<unknown[]>) {
	const newCashFlowActivities = event.detail as CashFlowActivity[]
	cashFlowActivities = [
		...cashFlowActivities,
		...newCashFlowActivities
	]
}

function removeCashFlowActivities(event: CustomEvent<CashFlowActivity>) {
	const oldCashFlowActivity = event.detail
	cashFlowActivities = cashFlowActivities.filter(
		cashFlowActivity => cashFlowActivity.id !== oldCashFlowActivity.id
	)
}
</script>

<svelte:head>
	<title>Cash Flow Activities</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Cash Flow Activities</PrimaryHeading>
		</GridCell>
		<AddForm on:create={addCashFlowActivity}/>
		<Collection
			data={cashFlowActivities}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting}
			listErrors={$errors}
			on:remove={removeCashFlowActivities}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadCashFlowActivities}
			on:addResources={addCashFlowActivities}/>
	</InnerGrid>
</ArticleGrid>
