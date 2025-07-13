<script lang="ts">
import type { GeneralError } from "+/rest"
import type {
	Currency,
	Account,
	Modifier,
	ModifierAtom,
	FinancialEntryAtomInput,
	CompleteFinancialEntryAtomInput
} from "+/entity"

import { untrack } from "svelte"

import { UNKNOWN_ACCOUNT, UNKNOWN_CURRENCY } from "#/component"
import {
	REAL_DEBIT_MODIFIER_ATOM_KIND,
	REAL_CREDIT_MODIFIER_ATOM_KIND,
	TOTAL_FINANCIAL_ENTRY_ATOM_KIND
} from "#/entity"

import makeAccountTransformer from "$/form/choice_info_transformer/make_account_transformer"

import AtomContainer from "%/financial_entries/basic_form/atom_container.svelte"

let {
	currencies,
	accounts,
	modifierAtoms,
	modifier,
	disabled,
	atoms = $bindable(),
	IDPrefix,
	isConnecting,
	errors
}: {
	currencies: Currency[]
	accounts: Account[]
	modifierAtoms: ModifierAtom[]
	modifier: Modifier
	disabled: boolean
	atoms: FinancialEntryAtomInput[]
	IDPrefix: string
	isConnecting: boolean
	errors: GeneralError[]
} = $props()

let chosenModifierAtoms = $derived(modifierAtoms.filter(
	modifierAtom => modifierAtom.modifier_id === modifier.id
))
let requiredAccountIDs = $derived(chosenModifierAtoms.map(atom => atom.account_id))
let requiredAccounts = $derived(accounts.filter(
	account => requiredAccountIDs.indexOf(account.id) > -1
))
let expectedFinancialEntryAtomInputs = $derived(
	chosenModifierAtoms.reduce(
		(compiledAtoms: CompleteFinancialEntryAtomInput[], currentAtom: ModifierAtom) => {
			const requiredAccount = requiredAccounts.find(
				account => account.id === currentAtom.account_id
			) ?? UNKNOWN_ACCOUNT

			const foundFinancialEntryAtom = atoms.find(atom => (
				atom.kind === TOTAL_FINANCIAL_ENTRY_ATOM_KIND
				&& atom.modifier_atom_id === currentAtom.id
			))

			return [
				...compiledAtoms,
				{
					"modifier_atom": currentAtom,
					"account": requiredAccount,
					"currency": currencies.find(
						currency => currency.id === requiredAccount.currency_id
					) ?? UNKNOWN_CURRENCY,
					"input": {
						"modifier_atom_id": currentAtom.id,
						"kind": TOTAL_FINANCIAL_ENTRY_ATOM_KIND,
						"numerical_value": foundFinancialEntryAtom?.numerical_value ?? "0",
						...(
							typeof foundFinancialEntryAtom === "undefined"
								? {}
								: { "id": foundFinancialEntryAtom.id }
						)
					},
				}
			]
		},
		[]
	)
)
let completeAtomInputs = $state<CompleteFinancialEntryAtomInput[]>([])

$effect(() => {
	const knownAtomCombinations = untrack(
		() => completeAtomInputs.map(atom => `${atom.input.modifier_atom_id}_${atom.input.kind}`)
	)
	const expectedAtomCombinations = expectedFinancialEntryAtomInputs.map(
		atom => `${atom.input.modifier_atom_id}_${atom.input.kind}`
	)

	if (JSON.stringify(knownAtomCombinations) !== JSON.stringify(expectedAtomCombinations)) {
		untrack(() => {
			completeAtomInputs = expectedFinancialEntryAtomInputs
		})
	}
})

$effect(() => {
	const newAtomInputs = untrack(() => completeAtomInputs).map(atom => atom.input)
	const hasDifferentNewAtoms = JSON.stringify(atoms.map(
		atom => `${atom.modifier_atom_id}_${atom.kind}_${atom.numerical_value}`
	)) !== JSON.stringify(newAtomInputs.map(
		atom => `${atom.modifier_atom_id}_${atom.kind}_${atom.numerical_value}`
	))
	if (hasDifferentNewAtoms) {
		untrack(() => {
			completeAtomInputs = completeAtomInputs.map(atom => ({
				...atom,
				"input": {
					...atom.input,
					"numerical_value": atoms.find(
						oldAtom => (
							oldAtom.modifier_atom_id === atom.input.modifier_atom_id
							&& oldAtom.kind === atom.input.kind
						)
					)?.numerical_value ?? "0"
				}
			}))
		})
	}
})

$effect(() => {
	const newAtomInputs = completeAtomInputs.map(atom => atom.input)
	const hasDifferentNewAtoms = JSON.stringify(untrack(() => atoms).map(
		atom => `${atom.modifier_atom_id}_${atom.kind}_${atom.numerical_value}`
	)) !== JSON.stringify(newAtomInputs.map(
		atom => `${atom.modifier_atom_id}_${atom.kind}_${atom.numerical_value}`
	))
	if (hasDifferentNewAtoms) {
		untrack(() => {
			atoms = newAtomInputs
		})
	}
})


let monetaryAtomInputs = $derived(completeAtomInputs.filter(
	atom => (
		atom.modifier_atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND
		|| atom.modifier_atom.kind === REAL_CREDIT_MODIFIER_ATOM_KIND
	) && atom.input.kind === TOTAL_FINANCIAL_ENTRY_ATOM_KIND
))
let hasSimpleAtomicPair = $derived(
	monetaryAtomInputs.length === 2
	&& monetaryAtomInputs[0].modifier_atom.kind !== monetaryAtomInputs[1].modifier_atom.kind
	&& monetaryAtomInputs[0].currency.id === monetaryAtomInputs[1].currency.id
)

let transformAccount = $derived(makeAccountTransformer(currencies))

function updateAtomAutomatically(atom: CompleteFinancialEntryAtomInput, index: number) {
	const newCompleteAtomInputs = [ ...completeAtomInputs]
	newCompleteAtomInputs[index] = atom

	if (hasSimpleAtomicPair) {
		const creditAtomIndex = newCompleteAtomInputs.findIndex(
			atom => atom.modifier_atom.kind === REAL_CREDIT_MODIFIER_ATOM_KIND
		)
		const debitAtomIndex = newCompleteAtomInputs.findIndex(
			atom => atom.modifier_atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND
		)
		const creditInput = newCompleteAtomInputs[creditAtomIndex]
		const debitInput = newCompleteAtomInputs[debitAtomIndex]

		if (index === creditAtomIndex) {
			newCompleteAtomInputs[debitAtomIndex] = {
				...debitInput,
				"input": {
					...debitInput.input,
					"numerical_value": creditInput.input.numerical_value
				}
			}
		} else if (index === debitAtomIndex) {
			newCompleteAtomInputs[creditAtomIndex] = {
				...creditInput,
				"input": {
					...creditInput.input,
					"numerical_value": debitInput.input.numerical_value
				}
			}
		}
	}

	completeAtomInputs = newCompleteAtomInputs
}
</script>

{#each completeAtomInputs as atom, index}
	<AtomContainer
		{disabled}
		bind:atom={() => atom, atomInput => updateAtomAutomatically(atomInput, index)}
		IDPrefix={`${IDPrefix}_${index}`}
		{isConnecting}
		{errors}
		{transformAccount}/>
{/each}
