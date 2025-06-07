<script lang="ts">
import type { Currency, PrecisionFormat } from "+/entity"

import { createEventDispatcher } from "svelte"

import { UNKNOWN_OPTION } from "#/component"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/currencies/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let precisionFormats: PrecisionFormat[]
export let data: Currency

const dispatch = createEventDispatcher<{
	"remove": Currency
}>()
let precisionFormatID = UNKNOWN_OPTION
let code = data.code
let name = data.name

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_currency_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/currencies/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				precision_format_id: +precisionFormatID,
				code,
				name
			}
		},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"currency": {
				precision_format_id: precisionFormatID,
				code,
				name
			}
		})
	}
)

function resetDraft() {
	code = data.code
	name = data.name
	precisionFormatID = `${data.precision_format_id}`
}

$: precisionFormat = precisionFormats.find(
	precisionFormat => `${precisionFormat.id}` === precisionFormatID
)
</script>

<CollectionItem
	label={data.code}
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
		bind:precisionFormatID={precisionFormatID}
		bind:code={code}
		bind:name={name}
		{IDPrefix}
		{precisionFormats}
		{isConnecting}
		{errors}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={isConnecting}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<ShortParagraph slot="delete_confirmation_message">
		Deleting this currency may prevent related data from being shown temporarily.
	</ShortParagraph>
	<ShortParagraph slot="restore_confirmation_message">
		Restoring this currency may show related data.
	</ShortParagraph>
	<ShortParagraph slot="force_delete_confirmation_message">
		Deleting this currency may prevent related data from being shown permanently.
	</ShortParagraph>
	<svelte:fragment slot="resource_info">
		<ShortParagraph>
			{data.name}
		</ShortParagraph>
		<ShortParagraph>
			Numbers associated with this currency would be shown in {precisionFormat?.name ?? "unknown"} precision format.
		</ShortParagraph>
	</svelte:fragment>
</CollectionItem>
