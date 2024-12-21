<script lang="ts">
import type { Collection } from "+/entity"

import { createEventDispatcher } from "svelte"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/collections/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import TextCardButton from "$/button/card/text.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let data: Collection

const dispatch = createEventDispatcher<{
	"remove": Collection
	"view": Collection
}>()
let name = data.name
let description = data.description

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_collection_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/collections/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				description,
				name
			}
		},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"collection": {
				description,
				name
			}
		})
	}
)

function resetDraft() {
	name = data.name
	description = data.description
}

function viewDetail() {
	dispatch("view", data)
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
		bind:name={name}
		bind:description={description}
		{IDPrefix}
		{isConnecting}
		{errors}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={isConnecting}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<ShortParagraph slot="delete_confirmation_message">
		Deleting this collection may prevent related data from being shown temporarily.
	</ShortParagraph>
	<ShortParagraph slot="restore_confirmation_message">
		Restoring this collection may show related data.
	</ShortParagraph>
	<ShortParagraph slot="force_delete_confirmation_message">
		Deleting this collection may prevent related data from being shown permanently.
	</ShortParagraph>
	<svelte:fragment slot="resource_info">
		<ShortParagraph>
			{data.description}
		</ShortParagraph>
		<ShortParagraph>
			The collection ID is {data.id}.
		</ShortParagraph>
	</svelte:fragment>
	<TextCardButton
		slot="extra_buttons"
		kind="button"
		label="View"
		on:click={viewDetail}/>
</CollectionItem>
