<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { CardStatus } from "+/component"
	import type { Writable } from "svelte/store"
	import type { Account } from "+/entity"

	import { createEventDispatcher } from "svelte"

	import DataTableAccountCell from "$/catalog/data_table_account_cell.svelte"
	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"
	import TextButton from "$/button/text.svelte"

	export let label: string
	export let debitAccount: Account
	export let creditAccount: Account
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
	$: debitAccountName = debitAccount.name
	$: creditAccountName = creditAccount.name

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
		<DataTableHeader>{label}</DataTableHeader>
		<DataTableAccountCell
			rawDebit={[ debitAccountName ]}
			rawCredit={[ creditAccountName ]}/>
		<slot name="special_cells"/>
		<DataTableCell>
			{#if isConfirmingDeletion}
				<TextButton
					class="mdc-button--raised"
					kind="button"
					disabled={isConnectingToDelete}
					label="Confirm"
					on:click={confirmDelete}/>
				<TextButton
					class="mdc-button--outlined"
					kind="button"
					disabled={isConnectingToDelete}
					label="Cancel"
					on:click={startReading}/>
			{:else}
				<TextButton
					class="mdc-button--raised"
					kind="submit"
					label="Edit"
					on:click={startEditing}/>
				<TextButton
					class="mdc-button--outlined"
					kind="button"
					label="Delete"
					on:click={confirmDeletion}/>
			{/if}
		</DataTableCell>
	{/if}
</DataTableRow>
