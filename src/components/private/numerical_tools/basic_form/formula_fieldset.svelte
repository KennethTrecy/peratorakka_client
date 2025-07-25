<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Formula, FormulaSource } from "+/entity"

import { untrack } from "svelte"

import transformFormula from "$/form/choice_info_transformer/transform_formula"

import ChoiceListField from "$/form/choice_list_field.svelte"

let {
	IDPrefix,
	formulae,
	formula = $bindable(),
	isConnecting,
	errors
}: {
	IDPrefix: string
	formulae: Formula[]
	formula: FormulaSource
	isConnecting: boolean
	errors: GeneralError[]
} = $props()

let formulaID = $state(`${formula.formula_id}`)
$effect(() => {
	const parsedFormulaID = +formulaID
	untrack(() => {
		formula = { ...formula, "formula_id": parsedFormulaID }
	})
});
</script>

<ChoiceListField
	fieldName="Formula"
	disabled={isConnecting}
	bind:value={formulaID}
	rawChoices={formulae}
	choiceConverter={transformFormula}
	{IDPrefix}
	{errors}/>
