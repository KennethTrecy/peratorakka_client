<script lang="ts">
	import type { Currency, Account } from "+/entity"
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import AccountCard from "%/accounts/account_card.svelte"
	import Collection from "$/catalog/collection.svelte"
	import Flex from "$/layout/flex.svelte"
	import GridCell from "$/layout/grid_cell.svelte"
	import ListSpecifier from "$/form/list_specifier.svelte"

	export let isConnecting: boolean
	export let currencies: Currency[]
	export let data: Account[]

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

<Collection collectiveName="Financial Accounts" {isConnecting} {data} progressRate={0}>
	<svelte:fragment slot="filled_collection_description">
		Below are the financial accounts that you have added on to your profile.
		They can be associated to modifiers.
	</svelte:fragment>
	<ListSpecifier
		slot="list_specifier"
		bind:searchMode={searchMode}
		bind:sortCriterion={sortCriterion}
		bind:sortOrder={sortOrder}
		{isConnecting}
		{availableSortCriteria}
		errors={listError}/>
	<svelte:fragment slot="cards">
		{#each data as entity(entity.id)}
			<AccountCard
				bind:data={entity}
				{currencies}
				on:delete/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available financial accounts at the moment.
		Create a financial account to view.
	</svelte:fragment>
</Collection>
