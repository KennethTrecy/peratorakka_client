<script lang="ts">
import type { Account, AccountCollection, Collection, Currency } from "+/entity"

import CollectionCatalog from "$/catalog/collection.svelte"
import AccountCard from "%/collections/account_card.svelte"

let {
	selectedCollection,
	data,
	accounts,
	currencies,
	remove
}: {
	selectedCollection: Collection
	data: AccountCollection[]
	accounts: Account[]
	currencies: Currency[]
	remove: (resource: AccountCollection) => void
} = $props()
</script>

<CollectionCatalog collectiveName="Linked Accounts" isConnecting={false} {data} progressRate={1}>
	{#snippet filled_collection_description()}
		Below are the accounts under to collection named "{selectedCollection.name}". Expect some of
		them to be shown in dashboard if this collection is included in one the numerical tools.
	{/snippet}
	{#snippet cards()}
		{#each data as entity(entity.id)}
			<AccountCard data={entity} {accounts} {currencies} {remove}/>
		{/each}
	{/snippet}
	{#snippet empty_collection_description()}
		There are no available accounts at the moment.
		Link an account to view.
	{/snippet}
</CollectionCatalog>
