<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"
	import debounce from "lodash.debounce"

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
	export let parameters: [string, string][]
	export let lastOffset: number

	let path = writable(partialPath)

	$: {
		const newPath = `${partialPath}?${
			new URLSearchParams([
				...parameters,
				[ "page[offset]", `${lastOffset + 1}` ],
				[ "page[limit]", "15" ]
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

					if (resources.length > 0) {
						lastOffset = lastOffset + resources.length
						dispatch("addResources", resources)
					}

				}
			}
		],
		"expectedErrorStatusCodes": [ 401 ]
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

	const reloadFully = debounce(() => dispatch("reloadFully"), 500)
	$: {
		if (isConnectingForInitialList) {
			oldParameters = parameters
		} else {
			const encodedOldParameters = JSON.stringify(oldParameters)
			const encodedCurrentParameters = JSON.stringify(parameters)

			if (encodedOldParameters !== encodedCurrentParameters) {
				if (abortController !== null) abortController.abort()
				if (lastOffset > 0) reloadFully()
			}
		}
	}
</script>

{#if !isConnectingForInitialList}
	<GridCell kind="full">
		<Flex direction="column">
			{#if $isConnecting}
				<ShortParagraph>Loading next items...</ShortParagraph>
			{:else}
				<TextButton
					label="Load next items"
					on:click={loadResources}/>
			{/if}
		</Flex>
	</GridCell>
{/if}
