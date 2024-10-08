<script lang="ts">
	import type { Account, Currency, FinancialEntry, Modifier } from "+/entity"
	import type { ContextBundle } from "+/component"
	import type { SearchMode, SortOrder } from "+/rest"

	import { get, writable } from "svelte/store"
	import { onMount, getContext } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import { ANY_ACCOUNT, ANY_MODIFIER, DEFAULT_MINIMUM_PROGRESS_RATE } from "#/component"
	import { GLOBAL_CONTEXT } from "#/contexts"
	import {
		SEARCH_NORMALLY,
		SEARCH_WITH_DELETED,
		DESCENDING_ORDER,
		MAXIMUM_PAGINATED_LIST_LENGTH
	} from "#/rest"

	import assertAuthentication from "$/page_requirement/assert_authentication"
	import makeDateFieldValue from "$/utility/make_date_field_value"
	import makeJSONRequester from "$/rest/make_json_requester"
	import mergeUniqueResources from "$/utility/merge_unique_resources"

	import AddForm from "%/financial_entries/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import DataTable from "%/financial_entries/data_table.svelte"
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

	const currentTransactedDate = makeDateFieldValue(new Date())
	const lastDate =  new Date()
	lastDate.setMonth(lastDate.getMonth() - 1)
	const lastTransactedDate = makeDateFieldValue(lastDate)

	let isRequestingDependencies = true

	let currencies: Currency[] = []
	let accounts: Account[] = []
	let modifiers: Modifier[] = []
	let financialEntries: FinancialEntry[] = []

	let beginDate: string = lastTransactedDate
	let endDate: string = currentTransactedDate
	let selectedAccountID: string = `${ANY_ACCOUNT.id}`
	let selectedModifierID: string = `${ANY_MODIFIER.id}`
	let searchMode: SearchMode = SEARCH_NORMALLY
	let sortCriterion: string = "transacted_at"
	let sortOrder: SortOrder = DESCENDING_ORDER
	let lastOffset: number = 0

	const collectiveName = "financial_entries"
	const partialPath = `/api/v1/${collectiveName}`
	let parameters: [string, string][] = [
		[ "filter[search_mode]", searchMode as string ],
		[ "filter[begin_date]", beginDate as string ],
		[ "filter[end_date]", endDate as string ],
		[ "sort[0][0]", sortCriterion ],
		[ "sort[0][1]", sortOrder as string ],
		[ "sort[1][0]", "created_at" ],
		[ "sort[1][1]", sortOrder as string ]
	]
	let completePath = writable(partialPath)
	$: {
		parameters = [
			[ "filter[search_mode]", searchMode as string ],
			[ "filter[begin_date]", beginDate as string ],
			[ "filter[end_date]", endDate as string ],
			[ "sort[0][0]", sortCriterion ],
			[ "sort[0][1]", sortOrder as string ],
			[ "sort[1][0]", "created_at" ],
			[ "sort[1][1]", sortOrder as string ]
		]

		if (selectedAccountID !== `${ANY_ACCOUNT.id}`) {
			parameters.push([ "filter[account_id]", selectedAccountID as string ])
		}

		if (selectedModifierID !== `${ANY_MODIFIER.id}`) {
			parameters.push([ "filter[modifier_id]", selectedModifierID as string ])
		}

		completePath.set(`${partialPath}?${
			new URLSearchParams([
				...parameters,
				[ "page[offset]", `${lastOffset}` ],
				[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
			]).toString()
		}`)
	}

	let {
		"isConnecting": isConnectingForFinancialEntries,
		"errors": errorsForFinancialEntries,
		"send": requestForFinancialEntries
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
					errorsForFinancialEntries.set([])
					financialEntries = responseDocument[collectiveName]
					lastOffset = Math.max(0, responseDocument[collectiveName].length - 1)
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	const partialDependencyPath = "/api/v1/modifiers"
	const dependencyPathParameters = [
		[ "filter[search_mode]", SEARCH_WITH_DELETED ],
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
		"isConnecting": isConnectingForModifiers,
		"errors": errorsForModifiers,
		"send": requestForModifiers
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
					errorsForModifiers.set([])
					currencies = mergeUniqueResources(currencies, responseDocument.currencies)
					accounts = mergeUniqueResources(accounts, responseDocument.accounts)
					modifiers = [ ...modifiers, ...responseDocument.modifiers ]
					lastDependencyOffset = lastDependencyOffset + responseDocument.modifiers.length
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

	async function reloadFinancialEntries() {
		financialEntries = []
		await requestForFinancialEntries({})
	}

	async function loadList() {
		const currentServerURL = get(globalContext.serverURL as any)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		isRequestingDependencies = true
		await requestForModifiers({})

		while (lastDependencyOffset + 1 < totalNumberOfDependencies) {
			await requestForModifiers({})
		}

		await reloadFinancialEntries()
		isRequestingDependencies = false
	}

	onMount(loadList)

	function addFinancialEntry(event: CustomEvent<FinancialEntry>) {
		const newFinancialEntry = event.detail
		financialEntries = [
			newFinancialEntry,
			...financialEntries
		]
	}

	function addFinancialEntries(event: CustomEvent<unknown[]>) {
		const newFinancialEntries = event.detail as FinancialEntry[]
		financialEntries = [
			...financialEntries,
			...newFinancialEntries
		]
	}

	function removeFinancialEntry(event: CustomEvent<FinancialEntry>) {
		const oldFinancialEntry = event.detail
		financialEntries = financialEntries.filter(
			financialEntry => financialEntry.id !== oldFinancialEntry.id
		)
	}

	$: progressRate = isRequestingDependencies
		? (
			totalNumberOfDependencies === 0
				? DEFAULT_MINIMUM_PROGRESS_RATE
				: (
					modifiers.length
					+ Math.max(Number(financialEntries.length > 0), DEFAULT_MINIMUM_PROGRESS_RATE)
				) / (totalNumberOfDependencies + 1)
		): Math.max(Number(financialEntries.length > 0), DEFAULT_MINIMUM_PROGRESS_RATE) / 1
</script>

<svelte:head>
	<title>General Ledger</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>General Ledger</PrimaryHeading>
		</GridCell>
		<AddForm
			{currencies}
			{accounts}
			{modifiers}
			isLoadingInitialData={$isConnectingForModifiers}
			on:create={addFinancialEntry}/>
		<DataTable
			{currencies}
			{accounts}
			{modifiers}
			data={financialEntries}
			bind:beginDate={beginDate}
			bind:endDate={endDate}
			bind:selectedAccountID={selectedAccountID}
			bind:selectedModifierID={selectedModifierID}
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			isConnecting={$isConnectingForFinancialEntries || isRequestingDependencies}
			{progressRate}
			listError={$errorsForFinancialEntries}
			on:delete={removeFinancialEntry}/>
		<ExtraResourceLoader
			isConnectingForInitialList={$isConnectingForFinancialEntries || isRequestingDependencies}
			{partialPath}
			{parameters}
			{collectiveName}
			bind:lastOffset={lastOffset}
			on:reloadFully={reloadFinancialEntries}
			on:addResources={addFinancialEntries}/>
	</InnerGrid>
</ArticleGrid>
