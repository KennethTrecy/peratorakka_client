<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { CardStatus } from "+/component"
	import type { Writable } from "svelte/store"

	import { createEventDispatcher } from "svelte"

	import DataTableRow from "$/catalog/data_table_row.svelte"
	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import TextCardButton from "$/button/card/text.svelte"

	export let label: string
	export let updateErrors: Writable<GeneralError[]>
	export let requestUpdate: () => Promise<void>
	export let isConnectingToDelete: boolean
	export let deleteErrors: Writable<GeneralError[]>
	export let requestDelete: () => Promise<void>

	const dispatch = createEventDispatcher<{
		"delete": void
		"resetDraft": void
	}>()

	let status: CardStatus = "reading"
	$: isEditing = status === "editing"
	$: isConfirmingDeletion = status === "confirming_deletion"

	function startReading() {
		status = "reading"
	}

	function startEditing() {
		status = "editing"
	}

	function confirmDeletion() {
		status = "confirming_deletion"
	}

	async function confirmEdit(event: SubmitEvent) {
		event.preventDefault()

		await requestUpdate()
		updateErrors.set([])
		startReading()
	}

	async function confirmDelete() {
		await requestDelete()
		deleteErrors.set([])
	}

	function cancelEdit() {
		startReading()
		dispatch("resetDraft")
	}
</script>

<DataTableRow>
	{#if isEditing}
		<slot
			name="edit_form"
			{confirmEdit}
			{cancelEdit}/>
	{:else}
		<DataTableCell>{label}</DataTableCell>
		<DataTableCell>
			{#if isConfirmingDeletion}
				<TextCardButton
					kind="button"
					disabled={isConnectingToDelete}
					label="Confirm"
					on:click={confirmDelete}/>
				<TextCardButton
					kind="button"
					disabled={isConnectingToDelete}
					label="Cancel"
					on:click={startReading}/>
			{:else}
				<TextCardButton
					kind="submit"
					label="Edit"
					on:click={startEditing}/>
				<TextCardButton
					kind="button"
					label="Delete"
					on:click={confirmDeletion}/>
			{/if}
		</DataTableCell>
	{/if}
</DataTableRow>
