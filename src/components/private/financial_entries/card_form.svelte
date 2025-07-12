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

import BasicSkeletonForm from "%/financial_entries/basic_form.svelte"
import BasicForm from "$/form/basic_form.svelte"

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
	onsubmit,
	id = null,
	button_group
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
	forceDisabledFields?: (keyof FinancialEntry|"atoms")[];
	isConnecting: boolean
	errors: GeneralError[]
	id?: string|null
	onsubmit: (event: SubmitEvent) => void
	button_group: Snippet
} = $props()
</script>

<BasicSkeletonForm
	{currencies}
	{accounts}
	{modifiers}
	{modifierAtoms}
	bind:modifierID={modifierID}
	bind:transactedAt={transactedAt}
	bind:atoms={atoms}
	bind:remarks={remarks}
	{forceDisabledFields}
	{isConnecting}
	{IDPrefix}
	{errors}>
	{#snippet form({ atomsField, remarksField, modifierField, transactedAtField })}
		<BasicForm {id} {isConnecting} {errors} {onsubmit} {button_group}>
			{#snippet fields()}
				{@render modifierField()}
				{@render transactedAtField()}
				{@render remarksField()}
				{@render atomsField()}
			{/snippet}
		</BasicForm>
	{/snippet}
</BasicSkeletonForm>
