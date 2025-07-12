<script lang="ts">
import type { Currency, PrecisionFormat } from "+/entity"

import checkArchivedState from "$/utility/check_archived_state"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/currencies/basic_form.svelte"
import CardItem from "$/catalog/card_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	precisionFormats,
	data = $bindable(),
	remove
}: {
	precisionFormats: PrecisionFormat[]
	data: Currency
	remove: (resource: Currency) => void
} = $props()

let precisionFormatID = $state(`${data.precision_format_id}`)
let code = $state(data.code)
let name = $state(data.name)

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_currency_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/currencies/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				precision_format_id: +precisionFormatID,
				code,
				name
			}
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"currency": {
				precision_format_id: precisionFormatID,
				code,
				name
			}
		})
	}
))

function resetDraft() {
	code = data.code
	name = data.name
	precisionFormatID = `${data.precision_format_id}`
}

let precisionFormat = $derived(precisionFormats.find(
	precisionFormat => `${precisionFormat.id}` === precisionFormatID
))
</script>

<CardItem
	label={data.code}
	{isArchived}
	options={restorableItemOptions}
	{resetDraft}>
	{#snippet edit_form({ confirmEdit, cancelEdit, isConnecting, errors })}
		<BasicForm
			id={formID}
			bind:precisionFormatID={precisionFormatID}
			bind:code={code}
			bind:name={name}
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
			Deleting this currency may prevent related data from being shown temporarily.
		</ShortParagraph>
	{/snippet}
	{#snippet restore_confirmation_message()}
		<ShortParagraph >
			Restoring this currency may show related data.
		</ShortParagraph>
	{/snippet}
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph >
			Deleting this currency may prevent related data from being shown permanently.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		<ShortParagraph>
			{data.name}
		</ShortParagraph>
		<ShortParagraph>
			Numbers associated with this currency would be shown in {precisionFormat?.name ?? "unknown"} precision format.
		</ShortParagraph>
	{/snippet}
</CardItem>
