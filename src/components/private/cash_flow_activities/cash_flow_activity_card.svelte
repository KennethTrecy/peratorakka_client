<script lang="ts">
import type { CashFlowActivity } from "+/entity"

import { createEventDispatcher } from "svelte"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/cash_flow_activities/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let data: CashFlowActivity

const dispatch = createEventDispatcher<{
	"remove": CashFlowActivity
}>()
let name = data.name
let description = data.description

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_cash_flow_activity_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/cash_flow_activities/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				name,
				description
			}
		},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"cash_flow_activity": {
				name,
				description
			}
		})
	}
)

function resetDraft() {
	name = data.name
	description = data.description
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
		Deleting this cash flow activity may cause inaccuracy of the cash flow statements.
	</ShortParagraph>
	<ShortParagraph slot="restore_confirmation_message">
		Restoring this cash flow activity may cause inaccuracy of the cash flow statements.
	</ShortParagraph>
	<ShortParagraph slot="force_delete_confirmation_message">
		Deleting this cash flow activity may cause inaccuracy of the cash flow statements permanently.
	</ShortParagraph>
	<ShortParagraph slot="resource_info">
		{data.description}
	</ShortParagraph>
</CollectionItem>
