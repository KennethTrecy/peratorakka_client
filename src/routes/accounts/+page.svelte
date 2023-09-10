<script lang="ts">
	import type { Account, Currency } from "+/entity"

	import { get } from "svelte/store"
	import { onMount } from "svelte"
	import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

	import makeJSONRequester from "$/rest/make_json_requester"
	import applyRequirements from "$/utility/apply_requirements"
	import {
		serverURL,
		mustHaveToken,
		mustHaveAccessToken,
		mustBeAuthenticatedUser
	} from "$/global_state"

	import AddForm from "%/accounts/add_form.svelte"
	import ArticleGrid from "$/layout/article_grid.svelte"
	import Collection from "%/accounts/collection.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import InnerGrid from "$/layout/inner_grid.svelte"
	import PrimaryHeading from "$/typography/primary_heading.svelte"

	applyRequirements([
		mustHaveToken,
		mustHaveAccessToken,
		mustBeAuthenticatedUser
	], {
		afterNavigate,
		beforeNavigate,
		goto
	})

	let currencies: Currency[] = []
	let accounts: Account[] = []

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
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	let {
		"isConnecting": isConnectingForCurrencies,
		"errors": errorsForCurrencies,
		"send": requestForCurrencies
	} = makeJSONRequester({
		"path": "/api/v1/currencies",
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errorsForCurrencies.set([])
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

		await requestForCurrencies({})
		await requestForAccounts({})
	}

	onMount(loadList)

	function addAccount(event: CustomEvent<Account>) {
		const newAccount = event.detail
		accounts = [
			...accounts,
			newAccount
		]
	}

	function removeAccount(event: CustomEvent<Account>) {
		const oldAccount = event.detail
		accounts = accounts.filter(account => account.id !== oldAccount.id)
	}
</script>

<svelte:head>
	<title>Financial Accounts</title>
</svelte:head>

<ArticleGrid>
	<InnerGrid>
		<GridCell kind="full">
			<PrimaryHeading>Financial Accounts</PrimaryHeading>
		</GridCell>
		<AddForm
			{currencies}
			isLoadingInitialData={$isConnectingForCurrencies}
			on:create={addAccount}/>
		<Collection
			{currencies}
			data={accounts}
			isConnecting={$isConnectingForAccounts}
			on:delete={removeAccount}/>
	</InnerGrid>
</ArticleGrid>
