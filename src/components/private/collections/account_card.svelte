<script lang="ts">
import type { Account, AccountCollection, Currency } from "+/entity"

import { UNKNOWN_ACCOUNT } from "#/component"

import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import CardItem from "$/catalog/card_item.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	data,
	accounts,
	currencies,
	remove
}: {
	data: AccountCollection
	accounts: Account[]
	currencies: Currency[]
	remove: (resource: AccountCollection) => void
} = $props()

let account = $derived(accounts.find(account => account.id === data.account_id) ?? UNKNOWN_ACCOUNT)
let associatedCurrency = $derived(currencies.find(
	currency => currency.id === account.currency_id
))
let friendlyKind = $derived(convertSnakeCaseToProperCase(account.kind).toLocaleLowerCase())

let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/account_collections/${data.id}`,
	{
		"updateCacheData": () => {},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => data as unknown as Record<string, unknown>
	}
))
</script>

<CardItem
	label={account.name}
	isArchived={false}
	options={restorableItemOptions}>
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph >
			Deleting this collection may prevent related data from being shown permanently.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		<ShortParagraph>
			{account.description}
		</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency?.code ?? "???"} as its currency. The
			account ID is {data.id}.
		</ShortParagraph>
	{/snippet}
</CardItem>
