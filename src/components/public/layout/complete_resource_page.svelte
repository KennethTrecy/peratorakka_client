<script lang="ts">
import type { Snippet } from "svelte"
import type { ContextBundle, ResourceDependencyInfo, HighResourceDependencyInfo } from "+/component"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"
import type { RestorableEntity } from "+/entity"

import { get, writable, derived as deriveStore } from "svelte/store"
import { onMount, getContext, untrack } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import loadAllDependencies from "$/rest/load_all_dependencies"
import makeJSONRequester from "$/rest/make_json_requester"

import ArticleGrid from "$/layout/article_grid.svelte"
import CatalogBase from "$/catalog/base.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import ExtraResourceLoader from "$/catalog/extra_resource_loader.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import InnerGrid from "$/layout/inner_grid.svelte"
import InteractiveContainer from "$/layout/interactive_container.svelte"
import ListSpecifier from "$/form/list_specifier.svelte"
import PrimaryHeading from "$/typography/primary_heading.svelte"
import ReactiveProgressBar from "$/utility/reactive_progress_bar.svelte"
import SecondaryHeading from "$/typography/secondary_heading.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

let {
	pageTitle,
	createTitle,
	listTitle,
	collectiveName,
	defaultSortCriterion,
	availableSortCriteria,
	additionalListParameters = [],
	dependencies = [],
	dependencyInfos = [],
	deriveID,
	makeNewResourceObject,
	processCreatedResourceObject,
	processListResourceObject = () => {},
	description,
	form,
	requirement,
	custom_list_specifiers,
	filled_collection_description,
	"empty_collection_description": empty_collection_description_child,
	collection_items
}: {
	pageTitle: string
	createTitle: string
	listTitle: string
	collectiveName: string
	defaultSortCriterion: string
	availableSortCriteria: string[]
	additionalListParameters?: [string, string][]
	dependencyInfos?: (
		ResourceDependencyInfo<RestorableEntity>
		|HighResourceDependencyInfo<RestorableEntity>
	)[]
	dependencies?: unknown[][]
	deriveID: (resource: unknown) => string
	makeNewResourceObject: () => Record<string, unknown>
	processCreatedResourceObject: (document: Record<string, unknown>) => unknown
	processListResourceObject?: (document: Record<string, unknown>) => void
	description: Snippet
	form: Snippet<[
		{
			IDPrefix: string,
			isConnecting: boolean,
			errors: GeneralError[],
			onsubmit: (event: SubmitEvent) => void,
			button_group: Snippet
		}
	]>
	requirement?: Snippet
	custom_list_specifiers?: Snippet<[ {
		isConnecting: boolean,
		errors: GeneralError[]
	} ]>
	filled_collection_description: Snippet
	empty_collection_description: Snippet<[ {
		isPresentAndArchived: boolean,
		isPresent: boolean,
		isArchived: boolean
	} ]>
	collection_items: Snippet<[ {
		resources: unknown[]
		updateResource: (resource: unknown, index: number) => void
		removeResource: (resource: unknown) => void
	} ]>
} = $props()

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let isRequestingDependencies = $state(true)
let resources: unknown[] = $state([])

let searchMode: SearchMode = $state<SearchMode>(SEARCH_NORMALLY)
let sortCriterion: string = $state(defaultSortCriterion)
let sortOrder: SortOrder = $state(ASCENDING_ORDER)
let lastOffset: number = $state(0)

