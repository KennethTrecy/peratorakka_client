<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type { CardStatus, GridCellKind, RestorableItemOptions } from "+/component"

import { get } from "svelte/store"

import Flex from "$/layout/flex.svelte"
import GridCell from "$/layout/grid_cell.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import TextCardButton from "$/button/card/text.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

let {
	label,
	isArchived,
	options,
	kind = "narrow",
	resetDraft,
	edit_form,
	delete_confirmation_message,
	restore_confirmation_message,
	force_delete_confirmation_message,
	resource_info,
	extra_buttons
}: {
	label: string
	isArchived: boolean
	options: RestorableItemOptions
	kind?: GridCellKind
	resetDraft: () => void
	edit_form?: Snippet<[ {
		isConnecting: boolean
		errors: GeneralError[]
		confirmEdit: (event: SubmitEvent) => void
		cancelEdit: () => void
	}]>
	delete_confirmation_message: Snippet
	restore_confirmation_message: Snippet
	force_delete_confirmation_message: Snippet
	resource_info: Snippet
	extra_buttons?: Snippet
} = $props()

let isConnectingToUpdate = $derived(options.isConnectingToUpdate)
let updateErrors = $derived(options.updateErrors)
let requestUpdate = $derived(options.requestUpdate)
let isConnectingToDelete = $derived(options.isConnectingToDelete)
let deleteErrors = $derived(options.deleteErrors)
let requestDelete = $derived(options.requestDelete)
let isConnectingToRestore = $derived(options.isConnectingToRestore)
let restoreErrors = $derived(options.restoreErrors)
let requestRestore = $derived(options.requestRestore)
let isConnectingToForceDelete = $derived(options.isConnectingToForceDelete)
let forceDeleteErrors = $derived(options.forceDeleteErrors)
let requestForceDelete = $derived(options.requestForceDelete)

let status: CardStatus = $state<CardStatus>("reading")
let isEditing = $derived(status === "editing")
let isConfirmingDeletion = $derived(status === "confirming_deletion")
let isConfirmingRestoration = $derived(status === "confirming_restoration")
let isConfirmingForceDeletion = $derived(status === "confirming_nullification")

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

	await requestUpdate()

	if (get(updateErrors).length === 0) {
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
	resetDraft()
}

let isConfirming = $derived(isEditing
	? isConnectingToUpdate
	: isConfirmingDeletion
		? isConnectingToDelete
		: isConfirmingRestoration
			? isConnectingToRestore
			: isConnectingToForceDelete)

let confirmAction = $derived(isConfirmingDeletion
	? confirmDelete
	: isConfirmingRestoration
		? confirmRestore
		: confirmForceDelete)
</script>

<GridCell {kind}>
	{#if isEditing}
		{@render edit_form?.({
			isConnecting: $isConfirming,
			errors: $updateErrors,
			confirmEdit,
			cancelEdit
		})}
	{:else}
		<article class="card">
			<div class="card-content">
				<Flex mustPad={false}>
					{#if isConfirmingDeletion}
						<WeakenedTertiaryHeading>
							Delete {label}?
						</WeakenedTertiaryHeading>
						{@render delete_confirmation_message()}
						{#each $deleteErrors as error}
							<ShortParagraph>
								{error.message}
							</ShortParagraph>
						{/each}
					{:else if isConfirmingRestoration}
						<WeakenedTertiaryHeading>
							Restore {label}?
						</WeakenedTertiaryHeading>
						{@render restore_confirmation_message()}
						{#each $restoreErrors as error}
							<ShortParagraph>
								{error.message}
							</ShortParagraph>
						{/each}
					{:else if isConfirmingForceDeletion}
						<WeakenedTertiaryHeading>
							Force delete {label}?
						</WeakenedTertiaryHeading>
						{@render force_delete_confirmation_message()}
						{#each $forceDeleteErrors as error}
							<ShortParagraph>
								{error.message}
							</ShortParagraph>
						{/each}
					{:else}
						<WeakenedTertiaryHeading>
							{label}
						</WeakenedTertiaryHeading>
						{@render resource_info()}
					{/if}
				</Flex>
			</div>
			<div class="card-action">
				{#if isConfirmingDeletion || isConfirmingRestoration || isConfirmingForceDeletion}
					<TextCardButton
						kind="button"
						disabled={$isConfirming}
						label="Confirm"
						onclick={confirmAction}/>
					<TextCardButton
						kind="button"
						label="Cancel"
						onclick={startReading}/>
				{:else if isArchived}
					<TextCardButton
						kind="submit"
						label="Restore"
						onclick={confirmRestoration}/>
					<TextCardButton
						kind="button"
						label="Force Delete"
						onclick={confirmForceDeletion}/>
				{:else}
					{#if edit_form}
						<TextCardButton
							kind="button"
							label="Edit"
							onclick={startEditing}/>
					{/if}
					{#if !delete_confirmation_message && !restore_confirmation_message}
						<TextCardButton
							kind="button"
							label="Force Delete"
							onclick={confirmForceDeletion}/>
					{:else}
						<TextCardButton
							kind="button"
							label="Delete"
							onclick={confirmDeletion}/>
					{/if}
				{/if}
				{@render extra_buttons?.()}
			</div>
		</article>
	{/if}
</GridCell>
