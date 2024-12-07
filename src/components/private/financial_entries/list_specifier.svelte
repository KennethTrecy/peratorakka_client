<script lang="ts">
import type { GeneralError, SearchMode, SortOrder } from "+/rest"
import type { Account, Currency, Modifier } from "+/entity"

import { ANY_ACCOUNT, ANY_MODIFIER } from "#/component"

import transformModifier from "$/form/choice_info_transformer/transform_modifier"
import makeAccountTransformer from "$/form/choice_info_transformer/make_account_transformer"

import ChoiceListField from "$/form/choice_list_field.svelte"
import ListSpecifier from "$/form/list_specifier.svelte"
import TextField from "$/form/text_field.svelte"

export let isConnecting: boolean = false
export let currencies: Currency[]
export let accounts: Account[]
export let modifiers: Modifier[]

export let beginDate: string
export let endDate: string
export let selectedAccountID: string
export let selectedModifierID: string
export let searchMode: SearchMode
export let sortCriterion: string
export let sortOrder: SortOrder
export let listErrors: GeneralError[]

const availableSortCriteria = [
	"transacted_at",
	"created_at"
]

$: transformAccount = makeAccountTransformer(currencies)

$: availableAccountChoices = [
	ANY_ACCOUNT,
	...accounts
]
$: {
	if (selectedAccountID === "") selectedAccountID = "0"
}
$: availableModifierChoices = [
	ANY_MODIFIER,
	...modifiers.filter(modifier => {
		return selectedAccountID === `${ANY_ACCOUNT.id}`
			|| `${modifier.debit_account_id}` === selectedAccountID
			|| `${modifier.credit_account_id}` === selectedAccountID
	})
]
$: {
	if (selectedModifierID === "") selectedModifierID = "0"
}
</script>

<TextField
	variant="date"
	fieldName="Begin Date"
	errorFieldID="begin_date"
	disabled={isConnecting}
	bind:value={beginDate}
	errors={listErrors}/>
<TextField
	variant="date"
	fieldName="End Date"
	errorFieldID="end_date"
	disabled={isConnecting}
	bind:value={endDate}
	errors={listErrors}/>
<ChoiceListField
	fieldName="Account"
	errorFieldID="account_id"
	disabled={isConnecting}
	bind:value={selectedAccountID}
	rawChoices={availableAccountChoices}
	choiceConverter={transformAccount}
	errors={listErrors}/>
<ChoiceListField
	fieldName="Modifier"
	errorFieldID="modifier_id"
	disabled={isConnecting}
	bind:value={selectedModifierID}
	rawChoices={availableModifierChoices}
	choiceConverter={transformModifier}
	errors={listErrors}/>
<ListSpecifier
	bind:searchMode={searchMode}
	bind:sortCriterion={sortCriterion}
	bind:sortOrder={sortOrder}
	{isConnecting}
	{availableSortCriteria}
	errors={listErrors}/>
