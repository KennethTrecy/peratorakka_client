<script lang="ts">
import type { ContextBundle } from "+/component"
import type { Account, AccountCollection, Currency, Collection } from "+/entity"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import { get, writable, derived } from "svelte/store"
import { onMount, getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import loadAllDependencies from "$/rest/load_all_dependencies"
import makeJSONRequester from "$/rest/make_json_requester"

import AddForm from "%/collections/add_form.svelte"
import AddLinkForm from "%/collections/add_link_form.svelte"
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

let isRequestingDependencies = true

let selectedCollection: Collection|null
let collections: Collection[] = []
let currencies: Currency[] = []
let accounts: Account[] = []
let accountCollections: AccountCollection[] = []

let searchMode: SearchMode = SEARCH_NORMALLY
let sortCriterion: string = "name"
let sortOrder: SortOrder = ASCENDING_ORDER
let lastOffset: number = 0
let progressRate = 0

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
				collections = responseDocument[collectiveName]
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

async function reloadCollections() {
	collections = []
	await send({})
}

async function loadList() {
	const currentServerURL = get(globalContext.serverURL as any)

	if (currentServerURL === "") {
		setTimeout(loadList, 1000)
		return
	}

	isRequestingDependencies = true

	await loadAllDependencies<Account|AccountCollection>(globalContext, [
		{
			"partialPath": "/api/v1/account_collections",
			"mainSortCriterion": "name",
			"resourceKey": "account_collections",
			"getResources": () => accountCollections,
			"setResources": (
				(newResources: AccountCollection[]) => { accountCollections = newResources }
			) as (newResources: (Account|AccountCollection)[]) => void
		},
		{
			"partialPath": "/api/v1/accounts",
			"mainSortCriterion": "name",
			"resourceKey": "accounts",
			"getResources": () => accounts,
			"setResources": (
				(newResources: Account[]) => { accounts = newResources }
			) as (newResources: (Account|AccountCollection)[]) => void,
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
	await reloadCollections()
}

onMount(loadList)

function addCollection(event: CustomEvent<Collection>) {
	if (searchMode === "only_deleted") return

	const newCollection = event.detail
	collections = [
		newCollection,
		...collections
	]
}

function addCollections(event: CustomEvent<unknown[]>) {
	const newCollections = event.detail as Collection[]
	collections = [
		...collections,
		...newCollections
	]
}

function removeCollection(event: CustomEvent<Collection>) {
	const oldCollection = event.detail
	collections = collections.filter(collection => collection.id !== oldCollection.id)
}

function addAccountCollection(event: CustomEvent<AccountCollection>) {
	const newAccountCollection = event.detail
	accountCollections = [
		newAccountCollection,
		...accountCollections
	]
}

function removeAccountCollection(event: CustomEvent<Collection>) {
	const oldAccountCollection = event.detail
	accountCollections = accountCollections.filter(
		accountCollection => accountCollection.id !== oldAccountCollection.id
	)
}

$: linkedAccountCollectionIDs = (
	selectedCollection === null
		? []
		: accountCollections.filter(
			accountCollection => accountCollection.collection_id === selectedCollection.id
		)
).map(accountCollection => accountCollection.account_id)
$: linkedAccounts = accounts.filter(account => linkedAccountCollectionIDs.includes(account.id))
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
			data={collections}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting}
			{progressRate}
			listErrors={$allErrors}
			on:remove={removeCollection}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadCollections}
			on:addResources={addCollections}/>
		{#if selectedCollection !== null}
			<AddLinkForm
				collection={selectedCollection}
				{currencies}
				{accounts}
				{linkedAccounts}
				isLoadingInitialData={isRequestingDependencies}
				on:create={addAccountCollection}/>
		{/if}
	</InnerGrid>
</ArticleGrid>
