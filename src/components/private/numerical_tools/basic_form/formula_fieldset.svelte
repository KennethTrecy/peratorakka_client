<script lang="ts">
import type { GeneralError } from "+/rest"
import type { Formula, FormulaSource } from "+/entity"

import transformFormula from "$/form/choice_info_transformer/transform_formula"

import ChoiceListField from "$/form/choice_list_field.svelte"

export let IDPrefix: string
export let formulae: Formula[]

export let formula: FormulaSource

export let isConnecting: boolean
export let errors: GeneralError[]

let oldFormula = formula
let formulaID = `${formula.formula_id}`
$: {
	if (JSON.stringify(oldFormula) !== JSON.stringify(formula)) {
		oldFormula = formula
		formulaID = `${formula.formula_id}`
	} else {
		formula = { ...formula, "formula_id": +formulaID }
	}
}
</script>

<ChoiceListField
	fieldName="Formula"
	disabled={isConnecting}
	bind:value={formulaID}
	rawChoices={formulae}
	choiceConverter={transformFormula}
	{IDPrefix}
	{errors}/>
