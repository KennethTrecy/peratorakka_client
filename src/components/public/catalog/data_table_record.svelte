<script lang="ts">
import type {
	CardStatus,
	DataTableCellKind,
	DataTableCellStatus,
	RestorableItemOptions
} from "+/component"

import { createEventDispatcher } from "svelte"
import { get } from "svelte/store"

import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableHeader from "$/catalog/data_table_header.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"
import Flex from "$/layout/flex.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"
import TextButton from "$/button/text.svelte"
import TextCardButton from "$/button/card/text.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

export let label: string
export let isArchived: boolean
export let headerStatus: DataTableCellStatus = "present"
export let options: RestorableItemOptions
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

	await requestUpdate()
	if (get(updateErrors).length === 0) {
		updateErrors.set([])
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

$: actionCellKind = (
		isEditing
		|| isConfirmingDeletion
		|| isConfirmingRestoration
		|| isConfirmingForceDeletion
		? "descriptive"
		: "representative"
	) as DataTableCellKind
</script>

<DataTableRow>
	<slot name="leading_cells"/>
	{#if $$slots.main_cell}
		<slot name="main_cell" {label} {headerStatus}/>
	{:else}
		<DataTableHeader scope="row" kind="representative" status={headerStatus}>
			{label}
		</DataTableHeader>
	{/if}
	<slot name="trailing_cells"/>
	<DataTableCell kind={actionCellKind}>
		{#if isConfirmingDeletion || isConfirmingRestoration || isConfirmingForceDeletion}
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
						{/if}
					</Flex>
				</div>
				<div class="card_action">
					<TextCardButton
						kind="button"
						disabled={$isConfirming}
						label="Confirm"
						on:click={confirmAction}/>
					<TextCardButton
						kind="button"
						label="Cancel"
						on:click={startReading}/>
				</div>
			</article>
		{:else if isEditing}
			<slot
				name="edit_form"
				{confirmEdit}
				{cancelEdit}
				isConnecting={$isConfirming}
				errors={$updateErrors}/>
		{:else}
			<slot name="other_info"/>
			{#if isArchived}
				<TextButton
					kind="submit"
					label="Restore"
					on:click={confirmRestoration}/>
				<TextButton
					kind="button"
					label="Force Delete"
					on:click={confirmForceDeletion}/>
			{:else}
				<TextButton
					kind="button"
					label="Edit"
					on:click={startEditing}/>
				<TextButton
					kind="button"
					label="Delete"
					on:click={confirmDeletion}/>
			{/if}
			<slot name="additional_buttons"/>
		{/if}
	</DataTableCell>
</DataTableRow>

<style lang="scss">
@use "@/components/third-party/index";
</style>