const partialPath = `/api/v2/${collectiveName}`
let parameters: [string, string][] = $derived([
	[ "filter[search_mode]", searchMode as string ],
	[ "sort[0][0]", sortCriterion ],
	[ "sort[0][1]", sortOrder as string ],
	...additionalListParameters
])
let completePath = writable(partialPath)
$effect(() => {
	const completeParameters = new URLSearchParams([
		...parameters,
		[ "page[offset]", `${lastOffset}` ],
		[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
	]).toString()

	untrack(() => {
		completePath.set(`${partialPath}?${completeParameters}`)
	})
})

let progressRate = $state(0)
const dependencyErrors = writable([] as GeneralError[])

let {
	"isConnecting": isConnectingForList,
	"errors": errorsForList,
	"send": sendForList
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
				errorsForList.set([])
				resources = responseDocument[collectiveName]
				lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
				processListResourceObject(responseDocument)
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

const allErrors = deriveStore(
	[ dependencyErrors, errorsForList ],
	([ dependencyErrors, errors ]) => [
		...dependencyErrors,
		...errors
	]
)

async function reloadResources() {
	resources = []
	await sendForList({})
}

async function loadList() {
	const currentServerURL = get(globalContext.serverURL as any)

	if (currentServerURL === "") {
		setTimeout(loadList, 1000)
		return
	}

	isRequestingDependencies = true

	if (dependencyInfos.length > 0) {
		await loadAllDependencies(globalContext, dependencyInfos, {
			"updateProgressRate": newProgressRate => { progressRate = newProgressRate },
			"updateErrors": newErrors => { dependencyErrors.set(newErrors) }
		})
	} else {
		progressRate = 1
	}

	isRequestingDependencies = false

	await reloadResources()
}

onMount(loadList)

function addResource(newResource: unknown) {
	if (searchMode === "only_deleted") return

	resources = [
		newResource,
		...resources
	]
}

function addResources(newResources: unknown[]) {
	resources = [
		...resources,
		...newResources as unknown[]
	]
}

function removeResource(oldResource: unknown) {
	resources = resources.filter(
		resource => deriveID(resource) !== deriveID(oldResource)
	)
}

let hasLoadedAllDependencies = $derived(
	!isRequestingDependencies
	&& (
		dependencyInfos.length === 0
		|| dependencies.every(dependency => dependency.length > 0)
	)
)

let {
	"isConnecting": isConnectingForCreation,
	"errors": errorsForCreation,
	"send": sendForCreation
} = makeJSONRequester({
	"path": partialPath,
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 201,
			"action": async (response: Response) => {
				const document = await response.json()

				errorsForCreation.set([])
				addResource(processCreatedResourceObject(document))
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function createResource() {
	await sendForCreation({
		"body": JSON.stringify(makeNewResourceObject())
	})
}

let isPresentAndArchived = $derived(searchMode === "with_deleted")
let isPresent = $derived(searchMode === "normal" || isPresentAndArchived)
let isArchived = $derived(searchMode === "only_deleted" || isPresentAndArchived)
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

{#snippet button_group()}
	<TextCardButton
		kind="submit"
		disabled={$isConnectingForCreation}
		label="Add"/>
{/snippet}

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>{pageTitle}</PrimaryHeading>
		</GridCell>
		<GridCell kind="full">
			<SecondaryHeading>{createTitle}</SecondaryHeading>
		</GridCell>
		<GridCell kind="full">
			<InteractiveContainer>
				{#snippet text()}
					{@render description()}
				{/snippet}
				{#snippet widget()}
					<ReactiveProgressBar
						isLoading={isRequestingDependencies}
						progressBarLabel="Waiting for server's response..."/>
					{#if isRequestingDependencies}
						<Flex direction="column" mustPad={false}>
							<TextContainer>
								<ElementalParagraph alignment="center">
									Initial data for the form is loading...
								</ElementalParagraph>
							</TextContainer>
						</Flex>
					{:else if hasLoadedAllDependencies}
						{@render form({
							"IDPrefix": "new_",
							"isConnecting": $isConnectingForCreation,
							"errors": $errorsForCreation,
							button_group,
							"onsubmit": createResource
						})}
					{:else}
						{@render requirement?.()}
					{/if}
				{/snippet}
			</InteractiveContainer>
		</GridCell>
		<CatalogBase
			data={resources}
			isConnecting={$isConnectingForList || isRequestingDependencies}
			{progressRate}
			{collectiveName}
			{filled_collection_description}>
			{#snippet name()}
				<SecondaryHeading>{listTitle}</SecondaryHeading>
			{/snippet}
			{#snippet list_specifier()}
				{@render custom_list_specifiers?.({
					"isConnecting": $isConnectingForList,
					"errors": $errorsForList
				})}

				<ListSpecifier
					bind:searchMode={searchMode}
					bind:sortCriterion={sortCriterion}
					bind:sortOrder={sortOrder}
					isConnecting={$isConnectingForList}
					{availableSortCriteria}
					errors={$errorsForList}/>
			{/snippet}
			{#snippet available_content()}
				{@render collection_items({
					resources,
					updateResource: (resource: unknown, index: number) => {
						resources[index] = resource
					},
					removeResource
				})}
			{/snippet}
			{#snippet empty_collection_description()}
				{@render empty_collection_description_child({
					isPresentAndArchived,
					isPresent,
					isArchived
				})}
			{/snippet}
		</CatalogBase>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnectingForList || isRequestingDependencies}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			reloadFully={reloadResources}
			addResources={addResources}/>
	</InnerGrid>
</ArticleGrid>
