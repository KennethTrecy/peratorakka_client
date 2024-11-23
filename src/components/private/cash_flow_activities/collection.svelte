<script lang="ts">
import type { CashFlowActivity } from "+/entity"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import Collection from "$/catalog/collection.svelte"
import CashFlowActivityCard from "%/cash_flow_activities/cash_flow_activity_card.svelte"
import Flex from "$/layout/flex.svelte"
import ListSpecifier from "$/form/list_specifier.svelte"

export let isConnecting: boolean
export let data: CashFlowActivity[]
export let searchMode: SearchMode
export let sortCriterion: string
export let sortOrder: SortOrder

export let listError: GeneralError[]

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

<Collection collectiveName="Cash Flow Activities" {isConnecting} {data} progressRate={0}>
	<svelte:fragment slot="filled_collection_description">
		Below are the cash flow activity that you have added on to your profile.
		They can be associated to modifiers.
	</svelte:fragment>
	<Flex slot="list_specifier" justifyContent="responsive_stretch" mustPad={false}>
		<ListSpecifier
			bind:searchMode={searchMode}
			bind:sortCriterion={sortCriterion}
			bind:sortOrder={sortOrder}
			{isConnecting}
			{availableSortCriteria}
			errors={listError}/>
	</Flex>
	<svelte:fragment slot="cards">
		{#each data as entity(entity.id)}
			<CashFlowActivityCard bind:data={entity} on:remove/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available cash flow activity at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if}
		a cash flow activity to view.
	</svelte:fragment>
</Collection>
