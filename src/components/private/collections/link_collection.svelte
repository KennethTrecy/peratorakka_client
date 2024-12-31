<script lang="ts">
import type { Account, AccountCollection, Collection, Currency } from "+/entity"

import CollectionCatalog from "$/catalog/collection.svelte"
import AccountCard from "%/collections/account_card.svelte"

export let isConnecting: boolean
export let progressRate: number
export let selectedCollection: Collection
export let data: AccountCollection[]
export let accounts: Account[]
export let currencies: Currency[]
</script>

<CollectionCatalog collectiveName="Linked Accounts" {isConnecting} {data} {progressRate}>
	<svelte:fragment slot="filled_collection_description">
		Below are the accounts under to collection named "{selectedCollection.name}". Expect some of them to be shown in dashboard if this collection is included in one the numerical tools.
	</svelte:fragment>
	<svelte:fragment slot="cards">
		{#each data as entity(entity.id)}
			<AccountCard data={entity} {accounts} {currencies} on:remove/>
		{/each}
	</svelte:fragment>
	<svelte:fragment slot="empty_collection_description">
		There are no available accounts at the moment.
		Link an account to view.
	</svelte:fragment>
</CollectionCatalog>
