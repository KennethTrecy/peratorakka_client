<script lang="ts">
	import type { Currency } from "+/entity"

	import Collection from "$/catalog/collection.svelte"
	import CurrencyCard from "%/currencies/currency_card.svelte"

	export let isConnecting: boolean
	export let data: Currency[]
</script>

<Collection collectiveName="Currencies" {isConnecting} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the currencies that you have added on to your profile.
		They can be associated to financial accounts.
	</svelte:fragment>
	<svelte:fragment slot="cards">
		{#each data as entity(entity.id)}
			<CurrencyCard bind:data={entity} on:delete/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available currencies at the moment.
		Create a currency to view.
	</svelte:fragment>
</Collection>
