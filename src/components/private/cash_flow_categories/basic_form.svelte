<script lang="ts">
	import type { GeneralError } from "+/rest"
	import type { AcceptableAccountKind, CashFlowCategory } from "+/entity"

	import { acceptableCashFlowCategoryKinds } from "#/entity"

	import transformString from "$/form/choice_info_transformer/transform_string"

	import BasicForm from "$/form/basic_form.svelte"
	import ChoiceListField from "$/form/choice_list_field.svelte"
	import TextField from "$/form/text_field.svelte"

	export const ACCEPTABLE_CASH_FLOW_CATEGORY_KINDS = [ ...acceptableCashFlowCategoryKinds ]

	export let IDPrefix: string

	export let name: string
	export let description: string
	export let kind: AcceptableAccountKind
	export let forceDisabledFields: (keyof CashFlowCategory)[] = []

	export let isConnecting: boolean
	export let errors: GeneralError[]
	export let id: string|null = null
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
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
		<ChoiceListField
			fieldName="Kind"
			disabled={isConnecting || forceDisabledFields.includes("kind")}
			bind:value={kind}
			rawChoices={ACCEPTABLE_CASH_FLOW_CATEGORY_KINDS}
			choiceConverter={transformString}
			{IDPrefix}
			{errors}/>
	</svelte:fragment>
	<slot slot="button_group" name="button_group"/>
</BasicForm>
