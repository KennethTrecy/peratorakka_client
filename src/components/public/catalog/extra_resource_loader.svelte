<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { writable } from "svelte/store"
	import debounce from "lodash.debounce"

	import { MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

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
	export let collectiveName: string
	export let parameters: [string, string][]
	export let lastOffset: number
	let lastResourceCount = 0

	let nextPath = writable(partialPath)

	$: {
		const newPath = `${partialPath}?${
			new URLSearchParams([
				...parameters,
				[ "page[offset]", `${lastOffset + 1}` ],
				[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
			]).toString()
		}`

		nextPath.set(newPath)
	}

	let { isConnecting, errors, send } = makeJSONRequester({
		"path": nextPath,
		"defaultRequestConfiguration": {
			"method": "GET"
		},
		"manualResponseHandlers": [
			{
				"statusCode": 200,
				"action": async (response: Response) => {
					let responseDocument = await response.json()
					errors.set([])
					const resources = responseDocument[collectiveName]

					if (resources.length > 0) {
						lastResourceCount = resources.length
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
				if (lastOffset >= 0) {
					lastOffset = 0
					reloadFully()
				}
			}
		}
	}

	$: hasPossibleUnloadedResources = lastResourceCount > 0
</script>

{#if isConnectingForInitialList}
	<GridCell kind="full">
		<Flex direction="column">
			<ShortParagraph>Loading initial items...</ShortParagraph>
		</Flex>
	</GridCell>
{:else}
	<GridCell kind="full">
		<Flex direction="column">
			{#if $isConnecting}
				<ShortParagraph>Loading next items...</ShortParagraph>
			{:else if hasPossibleUnloadedResources}
				<TextButton
					label="Load next items"
					on:click={loadResources}/>
			{/if}
		</Flex>
	</GridCell>
{/if}
