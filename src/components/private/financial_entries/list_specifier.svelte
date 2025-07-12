<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Account, Currency, Modifier, ModifierAtom } from "+/entity"

import { ANY_ACCOUNT, ANY_MODIFIER } from "#/component"

import transformModifier from "$/form/choice_info_transformer/transform_modifier"
import makeAccountTransformer from "$/form/choice_info_transformer/make_account_transformer"

import ChoiceListField from "$/form/choice_list_field.svelte"
import TextField from "$/form/text_field.svelte"

let {
	isConnecting = false,
	currencies,
	accounts,
	modifiers,
	modifierAtoms,
	beginDate = $bindable(),
	endDate = $bindable(),
	selectedAccountID = $bindable(),
	selectedModifierID = $bindable(),
	listErrors
}: {
	isConnecting?: boolean
	currencies: Currency[]
	accounts: Account[]
	modifiers: Modifier[]
	modifierAtoms: ModifierAtom[]
	beginDate: string
	endDate: string
	selectedAccountID: string
	selectedModifierID: string
	listErrors: GeneralError[]
} = $props()

const availableSortCriteria = [
	"transacted_at",
	"created_at"
]

let transformAccount = $derived(makeAccountTransformer(currencies))

let availableAccountChoices = $derived([
	ANY_ACCOUNT,
	...accounts
])
let availableModifierChoices = $derived([
	ANY_MODIFIER,
	...modifiers.filter(
		modifier => selectedAccountID === `${ANY_ACCOUNT.id}`
			|| modifierAtoms.filter(
				modifierAtom => modifierAtom.modifier_id === modifier.id
			).some(modifierAtom => `${modifierAtom.account_id}` === selectedAccountID)
	)
])
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
