<script lang="ts">
import type { Collection } from "+/entity"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/collections/basic_form.svelte"
import CardItem from "$/catalog/card_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import TextCardButton from "$/button/card/text.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	data = $bindable(),
	remove,
	view
}: {
	data: Collection
	remove: (resource: Collection) => void
	view: (resource: Collection) => void
} = $props()

let name = $state(data.name)
let description = $state(data.description)

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_collection_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/collections/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				description,
				name
			}
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"collection": {
				description,
				name
			}
		})
	}
))

function resetDraft() {
	name = data.name
	description = data.description
}

function viewDetail() {
	view(data)
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
			bind:name={name}
			bind:description={description}
			{IDPrefix}
			{isConnecting}
			{errors}
			onsubmit={confirmEdit}>
			{#snippet button_group()}
				<EditActionCardButtonPair
					disabled={isConnecting}
					cancelEdit={cancelEdit}/>
			{/snippet}
		</BasicForm>
	{/snippet}
	{#snippet delete_confirmation_message()}
		<ShortParagraph >
			Deleting this collection may prevent related data from being shown temporarily.
		</ShortParagraph>
	{/snippet}
	{#snippet restore_confirmation_message()}
		<ShortParagraph >
			Restoring this collection may show related data.
		</ShortParagraph>
	{/snippet}
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph >
			Deleting this collection may prevent related data from being shown permanently.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		<ShortParagraph>
			{data.description}
		</ShortParagraph>
		<ShortParagraph>
			The collection ID is {data.id}.
		</ShortParagraph>
	{/snippet}
	{#snippet extra_buttons()}
		<TextCardButton
			kind="button"
			label="View"
			onclick={viewDetail}/>
	{/snippet}
</CardItem>
