<script lang="ts">
	import type { Currency } from "+/entity"
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import Collection from "$/catalog/collection.svelte"
	import CurrencyCard from "%/currencies/currency_card.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import ListSpecifier from "$/form/list_specifier.svelte"

	export let isConnecting: boolean
	export let data: Currency[]
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
</script>

<Collection collectiveName="Currencies" {isConnecting} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the currencies that you have added on to your profile.
		They can be associated to financial accounts.
	</svelte:fragment>
	<svelte:fragment slot="cards">
		<GridCell kind="full">
			<Flex direction="column">
				<Flex direction="row" mustPad={false}>
					<ListSpecifier
						bind:searchMode={searchMode}
						bind:sortCriterion={sortCriterion}
						bind:sortOrder={sortOrder}
						{isConnecting}
						{availableSortCriteria}
						errors={listError}/>
				</Flex>
			</Flex>
		</GridCell>
		{#each data as entity(entity.id)}
			<CurrencyCard bind:data={entity} on:delete/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available currencies at the moment.
		Create a currency to view.
	</svelte:fragment>
</Collection>
