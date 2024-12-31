<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Account, Collection, Currency } from "+/entity"

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

let oldUnlinkedAccounts: Account[] = []

$: linkedAccountIDs = linkedAccounts.map(account => account.id)
$: unlinkedAccounts = accounts.filter(account => !linkedAccountIDs.includes(account.id))
$: transformAccount = makeAccountTransformer(currencies)

$: {
	if (unlinkedAccounts.length !== oldUnlinkedAccounts.length) {
		oldUnlinkedAccounts = unlinkedAccounts
		if (unlinkedAccounts.length > 0) {
			accountID = `${unlinkedAccounts[0].id}`
		}
	}
}
</script>

<BasicForm {id} {isConnecting} {errors} on:submit>
	<svelte:fragment slot="fields">
		<ChoiceListField
			fieldName="Account"
			errorFieldID="account_id"
			disabled={isConnecting}
			bind:value={accountID}
			rawChoices={unlinkedAccounts}
			choiceConverter={transformAccount}
			{IDPrefix}
			{errors}/>
		<ChoiceListField
			fieldName="Collection"
			errorFieldID="collection_id"
			disabled={true}
			value={`${collection.id}`}
			rawChoices={[ collection ]}
			choiceConverter={transformCollection}
			{IDPrefix}
			{errors}/>
	</svelte:fragment>
	<slot slot="button_group" name="button_group"/>
</BasicForm>
