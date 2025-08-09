<script lang="ts">
import type { Snippet } from "svelte"
import type { CompleteFinancialEntryAtomInput } from "+/component"

import {
	REAL_DEBIT_MODIFIER_ATOM_KIND,
	REAL_DEBITEM_MODIFIER_ATOM_KIND
} from "#/entity"

import GeneralFieldContainer from "$/form/general_field_container.svelte"
import SupportingText from "$/typography/supporting_text.svelte"

let {
	atom,
	children
}: {
	atom: CompleteFinancialEntryAtomInput
	children: Snippet
} = $props()

let description = $derived(`Below are the required values in order to ${
	atom.modifier_atom.kind === REAL_DEBIT_MODIFIER_ATOM_KIND
	|| atom.modifier_atom.kind === REAL_DEBITEM_MODIFIER_ATOM_KIND
		? "debit"
		: "credit"
} ${atom.account.name} (${atom.currency.code}):`)
</script>

<GeneralFieldContainer tag="fieldset">
	<SupportingText>{description}</SupportingText>
	{@render children()}
</GeneralFieldContainer>
