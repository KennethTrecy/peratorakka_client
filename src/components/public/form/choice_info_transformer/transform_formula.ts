import type { ChoiceInfo } from "+/component"
import type { Formula } from "+/entity"

export default function transformFormula(formula: Formula): ChoiceInfo {
	const data = `${formula.id}`

	const label = formula.name

	return {
		label,
		data
	}
}
