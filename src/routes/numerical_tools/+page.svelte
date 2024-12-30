<script lang="ts">
import type { ContextBundle } from "+/component"
import type { Collection, Currency, Formula, NumericalTool } from "+/entity"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import { get, writable, derived } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import loadAllDependencies from "$/rest/load_all_dependencies"
import makeJSONRequester from "$/rest/make_json_requester"
import parseNumericalTool from "$/utility/parse_numerical_tool"

import AddForm from "%/numerical_tools/add_form.svelte"
import ArticleGrid from "$/layout/article_grid.svelte"
import NumericalToolCollection from "%/numerical_tools/collection.svelte"
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

let numericalTools: NumericalTool[] = []
let formulae: Formula[] = []
let collections: Collection[] = []
let currencies: Currency[] = []

let searchMode: SearchMode = SEARCH_NORMALLY
let sortCriterion: string = "name"
let sortOrder: SortOrder = ASCENDING_ORDER
let lastOffset: number = 0
let progressRate = 0

const collectiveName = "numerical_tools"
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

const dependencyErrors = writable([] as GeneralError[])

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
				numericalTools = responseDocument[collectiveName].map(parseNumericalTool)
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

async function reloadNumericalTools() {
	numericalTools = []
	await send({})
}

async function loadList() {
	const currentServerURL = get(globalContext.serverURL as any)

	if (currentServerURL === "") {
		setTimeout(loadList, 1000)
		return
	}

	isRequestingDependencies = true

	await loadAllDependencies<Currency|Collection|Formula>(globalContext, [
		{
			"partialPath": "/api/v1/formulae",
			"mainSortCriterion": "name",
			"resourceKey": "formulae",
			"getResources": () => formulae,
			"setResources": newResources => { formulae = newResources as Formula[] }
		},
		{
			"partialPath": "/api/v1/collections",
			"mainSortCriterion": "name",
			"resourceKey": "collections",
			"getResources": () => collections,
			"setResources": newResources => { collections = newResources as Collection[] }
		},
		{
			"partialPath": "/api/v1/currencies",
			"mainSortCriterion": "name",
			"resourceKey": "currencies",
			"getResources": () => currencies,
			"setResources": newResources => { currencies = newResources as Currency[] }
		}
	], {
		"updateProgressRate": newProgressRate => { progressRate = newProgressRate },
		"updateErrors": newErrors => { dependencyErrors.set(newErrors) }
	})

	isRequestingDependencies = false
	await reloadNumericalTools()
}

onMount(loadList)

function addNumericalTool(event: CustomEvent<NumericalTool>) {
	if (searchMode === "only_deleted") return

	const newNumericalTool = parseNumericalTool(event.detail)
	numericalTools = [
		newNumericalTool,
		...numericalTools
	]
}

function addNumericalTools(event: CustomEvent<unknown[]>) {
	const newNumericalTools = event.detail as NumericalTool[]
	numericalTools = [
		...numericalTools,
		...newNumericalTools.map(parseNumericalTool)
	]
}

function removeNumericalTool(event: CustomEvent<NumericalTool>) {
	const oldNumericalTool = event.detail
	numericalTools = numericalTools.filter(numericalTool => numericalTool.id !== oldNumericalTool.id)
}
</script>

<svelte:head>
	<title>Numerical Tools</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Numerical Tools</PrimaryHeading>
		</GridCell>
		<AddForm
			{formulae}
			{collections}
			{currencies}
			isLoadingInitialData={isRequestingDependencies}
			on:create={addNumericalTool}/>
		<NumericalToolCollection
			data={numericalTools}
			{formulae}
			{currencies}
			{collections}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting}
			{progressRate}
			listErrors={$allErrors}
			on:remove={removeNumericalTool}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadNumericalTools}
			on:addResources={addNumericalTools}/>
	</InnerGrid>
</ArticleGrid>
