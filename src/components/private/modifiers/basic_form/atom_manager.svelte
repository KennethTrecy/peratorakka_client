<script lang="ts">
import type { GeneralError } from "+/rest"
import type {
	Currency,
	Account,
	CashFlowActivity,
	AcceptableModifierAction,
	ModifierAtomInput
} from "+/entity"

import makeAccountTransformer from "$/form/choice_info_transformer/make_account_transformer"

import ShortParagraph from "$/typography/short_paragraph.svelte"
import AtomContainer from "%/modifiers/basic_form/atom_container.svelte"

let {
	IDPrefix,
	accounts,
	currencies,
	cashFlowActivities,
	disabled,
	action,
	atoms = $bindable(),
	isConnecting,
	errors
}: {
	IDPrefix: string
	currencies: Currency[]
	accounts: Account[]
	cashFlowActivities: CashFlowActivity[]
	disabled: boolean
	action: AcceptableModifierAction
	atoms: ModifierAtomInput[]
	isConnecting: boolean
	errors: GeneralError[]
} = $props()

function removeAtom(index: number): void {
	atoms = atoms.filter((_, i) => i !== index)
}

function moveAtomUp(index: number): void {
	const newAtoms = [ ...atoms ]
	const currentAtom = newAtoms[index]

	newAtoms[index] = newAtoms[index - 1]
	newAtoms[index - 1] = currentAtom

	atoms = newAtoms
}

function moveAtomDown(index: number): void {
	const newAtoms = [ ...atoms ]
	const currentAtom = newAtoms[index]

	newAtoms[index] = newAtoms[index + 1]
	newAtoms[index + 1] = currentAtom

	atoms = newAtoms
}

let atomCount = $derived(atoms.length)

let transformAccount = $derived(makeAccountTransformer(currencies))
</script>

{#each atoms as atom, index}
	<AtomContainer
		{accounts}
		{cashFlowActivities}
		{index}
		maxIndex={atomCount - 1}
		{disabled}
		{action}
		bind:atom={() => atoms[index], atom => atoms[index] = atom}
		IDPrefix={`${IDPrefix}_${index}`}
		{isConnecting}
		{errors}
		{transformAccount}
		remove={removeAtom}
		up={moveAtomUp}
		down={moveAtomDown}/>
{/each}

{#if atomCount === 0}
	<ShortParagraph>
		Add at least two modifier atoms.
	</ShortParagraph>
{:else if atomCount === 1}
	<ShortParagraph>
		Add one more modifier atom.
	</ShortParagraph>
{/if}
