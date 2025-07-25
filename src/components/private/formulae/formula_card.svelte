<script lang="ts">
import type { PrecisionFormat, Formula } from "+/entity"

import { fallbackToAcceptableFormulaOutputFormat } from "+/entity"
import checkArchivedState from "$/utility/check_archived_state"
import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/formulae/basic_form.svelte"
import CardItem from "$/catalog/card_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

let {
	precisionFormats,
	data = $bindable(),
	remove
}: {
	precisionFormats: PrecisionFormat[]
	data: Formula
	remove: (resource: Formula) => void
} = $props()

let precisionFormatID = $state(`${data.precision_format_id}`)
let name = $state(data.name)
let description = $state(data.description)
let outputFormat = $state(fallbackToAcceptableFormulaOutputFormat(data.output_format))
let expression = $state(data.expression)

let isArchived = $derived(checkArchivedState(data))
let IDPrefix = $derived(`old_account_${data.id}`)
let formID = $derived(`${IDPrefix}_update_form`)
let associatedPrecisionFormat = $derived(precisionFormats.find(
	precisionFormat => precisionFormat.id === parseInt(precisionFormatID)
))
let friendlyOutputFormat = $derived(
	convertSnakeCaseToProperCase(data.output_format).toLocaleLowerCase()
)
let friendlyPrecisionFormat = $derived(
	associatedPrecisionFormat?.maximum_presentational_precision ?? "unknown number of"
)
let restorableItemOptions = $derived(makeRestorableItemOptions(
	`/api/v2/formulae/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				"precision_format_id": parseInt(precisionFormatID),
				name,
				description,
				"output_format": outputFormat,
				expression
			}
		},
		"removeCacheData": () => remove(data),
		"makeUpdatedBody": () => ({
			"formula": {
				"precision_format_id": parseInt(precisionFormatID),
				name,
				description,
				"output_format": outputFormat,
				expression
			}
		})
	}
))

function resetDraft() {
	precisionFormatID = `${data.precision_format_id}`
	name = data.name
	description = data.description
	outputFormat = fallbackToAcceptableFormulaOutputFormat(data.output_format)
}
</script>

<CardItem
	label={data.name}
	{isArchived}
	options={restorableItemOptions}
	{resetDraft}>
	{#snippet edit_form({ confirmEdit, cancelEdit, isConnecting, errors })}
		<BasicForm
			id={formID}
			bind:precisionFormatID={precisionFormatID}
			bind:name={name}
			bind:description={description}
			bind:outputFormat={outputFormat}
			bind:expression={expression}
			{IDPrefix}
			{precisionFormats}
			{isConnecting}
			{errors}
			onsubmit={confirmEdit}>
			{#snippet button_group()}
				<EditActionCardButtonPair
					disabled={isConnecting}
					{cancelEdit}/>
			{/snippet}
		</BasicForm>
	{/snippet}
	{#snippet delete_confirmation_message()}
		<ShortParagraph>
			Deleting this expression may prevent related data from being shown temporarily.
		</ShortParagraph>
		<ShortParagraph>
			Result is formatted as {friendlyOutputFormat} showing up to {friendlyPrecisionFormat}
			significant digits.
		</ShortParagraph>
	{/snippet}
	{#snippet restore_confirmation_message()}
		<ShortParagraph>
			Restoring this account may show related data.
		</ShortParagraph>
		<ShortParagraph>
			Result is formatted as {friendlyOutputFormat} showing up to {friendlyPrecisionFormat}
			significant digits.
		</ShortParagraph>
	{/snippet}
	{#snippet force_delete_confirmation_message()}
		<ShortParagraph>
			Deleting this account may prevent related data from being shown permanently.
		</ShortParagraph>
		<ShortParagraph>
			Result is formatted as {friendlyOutputFormat} showing up to {friendlyPrecisionFormat}
			significant digits.
		</ShortParagraph>
	{/snippet}
	{#snippet resource_info()}
		<ShortParagraph>{data.description}</ShortParagraph>
		<ShortParagraph>
			Result is formatted as {friendlyOutputFormat} showing up to {friendlyPrecisionFormat}
			significant digits.
		</ShortParagraph>
		<ShortParagraph>
			Formula has an assigned ID of {data.id} with the following equation: <span>{data.expression}</span>
		</ShortParagraph>
	{/snippet}
</CardItem>

<style lang="scss">
span {
	font-family: "Courier New", Courier, monospace;
	word-wrap: break-word;
	word-break: break-word;
}
</style>
