<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { Entity } from "%/currencies/types"

	import { get } from "svelte/store"
	import { goto } from "$app/navigation"
	import { onMount, onDestroy } from "svelte"

	import {
		serverURL,
		hasRequirements,
		mustHaveToken,
		mustBeAuthenticatedUser,
		redirectPath
	} from "$/global_state"

	import Collection from "%/currencies/collection.svelte"
	import AddForm from "%/currencies/add_form.svelte"

	hasRequirements.set(true)
	mustHaveToken.set(true)
	mustBeAuthenticatedUser.set(true)
	const forgetPossibleRedirection = redirectPath.subscribe(path => {
		if (path !== "") goto(path as string)
	})
	onDestroy(forgetPossibleRedirection)

	let currencies: Entity[] = []
	let isConnecting = false
	let errors: GeneralError[] = []

	async function loadList() {
		const currentServerURL = get(serverURL)

		if (currentServerURL === "") {
			setTimeout(1000, loadList)
			return
		}

		isConnecting = true

		try {
			const response = await fetch(`${currentServerURL}/api/v1/currencies`, {
				"method": "GET",
				"mode": "cors",
				"credentials": "include",
				"headers": {
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			})

			const statusCode = response.status
			if (statusCode === 200) {
				let responseDocument = await response.json()

				errors = []
				currencies = responseDocument.currencies
			} else if (statusCode === 401) {
				errors = (await response.json()).errors
			} else {
				throw new Error(
					`Unexpected status code was returned by the server: ${response.status}.`
				)
			}
		} catch (receivedErrors) {
			if (Array.isArray(receivedErrors)) {
				errors = receivedErrors
			} else {
				errors = [
					{
						"message": (receivedErrors as Error).message
					}
				]
			}
		}

		isConnecting = false
	}

	onMount(loadList)
</script>

<svelte:head>
	<title>Currencies</title>
</svelte:head>

<article>
	<h1>Currencies</h1>
	<AddForm/>
	<Collection data={currencies}/>
</article>

<style lang="scss">
	@use "@/components/third-party/index";

	article {
		@extend .medium-margin;
		margin-left: 0em;
		margin-right: 0em;
	}
</style>
