<script lang="ts">
	import { writable } from "svelte/store"
	import { onMount, createEventDispatcher } from "svelte"

	import makeJSONRequester from "$/rest/make_json_requester"

	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import TextButton from "$/button/text.svelte"

	const dispatch = createEventDispatcher<{
		"reloadFully": void
		"addResources": unknown[]
	}>()

	export let isConnectingForInitialList: boolean
	export let partialPath: string
	export let individualName: string
	export let parameters: string[][]
	export let lastOffset: number

	let path = writable(partialPath)

	$: {
		const newPath = `${partialPath}?${
			new URLSearchParams([
				...parameters,
				[ "page[offset]", `${lastOffset}` ],
				[ "page[limit]", "1" ]
			]).toString()
		}`

		path.set(newPath)
	}

	let { isConnecting, errors, send } = makeJSONRequester({
		path,
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errors.set([])
					const resources = responseDocument[individualName]
					lastOffset = lastOffset + responseDocument[individualName].length
					dispatch("addResources", resources)

				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
	})

	let isInClient = false
	onMount(() => {
		isInClient = true
	})

	let oldParameters: string[][] = []
	let abortController: AbortController|null = null

	async function loadResources() {
		if (abortController !== null) abortController.abort()

		abortController = new AbortController()

		await send({
			"signal": abortController.signal
		})
	}

	$: {
		if (isInClient) {
			const encodedOldParameters = JSON.stringify(oldParameters)
			const encodedCurrentParameters = JSON.stringify(parameters)

			if (encodedOldParameters !== encodedCurrentParameters) {
				if (abortController !== null) abortController.abort()
				dispatch("reloadFully")
			}
		}
	}
</script>

{#if !isConnectingForInitialList}
	<GridCell kind="full">
		{#if isConnecting}
			<ShortParagraph>Loading next items...</ShortParagraph>
		{:else}
			<Flex direction="column">
				<TextButton
					label="Load next items"
					on:click={loadResources}/>
			</Flex>
		{/if}
	</GridCell>
{/if}
