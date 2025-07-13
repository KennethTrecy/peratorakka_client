<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type { RestorableItemOptions } from "+/component"

import DataTableCell from "$/catalog/data_table_cell.svelte"
import DataTableRow from "$/catalog/data_table_row.svelte"
import TextButton from "$/button/text.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"

let {
	label,
	isArchived,
	options,
	normal_cells,
	resetDraft,
	mini_edit_form,
	delete_confirmation_message,
	restore_confirmation_message,
	force_delete_confirmation_message,
	other_info,
	additional_buttons
}: {
	label: string
	isArchived: boolean
	options: RestorableItemOptions
	resetDraft: () => void
	normal_cells: Snippet<[{ isEditing: boolean }]>
	mini_edit_form?: Snippet<[{
		isConnecting: boolean
		errors: GeneralError[]
		confirmEdit: (event: SubmitEvent) => void
		cancelEdit: () => void
	}]>
	delete_confirmation_message: Snippet
	restore_confirmation_message: Snippet
	force_delete_confirmation_message: Snippet
	other_info: Snippet
	additional_buttons?: Snippet
} = $props()
</script>

<CollectionItem
	{label}
	{isArchived}
	{options}
	{resetDraft}
	edit_form={mini_edit_form}
	{delete_confirmation_message}
	{restore_confirmation_message}
	{force_delete_confirmation_message}>
	{#snippet item({
		isEditing,
		isConnecting,
		isConfirmingDeletion,
		isConfirmingRestoration,
		isConfirmingForceDeletion,
		updateErrors,
		confirmEdit,
		cancelEdit,
		notice,
		action_buttons
	})}
		<DataTableRow>
			{@render normal_cells({ isEditing })}
			<DataTableCell kind={
				isEditing
				|| isConfirmingDeletion
				|| isConfirmingRestoration
				|| isConfirmingForceDeletion
				? "descriptive"
				: "representative"
			}>
				{#if isEditing}
					{@render mini_edit_form?.({
						isConnecting,
						"errors": updateErrors,
						confirmEdit,
						cancelEdit
					})}
				{:else}
					{#if isConfirmingDeletion || isConfirmingRestoration || isConfirmingForceDeletion}
						{@render notice()}
					{:else}
						{@render other_info()}
					{/if}
					{@render additional_buttons?.()}
					{@render action_buttons()}
				{/if}
			</DataTableCell>
		</DataTableRow>
	{/snippet}
	{#snippet action_button({ kind, disabled, label, onclick })}
		<TextButton {kind} {disabled} {label} {onclick}/>
	{/snippet}
</CollectionItem>
