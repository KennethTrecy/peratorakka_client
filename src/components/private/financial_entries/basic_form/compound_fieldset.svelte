<script lang="ts">
import type { GeneralError } from "+/rest"
import type { CompleteFinancialEntryAtomInput } from "+/component"

import GeneralField from "%/financial_entries/basic_form/general_field.svelte"
import GeneralFieldset from "%/financial_entries/basic_form/general_fieldset.svelte"

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
</script>

<GeneralFieldset {atom}>
	{#each atom.input as input, i(`${i}_${input.kind}_${input.modifier_atom_id}`)}
		<GeneralField
			bind:atom={atom}
			inputIndex={i}
			{IDPrefix}
			{disabled}
			{isConnecting}
			{errors}/>
	{/each}
</GeneralFieldset>
