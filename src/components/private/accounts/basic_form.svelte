<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type {
	Currency,
	AcceptableAccountKind,
	Account,
	ItemConfigurationInput,
	ItemConfiguration,
	ItemDetail
} from "+/entity"

import { untrack } from "svelte"

import {
	acceptableAccountKinds,
	acceptableValuationMethods,
	ACCOUNT_KIND_DESCRIPTIONS,
	ITEMIZED_ASSET_ACCOUNT_KIND
} from "#/entity"

import transformCurrency from "$/form/choice_info_transformer/transform_currency"
import transformString from "$/form/choice_info_transformer/transform_string"
import transformItemDetail from "$/form/choice_info_transformer/transform_item_detail"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import TextField from "$/form/text_field.svelte"
import ShortParagraph from "$/typography/short_paragraph.svelte"

const ACCEPTABLE_ACCOUNT_KINDS = [ ...acceptableAccountKinds ]
const ACCEPTABLE_VALUATION_METHODS = [ ...acceptableValuationMethods ]

let {
	IDPrefix,
	currencies,
	itemDetails,
	currencyID = $bindable(),
	name = $bindable(),
	description = $bindable(),
	kind = $bindable(),
	configuration = $bindable(),
	forceDisabledFields = [],
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	currencies: Currency[]
	itemDetails: ItemDetail[]
	currencyID: string
	name: string
	description: string
	kind: AcceptableAccountKind
	configuration: ItemConfigurationInput|null
	forceDisabledFields?: (keyof Account|keyof ItemConfiguration)[]
	isConnecting: boolean
	errors: GeneralError[]
	id?: string|null
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()

let accountKindSupportText = $derived(ACCOUNT_KIND_DESCRIPTIONS[kind])

$effect(() => {
	if (kind === ITEMIZED_ASSET_ACCOUNT_KIND) {
		if (untrack(() => configuration) === null && itemDetails.length > 0) {
			untrack(() => {
				configuration = {
					"item_detail_id": itemDetails[0].id,
					"valuation_method": acceptableValuationMethods[0]
				}
			})
		}
	} else {
		untrack(() => {
			configuration = null
		})
	}
})
</script>

<BasicForm {id} {isConnecting} {errors} {onsubmit} {button_group}>
	{#snippet fields()}
		<ChoiceListField
			fieldName="Currency"
			errorFieldID="currency_id"
			disabled={isConnecting || forceDisabledFields.includes("currency_id")}
			bind:value={currencyID}
			rawChoices={currencies}
			choiceConverter={transformCurrency}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Kind"
			disabled={isConnecting || forceDisabledFields.includes("kind")}
			bind:value={kind}
			rawChoices={ACCEPTABLE_ACCOUNT_KINDS}
			choiceConverter={transformString}
			supportText={accountKindSupportText}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Name"
			disabled={isConnecting || forceDisabledFields.includes("name")}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Description"
			disabled={isConnecting || forceDisabledFields.includes("description")}
			bind:value={description}
			{IDPrefix}
			{errors}/>
		{#if kind === ITEMIZED_ASSET_ACCOUNT_KIND && configuration !== null}
			{#if itemDetails.length === 0}
				<ShortParagraph>
					You must have at least one item detail before you can create an itemized asset account.
				</ShortParagraph>
			{:else}
				{@const filledConfiguration = configuration}
				{@const { item_detail_id, valuation_method } = filledConfiguration}
				<ChoiceListField
					fieldName="Item Detail"
					disabled={isConnecting || forceDisabledFields.includes("item_detail_id")}
					bind:value={
						() => `${item_detail_id}`,
						itemDetailID => {
							configuration = { ...filledConfiguration, "item_detail_id": +itemDetailID }
						}
					}
					rawChoices={itemDetails}
					choiceConverter={transformItemDetail}
					{IDPrefix}
					{errors}/>
				<ChoiceListField
					fieldName="Valuation Method"
					disabled={isConnecting || forceDisabledFields.includes("valuation_method")}
					bind:value={
						() => valuation_method,
						valuationMethod => {
							configuration = { ...filledConfiguration, "valuation_method": valuationMethod }
						}
					}
					rawChoices={ACCEPTABLE_VALUATION_METHODS}
					choiceConverter={transformString}
					{IDPrefix}
					{errors}/>
			{/if}
		{/if}
	{/snippet}
</BasicForm>
