<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type { ButtonKind, ItemStatus, RestorableItemOptions } from "+/component"

import { get } from "svelte/store"

import Flex from "$/layout/flex.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

let {
	label,
	isArchived,
	options,
	resetDraft,
	action_button,
	edit_form,
	delete_confirmation_message,
	restore_confirmation_message,
	force_delete_confirmation_message,
	item
}: {
	label: string
	isArchived: boolean
	options: RestorableItemOptions
	resetDraft: () => void
	action_button: Snippet<[{
		kind: ButtonKind
		disabled?: boolean
		label: string
		onclick: (event: MouseEvent) => void
	}]>
	edit_form?: Snippet<[{
		isConnecting: boolean
		errors: GeneralError[]
		confirmEdit: (event: SubmitEvent) => void
		cancelEdit: () => void
	}]>
	delete_confirmation_message?: Snippet
	restore_confirmation_message?: Snippet
	force_delete_confirmation_message?: Snippet
	item: Snippet<[{
		isEditing: boolean
		isConnecting: boolean
		isConfirmingDeletion: boolean
		isConfirmingRestoration: boolean
		isConfirmingForceDeletion: boolean
		updateErrors: GeneralError[]
		confirmEdit: (event: SubmitEvent) => void
		cancelEdit: () => void
		notice: Snippet
		action_buttons: Snippet
	}]>
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

let status: ItemStatus = $state<ItemStatus>("reading")
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

let isConnecting = $derived(
	isEditing
		? isConnectingToUpdate
		: isConfirmingDeletion
			? isConnectingToDelete
			: isConfirmingRestoration
				? isConnectingToRestore
				: isConnectingToForceDelete
)

let confirmAction = $derived(
	isConfirmingDeletion
		? confirmDelete
		: isConfirmingRestoration
			? confirmRestore
			: confirmForceDelete
)
</script>

{#snippet notice()}
	<Flex mustPad={false}>
		{#if isConfirmingDeletion}
			<WeakenedTertiaryHeading>
				Delete {label}?
			</WeakenedTertiaryHeading>
			{@render delete_confirmation_message?.()}
			{#each $deleteErrors as error}
				<ShortParagraph>
					{error.message}
				</ShortParagraph>
			{/each}
		{:else if isConfirmingRestoration}
			<WeakenedTertiaryHeading>
				Restore {label}?
			</WeakenedTertiaryHeading>
			{@render restore_confirmation_message?.()}
			{#each $restoreErrors as error}
				<ShortParagraph>
					{error.message}
				</ShortParagraph>
			{/each}
		{:else if isConfirmingForceDeletion}
			<WeakenedTertiaryHeading>
				Force delete {label}?
			</WeakenedTertiaryHeading>
			{@render force_delete_confirmation_message?.()}
			{#each $forceDeleteErrors as error}
				<ShortParagraph>
					{error.message}
				</ShortParagraph>
			{/each}
		{/if}
	</Flex>
{/snippet}

{#snippet action_buttons()}
	{#if isConfirmingDeletion || isConfirmingRestoration || isConfirmingForceDeletion}
		{@render action_button({
			"kind": "button",
			"disabled": $isConnecting,
			"label": "Confirm",
			"onclick": confirmAction
		})}
		{@render action_button({
			"kind": "button",
			"label": "Cancel",
			"onclick": startReading
		})}
	{:else if isArchived}
		{@render action_button({
			"kind": "submit",
			"label": "Restore",
			"onclick": confirmRestoration
		})}
		{@render action_button({
			"kind": "button",
			"label": "Force Delete",
			"onclick": confirmForceDeletion
		})}
	{:else}
		{#if edit_form}
			{@render action_button({
				"kind": "button",
				"label": "Edit",
				"onclick": startEditing
			})}
		{/if}
		{#if !delete_confirmation_message && !restore_confirmation_message}
			{#if force_delete_confirmation_message}
				{@render action_button({
					"kind": "button",
					"label": "Force Delete",
					"onclick": confirmForceDeletion
				})}
			{/if}
		{:else}
			{@render action_button({
				"kind": "button",
				"label": "Delete",
				"onclick": confirmDeletion
			})}
		{/if}
	{/if}
{/snippet}

{@render item({
	isEditing,
	isConnecting: $isConnecting,
	isConfirmingDeletion,
	isConfirmingRestoration,
	isConfirmingForceDeletion,
	updateErrors: $updateErrors,
	confirmEdit,
	cancelEdit,
	notice,
	action_buttons
})}
