<script lang="ts">
import type { ContextBundle } from "+/component"
import type { Collection } from "+/entity"
import type { SearchMode, SortOrder } from "+/rest"

import { get, writable } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import makeJSONRequester from "$/rest/make_json_requester"

import AddForm from "%/collections/add_form.svelte"
import ArticleGrid from "$/layout/article_grid.svelte"
import CollectionCollection from "%/collections/collection.svelte"
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

let collection: Collection[] = []

let searchMode: SearchMode = SEARCH_NORMALLY
let sortCriterion: string = "name"
let sortOrder: SortOrder = ASCENDING_ORDER
let lastOffset: number = 0

const collectiveName = "collections"
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
				collection = responseDocument[collectiveName]
				lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

async function reloadCollections() {
	collection = []
	await send({})
}

async function loadList() {
	const currentServerURL = get(globalContext.serverURL as any)

	if (currentServerURL === "") {
		setTimeout(loadList, 1000)
		return
	}

	await reloadCollections()
}

onMount(loadList)

function addCollection(event: CustomEvent<Collection>) {
	if (searchMode === "only_deleted") return

	const newCollection = event.detail
	collection = [
		newCollection,
		...collection
	]
}

function addCollections(event: CustomEvent<unknown[]>) {
	const newCollections = event.detail as Collection[]
	collection = [
		...collection,
		...newCollections
	]
}

function removeCollection(event: CustomEvent<Collection>) {
	const oldCollection = event.detail
	collection = collection.filter(currency => currency.id !== oldCollection.id)
}
</script>

<svelte:head>
	<title>Collections</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Collections</PrimaryHeading>
		</GridCell>
		<AddForm on:create={addCollection}/>
		<CollectionCollection
			data={collection}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting}
			listErrors={$errors}
			on:remove={removeCollection}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadCollections}
			on:addResources={addCollections}/>
	</InnerGrid>
</ArticleGrid>
