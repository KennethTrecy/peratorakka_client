<script lang="ts">
import type { GeneralError } from "+/rest"
import type {
	Currency,
	Account,
	Modifier,
	ModifierAtom,
	FinancialEntryAtomInput
} from "+/entity"
import type { CompleteFinancialEntryAtomInput, FinancialEntryAtomInputMethod } from "+/component"

import { untrack } from "svelte"

import {
	UNKNOWN_ACCOUNT,
	UNKNOWN_CURRENCY,
	FINANCIAL_ENTRY_INPUT_TOTAL_ONLY,
	FINANCIAL_ENTRY_INPUT_QUANTITY_ONLY,
	FINANCIAL_ENTRY_INPUT_PRICE_ONLY,
	FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY,
	FINANCIAL_ENTRY_INPUT_PRICE_AND_QUANTITY,
	FINANCIAL_ENTRY_INPUT_PRICE_AND_TOTAL
} from "#/component"
import {
	REAL_DEBIT_MODIFIER_ATOM_KIND,
	REAL_CREDIT_MODIFIER_ATOM_KIND,
	TOTAL_FINANCIAL_ENTRY_ATOM_KIND,
	ITEMIZED_ASSET_ACCOUNT_KIND,
	PRICE_FINANCIAL_ENTRY_ATOM_KIND,
	QUANTITY_FINANCIAL_ENTRY_ATOM_KIND,
	REAL_DEBITEM_MODIFIER_ATOM_KIND,
	REAL_CREDITEM_MODIFIER_ATOM_KIND,
	REAL_EMERGENT_MODIFIER_ATOM_KIND
} from "#/entity"

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
let oldInputMethods = $derived(atoms.reduce((previousMethods, currentAtom) => ({
	...previousMethods,
	[currentAtom.modifier_atom_id]: typeof previousMethods[
		`${currentAtom.modifier_atom_id}`
	] !== undefined ? ([
		[ null, FINANCIAL_ENTRY_INPUT_PRICE_AND_TOTAL, FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY ],
		[ FINANCIAL_ENTRY_INPUT_PRICE_AND_TOTAL, null, FINANCIAL_ENTRY_INPUT_PRICE_AND_QUANTITY ],
		[ FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY, FINANCIAL_ENTRY_INPUT_PRICE_AND_QUANTITY, null ]
	])[(
		Math.max([
			FINANCIAL_ENTRY_INPUT_TOTAL_ONLY,
			FINANCIAL_ENTRY_INPUT_PRICE_ONLY,
			FINANCIAL_ENTRY_INPUT_QUANTITY_ONLY
		].indexOf(previousMethods[`${currentAtom.modifier_atom_id}`]), 0)
	)][(
		Math.max([
			TOTAL_FINANCIAL_ENTRY_ATOM_KIND,
			PRICE_FINANCIAL_ENTRY_ATOM_KIND,
			QUANTITY_FINANCIAL_ENTRY_ATOM_KIND
		].indexOf(currentAtom.kind), 0)
	)] ?? FINANCIAL_ENTRY_INPUT_TOTAL_ONLY : ({
		[TOTAL_FINANCIAL_ENTRY_ATOM_KIND]: FINANCIAL_ENTRY_INPUT_TOTAL_ONLY,
		[PRICE_FINANCIAL_ENTRY_ATOM_KIND]: FINANCIAL_ENTRY_INPUT_PRICE_ONLY,
		[QUANTITY_FINANCIAL_ENTRY_ATOM_KIND]: FINANCIAL_ENTRY_INPUT_QUANTITY_ONLY
	}[currentAtom.kind])
}), {} as Record<string, FinancialEntryAtomInputMethod>))

