<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { CardStatus, DataTableCellStatus } from "+/component"
	import type { Writable } from "svelte/store"
	import type { Account } from "+/entity"

	import { createEventDispatcher } from "svelte"
	import { get } from "svelte/store"

	import DataTableAccountCell from "$/catalog/data_table_account_cell.svelte"
	import DataTableCell from "$/catalog/data_table_cell.svelte"
	import DataTableHeader from "$/catalog/data_table_header.svelte"
	import DataTableRow from "$/catalog/data_table_row.svelte"
	import Flex from "$/layout/flex.svelte"
	import ShortParagraph from "$/typography/short_paragraph.svelte"
	import TextButton from "$/button/text.svelte"
	import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

	export let label: string
	export let debitAccount: Account
	export let creditAccount: Account
	export let updateErrors: Writable<GeneralError[]>
	export let requestUpdate: () => Promise<void>
	export let isConnectingToDelete: boolean
	export let deleteErrors: Writable<GeneralError[]>
	export let requestDelete: () => Promise<void>
	export let headerStatus: DataTableCellStatus = "present"

	const dispatch = createEventDispatcher<{
		"delete": void
		"resetDraft": void
	}>()

	let status: CardStatus = "reading"
	$: isEditing = status === "editing"
	$: isConfirmingDeletion = status === "confirming_deletion"
	$: debitAccountName = debitAccount.name
	$: creditAccountName = creditAccount.name
	$: debitExistence = debitAccount.deleted_at === null
	$: creditExistence = creditAccount.deleted_at === null

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
		if (get(updateErrors).length === 0) {
			updateErrors.set([])
			startReading()
		}
	}

	async function confirmDelete() {
		await requestDelete()
	}

	function cancelEdit() {
		startReading()
		dispatch("resetDraft")
	}
</script>

<DataTableRow>
	<slot name="leading_cells"/>
	<DataTableHeader scope="row" kind="representative" status={headerStatus}>
		{label}
	</DataTableHeader>
	<DataTableAccountCell
		rawDebitExistence={[ debitExistence ]}
		rawDebit={[ debitAccountName ]}
		rawCreditExistence={[ creditExistence ]}
		rawCredit={[ creditAccountName ]}/>
	<slot name="trailing_cells"/>
	<DataTableCell>
		{#if isConfirmingDeletion}
			<article class="mdc-card">
				<div class="mdc-card__content">
					<Flex>
						<WeakenedTertiaryHeading>
							Delete {label}?
						</WeakenedTertiaryHeading>
						<slot name="delete_confirmation_message"/>
						{#each $deleteErrors as error}
							<ShortParagraph>
								{error.message}
							</ShortParagraph>
						{/each}
					</Flex>
				</div>
				<div class="mdc-card__actions">
					<div class="mdc-card__action-buttons">
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
					</div>
				</div>
			</article>
		{:else if isEditing}
			<slot
				name="edit_form"
				{confirmEdit}
				{cancelEdit}/>
		{:else}
			<TextButton
				class="mdc-button--raised"
				kind="button"
				label="Edit"
				on:click={startEditing}/>
			<TextButton
				class="mdc-button--outlined"
				kind="button"
				label="Delete"
				on:click={confirmDeletion}/>
			<slot name="additional_buttons"/>
		{/if}
	</DataTableCell>
</DataTableRow>

<style lang="scss">
	@use "@/components/third-party/index";

	@use "@material/card";

	@include card.core-styles;
</style>
