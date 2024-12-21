<script lang="ts">
import type { Currency, Account, AcceptableAccountKind } from "+/entity"

import { createEventDispatcher } from "svelte"

import { acceptableAccountKinds } from "#/entity"

import checkArchivedState from "$/utility/check_archived_state"
import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/accounts/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let currencies: Currency[]
export let data: Account

const dispatch = createEventDispatcher<{
	"remove": Account
}>()
let currencyID = `${data.currency_id}`
let name = data.name
let description = data.description
let kind = fallbackToAceptableKind(data.kind)
let forceDisabledFields: (keyof Account)[] = [
	"currency_id",
	"kind"
]

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_account_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: associatedCurrency = currencies.find(
	currency => currency.id === parseInt(currencyID)
)
$: friendlyKind = convertSnakeCaseToProperCase(data.kind).toLocaleLowerCase()
$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/accounts/${data.id}`,
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
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"account": {
				"currency_id": parseInt(currencyID),
				name,
				description,
				kind
			}
		})
	}
)

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

<CollectionItem
	label={data.name}
	{isArchived}
	options={restorableItemOptions}
	on:resetDraft={resetDraft}>
	<BasicForm
		slot="edit_form"
		let:confirmEdit
		let:cancelEdit
		let:isConnecting
		let:errors
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
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={isConnecting}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<svelte:fragment slot="delete_confirmation_message">
		<ShortParagraph>
			Deleting this account may prevent related data from being shown temporarily.
		</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency?.code ?? "???"} as its currency.
		</ShortParagraph>
	</svelte:fragment>
	<svelte:fragment slot="restore_confirmation_message">
		<ShortParagraph>
			Restoring this account may show related data.
		</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency?.code ?? "???"} as its currency.
		</ShortParagraph>
	</svelte:fragment>
	<svelte:fragment slot="force_delete_confirmation_message">
		<ShortParagraph>
			Deleting this account may prevent related data from being shown permanently.
		</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency?.code ?? "???"} as its currency.
		</ShortParagraph>
	</svelte:fragment>
	<svelte:fragment slot="resource_info">
		<ShortParagraph>{data.description}</ShortParagraph>
		<ShortParagraph>
			This {friendlyKind} account uses {associatedCurrency?.code ?? "???"} as its currency.
		</ShortParagraph>
	</svelte:fragment>
</CollectionItem>
