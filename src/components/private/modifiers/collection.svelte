<script lang="ts">
	import type { Currency, Account, Modifier } from "+/entity"

	import Collection from "$/catalog/collection.svelte"
	import ModifierCard from "%/modifiers/modifier_card.svelte";

	export let isConnecting: boolean
	export let currencies: Currency[]
	export let accounts: Account[]
	export let data: Modifier[]
</script>

<Collection collectiveName="Modifiers" {isConnecting} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the modifiers that you have added on to your profile.
		They can be associated to account entries.
	</svelte:fragment>
	<svelte:fragment slot="cards">
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
