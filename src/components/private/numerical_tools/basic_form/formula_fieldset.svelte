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

let currentFormulaID = `${formula.formula_id}`
let oldFormulaID = `${formula.formula_id}`
$: {
	if (oldFormulaID !== currentFormulaID) {
		oldFormulaID = currentFormulaID
		formula = { ...formula, "formula_id": +currentFormulaID }
	}
}
</script>

<ChoiceListField
	fieldName="Formula"
	disabled={isConnecting}
	bind:value={currentFormulaID}
	rawChoices={formulae}
	choiceConverter={transformFormula}
	{IDPrefix}
	{errors}/>
