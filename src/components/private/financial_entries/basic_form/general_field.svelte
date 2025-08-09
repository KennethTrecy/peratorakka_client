<script lang="ts">
import type { GeneralError } from "+/rest"
import type { CompleteFinancialEntryAtomInput } from "+/component"

import {
	PRICE_FINANCIAL_ENTRY_ATOM_KIND,
	TOTAL_FINANCIAL_ENTRY_ATOM_KIND
} from "#/entity"

import { untrack } from "svelte"

import TextField from "$/form/text_field.svelte"

let {
	atom = $bindable(),
	inputIndex,
	IDPrefix,
	disabled,
	isConnecting,
	errors
}: {
	atom: CompleteFinancialEntryAtomInput
	inputIndex: number
	IDPrefix: string
	disabled: boolean
	isConnecting: boolean
	errors: GeneralError[]
} = $props()

let label = $derived(
	atom.input[inputIndex].kind === TOTAL_FINANCIAL_ENTRY_ATOM_KIND
		? "Monetary Amount"
		: atom.input[inputIndex].kind === PRICE_FINANCIAL_ENTRY_ATOM_KIND
			? "Price"
			: "Quantity"
)

let value = $state(atom.input[inputIndex].numerical_value)

$effect(() => {
	if (untrack(() => atom.input[inputIndex].numerical_value) !== value) {
		untrack(() => {
			const newAtomInputs = [ ...atom.input ]
			newAtomInputs[inputIndex] = {
				...atom.input[inputIndex],
				"numerical_value": value
			}

			atom = {
				...atom,
				"input": newAtomInputs
			}
		})
	}
})

$effect(() => {
	if (atom.input[inputIndex].numerical_value !== untrack(() => value)) {
		untrack(() => {
			value = atom.input[inputIndex].numerical_value
		})
	}
})
</script>

<TextField
	fieldName={label}
	errorFieldID="financial_entry_atoms"
	disabled={isConnecting || disabled}
	bind:value={value}
	{IDPrefix}
	{errors}/>
