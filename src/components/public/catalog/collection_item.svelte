<script lang="ts">
import type { CardStatus, GridCellKind, RestorableItemOptions } from "+/component"

import { createEventDispatcher } from "svelte"
import { get } from "svelte/store"

import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

export let label: string
export let isArchived: boolean
export let options: RestorableItemOptions
export let kind: GridCellKind = "narrow"
$: isConnectingToUpdate = options.isConnectingToUpdate
$: updateErrors = options.updateErrors
$: requestUpdate = options.requestUpdate
$: isConnectingToDelete = options.isConnectingToDelete
$: deleteErrors = options.deleteErrors
$: requestDelete = options.requestDelete
$: isConnectingToRestore = options.isConnectingToRestore
$: restoreErrors = options.restoreErrors
$: requestRestore = options.requestRestore
$: isConnectingToForceDelete = options.isConnectingToForceDelete
$: forceDeleteErrors = options.forceDeleteErrors
$: requestForceDelete = options.requestForceDelete

const dispatch = createEventDispatcher<{
	"resetDraft": void
}>()

let status: CardStatus = "reading"
$: isEditing = status === "editing"
$: isConfirmingDeletion = status === "confirming_deletion"
$: isConfirmingRestoration = status === "confirming_restoration"
$: isConfirmingForceDeletion = status === "confirming_nullification"

function startReading() {
	status = "reading"
}

function startEditing() {
	status = "editing"
}

function confirmDeletion() {
	status = "confirming_deletion"
}

function confirmRestoration() {
	status = "confirming_restoration"
}

function confirmForceDeletion() {
	status = "confirming_nullification"
}

async function confirmEdit(event: SubmitEvent) {
	event.preventDefault()

	updateErrors.set([])
	if (get(updateErrors).length === 0) {
		await requestUpdate()
		startReading()
	}
}

async function confirmDelete() {
	deleteErrors.set([])
	await requestDelete()
}

async function confirmRestore() {
	restoreErrors.set([])
	await requestRestore()
}

async function confirmForceDelete() {
	forceDeleteErrors.set([])
	await requestForceDelete()
}

function cancelEdit() {
	startReading()
	dispatch("resetDraft")
}

$: isConfirming = isEditing
	? isConnectingToUpdate
	: isConfirmingDeletion
		? isConnectingToDelete
		: isConfirmingRestoration
			? isConnectingToRestore
			: isConnectingToForceDelete

$: confirmAction = isConfirmingDeletion
	? confirmDelete
	: isConfirmingRestoration
		? confirmRestore
		: confirmForceDelete
</script>

<GridCell {kind}>
	{#if isEditing}
		<slot
			name="edit_form"
			{confirmEdit}
			{cancelEdit}
			isConnecting={$isConfirming}
			errors={$updateErrors}/>
	{:else}
		<article class="card">
			<div class="card-content">
				<Flex mustPad={false}>
					{#if isConfirmingDeletion}
						<WeakenedTertiaryHeading>
							Delete {label}?
						</WeakenedTertiaryHeading>
						<slot name="delete_confirmation_message"/>
						{#each $deleteErrors as error}
							<ShortParagraph>
								{error.message}
							</ShortParagraph>
						{/each}
					{:else if isConfirmingRestoration}
						<WeakenedTertiaryHeading>
							Restore {label}?
						</WeakenedTertiaryHeading>
						<slot name="restore_confirmation_message"/>
						{#each $restoreErrors as error}
							<ShortParagraph>
								{error.message}
							</ShortParagraph>
						{/each}
					{:else if isConfirmingForceDeletion}
						<WeakenedTertiaryHeading>
							Force delete {label}?
						</WeakenedTertiaryHeading>
						<slot name="force_delete_confirmation_message"/>
						{#each $forceDeleteErrors as error}
							<ShortParagraph>
								{error.message}
							</ShortParagraph>
						{/each}
					{:else}
						<WeakenedTertiaryHeading>
							{label}
						</WeakenedTertiaryHeading>
						<slot name="resource_info"/>
					{/if}
				</Flex>
			</div>
			<div class="card-action">
				{#if isConfirmingDeletion || isConfirmingRestoration || isConfirmingForceDeletion}
					<TextCardButton
						kind="button"
						disabled={$isConfirming}
						label="Confirm"
						on:click={confirmAction}/>
					<TextCardButton
						kind="button"
						label="Cancel"
						on:click={startReading}/>
				{:else if isArchived}
					<TextCardButton
						kind="submit"
						label="Restore"
						on:click={confirmRestoration}/>
					<TextCardButton
						kind="button"
						label="Force Delete"
						on:click={confirmForceDeletion}/>
				{:else}
					<TextCardButton
						kind="submit"
						label="Edit"
						on:click={startEditing}/>
					{#if !$$slots.delete_confirmation_message && !$$slots.restore_confirmation_message}
						<TextCardButton
							kind="button"
							label="Force Delete"
							on:click={confirmForceDeletion}/>
					{:else}
						<TextCardButton
							kind="button"
							label="Delete"
							on:click={confirmDeletion}/>
					{/if}
				{/if}
			</div>
		</article>
	{/if}
</GridCell>

<style lang="scss">
@use "@/components/third-party/index";
</style>
