<script lang="ts">
import type { Snippet } from "svelte"
import type { Writable } from "svelte/store"
import type { GeneralError } from "+/rest"
import type { GridCellKind, RestorableItemOptions } from "+/component"

import { untrack } from "svelte"

import BasicForm from "%/dashboard/basic_form.svelte"
import CardItem from "$/catalog/card_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import TextCardButton from "$/button/card/text.svelte"

let {
	IDPrefix,
	formID,
	name,
	referenceDate,
	kind,
	rowSpan,
	isConnecting,
	errors,
	view,
	refresh,
	resource_info
}: {
	IDPrefix: string
	formID: string
	name: string
	referenceDate: string
	kind: GridCellKind
	rowSpan?: number
	isConnecting: Writable<boolean>
	errors: Writable<GeneralError[]>
	view: (referenceDate: string) => Promise<void>
	refresh: () => Promise<void>
	resource_info: Snippet
} = $props()

let currentReferenceDate = $state(referenceDate)

let restorableItemOptions = $derived<RestorableItemOptions>({
	"isConnectingToUpdate": isConnecting,
	"updateErrors": errors,
	"requestUpdate": async () => await view(currentReferenceDate),
	"isConnectingToDelete": isConnecting,
	"deleteErrors": errors,
	"requestDelete": async () => {},
	"isConnectingToRestore": isConnecting,
	"restoreErrors": errors,
	"requestRestore": async () => {},
	"isConnectingToForceDelete": isConnecting,
	"forceDeleteErrors": errors,
	"requestForceDelete": async () => {}
})

function resetDraft() {
	currentReferenceDate = referenceDate
}

$effect(() => {
	const newReferenceDate = referenceDate
	untrack(() => {
		currentReferenceDate = newReferenceDate
	})
})
</script>

<CardItem
	label={name}
	options={restorableItemOptions}
	isArchived={false}
	{kind}
	{rowSpan}
	{resetDraft}
	{resource_info}>
	{#snippet edit_form({ confirmEdit, cancelEdit, isConnecting, errors })}
		<BasicForm
			id={formID}
			bind:referenceDate={currentReferenceDate}
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
	{#snippet extra_buttons()}
		<TextCardButton
			kind="button"
			label="Refresh"
			onclick={refresh}/>
	{/snippet}
</CardItem>
