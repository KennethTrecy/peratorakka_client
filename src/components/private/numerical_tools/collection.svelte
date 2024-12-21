<script lang="ts">
import type { Collection, Currency, Formula, NumericalTool } from "+/entity"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import CollectionCatalog from "$/catalog/collection.svelte"
import NumericalToolCard from "%/numerical_tools/numerical_tool_card.svelte"
import Flex from "$/layout/flex.svelte"
import ListSpecifier from "$/form/list_specifier.svelte"

export let isConnecting: boolean
export let data: NumericalTool[]
export let formulae: Formula[]
export let currencies: Currency[]
export let collections: Collection[]
export let searchMode: SearchMode
export let sortCriterion: string
export let sortOrder: SortOrder
export let progressRate: number

export let listErrors: GeneralError[]

const availableSortCriteria = [
	"name",
	"created_at",
	"updated_at",
	"deleted_at"
]

$: isPresentAndArchived = searchMode === "with_deleted"
$: isPresent = searchMode === "normal" || isPresentAndArchived
$: isArchived = searchMode === "only_deleted" || isPresentAndArchived
</script>

<CollectionCatalog collectiveName="Numerical Tools" {isConnecting} {data} {progressRate}>
	<svelte:fragment slot="filled_collection_description">
		Below are the numerical tools that you have added on to your profile.
		Their outputs can be seen on the dashboard.
	</svelte:fragment>
	<Flex slot="list_specifier" justifyContent="responsive_stretch" mustPad={false}>
		<ListSpecifier
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			{isConnecting}
			{availableSortCriteria}
			errors={listErrors}/>
	</Flex>
	<svelte:fragment slot="cards">
		{#each data as entity(entity.id)}
			<NumericalToolCard
				bind:data={entity}
				{formulae}
				{currencies}
				{collections}
				on:remove/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available numerical tools at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a numerical tools to view.
	</svelte:fragment>
</CollectionCatalog>
