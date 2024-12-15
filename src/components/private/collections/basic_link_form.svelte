<script lang="ts">
import type { GeneralError } from "+/rest"
import type {
	AcceptableModifierKind,
	AcceptableModifierAction,
	Account,
	CashFlowActivity,
	Collection,
	Currency
} from "+/entity"

import makeAccountTransformer from "$/form/choice_info_transformer/make_account_transformer"
import transformCollection from "$/form/choice_info_transformer/transform_collection"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"

export let IDPrefix: string
export let collection: Collection
export let currencies: Currency[]
export let accounts: Account[]
export let linkedAccounts: Account[]

export let accountID: string

export let isConnecting: boolean
export let errors: GeneralError[]
export let id: string|null = null

$: linkedAccountIDs = linkedAccounts.map(account => account.id)
$: availableAccounts = accounts.filter(account => linkedAccountIDs.indexOf(account.id) === -1)
$: transformAccount = makeAccountTransformer(currencies)
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
		<ChoiceListField
			fieldName="Collection"
			errorFieldID="collection_id"
			disabled={true}
			value={`${collection.id}`}
			rawChoices={[ collection ]}
			choiceConverter={transformCollection}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Account"
			errorFieldID="account_id"
			disabled={isConnecting}
			bind:value={accountID}
			rawChoices={availableAccounts}
			choiceConverter={transformAccount}
			{IDPrefix}
			{errors}/>
	</svelte:fragment>
	<slot slot="button_group" name="button_group"/>
</BasicForm>
