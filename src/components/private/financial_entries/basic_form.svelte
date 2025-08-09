<script lang="ts">
import type { Snippet } from "svelte"
import type { GeneralError } from "+/rest"
import type {
	Account,
	Currency,
	Modifier,
	ModifierAtom,
	FinancialEntry,
	FinancialEntryAtomInput
} from "+/entity"

import { untrack } from "svelte"

import { UNKNOWN_MODIFIER } from "#/component"
import { RECORD_MODIFIER_ACTION } from "#/entity"

import transformModifier from "$/form/choice_info_transformer/transform_modifier"
import transformString from "$/form/choice_info_transformer/transform_string"

import AtomManager from "%/financial_entries/basic_form/atom_manager.svelte"
import ChoiceListField from "$/form/choice_list_field.svelte"
import TextField from "$/form/text_field.svelte"

let {
	IDPrefix,
	currencies,
	accounts,
	modifiers,
	modifierAtoms,
	modifierID = $bindable(),
	transactedAt = $bindable(),
	atoms = $bindable(),
	remarks = $bindable(),
	forceDisabledFields = [],
	isConnecting,
	errors,
	form
}: {
	IDPrefix: string
	currencies: Currency[]
	accounts: Account[]
	modifiers: Modifier[]
	modifierAtoms: ModifierAtom[]
	modifierID: string
	transactedAt: string
	atoms: FinancialEntryAtomInput[]
	remarks: string
	forceDisabledFields?: (keyof FinancialEntry|"atoms")[]
	isConnecting: boolean
	errors: GeneralError[]
	form: Snippet<[ {
		modifierField: Snippet
		transactedAtField: Snippet
		remarksField: Snippet
		atomsField: Snippet
	} ]>
} = $props()

let currentAction = $state(
	modifiers.find(modifier => `${modifier.id}` === modifierID)?.action ?? RECORD_MODIFIER_ACTION
)
let oldAction = $state(RECORD_MODIFIER_ACTION)
let availableModifiers = $derived(modifiers.filter(modifier => modifier.deleted_at === null))
let availableModifierActions = $derived(Array.from(new Set(
	availableModifiers.map(modifier => modifier.action)
)))
let filteredModifiers = $derived(availableModifiers.filter(
	modifier => modifier.action === currentAction
))
let modifier = $derived(filteredModifiers.find(
	modifier => `${modifier.id}` === modifierID
) ?? UNKNOWN_MODIFIER)

$effect(() => {
	if (oldAction !== modifier.action) {
		untrack(() => {
			oldAction = currentAction
		})
	}
})
$effect(() => {
	if (filteredModifiers.length > 0) {
		untrack(() => {
			modifierID = `${filteredModifiers[0].id}`
		})
	}
})
</script>

{#snippet modifierField()}
	<ChoiceListField
		fieldName="Action"
		disabled={isConnecting || forceDisabledFields.includes("modifier_id")}
		bind:value={currentAction}
		rawChoices={availableModifierActions}
		choiceConverter={transformString}
		{IDPrefix}
		{errors}/>
	<ChoiceListField
		fieldName="Modifier"
		errorFieldID="modifier_id"
		disabled={isConnecting || forceDisabledFields.includes("modifier_id")}
		bind:value={modifierID}
		rawChoices={filteredModifiers}
		choiceConverter={transformModifier}
		{IDPrefix}
		{errors}/>
{/snippet}

{#snippet transactedAtField()}
	<TextField
		variant="date"
		fieldName="Transaction Date"
		errorFieldID="transacted_at"
		disabled={isConnecting || forceDisabledFields.includes("transacted_at")}
		bind:value={transactedAt}
		{IDPrefix}
		{errors}/>
{/snippet}

{#snippet remarksField()}
	<TextField
		fieldName="Remarks"
		errorFieldID="remarks"
		disabled={isConnecting || forceDisabledFields.includes("remarks")}
		bind:value={remarks}
		{IDPrefix}
		{errors}/>
{/snippet}

{#snippet atomsField()}
	<AtomManager
		{accounts}
		{currencies}
		{modifierAtoms}
		{modifier}
		disabled={isConnecting || forceDisabledFields.includes("atoms")}
		bind:atoms={atoms}
		{IDPrefix}
		{isConnecting}
		{errors}/>
{/snippet}

{@render form({
	modifierField,
	transactedAtField,
	remarksField,
	atomsField
})}
