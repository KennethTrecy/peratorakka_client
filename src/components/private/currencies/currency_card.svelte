<script lang="ts">
import type { Currency } from "+/entity"

import { createEventDispatcher } from "svelte"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/currencies/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let data: Currency

const dispatch = createEventDispatcher<{
	"remove": Currency
}>()
let code = data.code
let name = data.name
let presentationalPrecision = data.presentational_precision

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_currency_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/currencies/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				code,
				name,
				"presentational_precision": presentationalPrecision
			}
		},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"currency": {
				code,
				name,
				"presentational_precision": presentationalPrecision
			}
		})
	}
)

function resetDraft() {
	code = data.code
	name = data.name
	presentationalPrecision = data.presentational_precision
}
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
		bind:code={code}
		bind:name={name}
		bind:presentationalPrecision={presentationalPrecision}
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
			May show up to {data.presentational_precision} significant digits.
		</ShortParagraph>
	</svelte:fragment>
</CollectionItem>
