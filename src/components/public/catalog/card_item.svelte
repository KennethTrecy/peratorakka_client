<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type { GridCellKind, RestorableItemOptions } from "+/component"

import GridCell from "$/layout/grid_cell.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import TextCardButton from "$/button/card/text.svelte"
import WeakenedTertiaryHeading from "$/typography/weakened_tertiary_heading.svelte"

let {
	label,
	isArchived,
	options,
	kind = "narrow",
	rowSpan,
	resetDraft = () => {},
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
	rowSpan?: number
	resetDraft?: () => void
	edit_form?: Snippet<[{
		isConnecting: boolean
		errors: GeneralError[]
		confirmEdit: (event: SubmitEvent) => void
		cancelEdit: () => void
	}]>
	delete_confirmation_message?: Snippet
	restore_confirmation_message?: Snippet
	force_delete_confirmation_message?: Snippet
	resource_info: Snippet
	extra_buttons?: Snippet
} = $props()

</script>

<CollectionItem
	{label}
	{isArchived}
	{options}
	{resetDraft}
	{edit_form}
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
		<GridCell {kind} {rowSpan}>
			{#if isEditing}
				{@render edit_form?.({
					isConnecting,
					"errors": updateErrors,
					confirmEdit,
					cancelEdit
				})}
			{:else}
				<article class="card">
					<div class="card-content">
						{#if isConfirmingDeletion || isConfirmingRestoration || isConfirmingForceDeletion}
							{@render notice()}
						{:else}
							<WeakenedTertiaryHeading>
								{label}
							</WeakenedTertiaryHeading>
							{@render resource_info()}
						{/if}
					</div>
					<div class="card-action">
						{@render extra_buttons?.()}
						{@render action_buttons()}
					</div>
				</article>
			{/if}
		</GridCell>
	{/snippet}
	{#snippet action_button({ kind, disabled, label, onclick })}
		<TextCardButton {kind} {disabled} {label} {onclick}/>
	{/snippet}
</CollectionItem>
