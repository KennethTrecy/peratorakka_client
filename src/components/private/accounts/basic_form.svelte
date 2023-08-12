<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { Currency, AcceptableAccountKind } from "+/entity"

	import { acceptableAccountKinds } from "#/entity"

	import transformCurrency from "$/form/choice_info_transformer/transform_currency"
	import transformString from "$/form/choice_info_transformer/transform_string"

	import TextField from "$/form/text_field.svelte"
	import ChoiceListField from "$/form/choice_list_field.svelte"

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

<form class="s12 m12 l12 grid large-space" {id} on:submit>
	<fieldset class="s12 m12 l12 grid large-space">
		<div class="s12 m12 l12">
			<ChoiceListField
				fieldName="Currency"
				errorFieldName="currency_id"
				disabled={isConnecting}
				bind:value={currencyID}
				rawChoices={currencies}
				choiceConverter={transformCurrency}
				{IDPrefix}
				{errors}/>
		</div>
		<div class="s12 m12 l12">
			<ChoiceListField
				fieldName="Kind"
				disabled={isConnecting}
				bind:value={kind}
				rawChoices={ACCEPTABLE_ACCOUNT_KINDS}
				choiceConverter={transformString}
				{IDPrefix}
				{errors}/>
		</div>
		<div class="s12 m12 l12">
			<TextField
				fieldName="Name"
				disabled={isConnecting}
				bind:value={name}
				{IDPrefix}
				{errors}/>
		</div>
		<div class="s12 m12 l12">
			<TextField
				fieldName="Description"
				disabled={isConnecting}
				bind:value={description}
				{IDPrefix}
				{errors}/>
		</div>
	</fieldset>
	<div class="s12 m12 l12">
		<slot name="buttonGroup"/>
	</div>
</form>

<style lang="scss">
	@use "@/components/third-party/index";
</style>
