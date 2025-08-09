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
	<GeneralField
		bind:atom={atom}
		inputIndex={0}
		{IDPrefix}
		{disabled}
		{isConnecting}
		{errors}/>
</GeneralFieldset>
