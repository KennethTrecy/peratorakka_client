<script lang="ts">
	import type { Account, Currency, FrozenPeriod, SummaryCalculation } from "+/entity"

	import { get } from "svelte/store"
	import { onMount } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
		mustHaveToken,
		mustBeAuthenticatedUser
	} from "$/global_state"

	import AddForm from "%/frozen_periods/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import DataTable from "%/frozen_periods/data_table.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PrimaryHeading from "$/typography/primary_heading.svelte"

	applyRequirements([
		mustHaveToken,
		mustBeAuthenticatedUser
	], {
		afterNavigate,
		beforeNavigate,
		goto
	})

	let currencies: Currency[] = []
	let accounts: Account[] = []
	let frozenPeriods: FrozenPeriod[] = []
	let summaryCalculations: SummaryCalculation[] = []

	let {
		"isConnecting": isConnectingForFrozenPeriods,
		"errors": errorsForFrozenPeriods,
		"send": requestForFrozenPeriods
	} = makeJSONRequester({
		"path": "/api/v1/frozen_periods",
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForFrozenPeriods.set([])
					frozenPeriods = responseDocument.frozen_periods
					summaryCalculations = responseDocument.summary_calculations
					accounts = responseDocument.accounts
					currencies = responseDocument.currencies
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	async function loadList() {
		const currentServerURL = get(serverURL)

		if (currentServerURL === "") {
			setTimeout(loadList, 1000)
			return
		}

		await requestForFrozenPeriods({})
	}

	onMount(loadList)

	function addFrozenPeriod(event: CustomEvent<FrozenPeriod>) {
		const newFrozenPeriod = event.detail
		frozenPeriods = [
			...frozenPeriods,
			newFrozenPeriod
		]
	}

	function removeFrozenPeriod(event: CustomEvent<FrozenPeriod>) {
		const oldFrozenPeriod = event.detail
		frozenPeriods = frozenPeriods.filter(
			frozenPeriod => frozenPeriod.id !== oldFrozenPeriod.id
		)
	}
</script>

<svelte:head>
	<title>Frozen Periods</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Frozen Periods</PrimaryHeading>
		</GridCell>
		<AddForm
			isLoadingInitialData={$isConnectingForFrozenPeriods}
			on:create={addFrozenPeriod}/>
		<DataTable
			isConnecting={$isConnectingForFrozenPeriods}
			data={frozenPeriods}
			on:delete={removeFrozenPeriod}
			on:check/>
	</InnerGrid>
</ArticleGrid>
