<script lang="ts">
import type { PrecisionFormat } from "+/entity"

import { createEventDispatcher } from "svelte"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/precision_formats/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let data: PrecisionFormat

const dispatch = createEventDispatcher<{
	"remove": PrecisionFormat
}>()
let name = data.name
let minimumPresentationalPrecision = data.minimum_presentational_precision
let maximumPresentationalPrecision = data.maximum_presentational_precision

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_precision_format_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/precision_formats/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				name,
				"minimum_presentational_precision": minimumPresentationalPrecision,
				"maximum_presentational_precision": maximumPresentationalPrecision
			}
		},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"precision_format": {
				name,
				"minimum_presentational_precision": minimumPresentationalPrecision,
				"maximum_presentational_precision": maximumPresentationalPrecision
			}
		})
	}
)

function resetDraft() {
	name = data.name
	minimumPresentationalPrecision = data.minimum_presentational_precision
	maximumPresentationalPrecision = data.maximum_presentational_precision
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
		bind:minimumPresentationalPrecision={minimumPresentationalPrecision}
		bind:maximumPresentationalPrecision={maximumPresentationalPrecision}
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
		Deleting this precision format may prevent related data from being shown temporarily.
	</ShortParagraph>
	<ShortParagraph slot="restore_confirmation_message">
		Restoring this precision format may show related data.
	</ShortParagraph>
	<ShortParagraph slot="force_delete_confirmation_message">
		Deleting this precision format may prevent related data from being shown permanently.
	</ShortParagraph>
	<svelte:fragment slot="resource_info">
		<ShortParagraph>
			Resources using this setting may show {data.minimum_presentational_precision} to {data.maximum_presentational_precision} significant digits.
		</ShortParagraph>
	</svelte:fragment>
</CollectionItem>
