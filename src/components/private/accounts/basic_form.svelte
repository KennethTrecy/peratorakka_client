<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type { Currency, AcceptableAccountKind, Account } from "+/entity"

import { acceptableAccountKinds, ACCOUNT_KIND_DESCRIPTIONS } from "#/entity"

import transformCurrency from "$/form/choice_info_transformer/transform_currency"
import transformString from "$/form/choice_info_transformer/transform_string"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import TextField from "$/form/text_field.svelte"

const ACCEPTABLE_ACCOUNT_KINDS = [ ...acceptableAccountKinds ]

let {
	IDPrefix,
	currencies,
	currencyID = $bindable(),
	name = $bindable(),
	description = $bindable(),
	kind = $bindable(),
	forceDisabledFields = [],
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	currencies: Currency[]
	currencyID: string
	name: string
	description: string
	kind: AcceptableAccountKind
	forceDisabledFields?: (keyof Account)[]
	isConnecting: boolean
	errors: GeneralError[]
	id?: string|null
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()

let accountKindSupportText = $derived(ACCOUNT_KIND_DESCRIPTIONS[kind])
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
	{/snippet}
</BasicForm>