let expectedFinancialEntryAtomInputs = $derived(
	chosenModifierAtoms.reduce(
		(compiledAtoms: CompleteFinancialEntryAtomInput[], currentAtom: ModifierAtom) => {
			if (currentAtom.kind === REAL_EMERGENT_MODIFIER_ATOM_KIND) {
				return compiledAtoms
			}

			const requiredAccount = requiredAccounts.find(
				account => account.id === currentAtom.account_id
			) ?? UNKNOWN_ACCOUNT
			const requiredCurrency = currencies.find(
				currency => currency.id === requiredAccount.currency_id
			) ?? UNKNOWN_CURRENCY
			const knownMethod = oldInputMethods[`${currentAtom.id}`] ?? (
				currentAtom.kind === REAL_DEBITEM_MODIFIER_ATOM_KIND
				|| currentAtom.kind === REAL_CREDITEM_MODIFIER_ATOM_KIND
				? FINANCIAL_ENTRY_INPUT_QUANTITY_ONLY : (
					requiredAccount.kind === ITEMIZED_ASSET_ACCOUNT_KIND
					? FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY
					: FINANCIAL_ENTRY_INPUT_TOTAL_ONLY
				)
			)

			const foundTotalFinancialEntryAtom = atoms.find(atom => (
				atom.kind === TOTAL_FINANCIAL_ENTRY_ATOM_KIND
				&& atom.modifier_atom_id === currentAtom.id
			))
			const foundPriceFinancialEntryAtom = atoms.find(atom => (
				atom.kind === PRICE_FINANCIAL_ENTRY_ATOM_KIND
				&& atom.modifier_atom_id === currentAtom.id
			))
			const foundQuantityFinancialEntryAtom = atoms.find(atom => (
				atom.kind === QUANTITY_FINANCIAL_ENTRY_ATOM_KIND
				&& atom.modifier_atom_id === currentAtom.id
			))

			const totalInputElement = {
				"modifier_atom_id": currentAtom.id,
				"kind": TOTAL_FINANCIAL_ENTRY_ATOM_KIND,
				"numerical_value": foundTotalFinancialEntryAtom?.numerical_value ?? "0",
				...(
					typeof foundTotalFinancialEntryAtom === "undefined"
						? {}
						: { "id": foundTotalFinancialEntryAtom.id }
				)
			}
			const priceInputElement = {
				"modifier_atom_id": currentAtom.id,
				"kind": PRICE_FINANCIAL_ENTRY_ATOM_KIND,
				"numerical_value": foundPriceFinancialEntryAtom?.numerical_value ?? "0",
				...(
					typeof foundPriceFinancialEntryAtom === "undefined"
						? {}
						: { "id": foundPriceFinancialEntryAtom.id }
				)
			}
			const quantityInputElement = {
				"modifier_atom_id": currentAtom.id,
				"kind": QUANTITY_FINANCIAL_ENTRY_ATOM_KIND,
				"numerical_value": foundQuantityFinancialEntryAtom?.numerical_value ?? "0",
				...(
					typeof foundQuantityFinancialEntryAtom === "undefined"
						? {}
						: { "id": foundQuantityFinancialEntryAtom.id }
				)
			}

			return [
				...compiledAtoms,
				{
					"modifier_atom": currentAtom,
					"account": requiredAccount,
					"currency": requiredCurrency,
					"method": knownMethod,
					"input": ({
						[FINANCIAL_ENTRY_INPUT_TOTAL_ONLY]: [ totalInputElement ],
						[FINANCIAL_ENTRY_INPUT_PRICE_ONLY]: [ priceInputElement ],
						[FINANCIAL_ENTRY_INPUT_QUANTITY_ONLY]: [ quantityInputElement ],
						[FINANCIAL_ENTRY_INPUT_TOTAL_AND_QUANTITY]: [
							totalInputElement,
							quantityInputElement
						],
						[FINANCIAL_ENTRY_INPUT_PRICE_AND_QUANTITY]: [
							priceInputElement,
							quantityInputElement
						],
						[FINANCIAL_ENTRY_INPUT_PRICE_AND_TOTAL]: [
							priceInputElement,
							totalInputElement
						]
					})[knownMethod]
				}
			]
		},
		[]
	)
)
let completeAtomInputs = $state<CompleteFinancialEntryAtomInput[]>([])

