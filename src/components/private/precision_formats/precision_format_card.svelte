<script lang="ts">
import type { PrecisionFormat } from "+/entity"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/precision_formats/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	data = $bindable(),
	remove
}: {
	data: PrecisionFormat
	remove: (resource: PrecisionFormat) => void
} = $props()

let name = $state(data.name)
let minimumPresentationalPrecision = $state(data.minimum_presentational_precision)
let maximumPresentationalPrecision = $state(data.maximum_presentational_precision)

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_precision_format_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/precision_formats/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				name,
				"minimum_presentational_precision": minimumPresentationalPrecision,
				"maximum_presentational_precision": maximumPresentationalPrecision
			}
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"precision_format": {
				name,
				"minimum_presentational_precision": minimumPresentationalPrecision,
				"maximum_presentational_precision": maximumPresentationalPrecision
			}
		})
	}
))

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
	{resetDraft}>
	{#snippet edit_form({ confirmEdit, cancelEdit, isConnecting, errors })}
		<BasicForm
			id={formID}
			bind:name={name}
			bind:minimumPresentationalPrecision={minimumPresentationalPrecision}
			bind:maximumPresentationalPrecision={maximumPresentationalPrecision}
			{IDPrefix}
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
		<ShortParagraph>
			Deleting this precision format may prevent related data from being shown temporarily.
		</ShortParagraph>
	{/snippet}
	{#snippet restore_confirmation_message()}
		<ShortParagraph>
			Restoring this precision format may show related data.
		</ShortParagraph>
	{/snippet}
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph>
			Deleting this precision format may prevent related data from being shown permanently.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		<ShortParagraph>
			Resources using this setting may show {data.minimum_presentational_precision} to {data.maximum_presentational_precision} significant digits.
		</ShortParagraph>
	{/snippet}
</CollectionItem>
