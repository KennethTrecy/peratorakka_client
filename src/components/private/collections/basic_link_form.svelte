<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type { Account, Collection, Currency } from "+/entity"

import { untrack } from "svelte"

import makeAccountTransformer from "$/form/choice_info_transformer/make_account_transformer"
import transformCollection from "$/form/choice_info_transformer/transform_collection"

import BasicForm from "$/form/basic_form.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"

let {
	IDPrefix,
	collection,
	currencies,
	accounts,
	linkedAccounts,
	accountID = $bindable(),
	isConnecting,
	errors,
	id = null,
	onsubmit,
	button_group
}: {
	IDPrefix: string
	collection: Collection
	currencies: Currency[]
	accounts: Account[]
	linkedAccounts: Account[]
	accountID: string
	isConnecting: boolean
	errors: GeneralError[]
	id?: string|null
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()

let oldUnlinkedAccounts: Account[] = $state([])

let linkedAccountIDs = $derived(linkedAccounts.map(account => account.id))
let unlinkedAccounts = $derived(accounts.filter(account => !linkedAccountIDs.includes(account.id)))
let transformAccount = $derived(makeAccountTransformer(currencies))

$effect(() => {
	if (JSON.stringify(unlinkedAccounts) !== JSON.stringify(untrack(() => oldUnlinkedAccounts))) {
		untrack(() => {
			oldUnlinkedAccounts = unlinkedAccounts
		})
		if (unlinkedAccounts.length > 0) {
			untrack(() => {
				accountID = `${unlinkedAccounts[0].id}`
			})
		}
	}
})
</script>

<BasicForm {id} {isConnecting} {errors} {onsubmit} {button_group}>
	{#snippet fields()}
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
	{/snippet}
</BasicForm>
