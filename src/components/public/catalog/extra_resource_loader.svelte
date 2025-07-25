<script lang="ts">
import { untrack } from "svelte"
import { writable } from "svelte/store"
import debounce from "lodash.debounce"

import { MAXIMUM_PAGINATED_LIST_LENGTH } from "#/rest"

import makeJSONRequester from "$/rest/make_json_requester"

import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import TextButton from "$/button/text.svelte"

let {
	isConnectingForInitialList,
	partialPath,
	collectiveName,
	parameters,
	lastOffset = $bindable(),
	reloadFully,
	addResources,
	processListResourceObject = () => {},
	informLastOffset = () => {}
}: {
	isConnectingForInitialList: boolean
	partialPath: string
	collectiveName: string
	parameters: [string, string][]
	lastOffset: number
	reloadFully: () => void
	addResources: (resources: unknown[]) => void
	processListResourceObject?: (document: Record<string, unknown>) => void
	informLastOffset?: () => void
} = $props()
let lastOverallFilteredCount = $state(Infinity)

let nextPath = writable(partialPath)

$effect(() => {
	const newPath = `${partialPath}?${
		new URLSearchParams([
			...parameters,
			[ "page[offset]", `${lastOffset + 1}` ],
			[ "page[limit]", MAXIMUM_PAGINATED_LIST_LENGTH ]
		]).toString()
	}`

	untrack(() => {
		nextPath.set(newPath)
	})
})

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
				const overallFilteredCount = responseDocument["@meta"].overall_filtered_count
				const resources = responseDocument[collectiveName]
				const resourceCount = resources.length

				lastOverallFilteredCount = overallFilteredCount

				if (resourceCount > 0) {
					lastOffset = lastOffset + resourceCount
					addResources(resources)
					processListResourceObject(responseDocument)
				} else {
					informLastOffset()
				}
			}
		}
	],
	"expectedErrorStatusCodes": [ 401 ]
})

let oldParameters: string[][] = $state([])
let abortController: AbortController|null = $state(null)

async function loadResources() {
	if (abortController !== null) abortController.abort()

	abortController = new AbortController()

	await send({
		"signal": abortController.signal
	})
}

const reloadFullyAfterBounce = debounce(reloadFully, 2000)
$effect(() => {
	const hasFinishedConnectingForInitialList = !isConnectingForInitialList
	const newParameters = parameters

	untrack(() => {
		if (hasFinishedConnectingForInitialList) {
			const encodedOldParameters = JSON.stringify(oldParameters)
			const encodedCurrentParameters = JSON.stringify(newParameters)

			if (encodedOldParameters !== encodedCurrentParameters) {
				if (abortController !== null) abortController.abort()
				oldParameters = newParameters
				lastOverallFilteredCount = Infinity

				if (lastOffset > 0) {
					lastOffset = 0
				}

				reloadFullyAfterBounce()
			}
		} else {
			oldParameters = newParameters
		}
	})
})

let hasPossibleUnloadedResources = $derived(
	lastOffset !== 0 && lastOffset + 1 < lastOverallFilteredCount
)
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
					onclick={loadResources}/>
			{:else}
				<ShortParagraph>There are no more items beyond this point.</ShortParagraph>
				<TextButton
					label="Reload"
					onclick={reloadFully}/>
			{/if}
		</Flex>
	</GridCell>
{/if}
