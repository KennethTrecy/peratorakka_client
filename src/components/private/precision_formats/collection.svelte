<script lang="ts">
import type { PrecisionFormat } from "+/entity"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import Collection from "$/catalog/collection.svelte"
import PrecisionFormatCard from "%/precision_formats/precision_format_card.svelte"
import Flex from "$/layout/flex.svelte"
import ListSpecifier from "$/form/list_specifier.svelte"

export let isConnecting: boolean
export let data: PrecisionFormat[]
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

<Collection collectiveName="Precision Formats" {isConnecting} {data} progressRate={0}>
	<svelte:fragment slot="filled_collection_description">
		Below are the precision formats that you have created in your profile.
		They can be associated to currencies or numerical tools.
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
			<PrecisionFormatCard bind:data={entity} on:remove/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available precision formats at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a precision format to view some data here.
	</svelte:fragment>
</Collection>
