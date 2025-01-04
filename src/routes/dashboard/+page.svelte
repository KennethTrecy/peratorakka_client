<script lang="ts">
import debounce from "lodash.debounce"

import type { ContextBundle } from "+/component"
import type { Currency, Formula, NumericalTool } from "+/entity"
import type { GeneralError, SearchMode, SortOrder, NumericalToolConclusion } from "+/rest"

import { get, writable, derived } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import loadAllDependencies from "$/rest/load_all_dependencies"
import makeJSONRequester from "$/rest/make_json_requester"
import parseNumericalTool from "$/utility/parse_numerical_tool"

import ArticleGrid from "$/layout/article_grid.svelte"
import DashboardCollection from "%/dashboard/collection.svelte"
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
let currencies: Currency[][] = []
let conclusions: (NumericalToolConclusion|null)[] = []

let searchMode: SearchMode = SEARCH_NORMALLY
let sortCriterion: string = "order"
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

let uncalculatedNumericalToolID: number|null = null
let abortController: AbortController|null = null
const partialCalculationPath = `${partialPath}/calculate`
const completeCalculationPath = writable(partialCalculationPath)
const { "errors": conclusionErrors, "send": loadConclusion } = makeJSONRequester({
	"path": completeCalculationPath,
	"defaultRequestConfiguration": {
		"method": "GET"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 200,
			"action": async (response: Response) => {
				const responseDocument = await response.json()
				const newCurrencies = [ ...currencies ]
				const newConclusions = [ ...conclusions ]
				const currentNumericalToolIndex = numericalTools.findIndex(
					numericalTool => numericalTool.id === uncalculatedNumericalToolID
				)

				if (currentNumericalToolIndex === -1) return

				newCurrencies[currentNumericalToolIndex] = responseDocument["currencies"] ?? []
				newConclusions[currentNumericalToolIndex] = responseDocument["@meta"]

				currencies = newCurrencies
				conclusions = newConclusions
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

const loadConclusionsFully = debounce(() => loadConclusions(), 1000)
async function loadConclusions() {
	const emptyConclusionIndex = conclusions.indexOf(null)
	if (emptyConclusionIndex === -1) return

	const targetNumericalToolID = numericalTools[emptyConclusionIndex].id
	uncalculatedNumericalToolID = targetNumericalToolID

	if (abortController !== null) abortController.abort()

	abortController = new AbortController()

	if (uncalculatedNumericalToolID !== null) {
		completeCalculationPath.set(`${partialCalculationPath}/${uncalculatedNumericalToolID}`)
	}

	await loadConclusion({
		"signal": abortController.signal
	})

	if ((emptyConclusionIndex + 1) !== conclusions.length) loadConclusionsFully()
}

const allErrors = derived(
	[ dependencyErrors, conclusionErrors, errors ],
	([ dependencyErrors, conclusionErrors, errors ]) => [
		...dependencyErrors,
		...conclusionErrors,
		...errors
	]
)

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

	await loadAllDependencies<Formula>(globalContext, [
		{
			"partialPath": "/api/v1/formulae",
			"mainSortCriterion": "name",
			"resourceKey": "formulae",
			"getResources": () => formulae,
			"setResources": newResources => { formulae = newResources }
		}
	], {
		"updateProgressRate": newProgressRate => { progressRate = newProgressRate },
		"updateErrors": newErrors => { dependencyErrors.set(newErrors) }
	})

	isRequestingDependencies = false
	await reloadNumericalTools()

	loadConclusionsFully()
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

$: {
	const numericalToolCount = numericalTools.length
	const conclusionCount = conclusions.length

	if (numericalToolCount > conclusionCount) {
		conclusions = [ ...conclusions, ...Array(numericalToolCount - conclusionCount).fill(null) ]
		currencies = [ ...currencies, ...Array(numericalToolCount - conclusionCount).fill([]) ]
	} else if (conclusionCount > numericalToolCount) {
		conclusions = Array(numericalToolCount).fill(null)
		currencies = Array(numericalToolCount).fill([])
	}

	if (numericalToolCount !== conclusionCount) loadConclusionsFully()
}
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Dashboard</PrimaryHeading>
		</GridCell>
		<DashboardCollection
			data={numericalTools}
			{formulae}
			{currencies}
			{conclusions}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting || isRequestingDependencies}
			{progressRate}
			listErrors={$allErrors}
			on:remove={removeNumericalTool}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting || isRequestingDependencies}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadNumericalTools}
			on:addResources={addNumericalTools}/>
	</InnerGrid>
</ArticleGrid>
