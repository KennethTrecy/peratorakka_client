import type { ChoiceInfo } from "+/component"
import type { CashFlowCategory } from "+/entity"

export default function transformCashFlowCategory(category: CashFlowCategory): ChoiceInfo {
	const data = `${category.id}`
	const label = `${category.name} (${category.kind})`

	return {
		label,
		data
	}
}
