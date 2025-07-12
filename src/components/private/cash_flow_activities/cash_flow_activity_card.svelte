<script lang="ts">
import type { CashFlowActivity } from "+/entity"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/cash_flow_activities/basic_form.svelte"
import CardItem from "$/catalog/card_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	data = $bindable(),
	remove
}: {
	data: CashFlowActivity
	remove: (resource: CashFlowActivity) => void
} = $props()

let name = $state(data.name)
let description = $state(data.description)

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_cash_flow_activity_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/cash_flow_activities/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				name,
				description
			}
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"cash_flow_activity": {
				name,
				description
			}
		})
	}
))

function resetDraft() {
	name = data.name
	description = data.description
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
					{cancelEdit}/>
			{/snippet}
		</BasicForm>
	{/snippet}
	{#snippet delete_confirmation_message()}
		<ShortParagraph>
			Deleting this cash flow activity may cause inaccuracy of the cash flow statements.
		</ShortParagraph>
	{/snippet}
	{#snippet restore_confirmation_message()}
		<ShortParagraph>
			Restoring this cash flow activity may cause inaccuracy of the cash flow statements.
		</ShortParagraph>
	{/snippet}
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph>
			Deleting this cash flow activity may cause inaccuracy of the cash flow statements permanently.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		{#if data.description}
			<ShortParagraph>{data.description}</ShortParagraph>
		{/if}
		<ShortParagraph>
			The cash flow activity ID is {data.id}.
		</ShortParagraph>
	{/snippet}
</CardItem>