$effect(() => {
	const knownAtomCombinations = untrack(
		() => completeAtomInputs.map(
			atom => atom.input.map(input => `${input.modifier_atom_id}_${input.kind}`)
		)
	)
	const expectedAtomCombinations = expectedFinancialEntryAtomInputs.map(
		atom => atom.input.map(input => `${input.modifier_atom_id}_${input.kind}`)
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
		atom => atom.map(input => `${input.modifier_atom_id}_${input.kind}_${input.numerical_value}`)
	).flat())
	if (hasDifferentNewAtoms) {
		untrack(() => {
			completeAtomInputs = completeAtomInputs.map(atom => ({
				...atom,
				"input": atom.input.map(input => ({
					...input,
					"numerical_value": atoms.find(
						oldAtom => (
							oldAtom.modifier_atom_id === input.modifier_atom_id
							&& oldAtom.kind === input.kind
						)
					)?.numerical_value ?? "0"
				}))
			}))
		})
	}
})

let monetaryAtomInputs = $derived(completeAtomInputs.filter(
	atom => (
		atom.modifier_atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND
		|| atom.modifier_atom.kind === REAL_CREDIT_MODIFIER_ATOM_KIND
	) && atom.input.filter(input => input.kind === TOTAL_FINANCIAL_ENTRY_ATOM_KIND).length === 1
).map(atom => [ atom.modifier_atom.kind, atom.currency.id ]))
let hasSimpleAtomicPair = $derived(
	monetaryAtomInputs.length === 2
	&& monetaryAtomInputs[0][0] !== monetaryAtomInputs[1][0]
	&& monetaryAtomInputs[0][1] === monetaryAtomInputs[1][1]
)

function updateAtomAutomatically(atom: CompleteFinancialEntryAtomInput, index: number) {
	const newCompleteAtomInputs = [ ...completeAtomInputs ]
	newCompleteAtomInputs[index] = JSON.parse(JSON.stringify(atom))

	if (hasSimpleAtomicPair) {
		const debitIndex = completeAtomInputs.findIndex(
			atom => atom.modifier_atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND
		)
		const creditIndex = completeAtomInputs.findIndex(
			atom => atom.modifier_atom.kind === REAL_CREDIT_MODIFIER_ATOM_KIND
		)
		const totalValue = atom.input.find(
			input => input.kind === TOTAL_FINANCIAL_ENTRY_ATOM_KIND
		)?.numerical_value ?? "0"

		if (index === debitIndex) {
			newCompleteAtomInputs[creditIndex] = {
				...newCompleteAtomInputs[creditIndex],
				"input": newCompleteAtomInputs[creditIndex].input.map(input => {
					if (input.kind === TOTAL_FINANCIAL_ENTRY_ATOM_KIND) {
						return {
							...input,
							"numerical_value": totalValue
						}
					}
					return input
				})
			}
		} else if (index === creditIndex) {
			newCompleteAtomInputs[debitIndex] = {
				...newCompleteAtomInputs[debitIndex],
				"input": newCompleteAtomInputs[debitIndex].input.map(input => {
					if (input.kind === TOTAL_FINANCIAL_ENTRY_ATOM_KIND) {
						return {
							...input,
							"numerical_value": totalValue
						}
					}

					return input
				})
			}
		}
	}

	completeAtomInputs = newCompleteAtomInputs
	atoms = completeAtomInputs.reduce((previousAtoms, currentAtom) => [
		...previousAtoms,
		...currentAtom.input
	], [] as FinancialEntryAtomInput[])
}
</script>

{#each completeAtomInputs as atom, index}
	<AtomContainer
		{disabled}
		bind:atom={
			() => atom,
			atomInput => updateAtomAutomatically(atomInput, index)
		}
		IDPrefix={`${IDPrefix}_${index}`}
		{isConnecting}
		{errors}/>
{/each}
