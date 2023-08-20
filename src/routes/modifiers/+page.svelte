<script lang="ts">
	import type { Account, Currency, Modifier } from "+/entity"

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

	import AddForm from "%/modifiers/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import DataTable from "%/modifiers/data_table.svelte"
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
	let modifiers: Modifier[] = []

	let {
		"isConnecting": isConnectingForModifiers,
		"errors": errorsForModifiers,
		"send": requestForModifiers
	} = makeJSONRequester({
		"path": "/api/v1/modifiers",
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForModifiers.set([])
					modifiers = responseDocument.modifiers
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

	let {
		"isConnecting": isConnectingForAccounts,
		"errors": errorsForAccounts,
		"send": requestForAccounts
	} = makeJSONRequester({
		"path": "/api/v1/accounts",
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForAccounts.set([])
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

		await requestForModifiers({})
		await requestForAccounts({})
	}

	onMount(loadList)

	function addModifier(event: CustomEvent<Modifier>) {
		const newModifier = event.detail
		modifiers = [
			...modifiers,
			newModifier
		]
	}

	function removeModifier(event: CustomEvent<Modifier>) {
		const oldModifier = event.detail
		modifiers = modifiers.filter(modifier => modifier.id !== oldModifier.id)
	}
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
			on:create={addModifier}/>
		<DataTable
			{currencies}
			{accounts}
			data={modifiers}
			isConnecting={$isConnectingForModifiers}
			on:delete={removeModifier}/>
	</InnerGrid>
</ArticleGrid>
