<script lang="ts">
import type { Currency, Account, AcceptableAccountKind } from "+/entity"

import { acceptableAccountKinds } from "#/entity"

import checkArchivedState from "$/utility/check_archived_state"
import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/accounts/basic_form.svelte"
import CardItem from "$/catalog/card_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	currencies,
	data = $bindable(),
	remove
}: {
	currencies: Currency[]
	data: Account
	remove: (resource: Account) => void
} = $props()

let currencyID = $state(`${data.currency_id}`)
let name = $state(data.name)
let description = $state(data.description)
let kind = $state(fallbackToAceptableKind(data.kind))
let forceDisabledFields: (keyof Account)[] = [
	"currency_id",
	// "kind"
]

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_account_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let associatedCurrency = $derived(currencies.find(
	currency => currency.id === parseInt(currencyID)
))
let friendlyKind = $derived(convertSnakeCaseToProperCase(data.kind).toLocaleLowerCase())
let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/accounts/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				"currency_id": parseInt(currencyID),
				name,
				description,
				kind
			}
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"account": {
				"currency_id": parseInt(currencyID),
				name,
				description,
				kind
			}
		})
	}
))

function resetDraft() {
	currencyID = `${data.currency_id}`
	name = data.name
	description = data.description
	kind = fallbackToAceptableKind(data.kind)
}

function fallbackToAceptableKind(kind: string): AcceptableAccountKind {
	return isAcceptable(kind) ? kind : acceptableAccountKinds[0]
}

function isAcceptable(kind: string): kind is AcceptableAccountKind {
	return (<string[]>[ ...acceptableAccountKinds ]).indexOf(kind) > -1
}
</script>

<CardItem
	label={data.name}
	{isArchived}
	options={restorableItemOptions}
	{resetDraft}>
	{#snippet edit_form({ confirmEdit, cancelEdit, isConnecting, errors })}
		<BasicForm
			id={formID}
			bind:currencyID={currencyID}
			bind:name={name}
			bind:description={description}
			bind:kind={kind}
			{IDPrefix}
			{currencies}
			{isConnecting}
			{errors}
			{forceDisabledFields}
			onsubmit={confirmEdit}>
			{#snippet button_group()}
				<EditActionCardButtonPair
					disabled={isConnecting}
					{cancelEdit}/>
			{/snippet}
		</BasicForm>
	{/snippet}
	{#snippet delete_confirmation_message()}
		<ShortParagraph>
			Deleting this account may prevent related data from being shown temporarily.
		</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency?.code ?? "???"} as its currency.
		</ShortParagraph>
	{/snippet}
	{#snippet restore_confirmation_message()}
		<ShortParagraph>
			Restoring this account may show related data.
		</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency?.code ?? "???"} as its currency.
		</ShortParagraph>
	{/snippet}
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph>
			Deleting this account may prevent related data from being shown permanently.
		</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency?.code ?? "???"} as its currency.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		{#if data.description}
			<ShortParagraph>{data.description}</ShortParagraph>
		{/if}
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency?.code ?? "???"} as its currency. The
			account ID is {data.id}.
		</ShortParagraph>
	{/snippet}
</CardItem>
