<script lang="ts">
import type { Collection } from "+/entity"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import CollectionCatalog from "$/catalog/collection.svelte"
import CollectionCard from "%/collections/collection_card.svelte"
import Flex from "$/layout/flex.svelte"
import ListSpecifier from "$/form/list_specifier.svelte"

export let isConnecting: boolean
export let progressRate: number
export let data: Collection[]
export let searchMode: SearchMode
export let sortCriterion: string
export let sortOrder: SortOrder

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

<CollectionCatalog collectiveName="Collection" {isConnecting} {data} {progressRate}>
	<svelte:fragment slot="filled_collection_description">
		Below are the collection that you have added on to your profile.
		They may have several financial accounts.
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
			<CollectionCard bind:data={entity} on:remove/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available collection at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a collection to view.
	</svelte:fragment>
</CollectionCatalog>
