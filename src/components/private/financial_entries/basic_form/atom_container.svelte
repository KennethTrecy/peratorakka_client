<script lang="ts">
import type { GeneralError } from "+/rest"
import type { CompleteFinancialEntryAtomInput } from "+/entity"

import { REAL_DEBIT_MODIFIER_ATOM_KIND } from "#/entity"

import { untrack } from "svelte"

import TextField from "$/form/text_field.svelte"
import GeneralFieldContainer from "$/form/general_field_container.svelte"

let {
	atom = $bindable(),
	IDPrefix,
	disabled,
	isConnecting,
	errors
}: {
	atom: CompleteFinancialEntryAtomInput
	IDPrefix: string
	disabled: boolean
	isConnecting: boolean
	errors: GeneralError[]
} = $props()

let label = $derived(`${
	atom.modifier_atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND
		? "Debit Amount"
		: "Credit Amount"
} for ${atom.account.name} (${atom.currency.code})`)

let value = $state(atom.input.numerical_value)

$effect(() => {
	if (untrack(() => atom.input.numerical_value) !== value) {
		untrack(() => {
			atom = {
				...atom,
				"input": {
					...atom.input,
					"numerical_value": value
				}
			}
		})
	}
})

$effect(() => {
	if (atom.input.numerical_value !== untrack(() => value)) {
		untrack(() => {
			value = atom.input.numerical_value
		})
	}
})
</script>

<GeneralFieldContainer tag="fieldset">
	<TextField
		fieldName={label}
		errorFieldID="financial_entry_atoms"
		disabled={isConnecting || disabled}
		bind:value={value}
		{IDPrefix}
		{errors}/>
</GeneralFieldContainer>
