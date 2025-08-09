<script lang="ts">
import type { ItemDetail, PrecisionFormat } from "+/entity"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/item_details/basic_form.svelte"
import CardItem from "$/catalog/card_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	precisionFormats,
	data = $bindable(),
	remove
}: {
	precisionFormats: PrecisionFormat[]
	data: ItemDetail
	remove: (resource: ItemDetail) => void
} = $props()

let precisionFormatID = $state(`${data.precision_format_id}`)
let name = $state(data.name)
let unit = $state(data.unit)
let description = $state(data.description)

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_item_detail_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/item_details/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				precision_format_id: +precisionFormatID,
				name,
				unit,
				description
			}
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"item_detail": {
				precision_format_id: precisionFormatID,
				name,
				unit,
				description
			}
		})
	}
))

function resetDraft() {
	name = data.name
	unit = data.unit
	description = data.description
	precisionFormatID = `${data.precision_format_id}`
}

let precisionFormat = $derived(precisionFormats.find(
	precisionFormat => `${precisionFormat.id}` === precisionFormatID
))
</script>

<CardItem
	label={data.name}
	{isArchived}
	options={restorableItemOptions}
	{resetDraft}>
	{#snippet edit_form({ confirmEdit, cancelEdit, isConnecting, errors })}
		<BasicForm
			id={formID}
			bind:precisionFormatID={precisionFormatID}
			bind:name={name}
			bind:unit={unit}
			bind:description={description}
			{IDPrefix}
			{precisionFormats}
			{isConnecting}
			{errors}
			onsubmit={confirmEdit}>
			{#snippet button_group()}
				<EditActionCardButtonPair
					disabled={isConnecting}
					{cancelEdit}/>
			{/snippet}
		</BasicForm>
	{/snippet}
	{#snippet delete_confirmation_message()}
		<ShortParagraph >
			Deleting this item detail may prevent related data from being shown temporarily.
		</ShortParagraph>
	{/snippet}
	{#snippet restore_confirmation_message()}
		<ShortParagraph >
			Restoring this item detail may show related data.
		</ShortParagraph>
	{/snippet}
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph >
			Deleting this item detail may prevent related data from being shown permanently.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		<ShortParagraph>
			{data.name} abbreviated as {data.unit}.
		</ShortParagraph>
		<ShortParagraph>
			Numbers associated with this item detail would be shown in {precisionFormat?.name ?? "unknown"} precision format.
		</ShortParagraph>
	{/snippet}
</CardItem>
