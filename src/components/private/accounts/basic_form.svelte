<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { Currency, AcceptableAccountKind } from "+/entity"

	import { acceptableAccountKinds } from "#/entity"

	import transformCurrency from "$/form/choice_info_transformer/transform_currency"
	import transformString from "$/form/choice_info_transformer/transform_string"

	import BasicForm from "$/form/basic_form.svelte"
	import ChoiceListField from "$/form/choice_list_field.svelte"
	import TextField from "$/form/text_field.svelte"

	export const ACCEPTABLE_ACCOUNT_KINDS = [ ...acceptableAccountKinds ]

	export let IDPrefix: string
	export let currencies: Currency[]

	export let currencyID: string
	export let name: string
	export let description: string
	export let kind: AcceptableAccountKind

	export let isConnecting: boolean
	export let errors: GeneralError[]
	export let id = ""
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
		<ChoiceListField
			fieldName="Currency"
			errorFieldName="currency_id"
			disabled={isConnecting}
			bind:value={currencyID}
			rawChoices={currencies}
			choiceConverter={transformCurrency}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Kind"
			disabled={isConnecting}
			bind:value={kind}
			rawChoices={ACCEPTABLE_ACCOUNT_KINDS}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Name"
			disabled={isConnecting}
			bind:value={name}
			{IDPrefix}
			{errors}/>
		<TextField
			fieldName="Description"
			disabled={isConnecting}
			bind:value={description}
			{IDPrefix}
			{errors}/>
		</svelte:fragment>
		<slot slot="button_group" name="button_group"/>
</BasicForm>
