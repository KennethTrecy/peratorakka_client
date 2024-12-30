<script lang="ts">
import type { Currency, Formula, AcceptableExchangeRateBasis} from "+/entity"

import { createEventDispatcher } from "svelte"

import {  acceptableExchangeRateBases } from "#/entity"

import { fallbackToAcceptableFormulaOutputFormat } from "+/entity"
import checkArchivedState from "$/utility/check_archived_state"
import convertSnakeCaseToProperCase from "$/utility/convert_snake_case_to_proper_case"
import makeRestorableItemOptions from "$/rest/make_restorable_item_options"

import BasicForm from "%/formulae/basic_form.svelte"
import CollectionItem from "$/catalog/collection_item.svelte"
import EditActionCardButtonPair from "$/button/card/edit_action_pair.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

export let currencies: Currency[]
export let data: Formula

const dispatch = createEventDispatcher<{
	"remove": Formula
}>()
let currencyID = `${data.currency_id}`
let name = data.name
let description = data.description
let outputFormat = fallbackToAcceptableFormulaOutputFormat(data.output_format)
let exchangeRateBasis = fallbackToAcceptableExchangeRateBasis(data.exchange_rate_basis)
let presentationalPrecision = data.presentational_precision
let formula = data.formula

$: isArchived = checkArchivedState(data)
$: IDPrefix = `old_account_${data.id}`
$: formID = `${IDPrefix}_update_form`
$: associatedCurrency = currencies.find(
	currency => currency.id === parseInt(currencyID)
)
$: friendlyOutputFormat = convertSnakeCaseToProperCase(data.output_format).toLocaleLowerCase()
$: friendlyExchangeRateBasis = data.exchange_rate_basis === "latest"
	? "per period"
	: "regardless of the period"
$: restorableItemOptions = makeRestorableItemOptions(
	`/api/v1/formulae/${data.id}`,
	{
		"updateCacheData": () => {
			data = {
				...data,
				"currency_id": parseInt(currencyID),
				name,
				description,
				"output_format": outputFormat,
				"exchange_rate_basis": exchangeRateBasis,
				"presentational_precision": presentationalPrecision,
				formula
			}
		},
		"removeCacheData": () => dispatch("remove", data),
		"makeUpdatedBody": () => ({
			"account": {
				"currency_id": parseInt(currencyID),
				name,
				description,
				outputFormat
			}
		})
	}
)

function resetDraft() {
	currencyID = `${data.currency_id}`
	name = data.name
	description = data.description
	outputFormat = fallbackToAcceptableFormulaOutputFormat(data.output_format)
}

function fallbackToAcceptableExchangeRateBasis(data: string): AcceptableExchangeRateBasis {
	return isAcceptableExchangeRateBasis(data) ? data : acceptableExchangeRateBases[0]
}

function isAcceptableExchangeRateBasis(data: string): data is AcceptableExchangeRateBasis {
	return (<string[]>[ ...acceptableExchangeRateBases ]).indexOf(data) > -1
}
</script>

<CollectionItem
	label={data.name}
	{isArchived}
	options={restorableItemOptions}
	on:resetDraft={resetDraft}>
	<BasicForm
		slot="edit_form"
		let:confirmEdit
		let:cancelEdit
		let:isConnecting
		let:errors
		id={formID}
		bind:currencyID={currencyID}
		bind:name={name}
		bind:description={description}
		bind:outputFormat={outputFormat}
		bind:exchangeRateBasis={exchangeRateBasis}
		bind:presentationalPrecision={presentationalPrecision}
		bind:formula={formula}
		{IDPrefix}
		{currencies}
		{isConnecting}
		{errors}
		on:submit={confirmEdit}>
		<EditActionCardButtonPair
			slot="button_group"
			disabled={isConnecting}
			on:cancelEdit={cancelEdit}/>
	</BasicForm>
	<svelte:fragment slot="delete_confirmation_message">
		<ShortParagraph>
			Deleting this formula may prevent related data from being shown temporarily.
		</ShortParagraph>
		<ShortParagraph>
			It converts financial amounts in {associatedCurrency?.code ?? "???"} before calculation of result using the latest exchange rate {friendlyExchangeRateBasis}. Result is formatted as {friendlyOutputFormat} showing up to {data.presentational_precision} significant digits.
		</ShortParagraph>
	</svelte:fragment>
	<svelte:fragment slot="restore_confirmation_message">
		<ShortParagraph>
			Restoring this account may show related data.
		</ShortParagraph>
		<ShortParagraph>
			It converts financial amounts in {associatedCurrency?.code ?? "???"} before calculation of result using the latest exchange rate {friendlyExchangeRateBasis}. Result is formatted as {friendlyOutputFormat} showing up to {data.presentational_precision} significant digits.
		</ShortParagraph>
	</svelte:fragment>
	<svelte:fragment slot="force_delete_confirmation_message">
		<ShortParagraph>
			Deleting this account may prevent related data from being shown permanently.
		</ShortParagraph>
		<ShortParagraph>
			It converts financial amounts in {associatedCurrency?.code ?? "???"} before calculation of result using the latest exchange rate {friendlyExchangeRateBasis}. Result is formatted as {friendlyOutputFormat} showing up to {data.presentational_precision} significant digits.
		</ShortParagraph>
	</svelte:fragment>
	<svelte:fragment slot="resource_info">
		<ShortParagraph>{data.description}</ShortParagraph>
		<ShortParagraph>
			It converts financial amounts in {associatedCurrency?.code ?? "???"} before calculation of result using the latest exchange rate {friendlyExchangeRateBasis}. Result is formatted as {friendlyOutputFormat} showing up to {data.presentational_precision} significant digits.
		</ShortParagraph>
		<ShortParagraph>
			Formula is <span>{data.formula}</span>
		</ShortParagraph>
	</svelte:fragment>
</CollectionItem>

<style lang="scss">
span {
	font-family: "Courier New", Courier, monospace;
	word-wrap: break-word;
	word-break: break-word;
}
</style>
