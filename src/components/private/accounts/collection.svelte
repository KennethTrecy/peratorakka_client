<script lang="ts">
	import type { Currency, Account } from "+/entity"

	import Collection from "$/catalog/collection.svelte"
	import AccountCard from "%/accounts/account_card.svelte";

	export let isConnecting: boolean
	export let currencies: Currency[]
	export let data: Account[]
</script>

<Collection collectiveName="Financial Accounts" {isConnecting} {data}>
	<svelte:fragment slot="filled_collection_description">
		Below are the financial accounts that you have added on to your profile.
		They can be associated to modifiers.
	</svelte:fragment>
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
