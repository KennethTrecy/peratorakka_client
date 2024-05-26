import type { ChoiceInfo } from "+/component"
import type { CashFlowActivity } from "+/entity"

export default function transformCashFlowActivity(category: CashFlowActivity): ChoiceInfo {
	const data = `${category.id}`
	const label = category.name

	return {
		label,
		data
	}
}
