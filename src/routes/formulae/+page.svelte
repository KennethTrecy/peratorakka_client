<script lang="ts">
import type { Formula, Currency } from "+/entity"
import type { ContextBundle } from "+/component"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import { get, writable, derived } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import {
	SEARCH_NORMALLY,
	ASCENDING_ORDER,
	MAXIMUM_PAGINATED_LIST_LENGTH
} from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import loadAllDependencies from "$/rest/load_all_dependencies"
import makeJSONRequester from "$/rest/make_json_requester"

import AddForm from "%/formulae/add_form.svelte"
import ArticleGrid from "$/layout/article_grid.svelte"
import Collection from "%/formulae/collection.svelte"
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
let formulae: Formula[] = []

let searchMode: SearchMode = SEARCH_NORMALLY
let sortCriterion: string = "name"
let sortOrder: SortOrder = ASCENDING_ORDER
let lastOffset: number = 0
let progressRate = 0

const collectiveName = "formulae"
const partialPath = `/api/v1/${collectiveName}`
let parameters: [string, string][] = [
	[ "filter[search_mode]", searchMode as string ],
	[ "sort[0][0]", sortCriterion ],
	[ "sort[0][1]", sortOrder as string ]
]
const completePath = writable(partialPath)
$: {
	parameters = [
		[ "filter[search_mode]", searchMode as string ],
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
				formulae = responseDocument[collectiveName]
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

async function reloadFormulae() {
	formulae = []
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
			"partialPath": "/api/v1/currencies",
			"mainSortCriterion": "name",
			"resourceKey": "currencies",
			"getResources": () => currencies,
			"setResources": newResources => { currencies = newResources }
		}
	], {
		"updateProgressRate": newProgressRate => { progressRate = newProgressRate },
		"updateErrors": newErrors => { dependencyErrors.set(newErrors) }
	})

	isRequestingDependencies = false
	await reloadFormulae()
}

onMount(loadList)

function addFormula(event: CustomEvent<Formula>) {
	if (searchMode === "only_deleted") return

	const newFormula = event.detail
	formulae = [
		newFormula,
		...formulae
	]
}

function addFormulae(event: CustomEvent<unknown[]>) {
	const newFormulae = event.detail as Formula[]
	formulae = [
		...formulae,
		...newFormulae
	]
}

function removeFormula(event: CustomEvent<Formula>) {
	const oldFormula = event.detail
	formulae = formulae.filter(account => account.id !== oldFormula.id)
}

</script>

<svelte:head>
	<title>Formulae</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Formulae</PrimaryHeading>
		</GridCell>
		<AddForm
			{currencies}
			isLoadingInitialData={isRequestingDependencies}
			on:create={addFormula}/>
		<Collection
			{currencies}
			data={formulae}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting || isRequestingDependencies}
			listErrors={$allErrors}
			on:remove={removeFormula}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting || isRequestingDependencies}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadFormulae}
			on:addResources={addFormulae}/>
	</InnerGrid>
</ArticleGrid>
