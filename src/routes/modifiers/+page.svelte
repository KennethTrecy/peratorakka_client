<script lang="ts">
import type { Account, CashFlowActivity, Currency, Modifier } from "+/entity"
import type { ContextBundle } from "+/component"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import { get, writable, derived } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { DEFAULT_MINIMUM_PROGRESS_RATE, NO_CASH_FLOW_ACTIVITY } from "#/component"
import { GLOBAL_CONTEXT } from "#/contexts"
import {
	SEARCH_NORMALLY,
	ASCENDING_ORDER,
	MAXIMUM_PAGINATED_LIST_LENGTH
} from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import loadAllDependencies from "$/rest/load_all_dependencies"
import makeJSONRequester from "$/rest/make_json_requester"

import AddForm from "%/modifiers/add_form.svelte"
import ArticleGrid from "$/layout/article_grid.svelte"
import Collection from "%/modifiers/collection.svelte"
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
let cashFlowActivities: CashFlowActivity[] = []
let accounts: Account[] = []
let modifiers: Modifier[] = []

let searchMode: SearchMode = SEARCH_NORMALLY
let sortCriterion: string = "name"
let sortOrder: SortOrder = ASCENDING_ORDER
let lastOffset: number = 0
let progressRate = 0

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
				modifiers = responseDocument[collectiveName]
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

async function reloadModifiers() {
	modifiers = []
	await send({})
}

async function loadList() {
	const currentServerURL = get(globalContext.serverURL as any)

	if (currentServerURL === "") {
		setTimeout(loadList, 1000)
		return
	}

	isRequestingDependencies = true

	await loadAllDependencies<CashFlowActivity|Account>(globalContext, [
		{
			"partialPath": "/api/v1/cash_flow_activities",
			"mainSortCriterion": "name",
			"resourceKey": "cash_flow_activities",
			"getResources": () => cashFlowActivities,
			"setResources": (newResources: CashFlowActivity[]) => { cashFlowActivities = newResources }
		},
		{
			"partialPath": "/api/v1/accounts",
			"mainSortCriterion": "name",
			"resourceKey": "accounts",
			"getResources": () => accounts,
			"setResources": (
				(newResources: Account[]) => { accounts = newResources }
			) as (newResources: (Account|CashFlowActivity)[]) => void,
			"getLinkedResources": () => [
				{
					"resourceKey": "currencies",
					"resources": currencies
				}
			],
			"setLinkedResources": newResources => {
				currencies = newResources[0] as Currency[]
			}
		}
	], {
		"updateProgressRate": newProgressRate => { progressRate = newProgressRate },
		"updateErrors": newErrors => { dependencyErrors.set(newErrors) }
	})

	isRequestingDependencies = false
	await reloadModifiers()
}

onMount(loadList)

function addModifier(event: CustomEvent<Modifier>) {
	if (searchMode === "only_deleted") return

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

$: selectableCashFlowActivities = [
	NO_CASH_FLOW_ACTIVITY,
	...cashFlowActivities
]
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
			cashFlowActivities={selectableCashFlowActivities}
			isLoadingInitialData={isRequestingDependencies}
			on:create={addModifier}/>
		<Collection
			{currencies}
			cashFlowActivities={selectableCashFlowActivities}
			{accounts}
			data={modifiers}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting || isRequestingDependencies}
			{progressRate}
			listErrors={$allErrors}
			on:remove={removeModifier}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting || isRequestingDependencies}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadModifiers}
			on:addResources={addModifiers}/>
	</InnerGrid>
</ArticleGrid>
