<script lang="ts">
import type { Snippet } from "svelte"
import type { ContextBundle, ResourceDependencyInfo, HighResourceDependencyInfo } from "+/component"
import type { GeneralError, SortOrder } from "+/rest"
import type { RestorableEntity } from "+/entity"

import { getContext } from "svelte"
import { afterNavigate, beforeNavigate, goto } from "$app/navigation"

import { GLOBAL_CONTEXT } from "#/contexts"
import { ASCENDING_ORDER } from "#/rest"

import assertAuthentication from "$/page_requirement/assert_authentication"
import makeJSONRequester from "$/rest/make_json_requester"

import ListResourcePage from "$/layout/list_resource_page.svelte"
import ElementalParagraph from "$/typography/elemental_paragraph.svelte"
import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import InteractiveContainer from "$/layout/interactive_container.svelte"
import ReactiveProgressBar from "$/utility/reactive_progress_bar.svelte"
import SecondaryHeading from "$/typography/secondary_heading.svelte"
import TextCardButton from "$/button/card/text.svelte"
import TextContainer from "$/typography/text_container.svelte"

let {
	pageTitle,
	createTitle,
	listTitle,
	collectiveName,
	defaultSortCriterion,
	defaultSortOrder = ASCENDING_ORDER,
	availableSortCriteria,
	additionalListParameters = [],
	dependencies = [],
	dependencyInfos = [],
	deriveID,
	makeNewResourceObject,
	processCreatedResourceObject,
	processListResourceObject = () => {},
	general_description,
	form,
	requirement,
	create_grid_cell_rear,
	custom_list_specifiers,
	filled_collection_description,
	empty_collection_description,
	collection_items,
	list_grid_cell_rear
}: {
	pageTitle: string
	createTitle: string
	listTitle: string
	collectiveName: string
	defaultSortCriterion: string
	defaultSortOrder?: SortOrder
	availableSortCriteria: string[]
	additionalListParameters?: [string, string][]
	dependencyInfos?: (
		ResourceDependencyInfo<RestorableEntity>
		|HighResourceDependencyInfo<RestorableEntity>
	)[]
	dependencies?: unknown[][]
	deriveID: (resource: unknown) => string
	makeNewResourceObject: () => Record<string, unknown>
	processCreatedResourceObject: (document: Record<string, unknown>) => unknown
	processListResourceObject?: (document: Record<string, unknown>) => void
	general_description: Snippet
	form: Snippet<[
		{
			IDPrefix: string,
			isConnecting: boolean,
			errors: GeneralError[],
			onsubmit: (event: SubmitEvent) => void,
			button_group: Snippet
		}
	]>
	requirement?: Snippet
	create_grid_cell_rear?: Snippet
	custom_list_specifiers?: Snippet<[ {
		isConnecting: boolean,
		errors: GeneralError[]
	} ]>
	filled_collection_description: Snippet
	empty_collection_description: Snippet<[ {
		isPresentAndArchived: boolean,
		isPresent: boolean,
		isArchived: boolean
	} ]>
	collection_items: Snippet<[ {
		resources: unknown[]
		updateResource: (resource: unknown, index: number) => void
		removeResource: (resource: unknown) => void
	} ]>
	list_grid_cell_rear?: Snippet
} = $props()

const globalContext = getContext(GLOBAL_CONTEXT) as ContextBundle

assertAuthentication(globalContext, {
	afterNavigate,
	beforeNavigate,
	goto
})

let createdResource = $state<unknown|null>(null)

const partialPath = `/api/v2/${collectiveName}`

let {
	"isConnecting": isConnectingForCreation,
	"errors": errorsForCreation,
	"send": sendForCreation
} = makeJSONRequester({
	"path": partialPath,
	"defaultRequestConfiguration": {
		"method": "POST"
	},
	"manualResponseHandlers": [
		{
			"statusCode": 201,
			"action": async (response: Response) => {
				const document = await response.json()

				errorsForCreation.set([])
				createdResource = processCreatedResourceObject(document)
			}
		}
	],
	"expectedErrorStatusCodes": [ 400 ]
})

async function createResource(addResource: (resource: unknown) => void) {
	createdResource = null

	await sendForCreation({
		"body": JSON.stringify(makeNewResourceObject())
	})

	if (createdResource !== null) {
		addResource(createdResource)
	}
}
</script>

{#snippet button_group()}
	<TextCardButton
		kind="submit"
		disabled={$isConnectingForCreation}
		label="Add"/>
{/snippet}

<ListResourcePage
	{pageTitle}
	{listTitle}
	{collectiveName}
	{defaultSortCriterion}
	{defaultSortOrder}
	{availableSortCriteria}
	{additionalListParameters}
	{dependencies}
	{dependencyInfos}
	{deriveID}
	{processListResourceObject}
	{custom_list_specifiers}
	{filled_collection_description}
	{empty_collection_description}
	{collection_items}
	{list_grid_cell_rear}>
	{#snippet list_grid_cell_face({
		isRequestingDependencies,
		hasLoadedAllDependencies,
		addResource
	})}
		<GridCell kind="full">
			<SecondaryHeading>{createTitle}</SecondaryHeading>
		</GridCell>
		<GridCell kind="full">
			<InteractiveContainer>
				{#snippet text()}
					{@render general_description()}
				{/snippet}
				{#snippet widget()}
					<ReactiveProgressBar
						isLoading={isRequestingDependencies}
						progressBarLabel="Waiting for server's response..."/>
					{#if isRequestingDependencies}
						<Flex direction="column" mustPad={false}>
							<TextContainer>
								<ElementalParagraph alignment="center">
									Initial data for the form is loading...
								</ElementalParagraph>
							</TextContainer>
						</Flex>
					{:else if hasLoadedAllDependencies}
						{@render form({
							"IDPrefix": "new_",
							"isConnecting": $isConnectingForCreation,
							"errors": $errorsForCreation,
							button_group,
							"onsubmit": () => createResource(addResource)
						})}
					{:else}
						{@render requirement?.()}
					{/if}
				{/snippet}
			</InteractiveContainer>
		</GridCell>
		{@render create_grid_cell_rear?.()}
	{/snippet}
</ListResourcePage>
