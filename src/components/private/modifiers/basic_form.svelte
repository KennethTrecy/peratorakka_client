<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { AcceptableModifierKind, Account } from "+/entity"

	import { acceptableModifierKinds } from "#/entity"

	import transformAccount from "$/form/choice_info_transformer/transform_account"
	import transformString from "$/form/choice_info_transformer/transform_string"

	import TextField from "$/form/text_field.svelte"
	import ChoiceListField from "$/form/choice_list_field.svelte"

	export const ACCEPTABLE_MODIFIER_KINDS = [ ...acceptableModifierKinds ]

	export let IDPrefix: string
	export let accounts: Account[]

	export let debitAccountID: string
	export let creditAccountID: string
	export let name: string
	export let description: string
	export let kind: AcceptableModifierKind

	export let isConnecting: boolean
	export let errors: GeneralError[]
	export let id = ""
</script>

<form class="s12 m12 l12 grid large-space" {id} on:submit>
	<fieldset class="s12 m12 l12 grid large-space">
		<div class="s12 m12 l12">
			<ChoiceListField
				fieldName="Debit Account"
				errorFieldName="debit_account_id"
				disabled={isConnecting}
				bind:value={debitAccountID}
				rawChoices={accounts}
				choiceConverter={transformAccount}
				{IDPrefix}
				{errors}/>
		</div>
		<div class="s12 m12 l12">
			<ChoiceListField
				fieldName="Credit Account"
				errorFieldName="credit_account_id"
				disabled={isConnecting}
				bind:value={creditAccountID}
				rawChoices={accounts}
				choiceConverter={transformAccount}
				{IDPrefix}
				{errors}/>
		</div>
		<div class="s12 m12 l12">
			<ChoiceListField
				fieldName="Kind"
				disabled={isConnecting}
				bind:value={kind}
				rawChoices={ACCEPTABLE_MODIFIER_KINDS}
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
