<script lang="ts">
import type { ContextBundle } from "+/component"
import type { PrecisionFormat } from "+/entity"
import type { SearchMode, SortOrder } from "+/rest"

import { get, writable } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import makeJSONRequester from "$/rest/make_json_requester"

import AddForm from "%/precision_formats/add_form.svelte"
import ArticleGrid from "$/layout/article_grid.svelte"
import Collection from "%/precision_formats/collection.svelte"
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

let precisionFormats: PrecisionFormat[] = []

let searchMode: SearchMode = SEARCH_NORMALLY
let sortCriterion: string = "name"
let sortOrder: SortOrder = ASCENDING_ORDER
let lastOffset: number = 0

const collectiveName = "precision_formats"
const partialPath = `/api/v2/${collectiveName}`
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
				precisionFormats = responseDocument[collectiveName]
				lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

async function reloadPrecisionFormats() {
	precisionFormats = []
	await send({})
}

async function loadList() {
	const currentServerURL = get(globalContext.serverURL as any)

	if (currentServerURL === "") {
		setTimeout(loadList, 1000)
		return
	}

	await reloadPrecisionFormats()
}

onMount(loadList)

function addPrecisionFormat(event: CustomEvent<PrecisionFormat>) {
	if (searchMode === "only_deleted") return

	const newPrecisionFormat = event.detail
	precisionFormats = [
		newPrecisionFormat,
		...precisionFormats
	]
}

function addPrecisionFormats(event: CustomEvent<unknown[]>) {
	const newPrecisionFormats = event.detail as PrecisionFormat[]
	precisionFormats = [
		...precisionFormats,
		...newPrecisionFormats
	]
}

function removePrecisionFormat(event: CustomEvent<PrecisionFormat>) {
	const oldPrecisionFormat = event.detail
	precisionFormats = precisionFormats.filter(
		precisionFormat => precisionFormat.id !== oldPrecisionFormat.id
	)
}
</script>

<svelte:head>
	<title>Precision Formats</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Precision Formats</PrimaryHeading>
		</GridCell>
		<AddForm on:create={addPrecisionFormat}/>
		<Collection
			data={precisionFormats}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting}
			listErrors={$errors}
			on:remove={removePrecisionFormat}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadPrecisionFormats}
			on:addResources={addPrecisionFormats}/>
	</InnerGrid>
</ArticleGrid>
