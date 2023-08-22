<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type {
		AcceptableModifierKind,
		AcceptableModifierAction,
		Account,
		Currency
	} from "+/entity"

	import { acceptableModifierKinds, acceptableModifierActions } from "#/entity"

	import makeAccountTransformer from "$/form/choice_info_transformer/make_account_transformer"
	import transformString from "$/form/choice_info_transformer/transform_string"

	import BasicForm from "$/form/basic_form.svelte"
	import ChoiceListField from "$/form/choice_list_field.svelte"
	import TextField from "$/form/text_field.svelte"

	export const ACCEPTABLE_MODIFIER_KINDS = [ ...acceptableModifierKinds ]
	export const ACCEPTABLE_MODIFIER_ACTIONS = [ ...acceptableModifierActions ]

	export let IDPrefix: string
	export let currencies: Currency[]
	export let accounts: Account[]

	export let debitAccountID: string
	export let creditAccountID: string
	export let name: string
	export let description: string
	export let kind: AcceptableModifierKind
	export let action: AcceptableModifierAction

	export let isConnecting: boolean
	export let errors: GeneralError[]
	export let id: string|null = null

	$: transformAccount = makeAccountTransformer(currencies)
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
		<ChoiceListField
			fieldName="Debit Account"
			errorFieldName="debit_account_id"
			disabled={isConnecting}
			bind:value={debitAccountID}
			rawChoices={accounts}
			choiceConverter={transformAccount}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Credit Account"
			errorFieldName="credit_account_id"
			disabled={isConnecting}
			bind:value={creditAccountID}
			rawChoices={accounts}
			choiceConverter={transformAccount}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Kind"
			disabled={isConnecting}
			bind:value={kind}
			rawChoices={ACCEPTABLE_MODIFIER_KINDS}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Action"
			disabled={isConnecting}
			bind:value={action}
			rawChoices={ACCEPTABLE_MODIFIER_ACTIONS}
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
