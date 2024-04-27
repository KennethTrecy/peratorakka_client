<script lang="ts">
	import type { Currency, Account, Modifier } from "+/entity"
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import Collection from "$/catalog/collection.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import ListSpecifier from "$/form/list_specifier.svelte"
	import ModifierCard from "%/modifiers/modifier_card.svelte"

	export let isConnecting: boolean
	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Modifier[]

	export let searchMode: SearchMode
	export let sortCriterion: string
	export let sortOrder: SortOrder

	export let listError: GeneralError[]

	const availableSortCriteria = [
		"name",
		"created_at",
	]
</script>

<Collection collectiveName="Modifiers" {isConnecting} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the modifiers that you have added on to your profile.
		They can be associated to account entries.
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
			<ModifierCard
				bind:data={entity}
				{currencies}
				{accounts}
				on:delete/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available modifiers at the moment.
		Create a modifier to view.
	</svelte:fragment>
</Collection>
