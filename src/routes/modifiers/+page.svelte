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
		mustBeAuthenticatedUser
	} from "$/global_state"

	import Collection from "%/modifiers/collection.svelte"
	import AddForm from "%/modifiers/add_form.svelte"

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

	let {
		"isConnecting": isConnectingForAccount,
		"errors": errorsForAccount,
		"send": requestForAccount
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
					errorsForAccount.set([])
					accounts = responseDocument.accounts
				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	let {
		"isConnecting": isConnectingForCurrency,
		"errors": errorsForCurrency,
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
					errorsForAccount.set([])
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
		await requestForAccount({})
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
	<title>Accounts</title>
</svelte:head>

<article class="grid large-space large-margin large-padding">
	<h1 class="s12 m12 l12 center-align">Accounts</h1>
	<AddForm {currencies} on:create={addAccount}/>
	<Collection
		{currencies}
		data={accounts}
		isConnecting={$isConnectingForAccount}
		on:delete={removeAccount}/>
</article>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
