<script lang="ts">
import type { Account, AccountCollection, Currency } from "+/entity"

import { createEventDispatcher } from "svelte"

import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import CollectionItem from "$/catalog/collection_item.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let data: AccountCollection
export let accounts: Account[]
export let currencies: Currency[]

$: account = accounts.find(account => account.id === data.account_id)
$: console.log("card",{account})
// $: currency = currencies.find(currency => currency.id === account.currency_id) as Currency
const dispatch = createEventDispatcher<{
	"remove": AccountCollection
}>()

$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/account_collections/${data.id}`,
	{
		"updateCacheData": () => {},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => data as unknown as Record<string, unknown>
	}
)
</script>

<CollectionItem
	label={account.name}
	isArchived={false}
	options={restorableItemOptions}>
	<ShortParagraph slot="force_delete_confirmation_message">
		Deleting this collection may prevent related data from being shown permanently.
	</ShortParagraph>
	<svelte:fragment slot="resource_info">
		<ShortParagraph>
			{account.description}
		</ShortParagraph>
	</svelte:fragment>
</CollectionItem>
