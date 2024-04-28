<script lang="ts">
	import type { Account, Currency, Modifier } from "+/entity"
	import type { ContextBundle } from "+/component"
	import type { SearchMode, SortOrder } from "+/rest"

	import { get, writable } from "svelte/store"
	import { onMount, getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { DEFAULT_MINIMUM_PROGRESS_RATE } from "#/component"
	import { GLOBAL_CONTEXT } from "#/contexts"
	import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

	import assertAuthentication from "$/page_requirement/assert_authentication"
	import makeJSONRequester from "$/rest/make_json_requester"
	import mergeUniqueResources from "$/utility/merge_unique_resources"

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
	let accounts: Account[] = []
	let modifiers: Modifier[] = []

	let searchMode: SearchMode = SEARCH_NORMALLY
	let sortCriterion: string = "name"
	let sortOrder: SortOrder = ASCENDING_ORDER
	let lastOffset: number = 0

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

	let {
		"isConnecting": isConnectingForModifiers,
		"errors": errorsForModifiers,
		"send": requestForModifiers
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
					errorsForModifiers.set([])
					modifiers = responseDocument[collectiveName]
					lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	const partialDependencyPath = "/api/v1/accounts"
	const dependencyPathParameters = [
		[ "sort[0][0]", "name" ],
		[ "sort[0][1]", "ascending" ],
		[ "sort[1][0]", "created_at" ],
		[ "sort[1][1]", "ascending" ]
	]
	let totalNumberOfDependencies: number = 0
	let lastDependencyOffset: number = -1
	const completeDependencyPath = writable(partialDependencyPath)
	$: {
		completeDependencyPath.set(`${partialDependencyPath}?${
			new URLSearchParams([
				...dependencyPathParameters,
				[ "page[offset]", `${lastDependencyOffset + 1}` ],
				[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
			]).toString()
		}`)
	}
	let {
		"isConnecting": isConnectingForAccounts,
		"errors": errorsForAccounts,
		"send": requestForAccounts
	} = makeJSONRequester({
		"path": completeDependencyPath,
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForAccounts.set([])
					currencies = mergeUniqueResources(currencies, responseDocument.currencies)
					accounts = [ ...accounts, ...responseDocument.accounts ]
					lastDependencyOffset = lastDependencyOffset + responseDocument.accounts.length
					totalNumberOfDependencies = responseDocument.meta.overall_filtered_count
				}
			},
			{
				"statusCode": 204,
				"action": async (response: Response) => {
					errorsForModifiers.set([])
					modifiers = []
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function reloadModifiers() {
		modifiers = []
		await requestForModifiers({})
	}

	async function loadList() {
		const currentServerURL = get(globalContext.serverURL as any)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		isRequestingDependencies = true
		await requestForAccounts({})

		while (lastDependencyOffset + 1 < totalNumberOfDependencies) {
			await requestForAccounts({})
		}

		isRequestingDependencies = false

		await reloadModifiers()
	}

	onMount(loadList)

	function addModifier(event: CustomEvent<Modifier>) {
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

	$: progressRate = isRequestingDependencies
		? (
			totalNumberOfDependencies === 0
				? DEFAULT_MINIMUM_PROGRESS_RATE
				: (
					accounts.length
					+ Math.max(Number(modifiers.length > 0), DEFAULT_MINIMUM_PROGRESS_RATE)
				) / (totalNumberOfDependencies + 1)
		): Math.max(Number(modifiers.length > 0), DEFAULT_MINIMUM_PROGRESS_RATE) / 1
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
			isLoadingInitialData={$isConnectingForAccounts}
			on:create={addModifier}/>
		<Collection
			{currencies}
			{accounts}
			data={modifiers}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnectingForModifiers || isRequestingDependencies}
			{progressRate}
			listError={$errorsForModifiers}
			on:delete={removeModifier}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnectingForModifiers || isRequestingDependencies}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadModifiers}
			on:addResources={addModifiers}/>
	</InnerGrid>
</ArticleGrid>
