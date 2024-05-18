<script lang="ts">
	import type { ContextBundle } from "+/component"
	import type { CashFlowCategory } from "+/entity"
	import type { SearchMode, SortOrder } from "+/rest"

	import { get, writable } from "svelte/store"
	import { onMount, getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { GLOBAL_CONTEXT } from "#/contexts"
	import { SEARCH_NORMALLY, ASCENDING_ORDER, MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

	import assertAuthentication from "$/page_requirement/assert_authentication"
	import makeJSONRequester from "$/rest/make_json_requester"

	import AddForm from "%/cash_flow_categories/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import Collection from "%/cash_flow_categories/collection.svelte"
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

	let cashFlowCategories: CashFlowCategory[] = []

	let searchMode: SearchMode = SEARCH_NORMALLY
	let sortCriterion: string = "name"
	let sortOrder: SortOrder = ASCENDING_ORDER
	let lastOffset: number = 0

	const collectiveName = "cash_flow_categories"
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
					cashFlowCategories = responseDocument[collectiveName]
					lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function reloadCashFlowCategories() {
		cashFlowCategories = []
		await send({})
	}

	async function loadList() {
		const currentServerURL = get(globalContext.serverURL as any)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		await reloadCashFlowCategories()
	}

	onMount(loadList)

	function addCashFlowCategory(event: CustomEvent<CashFlowCategory>) {
		const newCashFlowCategories = event.detail
		cashFlowCategories = [
			newCashFlowCategories,
			...cashFlowCategories
		]
	}

	function addCashFlowCategories(event: CustomEvent<unknown[]>) {
		const newCashFlowCategories = event.detail as CashFlowCategory[]
		cashFlowCategories = [
			...cashFlowCategories,
			...newCashFlowCategories
		]
	}

	function removeCashFlowCategories(event: CustomEvent<CashFlowCategory>) {
		const oldCashFlowCategory = event.detail
		cashFlowCategories = cashFlowCategories.filter(
			cashFlowCategory => cashFlowCategory.id !== oldCashFlowCategory.id
		)
	}
</script>

<svelte:head>
	<title>Cash Flow Categories</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Cash Flow Categories</PrimaryHeading>
		</GridCell>
		<AddForm on:create={addCashFlowCategory}/>
		<Collection
			data={cashFlowCategories}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnecting}
			listError={$errors}
			on:delete={removeCashFlowCategories}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnecting}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadCashFlowCategories}
			on:addResources={addCashFlowCategories}/>
	</InnerGrid>
</ArticleGrid>
