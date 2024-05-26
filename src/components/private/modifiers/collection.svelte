<script lang="ts">
	import type { Currency, CashFlowActivity, Account, Modifier } from "+/entity"
	import type { GeneralError, SearchMode, SortOrder } from "+/rest"

	import Collection from "$/catalog/collection.svelte"
	import ListSpecifier from "$/form/list_specifier.svelte"
	import ModifierCard from "%/modifiers/modifier_card.svelte"

	export let isConnecting: boolean
	export let progressRate: number
	export let currencies: Currency[]
	export let cashFlowActivities: CashFlowActivity[]
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

<Collection collectiveName="Modifiers" {isConnecting} {progressRate} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the modifiers that you have added on to your profile.
		They can be associated to account entries.
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
			<ModifierCard
				bind:data={entity}
				{currencies}
				{accounts}
				{cashFlowActivities}
				on:delete/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available modifiers at the moment.
		Create a modifier to view.
	</svelte:fragment>
</Collection>
