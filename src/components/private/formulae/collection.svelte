<script lang="ts">
import type { Currency, Formula } from "+/entity"
import type { GeneralError, SearchMode, SortOrder } from "+/rest"

import FormulaCard from "%/formulae/formula_card.svelte"
import Collection from "$/catalog/collection.svelte"
import Flex from "$/layout/flex.svelte"
import ListSpecifier from "$/form/list_specifier.svelte"

export let isConnecting: boolean
export let currencies: Currency[]
export let data: Formula[]

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

<Collection collectiveName="Formulae" {isConnecting} {data} progressRate={0}>
	<svelte:fragment slot="filled_collection_description">
		Below are the formulae that you have added on to your profile.
		They can be associated to numerical tools in order to display their results.
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
			<FormulaCard
				bind:data={entity}
				{currencies}
				on:remove/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available formulae at the moment.
		{#if isPresent}Create{/if}{#if isPresentAndArchived}/{/if}{#if isArchived}Delete{/if} a formula to view.
	</svelte:fragment>
</Collection>
